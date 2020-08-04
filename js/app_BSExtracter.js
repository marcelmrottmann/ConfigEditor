//--------------------------------Define GLobal Variables---------------------------------

var hotdata;
var changedata;
var global_data;
var CurrentConnection;
var SDMZipFileName;
var hot;
var SelectedRuleIndex;
var currentFile;
var paycodesResponse;
var ExportConfig;
var AccessToken;
var AddOrEdit;
var RootNodeOptions;
RootNodeOptions = []

RefreshConnections()


StartDate = document.getElementById("From Date").value
RootNode = document.getElementById("RootNode").value
var SelectedConnection;


function RefreshConnections(x) {

	SelectedRuleIndex = document.getElementById("Connection").value
	CurrentConnection = SelectedRuleIndex
	var select = document.getElementById("Connection");
	var length = select.options.length;
	for (i = length - 1; i >= 0; i--) {
		select.options[i] = null;
	}
	const fs = require('fs')
	const config = require('./Settings/connections.json')
	global_data = fs.readFileSync("./Settings/connections.json");
	global_data = JSON.parse(global_data)
	console.log(global_data)
	for (let i = 0, l = global_data.length; i < l; i++) {
		value = global_data[i].name
		var x = document.getElementById("Connection");
		var option = document.createElement("option");
		option.text = value;
		x.add(option);
	}
	if (SelectedRuleIndex == '' || SelectedRuleIndex == null || SelectedRuleIndex == 'Connection') { SelectedRuleIndex = global_data[0].name }
	console.log(SelectedRuleIndex)
	console.log(document.getElementById("Connection").value)
	document.getElementById("Connection").value = SelectedRuleIndex

	SelectedConnectionName = document.getElementById("Connection").options[document.getElementById("Connection").selectedIndex].value
	SelectedConnection = {}
	for (let i = 0, l = global_data.length; i < l; i++) {
		if (global_data[i].name == SelectedConnectionName) {
			SelectedConnection = global_data[i]
		}
	}
	reloadDropDown()
	CloseLoadingModal()
}
//------------------------------------------Close the loading thing---------------
function CloseLoadingModal() {
	var loadingmodal = document.getElementById("load");
	loadingmodal.style.display = "none";
	loadingmodal.style.visibility = "hidden";
	document.getElementById('HandsOnTableValue').style.display = "block"
}
//DownloadCSV

