var routes = { 'wgd': 'workforce.getData', 'wde': 'getExportStatusData' }

class A {
  constructor() {
    this.b = new B()
  }
  getData(query = null, filters = null) {
    return new Promise((resolve, reject) => {
      this.b.getData(query, filters, this.showPending).then(res => {
        if (res.success) {
          resolve()
        }
      }, err => {
        reject(err)
      })
    })
  }
  getData1(query = null, filters = null) {
    var args = [].slice.call(arguments).concat(this.showPending)
    return new Promise((resolve, reject) => {
      this.b.delegate('wgd').bind(args).then(res => {
        if (res.success) {
          resolve()
        }
      }, err => {
        reject(err)
      })
    })
  }
}

class B {
  constructor() {
    this.gpsInstance = Object.create({});
    this.c = new C();
  }
  getData(qry = null, filters = null, showPending = true) {
    //return this.gpsInterface.call('workforce.getData', [qry, filters, showPending]);
    return this.c.getData(qry, filters, showPending)
  }
  deletegate() {

  }
}

class C {
  constructor() {
    this.authToken = this.initToken()
  }
  getData(qry = null, filters = null, showPending = true, authToken) {
    console.log('CRUD call CouchBase.', arguments)
  }
  initToken() {}
}

const aa = new A();
aa.getData('query', 'filter')

function abc(name, age) { console.log('abc: ', name, age); }
ttt = 'workforce.abc';
eval(ttt.split('.')[1]).call(null, 'william', 25);


////////////////////////
const ary = [
	['workforce.getData', 'workforce.getData parameters' ],
	['workforce.getEnvironmentCampaigns','workforce.getEnvironmentCampaigns parameters' ], 
	['workforce.getExportStatusData', 'workforce.getExportStatusData parameters' ]
];
const ary1 = [
	['workforce.setPermissions', 'workforce.setPermissions parameters' ],
];

function getData() {
	console.log('getData', arguments);
}
function getEnvironmentCampaigns() {
	console.log('getExportStatusData', arguments);
}
function getExportStatusData() {
	console.log('getExportStatusData', arguments);
}
function setPermissions() {
	console.log('setPermissions', arguments);
}
let authToken = 'authToken';
const delegate = (function (authToken) {
	authToken =  authToken || Math.random().toString(36).substring(16);
	return (ary) => {
		ary.forEach(namespace => {
			let temp = namespace[0].split('.');
			let cb = temp[1];
			let space = temp[0];
			let params = namespace[1];
			console.log('call function:' + cb, ', with parameters: ', authToken, space, params);
			eval(cb).call(null, space, params);
		});
	}
}(authToken));

delegate(ary);
delegate(ary1);



MERGE INTO state s 
USING (SELECT NULL) AS b ON KEY $1 /* $1 is the document pk */
WHEN MATCHED THEN
	UPDATE ... 
WHEN NOT MATCHED THEN
	INSERT <<empty model>>



