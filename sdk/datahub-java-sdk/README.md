# datahub-java-sdk

[ ![Download](https://api.bintray.com/packages/macaca/datahub/macaca.datahub/images/download.svg)](https://bintray.com/macaca/datahub/macaca.datahub/_latestVersion)

DataHub SDK for Android and Java applications

## Intro

## Document

[javadoc](//macacajs.github.io/datahub-java-sdk/)

## Usage

```java
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
```

## ChangeLog

Details changes for each release are documented in the [HISTORY.md](HISTORY.md).

## Deploy

```bash
$ mvn -s settings.xml clean source:jar deploy
```

## Generate Log

```bash
$ make doc
```

## License

The MIT License (MIT)