function reloadDropDown(x) {
	console.log('trigger')
	var request = require('request');
	var rp = require('request-promise')
	SelectedConnectionName = document.getElementById("Connection").options[document.getElementById("Connection").selectedIndex].value
	SelectedMapType = document.getElementById("Status").options[document.getElementById("Status").selectedIndex].value
	SelectedConnection = {}
	for (let i = 0, l = global_data.length; i < l; i++) {
		if (global_data[i].name == SelectedConnectionName) {
			SelectedConnection = global_data[i]
		}
	}


	function GETBSROOTS(x) {
		x = JSON.parse(x)

		AccessToken = x.access_token
		BodyCreator = JSON.stringify(
			{
				"where": {
					"query": {
						"context": SelectedMapType,
						"date": StartDate,
						"q": "/"
					}
				}
			}
		)
		console.log(BodyCreator)
		console.log(SelectedConnection.url)
		var options3 = {
			'method': 'POST',
			'url': 'https://' + SelectedConnection.url + '/api/v1/commons/locations/multi_read',
			'headers': {
				'appkey': SelectedConnection.appKey,
				'Authorization': AccessToken,
				'Content-Type': ['application/json']
			},
			body: BodyCreator

		};
		rp(options3)
			.then(function (parsedBody) {
				console.log(parsedBody)
				parseresponse = JSON.parse(parsedBody)
				var select = document.getElementById("RootNode");
				var length = select.options.length;
				for (i = length - 1; i >= 0; i--) {
					select.options[i] = null;
					RootNodeOptions = []
				}

				for (let i = 0, l = parseresponse.length; i < l; i++) {
					value = parseresponse[i].name
					var x = document.getElementById("RootNode");
					var option = document.createElement("option");
					option.text = value;
					RootNodeOptions.push(value)
					x.add(option);
				}

				if (parseresponse.length > 0) {
					RootNode = parseresponse[0].name
					document.getElementById('RootNode').style.display = "block"
					document.getElementById('RootNode2').style.display = "none"
				}
				else {
					document.getElementById('RootNode').style.display = "none"
					document.getElementById('RootNode2').style.display = "block"
				}


			})
			.catch(function (err) {
				console.log(err)
				window.alert('Could not retrieve the business structure ' + err.error)
				CloseLoadingModal()
				return
			});
	}
	function GETLCTYPES(x) {
		x = JSON.parse(x)
		AccessToken = x.access_token
		var options3 = {
			'method': 'GET',
			'url': 'https://' + SelectedConnection.url + '/api/v1/commons/labor_categories',
			'headers': {
				'appkey': SelectedConnection.appKey,
				'Authorization': AccessToken,
				'Content-Type': ['application/json']
			}
			//,body: BodyCreator

		};
		rp(options3)
			.then(function (parsedBody) {
				console.log(parsedBody)
				parseresponse = JSON.parse(parsedBody)
				var select = document.getElementById("RootNode");
				var length = select.options.length;
				for (i = length - 1; i >= 0; i--) {
					select.options[i] = null;
					RootNodeOptions = []
				}

				for (let i = 0, l = parseresponse.length; i < l; i++) {
					value = parseresponse[i].name
					idvalue = parseresponse[i].id
					var x = document.getElementById("RootNode");
					var option = document.createElement("option");
					option.text = value;
					option.value = idvalue
					RootNodeOptions.push(value)
					x.add(option);
				}

				if (parseresponse.length > 0) {
					RootNode = parseresponse[0].name
					document.getElementById('RootNode').style.display = "block"
					document.getElementById('RootNode2').style.display = "none"
				}
				else {
					document.getElementById('RootNode').style.display = "none"
					document.getElementById('RootNode2').style.display = "block"
				}


			})
			.catch(function (err) {
				console.log(err)
				window.alert('Could not retrieve the business structure ' + err.error)
				CloseLoadingModal()
				return
			});
	}
	function Access2(z) {
		SelectedMapType = document.getElementById("Status").options[document.getElementById("Status").selectedIndex].value
		var options = {
			'method': 'POST',
			'url': 'https://' + SelectedConnection.url + '/api/authentication/access_token',
			'headers': {
				'Content-Type': ['application/x-www-form-urlencoded'],
				'appkey': SelectedConnection.appKey
			},
			form: {
				'username': SelectedConnection.username,
				'password': SelectedConnection.password,
				'client_id': SelectedConnection.auth_ID,
				'client_secret': SelectedConnection.auth_secret,
				'grant_type': 'password',
				'auth_chain': 'OAuthLdapService'
			}
		};
		rp(options)
			.then(function (parsedBody) {
				console.log(parsedBody)
				if (SelectedMapType == 'LCENTRIES') {
					GETLCTYPES(parsedBody)
				}
				else {
					GETBSROOTS(parsedBody)
				}

			})
			.catch(function (err) {

				console.log(err)
				window.alert('Login failed ' + err.error)
				CloseLoadingModal()

				return
			});
	}

	Access2()

}
//---------------------------------------------Display Help Guide-----------------------------
document.getElementById("about").addEventListener("click", (function () {

	var modal = document.getElementById("myModal");
	modal.style.display = "block";
	document.getElementById('HandsOnTableValue').style.display = "none"
	const fs = require('fs')
	info = fs.readFileSync('./information/Info.txt', 'UTF-8')
	info = info.toString()
})
)
window.addEventListener("click", function (event) {
	var modal = document.getElementById("myModal");
	if (event.target == modal) {
		modal.style.display = "none";
		document.getElementById('HandsOnTableValue').style.display = "block"
	}
})
var span = document.getElementsByClassName("close")[0];
span.addEventListener("click", function () {
	var modal = document.getElementById("myModal");
	modal.style.display = "none";
	document.getElementById('HandsOnTableValue').style.display = "block"
})
//---------------------------------------Empty connections Drop Down

//-----------------------------------------Fill Connections Dropdown.

function toggleField(hideObj, showObj) {
	hideObj.disabled = true;
	hideObj.style.display = 'none';
	showObj.disabled = false;
	showObj.style.display = 'inline';
	showObj.focus();
}




//---------------------------------------------Hamburger Menu-----------------------------

function hamburgermenu(x) {
	x.classList.toggle("change");
	document.getElementByClass("hamburgermenu").classlist.toggle("change")

}

/* Set the width of the side navigation to 0 */
function closeNav() {
	document.getElementById("SideBar").style.width = "0";
	document.getElementById('HandsOnTableValue').style.display = "block"
}

document.getElementById("hamburgermenuID").addEventListener("click", (function () {
	document.getElementById('HandsOnTableValue').style.display = "none"
	document.getElementById("SideBar").style.width = "250px"
}))

//---------------------------------------------Modal Controls----------------------------
/*
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
span.addEventListener("click", function () {
	modal.style.display = "none";
	document.getElementById('HandsOnTableValue').style.display = "block"
})
*/
var loadingmodal = document.getElementById("load");
var span = document.getElementsByClassName("close")[0];
window.addEventListener("click", function (event) {
	if (event.target == loadingmodal) {
		modal.style.display = "none";
		document.getElementById('HandsOnTableValue').style.display = "block"
	}
})


span.addEventListener("click", function () {
	loadingmodal.style.display = "none";
	document.getElementById('HandsOnTableValue').style.display = "block"
})
window.addEventListener("click", function (event) {
	if (event.target == loadingmodal) {
		loadingmodal.style.display = "none";
		document.getElementById('HandsOnTableValue').style.display = "block"
	}
})




//---------------------------------------------Define Object.assign----------------------

if (typeof Object.assign != 'function') {
	// Must be writable: true, enumerable: false, configurable: true
	Object.defineProperty(Object, "assign", {
		value: function assign(target, varArgs) { // .length of function is 2
			'use strict';
			if (target == null) { // TypeError if undefined or null
				throw new TypeError('Cannot convert undefined or null to object');
			}

			var to = Object(target);

			for (var index = 1; index < arguments.length; index++) {
				var nextSource = arguments[index];

				if (nextSource != null) { // Skip over if undefined or null
					for (var nextKey in nextSource) {
						// Avoid bugs when hasOwnProperty is shadowed
						if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
							to[nextKey] = nextSource[nextKey];
						}
					}
				}
			}
			return to;
		},
		writable: true,
		configurable: true
	});
}