[
  {
    "state": {
      "createDate": 1485201185429,
      "currentLoginSession": {
        "endTime": 1485201185425,
        "loginSessionId": "8e470010-e1a5-11e6-915f-2775f66d46bb",
        "startTime": 1485201185425,
        "states": [
          {
            "status": "online",
            "timestamp": 1485201185425
          },
          {
            "status": "online",
            "timestamp": 1485203512848
          },
          {
            "status": "onbreak",
            "timestamp": 1485203514951
          },
          {
            "status": "onbreak",
            "timestamp": 1485203516083
          },
          {
            "status": "offline",
            "timestamp": 1485203517628
          }
        ],
        "webSocketSessions": [
          {
            "endTime": 1485201185425,
            "sessionId": "2988368721902243",
            "startTime": 1485201185425
          }
        ]
      },
      "lastKnownLoginSessionId": "8e470010-e1a5-11e6-915f-2775f66d46bb",
      "lastKnownStatus": "whatever-TODO",
      "lastKnownWebsocketSessionId": "6757656565664",
      "loginSessions": [
        {
          "endTime": 1485201185425,
          "loginSessionId": "8e470010-e1a5-11e6-915f-2775f66d4622",
          "startTime": 1485201185425,
          "states": [
            {
              "status": "online",
              "timestamp": 1485201185425
            },
            {
              "status": "online",
              "timestamp": 1485203512848
            },
            {
              "status": "onbreak",
              "timestamp": 1485203514951
            },
            {
              "status": "onbreak",
              "timestamp": 1485203516083
            },
            {
              "status": "offline",
              "timestamp": 1485203517628
            }
          ],
          "webSocketSessions": [
            {
              "endTime": 1485201185425,
              "sessionId": "2988368721902243",
              "startTime": 1485201185425
            }
          ]
        }
      ],
      "type": "user-state",
      "userId": "user::220b47b3-bbb8-42df-875a-15aa85d23975",
      "version": "0.1.2"
    }
  },
  {
    "state": {
      "createDate": 1485201185429,
      "lastKnownLoginSessionId": "8e470010-e1a5-11e6-915f-2775f66d46bb",
      "lastKnownStatus": "whatever-TODO",
      "lastKnownWebsocketSessionId": "6757656565664",
      "loginSessions": [
        {
          "endTime": 1485201185425,
          "loginSessionId": "8e470010-e1a5-11e6-915f-2775f66d46bb",
          "startTime": 1485201185425,
          "states": [
            {
              "status": "online",
              "timestamp": 1485201185425
            },
            {
              "status": "online",
              "timestamp": 1485203512848
            },
            {
              "status": "onbreak",
              "timestamp": 1485203514951
            },
            {
              "status": "onbreak",
              "timestamp": 1485203516083
            },
            {
              "status": "offline",
              "timestamp": 1485203517628
            }
          ],
          "webSocketSessions": [
            {
              "endTime": 1485201185425,
              "sessionId": "2988368721902243",
              "startTime": 1485201185425
            }
          ]
        }
      ],
      "type": "user-state",
      "userId": "user::220b47b3-bbb8-42df-875a-15aa85d23975",
      "version": "0.1.2"
    }
  }
]	


children AmpersandState.extend({ children: { profile: Profile } })

Define child state objects to attach to the object. Attributes passed to the constructor or to set() will be proxied to the children/collections. 
Childen''s change events are proxied to the parent.


collections AmpersandState.extend({ collections: { widgets: Widgets } })

Define child collection objects to attach to the object. Attributes passed to the constructor or to set() will be proxied to the collections.

Note: Currently, events don not automatically proxy from collections to parent. This is for efficiency reasons. 
But there are ongoing discussions about how to best handle this.


loginSessions: [
	{
		loginSessionId: this.loginSessionId,
		startTime: new Date(),
		endTime: new Date(),
		states: [
			{
				timestamp: new Date(),
				status: "online"
			}
		],
		webSocketSessions: [
			{
				sessionId: sessionId.toString(),
				startTime: new Date(),
				endTime: new Date(),
			}
		]
	}
]


[
  {
    "createDate": 1485365895060,
    "currentLoginSession": {
      "endTime": 1485365895059,
      "loginSessionId": "what ever nyc",
      "startTime": 1485365895059,
      "states": [
        {
          "status": "online",
          "timestamp": 1485365895059
        }
      ],
      "webSocketSessions": [
        {
          "endTime": 1485365895059,
          "sessionId": "4786655415246917",
          "startTime": 1485365895059
        }
      ]
    },
    "lastKnownLoginSessionId": "0cdc0620-e325-11e6-ad1a-49bad790a7b1",
    "lastKnownStatus": "offline",
    "lastKnownWebsocketSessionId": "4786655415246917",
    "loginSessions": [],
    "type": "user-state",
    "userId": "user::220b47b3-bbb8-42df-875a-15aa85d23975",
    "version": "0.1.2"
  },
  {
    "currentLoginSession": {
      "endTime": 1485365895059,
      "loginSessionId": "loginSessionId",
      "startTime": 1485365895059,
      "states": [],
      "webSocketSessions": []
    },
    "lastKnownLoginSessionId": "lastKnownLoginSessionId",
    "lastKnownStatus": "offline",
    "lastKnownWebsocketSessionId": "lastKnownWebsocketSessionId",
    "loginSessions": [],
    "userId": "user::220b47b3-bbb8-42df-875a-15aa85d23975"
  }
]