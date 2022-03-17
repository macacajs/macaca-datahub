package macaca.datahub;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import macaca.datahub.common.Utils;

public class DataHubClient {
	public int port = 7001;
	public String hostname = "127.0.0.1";
	public String protocol = "http";
	public String host;
	public Utils utils = new Utils();
	
	public DataHubClient(int port) {
		this.port = port;
		this.host = this.protocol + "://" + this.hostname + ":" + this.port;
	}
	
	public DataHubClient(int port, String hostname) {
		this.port = port;
		this.hostname = hostname;
		this.host = this.protocol + "://" + this.hostname + ":" + this.port;
	}
	
	public DataHubClient(int port, String hostname, String protocol) {
		this.port = port;
		this.hostname = hostname;
		this.protocol = protocol;
		this.host = this.protocol + "://" + this.hostname + ":" + this.port;
	}
	
	public DataHubClient(String host) {
		this.host = host;
	}
	
	public void updateByProjectidAndDataid(String projectId, String dataId, JSONObject data) throws Exception {
		String url = "${host}/api/data/${projectId}/${dataId}"
				.replace("${host}", this.host)
				.replace("${projectId}", projectId)
				.replace("${dataId}", dataId);
		utils.request("post", url, data);
	}
	
	public JSONArray geDataListByProjectId(String projectId) throws Exception {
		String url = "${host}/api/data/${projectId}"
				.replace("${host}", this.host)
				.replace("${projectId}", projectId);
		return (JSONArray) utils.request("get", url, null);
	}
	
	public JSONObject geDataByProjectIdAndDataId(String projectId, String dataId) throws Exception {
		String url = "${host}/api/data/${projectId}/${dataId}"
				.replace("${host}", this.host)
				.replace("${projectId}", projectId)
				.replace("${dataId}", dataId);
		return (JSONObject) utils.request("get", url, null);		
	}
}