//---------------------------------------------ParseInput function---------------------------------
document.getElementById("UploadAndParse").addEventListener("click", function () {
	var loadingmodal = document.getElementById("load");
	loadingmodal.style.display = "block";
	loadingmodal.style.visibility = "visible";
	setTimeout(parseInputJson, 1000);
})


function parseInputJson(data) {
	//RefreshConnections()

	//--------------------------------------------Require functions----------------------------------------------
	console.log(SDMZipFileName)
	var firstBy = require('thenby');
	var AdmZip = require('adm-zip');



	//--------------------------------------------Make API CALL---
	var request = require('request');
	var rp = require('request-promise')
	AccessToken = ""
	StartDate = document.getElementById("From Date").value
	RootNode = document.getElementById("RootNode").value
	RootNode2 = document.getElementById("RootNode2")
	if (window.getComputedStyle(RootNode2).display === "block") { RootNode = RootNode2.value }

	console.log(global_data)
	SelectedConnectionName = document.getElementById("Connection").options[document.getElementById("Connection").selectedIndex].value
	SelectedMapType = document.getElementById("Status").options[document.getElementById("Status").selectedIndex].value
	SelectedConnection = {}
	for (let i = 0, l = global_data.length; i < l; i++) {
		if (global_data[i].name == SelectedConnectionName) {
			SelectedConnection = global_data[i]
		}
	}

	function GETBS(x) {
		x = JSON.parse(x)
		AccessToken = x.access_token
		BodyCreator = JSON.stringify(
			{
				"where": {
					"descendantsOf": {
						"context": SelectedMapType,
						"date": StartDate,
						"locationRef": {
							"qualifier": RootNode
						}
					}
				}
			}
		)
		console.log(BodyCreator)
		var options3 = {
			'method': 'POST',
			'url': 'https://' + SelectedConnection.url + '/api/v1/commons/locations/multi_read',
			'headers': {
				'appkey': SelectedConnection.appKey,
				'Authorization': AccessToken,
				'Content-Type': ['application/json']
			},
			body: BodyCreator

		};
		rp(options3)
			.then(function (parsedBody) {
				console.log(parsedBody)
				RenderHandsOnTable(parsedBody)
			})
			.catch(function (err) {
				console.log(err)
				window.alert('Could not retrieve the business structure ' + err.error)
				CloseLoadingModal()
				return
			});
	}


	function GETLCENTRIES(x) {
		x = JSON.parse(x)
		AccessToken = x.access_token
		BodyCreator = JSON.stringify(
			{
				"where": {
					"descendantsOf": {
						"context": SelectedMapType,
						"date": StartDate,
						"locationRef": {
							"qualifier": RootNode
						}
					}
				}
			}
		)
		console.log(BodyCreator)
		var options3 = {
			'method': 'GET',
			'url': 'https://' + SelectedConnection.url + '/api/v1/commons/labor_entries?categoryId=' + RootNode,
			'headers': {
				'appkey': SelectedConnection.appKey,
				'Authorization': AccessToken,
				'Content-Type': ['application/json']
			}
			//,			body: BodyCreator

		};
		console.log(options3.url)

		rp(options3)
			.then(function (parsedBody) {
				console.log(parsedBody)
				RenderHandsOnTable(parsedBody)
			})
			.catch(function (err) {
				console.log(err)
				window.alert('Could not retrieve the business structure ' + err.error)
				CloseLoadingModal()
				return
			});
	}



	function GETBSROOTS(x) {
		x = JSON.parse(x)
		AccessToken = x.access_token
		BodyCreator = JSON.stringify(
			{
				"where": {
					"query": {
						"context": SelectedMapType,
						"date": StartDate,
						"q": "/"
					}
				}
			}
		)
		console.log(BodyCreator)
		var options3 = {
			'method': 'POST',
			'url': 'https://' + SelectedConnection.url + '/api/v1/commons/locations/multi_read',
			'headers': {
				'appkey': SelectedConnection.appKey,
				'Authorization': AccessToken,
				'Content-Type': ['application/json']
			},
			body: BodyCreator

		};
		rp(options3)
			.then(function (parsedBody) {
				console.log(parsedBody)
				parseresponse = JSON.parse(parsedBody)
				GETBS(parsedBody)
			})
			.catch(function (err) {
				console.log(err)
				window.alert('Could not retrieve the business structure ' + err.error)
				CloseLoadingModal()
				return
			});
	}


	function Access(z) {
		var options = {
			'method': 'POST',
			'url': 'https://' + SelectedConnection.url + '/api/authentication/access_token',
			'headers': {
				'Content-Type': ['application/x-www-form-urlencoded'],
				'appkey': SelectedConnection.appKey
			},
			form: {
				'username': SelectedConnection.username,
				'password': SelectedConnection.password,
				'client_id': SelectedConnection.auth_ID,
				'client_secret': SelectedConnection.auth_secret,
				'grant_type': 'password',
				'auth_chain': 'OAuthLdapService'
			}
		};
		rp(options)
			.then(function (parsedBody) {
				console.log(parsedBody)
				if (SelectedMapType == 'LCENTRIES') {
					GETLCENTRIES(parsedBody)
				}
				else {
					GETBS(parsedBody)
				}

			})
			.catch(function (err) {

				console.log(err)
				window.alert('Login failed ' + err.error)
				CloseLoadingModal()

				return
			});
	}

	Access()
	function RenderHandsOnTable(x) {
		try {
			if (hotdata) hotdata.destroy()
		}
		catch{ }
		var container = document.getElementById('HandsOnTableValue');
		Complete = []
		headers = []
		columneditorsettings = []
		FinalArray = []
		Periods = []

		console.log(x)
		//if (JSON.parse(x) instanceof Array == true && JSON.parse(x).length == 0){window.alert('No Requests found in target system') ;CloseLoadingModal(); return}
		FinalArray = JSON.parse(x)
		if (SelectedMapType == 'LCENTRIES') {

			if (FinalArray.length > 6000) {
				window.alert('You have a lot of data, this will continue to load in the background, please be patient')

				BatchedDataFinalArray = FinalArray.chunk(200)
				for (let z = 0, a = BatchedDataFinalArray.length; z < a; z++) {
					console.log(BatchedDataFinalArray[z])
					setTimeout(() => {
						for (let i = 0, l = BatchedDataFinalArray[z].length; i < l; i++) {
							g = BatchedDataFinalArray[z][i]
							map =
							{
								"Action": "None",
								"Status": "None",
								"Labor Category Type": g.laborCategory.qualifier,
								"name": g.name,
								"description": g.description,
								"Inactive": g.inactive,
								"Id": g.id
							}
							Complete.push(map)
						}
					}, 1000);

				}
			}
			else {
				for (let i = 0, l = FinalArray.length; i < l; i++) {
					g = FinalArray[i]

					map =
					{
						"Action": "None",
						"Status": "None",
						"Labor Category Type": g.laborCategory.qualifier,
						"name": g.name,
						"description": g.description,
						"Inactive": g.inactive,
						"Id": g.id

					}

					Complete.push(map)
				}
			}


			FinalArray = Complete
			//console.log(FinalArray)
			try {
				for (let y = 0, x = FinalArray.length; y < x; y++) {
					for (let x = 0, z = FinalArray.length; x < z; x++) {
						headers.push(Object.keys(FinalArray[y])[x])
					}
				}
			}
			catch { window.alert("File is empty"); CloseLoadingModal(); return; }



			headers = Array.from(new Set(headers))
			var container = document.getElementById('HandsOnTableValue');
			headers = headers.filter(function (fil) { return fil != null })
			console.log(headers)

			headers = [
				"Action",
				"Status",
				"Labor Category Type",
				"name",
				"description",
				"Inactive",
				"Id"
			]


			for (let i = 0, l = headers.length; i < l; i++) {
				if (headers[i] == 'Action') { columneditorsettings.push({ data: headers[i], type: 'dropdown', source: ['None', 'Delete'] }) }
				//else if (headers[i] == 'GUID') { columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: true, width: '300' }) }
				//else if (headers[i] == "periods") { columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: true, renderer: 'html' }) }
				//else if (headers[i] == "ExpirationDate") { columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: false }) }
				//else if (headers[i] == "EffectiveDate") { columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: false }) }
				//else if (headers[i] == "LastRevision") { columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: false }) }
				else { columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: true }) }
			}

			function checkRenderer(instance, td, row, col, prop, value, cellProperties) {
				Handsontable.renderers.CheckboxRenderer.apply(this, arguments);
				if (value == true) {
					td.style.color = 'black';
					td.style.background = '#90ee90';
				} else if (value == false) {
					td.style.color = 'black';
					td.style.background = '#ffcccb';
				}
			}
			function checktextRenderer(instance, td, row, col, prop, value, cellProperties) {
				Handsontable.renderers.TextRenderer.apply(this, arguments);
				if (value == true) {
					td.style.color = 'black';
					td.style.background = '#90ee90';
				} else if (value == false) {
					td.style.color = 'black';
					td.style.background = '#ffcccb';
				}
			}
		}

		else {



				if (FinalArray.length > 6000) {
					window.alert('You have a lot of data, this will continue to load in the background, please be patient')
	
					BatchedDataFinalArray = FinalArray.chunk(200)
					for (let z = 0, a = BatchedDataFinalArray.length; z < a; z++) {
						console.log(BatchedDataFinalArray[z])
						setTimeout(() => {
							for (let i = 0, l = BatchedDataFinalArray[z].length; i < l; i++) {
								g = BatchedDataFinalArray[z][i]
								var CostCenters
								var TimeZones
								var Currencies
				
				
								if (g.costCenterRef == "" || g.costCenterRef == null) { CostCenters = null } else CostCenters = g.costCenterRef.qualifier
								if (g.timezoneRef == "" || g.timezoneRef == null) { TimeZones = null } else TimeZones = g.timezoneRef.qualifier
								if (g.currencyRef == "" || g.currencyRef == null) { Currencies = "Inherited" } else Currencies = g.currencyRef.qualifier
				
								map =
								{
									"Action": "None",
									"Status": "None",
									"Type": g.orgNodeTypeRef.qualifier,
									"Full Node Path": g.parentNodeRef.qualifier + '/' + g.name,
									"parentNode": g.parentNodeRef.qualifier,
									"name": g.name,
									"FullName": g.fullName,
									"description": g.description,
									"EffectiveDate": g.effectiveDate,
									"ExpirationDate": g.expirationDate,
									"LastRevision": g.lastRevision,
									"address": g.address,
									"Cost Center": CostCenters,
									"directWorkPercent": g.directWorkPercent,
									"indirectWorkPercent": g.indirectWorkPercent,
									"timezoneRef": g.TimeZones,
									"transferable": g.transferable,
									"currency": Currencies,
									"externalID": g.externalId,
									"nodeID": g.nodeId,
									"GUID": g.persistentId,
									"NumberOfParentNodes": g.parentNodeRef.qualifier.split('/').length
								}
				
								Complete.push(map)
							}
						}, 1000);
	
					}
				}
				else {
					for (let i = 0, l = FinalArray.length; i < l; i++) {
						g = FinalArray[i]
						var CostCenters
						var TimeZones
						var Currencies
		
		
						if (g.costCenterRef == "" || g.costCenterRef == null) { CostCenters = null } else CostCenters = g.costCenterRef.qualifier
						if (g.timezoneRef == "" || g.timezoneRef == null) { TimeZones = null } else TimeZones = g.timezoneRef.qualifier
						if (g.currencyRef == "" || g.currencyRef == null) { Currencies = "Inherited" } else Currencies = g.currencyRef.qualifier
		
						map =
						{
							"Action": "None",
							"Status": "None",
							"Type": g.orgNodeTypeRef.qualifier,
							"Full Node Path": g.parentNodeRef.qualifier + '/' + g.name,
							"parentNode": g.parentNodeRef.qualifier,
							"name": g.name,
							"FullName": g.fullName,
							"description": g.description,
							"EffectiveDate": g.effectiveDate,
							"ExpirationDate": g.expirationDate,
							"LastRevision": g.lastRevision,
							"address": g.address,
							"Cost Center": CostCenters,
							"directWorkPercent": g.directWorkPercent,
							"indirectWorkPercent": g.indirectWorkPercent,
							"timezoneRef": g.TimeZones,
							"transferable": g.transferable,
							"currency": Currencies,
							"externalID": g.externalId,
							"nodeID": g.nodeId,
							"GUID": g.persistentId,
							"NumberOfParentNodes": g.parentNodeRef.qualifier.split('/').length
						}
		
						Complete.push(map)
					}
				}
	





			



			FinalArray = Complete
			console.log(FinalArray)
			try {
				for (let y = 0, x = FinalArray.length; y < x; y++) {
					for (let x = 0, z = FinalArray.length; x < z; x++) {
						headers.push(Object.keys(FinalArray[y])[x])
					}
				}
			}
			catch { window.alert("File is empty"); CloseLoadingModal(); return; }



			headers = Array.from(new Set(headers))
			var container = document.getElementById('HandsOnTableValue');
			headers = headers.filter(function (fil) { return fil != null })
			console.log(headers)

			headers = [
				"Action",
				"Status",
				"Type",
				"parentNode",
				"name",
				"FullName",
				"description",
				"EffectiveDate",
				"ExpirationDate",
				"LastRevision",
				"address",
				"Cost Center",
				"directWorkPercent",
				"indirectWorkPercent",
				//"timezoneRef",
				"transferable",
				"currency",
				"Full Node Path",
				"externalID",
				"nodeID",
				"GUID",
				"NumberOfParentNodes"
			]


			for (let i = 0, l = headers.length; i < l; i++) {
				if (headers[i] == 'Action') { columneditorsettings.push({ data: headers[i], type: 'dropdown', source: ['None', 'Update'] }) }
				else if (headers[i] == 'GUID') { columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: true, width: '300' }) }
				else if (headers[i] == "periods") { columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: true, renderer: 'html' }) }
				else if (headers[i] == "ExpirationDate") { columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: false }) }
				else if (headers[i] == "EffectiveDate") { columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: false }) }
				else if (headers[i] == "LastRevision") { columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: false }) }
				else { columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: false }) }
			}

			function checkRenderer(instance, td, row, col, prop, value, cellProperties) {
				Handsontable.renderers.CheckboxRenderer.apply(this, arguments);
				if (value == true) {
					td.style.color = 'black';
					td.style.background = '#90ee90';
				} else if (value == false) {
					td.style.color = 'black';
					td.style.background = '#ffcccb';
				}
			}
			function checktextRenderer(instance, td, row, col, prop, value, cellProperties) {
				Handsontable.renderers.TextRenderer.apply(this, arguments);
				if (value == true) {
					td.style.color = 'black';
					td.style.background = '#90ee90';
				} else if (value == false) {
					td.style.color = 'black';
					td.style.background = '#ffcccb';
				}
			}
		}

		//end else
		var hot = new Handsontable(container, {
			data: FinalArray,
			startRows: 30,
			minSpareCols: 1,
			minSpareRows: 0,
			rowHeaders: true,
			colHeaders: headers,
			columns: columneditorsettings,
			contextMenu: ['cut', 'copy', 'row_above', 'row_below', 'remove_row', 'undo', 'redo'],
			columnSorting: { sortEmptyCells: true },
			filters: true,
			dropdownMenu: ['---------', 'filter_by_condition', 'filter_by_value', 'filter_action_bar'],
			//autocolumnsize: true,
			autoRowSize: true,
			manualRowResize: true,
			manualColumnResize: true,
			//fixedColumnsLeft: fixcolumns,
			outsideClickDeselects: false,
			//hiddenColumns: hiddencolumn,
			undo: true,
			licenseKey: 'non-commercial-and-evaluation',
			search: {
				searchResultClass: 'hot_search_found'
			},
			trimDropdown: false,
			stretchH: 'all',
			afterRender: CloseLoadingModal()
		});

		hot.render()

		//--------------------------------------------------------Feature fields-------------------------
		SearchField = document.getElementById('search_field')
		queryResult = ""

		//----------------------------------------------------------Search function------------------------

		Handsontable.dom.addEvent(SearchField, 'keyup', function (event) {
			var search = hot.getPlugin('search');



			queryResult = search.query(this.value);
			hot.render();
		});

		hotdata = hot


		CloseLoadingModal()


	}
}



