package macaca.datahub.common;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

public class Utils {

//    private final Log log = LogFactory.getLog(getClass());

    private HttpGet httpget = null;
    private CloseableHttpClient httpclient = HttpClients.createDefault();

    private CloseableHttpResponse response = null;
    private HttpEntity entity = null;
    private JSONObject jsonResponse = null;
    private String stringResponse = "";

    public Utils() {
        
    }

    public Object request(String method, String url, Object data) throws Exception {

        if ("GET".equals(method.toUpperCase())) {
            return getRequest(url);
        } else if ("POST".equals(method.toUpperCase())) {
        	return postRequest(url, (JSONObject) data);
        }

        return null;
    }
    
    private void printResponse(String stringResponse) throws Exception {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        if (stringResponse.length() > 800) {
            System.out.println(df.format(new java.util.Date()) + " Response:" + stringResponse.substring(0, 800) + "...more response is ignored..");
        } else {
            System.out.println(df.format(new java.util.Date()) + " Response:" + stringResponse);
        }
    }

    private void printRequest(String stringRequest) throws Exception {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        System.out.println(df.format(new java.util.Date()) + " Request:" + stringRequest);
    }

    private Object getRequest(String url) throws Exception {

        try {
            printRequest(url);
            httpget = new HttpGet(url);
            response = httpclient.execute(httpget);
            entity = response.getEntity();
            if (entity != null) {
                stringResponse = EntityUtils.toString(entity);
                printResponse(stringResponse);
                jsonResponse = JSON.parseObject(stringResponse);
                return jsonResponse.get("data");
            }
        } catch (ClientProtocolException e) {
            e.printStackTrace();
        }
        return null;
    }

    private Object postRequest(String url, JSONObject jsonBody) throws Exception {
    	List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>();

        for (String key : jsonBody.keySet()) {
            String value = jsonBody.get(key).toString();
            nameValuePairs.add(new BasicNameValuePair(key, value));
        }
        
    	HttpPost httppost = new HttpPost(url); 
    	httppost.setHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    	httppost.setEntity(new UrlEncodedFormEntity(nameValuePairs, "UTF-8"));
    	try {
        	CloseableHttpResponse res = httpclient.execute(httppost);
            String json2 = EntityUtils.toString(res.getEntity(), "utf-8");  
            System.out.println(json2);
        } catch (ClientProtocolException e) {
            e.printStackTrace();
        }

        return null;
    }

}
