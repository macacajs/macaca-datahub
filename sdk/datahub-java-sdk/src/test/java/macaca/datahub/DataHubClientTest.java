package macaca.datahub;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

public class DataHubClientTest {
    DataHubClient datahubClient;
    @Before
    public void setUp() throws Exception {
    	datahubClient = new DataHubClient(7001, "127.0.0.1");
    }

    @Test
    public void geDataListByProjectId() throws Exception {
    	JSONArray res = datahubClient.geDataListByProjectId("sample");
    	System.out.println(res);
    }

    @Test
    public void geDataByProjectIdAndDataId() throws Exception {
    	JSONObject res = datahubClient.geDataByProjectIdAndDataId("sample", "test1");
    	System.out.println(res);
    }

    @Test
    public void updateByProjectidAndDataid() throws Exception {
    	JSONObject data = new JSONObject();
    	data.put("currentScene", "default");
    	datahubClient.updateByProjectidAndDataid("sample", "test1", data);
    }

    @After
    public void tearDown() throws Exception {

    }
}