document.getElementById("DownloadtoCSV").addEventListener('click', function () {
	var exportPlugin = hotdata.getPlugin('exportFile');
	exportPlugin.downloadFile('csv', { filename: RootNode, columnHeaders: true, });
});



//console.log(document.getElementById("example").Handsontable)

document.getElementById("DownloadNewFile").addEventListener("click", function (change_data) {
	loadingmodal.style.display = "block";
	loadingmodal.style.visibility = "visible";
	setTimeout(downloadNewFile, 1000, change_data);
})
//console.log(hot.getdata())

//-------------------------------------------------------Save Changes to file-----------------------------------
function downloadNewFile(change_data) {
	var request = require('request');
	var rp = require('request-promise')
	function Access2(z) {
		var options = {
			'method': 'POST',
			'url': 'https://' + SelectedConnection.url + '/api/authentication/access_token',
			'headers': {
				'Content-Type': ['application/x-www-form-urlencoded'],
				'appkey': SelectedConnection.appKey
			},
			form: {
				'username': SelectedConnection.username,
				'password': SelectedConnection.password,
				'client_id': SelectedConnection.auth_ID,
				'client_secret': SelectedConnection.auth_secret,
				'grant_type': 'password',
				'auth_chain': 'OAuthLdapService'
			}
		};
		rp(options)
			.then(function (parsedBody) {
				console.log(parsedBody)
				StartOffAPIS(parsedBody)

			})
			.catch(function (err) {
				window.alert('Login Failed ' + err.error)
			});
	}

	Access2()

	function StartOffAPIS(x) {
		var resultdata = []
		var headers = []
		AccessToken = JSON.parse(x).access_token
		console.log(AccessToken)
		hot2 = hotdata
		console.log(hot)
		var ObjectArray = []
		console.log('1')

		resultdata = hot2.getData();
		console.log('1')
		headers = hot2.getColHeader();
		console.log(resultdata)
		for (let y = 0, x = resultdata.length; y < x; y++) {
			for (let i = 0, l = headers.length; i < l; i++) {
				if (i === 0) {
					ObjectArray.push(
						{ [headers[i]]: resultdata[y][i] }
					)

				}
				else Object.assign(ObjectArray[y], { [headers[i]]: resultdata[y][i] })

			}
		}
		console.log('12')
		console.log(ObjectArray)

		IDsforCompletionTracking = []

		for (let i = 0, l = ObjectArray.length; i < l; i++) {

			if (!ObjectArray[i]['Labor Category Type']) {
				if (ObjectArray[i].Action == "Update") {
					console.log(ObjectArray[i])
					console.log(AccessToken)
					hot2.setCellMeta(i, 1, 'className', 'YellowCellBackground')
					BodyCreator =
					{
						"lastRevision": ObjectArray[i].LastRevision,
						"expirationDate": ObjectArray[i].ExpirationDate,
						"effectiveDate": ObjectArray[i].EffectiveDate,
						"fullName": ObjectArray[i].FullName,
						"description": ObjectArray[i].description,
						"transferable": ObjectArray[i].transferable,
						"costCenterRef": { "qualifier": ObjectArray[i]['Cost Center'] },
						"address": ObjectArray[i].address,
						"currencyRef": { "qualifier": ObjectArray[i].currency },
						"name": ObjectArray[i].name,
						"genericJobRef": { "qualifier": ObjectArray[i].name },
						"directWorkPercent": ObjectArray[i].directWorkPercent,
						"indirectWorkPercent": ObjectArray[i].indirectWorkPercent,
						//"timezoneRef":{"qualifier":ObjectArray[i].timezoneRef},
						"externalId": ObjectArray[i].externalID
					}
					if (ObjectArray[i].Type != "Job") { delete BodyCreator.genericJobRef }
					else { delete BodyCreator.transferable }
					if (ObjectArray[i].currency == "Inherited") { delete BodyCreator.currencyRef }
					if (ObjectArray[i]['Cost Center'] == "" || ObjectArray[i]['Cost Center'] == null) { delete BodyCreator.costCenterRef }
					if (ObjectArray[i].externalID == "" || ObjectArray[i].externalID == null) { delete BodyCreator.externalID }
					if (ObjectArray[i].directWorkPercent == "" || ObjectArray[i].directWorkPercent == null) { delete BodyCreator.directWorkPercent }
					if (ObjectArray[i].indirectWorkPercent == "" || ObjectArray[i].indirectWorkPercent == null) { delete BodyCreator.indirectWorkPercent }
					if (ObjectArray[i].address == "" || ObjectArray[i].address == null) { delete BodyCreator.address }



					//if (ObjectArray[i].timezoneRef == "" || ObjectArray[i].timezoneRef == null || ObjectArray[i].timezoneRef == undefined){delete BodyCreator.timeZoneRef}

					console.log(BodyCreator)

					var options4 = {
						'method': 'POST',
						'url': 'https://' + SelectedConnection.url + '/api/v1/commons/locations/' + ObjectArray[i].nodeID,
						'headers': {
							'appkey': SelectedConnection.appKey,
							'Authorization': AccessToken,
							'Content-Type': ['application/json']
						},



						body: JSON.stringify(BodyCreator)



					};
					rp(options4)
						.then(function (parsedBody) {
							hot2.setDataAtCell(i, 1, ObjectArray[i].Action)
							hot2.setDataAtCell(i, 0, "None");
							hot2.setCellMeta(i, 1, 'className', 'GreenCellBackground')
							hot2.render()
							console.log(parsedBody)
							//StartOffAPIS(parsedBody)

						})
						.catch(function (err) {
							console.log('fail')
							console.log(err)
							hot2.setDataAtCell(i, 1, "Error" + err.error);
							hot2.setDataAtCell(i, 0, "None");
							hot2.setCellMeta(i, 1, 'className', 'RedCellBackground')
							hot2.render()
						});
				}
			}
			else if (ObjectArray[i]['Labor Category Type']) {
				if (ObjectArray[i].Action == "Delete") {
					IDsforCompletionTracking.push(ObjectArray[i].Id)


					console.log(ObjectArray[i])
					console.log(AccessToken)
					hot2.setCellMeta(i, 1, 'className', 'YellowCellBackground')
					BodyCreator =
						[
							{
								"id": ObjectArray[i].Id,
							}
						]

					//if (ObjectArray[i].timezoneRef == "" || ObjectArray[i].timezoneRef == null || ObjectArray[i].timezoneRef == undefined){delete BodyCreator.timeZoneRef}

					console.log(BodyCreator)

					var options4 = {
						'method': 'DELETE',
						'url': 'https://' + SelectedConnection.url + '/api/v1/commons/labor_entries/' + ObjectArray[i].Id,
						'resolveWithFullResponse': true,
						'headers': {
							'appkey': SelectedConnection.appKey,
							'Authorization': AccessToken,
							'Content-Type': ['application/json']

						},



						//body: JSON.stringify(BodyCreator)



					};
					rp(options4)
						.then(function (parsedBody) {
							console.log(parsedBody)
							console.log(parsedBody.request.path)
							ID = parsedBody.request.path.split('/labor_entries/')[1]
							StatusResponse = "Successfully Deleted"
							for (let iz = 0, lz = ObjectArray.length; iz < lz; iz++) {
								console.log(ID, ObjectArray[i].Id)
								if (ObjectArray[iz].Id == ID) {
									hot2.setDataAtCell(iz, 1, StatusResponse)
									hot2.setDataAtCell(iz, 0, "None");
									hot2.setCellMeta(iz, 1, 'className', 'GreenCellBackground')
									hot2.render()
								}
							}


							/*
														hot2.setDataAtCell(i, 1, ObjectArray[i].Action)
														hot2.setDataAtCell(i, 0, "None");
														hot2.setCellMeta(i, 1, 'className', 'GreenCellBackground')
														hot2.render()
							*/
							//StartOffAPIS(parsedBody)

						})
						.catch(function (err) {
							console.log('fail')
							console.log(err)

							ID = err.options.url.split('/labor_entries/')[1]
							for (let iz = 0, lz = ObjectArray.length; iz < lz; iz++) {
								if (ObjectArray[iz].Id == ID) {
									hot2.setDataAtCell(iz, 1, "Error" + err.error);
									hot2.setDataAtCell(iz, 0, "None");
									hot2.setCellMeta(iz, 1, 'className', 'RedCellBackground')
									hot2.render()
								}
							}
						});
				}
			}
		}



		CloseLoadingModal()
	}
}
//End of function

