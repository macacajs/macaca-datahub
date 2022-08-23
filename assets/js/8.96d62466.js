(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{273:function(e,t,a){"use strict";a.r(t);var s=a(13),n=Object(s.a)({},(function(){var e=this,t=e._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h1",{attrs:{id:"introduction"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#introduction"}},[e._v("#")]),e._v(" Introduction")]),e._v(" "),t("p",[e._v("In the development process of the front-end and the client, environmental problems have been plaguing us. Lack of data or poor data management will lead to low overall efficiency of R&D. In the process of facing this problem, many excellent Mock programs were born, mostly with platforms and local tools.")]),e._v(" "),t("p",[e._v("In the face of these problems, we believe that there are three main points in the core points, data source issues, scenario issues, and lifecycle issues. Having a stable and iterative data source is the key to project development. The data source is actually a server interface, and most interfaces have a state. At this time, we also need to solve the problem of scene management. In addition, as the development process progresses, we usually enter the cycle of daily joint debugging, integration testing, grayscale publishing, etc., so the provision of data should always be a continuous process.")]),e._v(" "),t("h2",{attrs:{id:"data-source-problem"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#data-source-problem"}},[e._v("#")]),e._v(" Data source problem")]),e._v(" "),t("p",[e._v("The data in the research and development period is missing, and the terminal students and the server end the business interaction field according to the product requirements or the existing service. At this point, the terminal classmate will create data that can be used for "),t("code",[e._v("Mock")]),e._v(" according to the business field. The data source needs to meet the following principles:")]),e._v(" "),t("ul",[t("li",[e._v("Standardization: Since the terminals are almost all based on the same level of data protocol, the versatility of each service in data interaction is sufficient to meet the unified requirements. Here, the personalized introduction of data sources increases the learning cost and backup cost.")]),e._v(" "),t("li",[e._v("Non-intrusive: data source injection does not intrude on the business code itself, which means that the code of the business logic does not sense where the data comes from.")]),e._v(" "),t("li",[e._v("Go to the center: no central service dependence, data backup in the project local, anyone can develop offline")])]),e._v(" "),t("h2",{attrs:{id:"scene-problem"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#scene-problem"}},[e._v("#")]),e._v(" Scene problem")]),e._v(" "),t("p",[e._v("When it comes to complex services, the most frequently talked about is the scene problem. In addition to the services such as rich interactive editors, the complexity of display services often means more scenes, more scene combinations, and more branches in the process of business flow. The situation of combining scenes is easy to miss key scenarios and is not well managed. Once the multi-person cross-coordination, the interaction fields are adjusted to cause the information flow to be repeated, and the retroactive cost becomes higher.")]),e._v(" "),t("ul",[t("li",[e._v("Manageable: The scene data needs to be maintainable and manageable, support the semantics of the scene data and the basic additions and deletions.")]),e._v(" "),t("li",[e._v("Versioning: The scene data needs to be the same as the business logic, with versionability, and the scene data is integrated in the current project in clear text.")])]),e._v(" "),t("h2",{attrs:{id:"life-cycle-issues"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#life-cycle-issues"}},[e._v("#")]),e._v(" Life cycle issues")]),e._v(" "),t("p",[e._v("The data in the research and development period is relatively well solved, but when looking at this problem from the perspective of the whole process of research and development, it is necessary to consider the problem of the follow-up to solve the problem as a whole.")]),e._v(" "),t("ul",[t("li",[e._v("Iterable: Scene data can be managed with the project via Git timeline and as a necessary part of delivery")]),e._v(" "),t("li",[e._v("Consistency: The data source should be continued from the previous cycle and docked to the real data source during system integration testing")]),e._v(" "),t("li",[e._v("Documentization: Consistency makes interface document maintenance no longer scattered and lagging, interface documents automatically generate and maintain iteration ability is the optimal solution")]),e._v(" "),t("li",[e._v("Testable: Whether it is function unit test before delivery, UI unit test, or system integration test during test period, it needs to rely on combinable data source. The stability of integration test phase is high, and data source service is required to shield peripheral service.")])]),e._v(" "),t("h2",{attrs:{id:"other-questions"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#other-questions"}},[e._v("#")]),e._v(" Other questions")]),e._v(" "),t("ul",[t("li",[e._v("Entry cost: The data source has a higher initial entry cost, especially in the joint adjustment period. It should support automatic entry by request snapshot.")]),e._v(" "),t("li",[e._v("Troubleshooting: Production environment should support switching data sources, support proxy and snapshot records")])]),e._v(" "),t("hr"),e._v(" "),t("p",[e._v("Based on the above pain points and several principles, Ant International Wireless designed and implemented a data environment solution for the full cycle of research and development - DataHub, with features such as sustainability and decentralization.")]),e._v(" "),t("blockquote",[t("p",[e._v("DataHub - Continuous data provider for development, testing, staging and production.")])])])}),[],!1,null,null,null);t.default=n.exports}}]);