//--------------------------Custom Handsontable Cell Renderer for Search -------------------------------------

function firstRowRenderer(instance, td, row, col, prop, value, cellProperties) {
	Handsontable.renderers.TextRenderer.apply(this, arguments);
	td.style.color = 'black';
	td.style.background = '#f5906c';
	td.style['background-color'] = '#f5906c';
	cellProperties.className = "htCenter"

}




//-------------------------PayCode Edit Slider:

//---------------------------------------------Hamburger Menu-----------------------------

/* Set the width of the side navigation to 0 */
function closeRight() {
	document.getElementById("SideBarRight").style.width = "0";
	document.getElementById('HandsOnTableValue').style.display = "block"
}

document.getElementById("AddPaycode").addEventListener("click", (function () {
	AddOrEdit = 'Add'
	document.getElementById('HandsOnTableValue').style.display = "none"
	document.getElementById("SideBarRight").style.width = "30%"
}))

document.getElementById("EditConnection").addEventListener("click", (function (x) {
	AddOrEdit = 'Edit'
	document.getElementById('HandsOnTableValue').style.display = "none"
	document.getElementById("SideBarRight").style.width = "30%"

	SelectedConnectionName = document.getElementById("Connection").options[document.getElementById("Connection").selectedIndex].value
	SelectedConnection = {}
	for (let i = 0, l = global_data.length; i < l; i++) {
		if (global_data[i].name == SelectedConnectionName) {
			SelectedConnection = global_data[i]
		}
	}
	document.getElementById('CName').value = SelectedConnection.name
	document.getElementById('URL').value = SelectedConnection.url
	document.getElementById('appKey').value = SelectedConnection.appKey
	document.getElementById('auth_ID').value = SelectedConnection.auth_ID
	document.getElementById('auth_secret').value = SelectedConnection.auth_secret
	document.getElementById('username').value = SelectedConnection.username
	document.getElementById('Password').value = SelectedConnection.password

}))

//--------------------------------------------PayCode QuickAdd
document.getElementById('AddPaycodeID').addEventListener('click', function (event) {
	if (AddOrEdit == 'Add') {
		CName = document.getElementById('CName').value
		CURL = document.getElementById('URL').value
		cappKey = document.getElementById('appKey').value
		cauth_ID = document.getElementById('auth_ID').value
		cauth_secret = document.getElementById('auth_secret').value
		cusername = document.getElementById('username').value
		cPassword = document.getElementById('Password').value

		global_data.push(
			{
				"name": CName,
				"url": CURL,
				"appKey": cappKey,
				"auth_ID": cauth_ID,
				"auth_secret": cauth_secret,
				"username": cusername,
				"password": cPassword
			}

		)
		fs = require('fs')
		fs.writeFileSync('./Settings/connections.json', JSON.stringify(global_data));
		RefreshConnections()
		document.getElementById("SideBarRight").style.width = "0";
		document.getElementById('HandsOnTableValue').style.display = "block"

		document.getElementById('CName').value = ''
		document.getElementById('URL').value = ''
		document.getElementById('appKey').value = ''
		document.getElementById('auth_ID').value = ''
		document.getElementById('auth_secret').value = ''
		document.getElementById('username').value = ''
		document.getElementById('Password').value = ''
	}
})

//--------------------------------------------PayCode QuickEdit
document.getElementById('AddPaycodeID').addEventListener('click', function (event) {
	if (AddOrEdit == 'Edit') {
		console.log(global_data)
		CName = document.getElementById('CName').value
		CURL = document.getElementById('URL').value
		cappKey = document.getElementById('appKey').value
		cauth_ID = document.getElementById('auth_ID').value
		cauth_secret = document.getElementById('auth_secret').value
		cusername = document.getElementById('username').value
		cPassword = document.getElementById('Password').value

		ConnectionDetails = {
			"name": CName,
			"url": CURL,
			"appKey": cappKey,
			"auth_ID": cauth_ID,
			"auth_secret": cauth_secret,
			"username": cusername,
			"password": cPassword
		}

		console.log(ConnectionDetails)


		SelectedConnectionName = document.getElementById("Connection").options[document.getElementById("Connection").selectedIndex].value
		SelectedConnection = {}
		for (let i = 0, l = global_data.length; i < l; i++) {
			if (global_data[i].name == SelectedConnectionName) {
				Object.assign(global_data[i], ConnectionDetails)
			}
		}



		fs = require('fs')
		fs.writeFileSync('./Settings/connections.json', JSON.stringify(global_data));
		RefreshConnections()
		document.getElementById("SideBarRight").style.width = "0";
		document.getElementById('HandsOnTableValue').style.display = "block"

		document.getElementById('CName').value = ''
		document.getElementById('URL').value = ''
		document.getElementById('appKey').value = ''
		document.getElementById('auth_ID').value = ''
		document.getElementById('auth_secret').value = ''
		document.getElementById('username').value = ''
		document.getElementById('Password').value = ''
	}
})

Object.defineProperty(Array.prototype, 'chunk', {
	value: function (chunkSize) {
		var temporal = [];

		for (var i = 0; i < this.length; i += chunkSize) {
			temporal.push(this.slice(i, i + chunkSize));
		}

		return temporal;
	}
});

function ToggleRootNode (){
if (document.getElementById('RootNode').style.display == "block"){
	document.getElementById('RootNode').style.display = "none"
	document.getElementById('RootNode2').style.display = "block"
}
else{
	document.getElementById('RootNode').style.display = "block"
	document.getElementById('RootNode2').style.display = "none"

}


}