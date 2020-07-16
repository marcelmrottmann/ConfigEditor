//--------------------------------Define GLobal Variables---------------------------------

var hotdata;
var changedata;
var global_data;
var change_data
var connectionData
var SDMZipFileName;
var hot;
var SelectedRuleIndex;
var SelectedVersionIndex;
var currentFile;
var paycodesResponse;
var ExportConfig;
var DataDictionary;
const fs = require('fs')
var request = require('request');
var rp = require('request-promise')
//-----------------------------------------Read Properties file function
function readLines(input, func) {
	var remaining = '';

	input.on('data', function (data) {
		remaining += data;
		var index = remaining.indexOf('\n');
		var last = 0;
		while (index > -1) {
			var line = remaining.substring(last, index);
			last = index + 1;
			func(line);
			index = remaining.indexOf('\n', last);
		}

		remaining = remaining.substring(last);
	});

	input.on('end', function () {
		if (remaining.length > 0) {
			func(remaining);
		}
	});
}

//-----------------------------------------Fill Connections Dropdown.
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

}


RefreshConnections()

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

		StartDate = document.getElementById("From Date").value
		RootNode = document.getElementById("RootNode").value
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
				RootNodeOptions = []
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
				RootNodeOptions = []
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

//------------------------------------------Close the loading thing---------------
function CloseLoadingModal() {
	loadingmodal.style.display = "none";
	loadingmodal.style.visibility = "hidden";
	document.getElementById('HandsOnTableValue').style.display = "block"
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
	loadingmodal.style.display = "block";
	loadingmodal.style.visibility = "visible";
	setTimeout(parseInputJson, 1000);
})

function parseInputJson(data) {

	var request = require('request');
	var rp = require('request-promise')
	AccessToken = ""
	StartDate = document.getElementById("From Date").value
	//EndDate= document.getElementById("To Date").value
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
				GETWLPATTERNS(parsedBody)
			})
			.catch(function (err) {
				console.log(err)
				window.alert('Could not retrieve the business structure ' + err.error)
				CloseLoadingModal()
				return
			});
	}


	function GETWLPATTERNS(x) {
		x = JSON.parse(x)
		ListOfLocations = []
		for (let i = 0, l = x.length; i < l; i++) {
			if (x[i].orgNodeTypeRef.qualifier != 'Job') {
				ListOfLocations.push(x[i].nodeId)
			}
		}
		AccessToken
		BodyCreator = JSON.stringify(
			{
				"where": {
					"endDate": StartDate,
					"locations": {
						"ids": ListOfLocations
					},
					"startDate": StartDate
				}
			}
		)
		console.log(BodyCreator)
		var options3 = {
			'method': 'POST',
			'url': 'https://' + SelectedConnection.url + '/api/v1/scheduling/workload_patterns/multi_read',
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

				GETBS(parsedBody)


			})
			.catch(function (err) {

				console.log(err)
				window.alert('Login failed ' + err.error)
				CloseLoadingModal()

				return
			});
	}

	Access()

}
function RenderHandsOnTable(x) {

	//--------------------------------------------Require functions----------------------------------------------

	var firstBy = require('thenby');
	var AdmZip = require('adm-zip');


	try {
		if (hotdata) hotdata.destroy()
	}
	catch{ }

	headers = []
	overtimes = []
	overtimecombinations = []
	zones = []
	zonescombinations = []
	paycode = []
	paycodecombinations = []
	complete = []
	Complete = []
	currentFile = SDMZipFileName


	//----------------------------------------------------------------Format data into datatable format
	FinalArray = complete



	console.log(FinalArray)
	FinalArray = Array.from(new Set(FinalArray))
	//headers = Object.keys(FinalArray[0])

	//--------------------------------------------------Create headers and hide columns if needed---------------------------

	console.log(FinalArray)
	headers = []
	for (let i = 0, l = FinalArray.length; i < l; i++) {
		KeyArray = Object.keys(FinalArray[i])
		for (let y = 0, x = KeyArray.length; y < x; y++) {
			headers.push(KeyArray[y])
		}
	}
	headers = Array.from(new Set(headers))
	console.log(JSON.stringify(headers))
	FinalArray = JSON.parse(x)
	if (FinalArray.length > 0) {

		for (let i = 0, l = FinalArray.length; i < l; i++) {
			g = FinalArray[i]

			for (let m = 0, n = g.jobPatterns.length; m < n; m++) {
				f = g.jobPatterns[m]
				StandardShifts = []

				for (let v = 0, w = f.workload.length; v < w; v++) {
					if (f.workload[v].standardShift) {
						if (StandardShifts.indexOf(f.workload[v].standardShift.qualifier) == -1) {
							StandardShifts.push(f.workload[v].standardShift.qualifier)
						}
					}
					else if (f.workload[v].scheduleZone) {
						if (StandardShifts.indexOf(f.workload[v].scheduleZone.qualifier) == -1) {
							StandardShifts.push(f.workload[v].scheduleZone.qualifier)
						}
					}
				}
				StandardShifts = Array.from(new Set(StandardShifts))
				StandardShifts = StandardShifts.map(function (shifts) {
					shiftsTemp = {
						"Job": "",
						"StandardShift": shifts,
						"MONDAY": "",
						"TUESDAY": "",
						"WEDNESDAY": "",
						"THURSDAY": "",
						"FRIDAY": "",
						"SATURDAY": "",
						"SUNDAY": "",
						"HOLIDAY": ""
					}
					return shiftsTemp
				})
				console.log(StandardShifts)
				if (StandardShifts.length > 0) {
					for (let o = 0, p = StandardShifts.length; o < p; o++) {
						for (let v = 0, w = f.workload.length; v < w; v++) {
							if (f.workload[v].standardShift) {
								if (f.workload[v].standardShift.qualifier == StandardShifts[o].StandardShift) {
									if (f.workload[v].dayOfWeek == "MONDAY") { StandardShifts[o].MONDAY = f.workload[v].count }
									else if (f.workload[v].dayOfWeek == "TUESDAY") { StandardShifts[o].TUESDAY = f.workload[v].count }
									else if (f.workload[v].dayOfWeek == "WEDNESDAY") { StandardShifts[o].WEDNESDAY = f.workload[v].count }
									else if (f.workload[v].dayOfWeek == "THURSDAY") { StandardShifts[o].THURSDAY = f.workload[v].count }
									else if (f.workload[v].dayOfWeek == "FRIDAY") { StandardShifts[o].FRIDAY = f.workload[v].count }
									else if (f.workload[v].dayOfWeek == "SATURDAY") { StandardShifts[o].SATURDAY = f.workload[v].count }
									else if (f.workload[v].dayOfWeek == "SUNDAY") { StandardShifts[o].SUNDAY = f.workload[v].count }
									else if (f.workload[v].dayOfWeek == "HOLIDAY") { StandardShifts[o].HOLIDAY = f.workload[v].count }
								}
							}
							else if (f.workload[v].scheduleZone) {
								if (f.workload[v].scheduleZone.qualifier == StandardShifts[o].StandardShift) {
									if (f.workload[v].dayOfWeek == "MONDAY") { StandardShifts[o].MONDAY = f.workload[v].count }
									else if (f.workload[v].dayOfWeek == "TUESDAY") { StandardShifts[o].TUESDAY = f.workload[v].count }
									else if (f.workload[v].dayOfWeek == "WEDNESDAY") { StandardShifts[o].WEDNESDAY = f.workload[v].count }
									else if (f.workload[v].dayOfWeek == "THURSDAY") { StandardShifts[o].THURSDAY = f.workload[v].count }
									else if (f.workload[v].dayOfWeek == "FRIDAY") { StandardShifts[o].FRIDAY = f.workload[v].count }
									else if (f.workload[v].dayOfWeek == "SATURDAY") { StandardShifts[o].SATURDAY = f.workload[v].count }
									else if (f.workload[v].dayOfWeek == "SUNDAY") { StandardShifts[o].SUNDAY = f.workload[v].count }
									else if (f.workload[v].dayOfWeek == "HOLIDAY") { StandardShifts[o].HOLIDAY = f.workload[v].count }
								}
							}

							console.log(StandardShifts[o])
							StandardShifts[o].Job = f.job.qualifier.split('/')[f.job.qualifier.split('/').length - 1]
						}

						map =
						{
							"Location": g.location.qualifier,
							"Type": g.planType,
							"EffectiveDate": g.effectiveDate,
							"ExpirationDate": g.expirationDate
						}
						Object.assign(map, StandardShifts[o])
						Complete.push(map)
						console.log(map)
					}
				}

				else {
					console.log("asdjdsajkdsajkdsakjdsa")
					map = {
						"Location": g.location.qualifier,
						"Type": g.planType,
						"EffectiveDate": g.effectiveDate,
						"ExpirationDate": g.expirationDate,
						"Job": f.job.qualifier.split('/')[f.job.qualifier.split('/').length - 1],
						"StandardShift": "",
						"MONDAY": "",
						"TUESDAY": "",
						"WEDNESDAY": "",
						"THURSDAY": "",
						"FRIDAY": "",
						"SATURDAY": "",
						"SUNDAY": "",
						"HOLIDAY": ""
					}
					Complete.push(map)
					console.log(map)
				}





			}
		}
	}


	headers = [
		"Location",
		"Type",
		"EffectiveDate",
		"ExpirationDate",
		"Job",
		"StandardShift",
		"MONDAY",
		"TUESDAY",
		"WEDNESDAY",
		"THURSDAY",
		"FRIDAY",
		"SATURDAY",
		"SUNDAY",
		"HOLIDAY"
	]


	FinalArray = Complete
	console.log(FinalArray)
	console.log(headers)
	var container = document.getElementById('HandsOnTableValue');

	//---------------------------------------------------Search Criteria for Search function------------------------------------

	function AllMatches(queryStr, value) {
		result = ""
		if (value.toString().indexOf(queryStr.toString()) != -1) result = true
		else result = false
		if (queryStr == '') result = false
		return result//queryStr.toString() === value.toString();
	}
	//---------------------------------------------------------Custom editor for 4th column

	var CustomTextEditor = Handsontable.editors.TextEditor.prototype.extend();

	CustomTextEditor.prototype.open = function () {
		let sourceData = this.instance.getSourceData()[this.row][this.prop];
		this.originalValue = sourceData;
		this.setValue(sourceData);
		Handsontable.editors.TextEditor.prototype.open.apply(this, arguments);
	}
	CustomTextEditor.prototype.refreshValue = function () {
		let sourceData = this.instance.getSourceData()[this.row][this.prop];
		this.originalValue = sourceData;

		this.setValue(sourceData);
		this.refreshDimensions();
	};

	//---------------------------------------Make Columns Not Editable---------------------------------------------------------------------
	columneditorsettings = []
	for (let i = 0, l = headers.length; i < l; i++) {
		if (headers[i] == 'Description') { columneditorsettings.push({ data: headers[i], editor: 'text', width: 300 }) }
		else if (headers[i] == 'ColumnSetDescription') { columneditorsettings.push({ data: headers[i], editor: 'text', width: 300, readOnly: true }) }
		else if (headers[i] == 'Category') { columneditorsettings.push({ data: headers[i], type: 'dropdown', source: ["OTHER", "TIMEKEEPING", "SCHEDULING", "ATTENDANCE", "ANALYTICS", "LEAVE", "AUDIT", "WORK", "EMPLOYEE_SUMMARY"] }) }
		else if (headers[i] == 'Calculate') { columneditorsettings.push({ data: headers[i], type: 'dropdown', source: ['SUM', 'AVG'] }) }
		else if (headers[i] == 'adjustmentType') { columneditorsettings.push({ data: headers[i], type: 'dropdown', source: ['Bonus', 'Wage'] }) }
		else if (headers[i] == 'oncePerDay' || headers[i] == 'overrideIfPrimaryJobSwitch' || headers[i] == 'useHighestWageSwitch' || headers[i] == 'matchAnywhere') { columneditorsettings.push({ data: headers[i], type: 'dropdown', source: ['true', 'false'] }) }

		else { columneditorsettings.push({ data: headers[i], editor: 'text', readOnly: false }) }
		//else if (i == 4) { columneditorsettings.push({ data: headers[i], editor: CustomTextEditor }) }
		//else if (i >= 5) { columneditorsettings.push({ data: headers[i], editor: 'text' }) }
	}
	console.log(columneditorsettings)
	//----------------------------------------RenderFunction
	/*
	function negativeValueRenderer(instance, td, row, col, prop, value, cellProperties) {
		
		
		Handsontable.renderers.TextRenderer.apply(this, arguments);
		
		if (hot.getDataAtCell(row, 7) == 'Bonus'){console.log('true')
			if (col == 8 || col == 9 || col == 10 || col == 11 ){
				td.style.color = 'black';
				td.style.background = '#90ee90';
			}
			else {
				td.style.color = 'red'
				td.style.background = '#90ee90'
			}
		
		}
	  
	}
	*/




	//----------------------------------------Create Handsontable----------------------------------------------------------------------------

	console.log('got this far')
	//if (hot) hot.destroy()
	console.log('got this far')
	var hot = new Handsontable(container, {
		data: FinalArray,
		startRows: 30,
		minSpareCols: 0,
		minSpareRows: 1,
		rowHeaders: true,
		colHeaders: headers,
		columns: columneditorsettings,
		contextMenu: ['cut', 'copy', 'undo', 'redo', 'row_below', 'remove_row'],
		columnSorting: false,
		filters: true,
		dropdownMenu: ['---------', 'filter_by_condition', 'filter_by_value', 'filter_action_bar'],
		autocolumnsize: true,
		autoRowSize: true,
		manualRowResize: true,
		manualColumnResize: true,
		trimDropdown: true,
		//fixedColumnsLeft: fixcolumns,
		outsideClickDeselects: false,
		wordWrap: false,
		//hiddenColumns: hiddencolumn,
		undo: true,
		licenseKey: 'non-commercial-and-evaluation',
		search: {
			searchResultClass: 'hot_search_found'
		},
		//stretchH: 'all',
		afterRender: CloseLoadingModal()



		//----------------------------------------------------Deprecated first column render- deprecated due to performance issues
		/*
			,cells: function (row, col) {
			var cellProperties = {};
			var data = this.instance.getData();
			 if (col === 0) {
				cellProperties.renderer = firstRowRenderer; // uses function directly
				return cellProperties;
			  }}
		*/
		//---------------------------------------------------End Deprecated

	});
	//-----------------------------------------------------Debugging-----------------------------
	console.log('got this far')
	hotdata = hot

	//--------------------------------------------------------Feature fields-------------------------
	SearchField = document.getElementById('search_field')
	queryResult = ""

	//----------------------------------------------------------Search function------------------------

	Handsontable.dom.addEvent(SearchField, 'keyup', function (event) {
		var search = hot.getPlugin('search');
		queryResult = search.query(this.value);
		hot.render();
	});



	//-------------------------------------------put data table into a global variable-----------------------------
	console.log('got this far')
	hotdata = hot


	//hot2 = clone(hot)
	//hot2.getPlugin('Filters').clearConditions();
	//hot2.getPlugin('Filters').filter();
	//hotdata = hot2
	console.log(JSON.stringify(hotdata.getData()))
	console.log(JSON.stringify(hotdata.getColHeader()))

	//-----------------------------------------------Empty master json combinations for rule------------------------------



}
//console.log(document.getElementById("example").Handsontable)

document.getElementById("DownloadNewFile").addEventListener("click", function (change_data) {
	loadingmodal.style.display = "block";
	loadingmodal.style.visibility = "visible";
	setTimeout(Access2, 1000);
})
/*
document.getElementById("DownloadFinalFile").addEventListener("click", function (change_data) {
	loadingmodal.style.display = "block";
	loadingmodal.style.visibility = "visible";
	setTimeout(downloadNewFile, 1000, change_data);
})
*/
//-------------------------------------------------------Save Changes to file-----------------------------------

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
			AccessToken = JSON.parse(parsedBody).access_token
			downloadNewFile(parsedBody)


		})
		.catch(function (err) {
			console.log(err)
			window.alert('Login Failed ' + err.error)
		});
}


function downloadNewFile(change_data) {
	//AccessToken = change_data

	//changedata.itemsRetrieveResponses = []
	console.log(AccessToken)
	LoadingScreenModal('block')

	var request = require('request');
	var rp = require('request-promise')


	LoadingHandsOnTable = document.getElementById('LoadingHandsOnTable')

	console.log(changedata)
	const fs = require('fs')
	console.log(changedata)
	//var pop = hotdata.getData().pop()
	//var resultdata = hotdata.getData()
	var ObjectArray = []

	//var OnlySaveFiltered = document.getElementById("OnlySaveFiltered").checked
	hot2 = hotdata
	console.log(hot)

	/*if (OnlySaveFiltered == true) {
		hot2.getPlugin('Filters').clearConditions();
		hot2.getPlugin('Filters').filter();
	}
	*/
	resultdata = hot2.getData();
	headers = hot2.getColHeader();

	//resultdata.splice(-1,1)

	console.log(resultdata)
	console.log(headers)
	ListOfDVs = []
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
	console.log(ObjectArray)


	ListOfDVs = []
	for (let i = 0, l = ObjectArray.length; i < l; i++) {
		LocationID = ObjectArray[i].Location + '-' + ObjectArray[i].EffectiveDate + '-' + ObjectArray[i].ExpirationDate
		try {
			LocationIDMinus1 = ObjectArray[i - 1].Location + '-' + ObjectArray[i - 1].EffectiveDate + '-' + ObjectArray[i - 1].ExpirationDate
		} catch{ LocationIDMinus1 = ObjectArray[i].Location + '-' + ObjectArray[i].EffectiveDate + '-' + ObjectArray[i].ExpirationDate }
		DetailGenie =
		{
			"Name": ObjectArray[i].Location + '-' + ObjectArray[i].EffectiveDate + '-' + ObjectArray[i].ExpirationDate,
			"Status": "None"
		}
		if (i == 0 && ObjectArray[i].Location != '' && ObjectArray[i].Location != null) {
			ListOfDVs.push(DetailGenie)
		}
		else if (LocationID != LocationIDMinus1 && ObjectArray[i].Location != '' && ObjectArray[i].Location != null) {
			ListOfDVs.push(DetailGenie)
		}
	}
	ListOfDVs = Array.from(new Set(ListOfDVs))
	console.log(ListOfDVs)



	Columns = [
		{ data: "Status", editor: 'text', readOnly: true, width: 400 },
		{ data: "Name", editor: 'text', readOnly: true }
	]

	ColumnHeaders = [
		"Status", "Name"
	]
	var LoaderHOT = new Handsontable(LoadingHandsOnTable, {
		data: ListOfDVs,
		colHeaders: ColumnHeaders,
		contextMenu: ['copy'],
		columnSorting: false,
		columns: Columns,
		filters: true,
		dropdownMenu: ['---------', 'filter_by_condition', 'filter_by_value', 'filter_action_bar'],
		autocolumnsize: true,
		autoRowSize: true,
		manualRowResize: true,
		manualColumnResize: true,
		trimDropdown: true,
		//fixedColumnsLeft: fixcolumns,
		outsideClickDeselects: false,
		wordWrap: false,
		//hiddenColumns: hiddencolumn,
		undo: true,
		licenseKey: 'non-commercial-and-evaluation',
		stretchH: 'all',
		afterRender: CloseLoadingModal()
	}
	)

	AllJobPatterns = []
	ListOfLocations = []


	for (let i = 0, l = ObjectArray.length; i < l; i++) {
		if (ObjectArray[i].Location != '' && ObjectArray[i].Location != null) {
			ListOfLocations.push(ObjectArray[i].Location + '-//-' + ObjectArray[i].EffectiveDate + '-//-' + ObjectArray[i].ExpirationDate)
		}
	}
	ListOfLocations = Array.from(new Set(ListOfLocations))


	ListOfJobs = []
	for (let i = 0, l = ObjectArray.length; i < l; i++) {
		ListOfJobs.push(ObjectArray[i].Location + '/' + ObjectArray[i].Job + '///' + ObjectArray[i].Location + '-//-' + ObjectArray[i].EffectiveDate + '-//-' + ObjectArray[i].ExpirationDate)
	}
	ListOfJobs = Array.from(new Set(ListOfJobs))

	ListOfJobs = ListOfJobs.map(function (z) {
		zi =
		{
			"LocationID": z.split('///')[1],
			"JobPattern":
			{
				"job": {
					"qualifier": z.split('///')[0]
				},
				"workload": []
			}
		}
		return zi

	})
	for (let i = 0, l = ListOfLocations.length; i < l; i++) {

		JobPatterns =
		{
			"LocationID": ListOfLocations[i],
			"jobPatterns": []
		}
		for (let g = 0, h = ListOfJobs.length; g < h; g++) {
			if (ListOfJobs[g].LocationID == JobPatterns.LocationID) {
				JobPatterns.jobPatterns.push(ListOfJobs[g].JobPattern)
			}
		}
		AllJobPatterns.push(JobPatterns)
	}


	for (let i = 0, l = AllJobPatterns.length; i < l; i++) {
		for (let j = 0, k = AllJobPatterns[i].jobPatterns.length; j < k; j++) {
			for (let m = 0, n = ObjectArray.length; m < n; m++) {
				if (AllJobPatterns[i].LocationID == (ObjectArray[m].Location + '-//-' + ObjectArray[m].EffectiveDate + '-//-' + ObjectArray[m].ExpirationDate)
					&& AllJobPatterns[i].jobPatterns[j].job.qualifier == (ObjectArray[m].Location + '/' + ObjectArray[m].Job)) {



					Monday =
					{
						"count": parseInt(ObjectArray[m].MONDAY, 10),
						"dayOfWeek": "MONDAY",
						"standardShift": {
							"qualifier": ObjectArray[m].StandardShift
						}
					}
					Tuesday =
					{
						"count": parseInt(ObjectArray[m].TUESDAY, 10),
						"dayOfWeek": "TUESDAY",
						"standardShift": {
							"qualifier": ObjectArray[m].StandardShift
						}
					}
					Wednesday =
					{
						"count": parseInt(ObjectArray[m].WEDNESDAY, 10),
						"dayOfWeek": "WEDNESDAY",
						"standardShift": {
							"qualifier": ObjectArray[m].StandardShift
						}
					}
					Thursday =
					{
						"count": parseInt(ObjectArray[m].THURSDAY, 10),
						"dayOfWeek": "THURSDAY",
						"standardShift": {
							"qualifier": ObjectArray[m].StandardShift
						}
					}
					Friday =
					{
						"count": parseInt(ObjectArray[m].FRIDAY, 10),
						"dayOfWeek": "FRIDAY",
						"standardShift": {
							"qualifier": ObjectArray[m].StandardShift
						}
					}
					Saturday =
					{
						"count": parseInt(ObjectArray[m].SATURDAY, 10),
						"dayOfWeek": "SATURDAY",
						"standardShift": {
							"qualifier": ObjectArray[m].StandardShift
						}
					}
					Sunday =
					{
						"count": parseInt(ObjectArray[m].SUNDAY, 10),
						"dayOfWeek": "SUNDAY",
						"standardShift": {
							"qualifier": ObjectArray[m].StandardShift
						}
					}
					Holiday =
					{
						"count": parseInt(ObjectArray[m].HOLIDAY, 10),
						"dayOfWeek": "HOLIDAY",
						"standardShift": {
							"qualifier": ObjectArray[m].StandardShift
						}
					}

					if (ObjectArray[m].MONDAY != null && ObjectArray[m].MONDAY != "") { AllJobPatterns[i].jobPatterns[j].workload.push(Monday) }
					if (ObjectArray[m].TUESDAY != null && ObjectArray[m].TUESDAY != "") { AllJobPatterns[i].jobPatterns[j].workload.push(Tuesday) }
					if (ObjectArray[m].WEDNESDAY != null && ObjectArray[m].WEDNESDAY != "") { AllJobPatterns[i].jobPatterns[j].workload.push(Wednesday) }
					if (ObjectArray[m].THURSDAY != null && ObjectArray[m].THURSDAY != "") { AllJobPatterns[i].jobPatterns[j].workload.push(Thursday) }
					if (ObjectArray[m].FRIDAY != null && ObjectArray[m].FRIDAY != "") { AllJobPatterns[i].jobPatterns[j].workload.push(Friday) }
					if (ObjectArray[m].SATURDAY != null && ObjectArray[m].SATURDAY != "") { AllJobPatterns[i].jobPatterns[j].workload.push(Saturday) }
					if (ObjectArray[m].SUNDAY != null && ObjectArray[m].SUNDAY != "") { AllJobPatterns[i].jobPatterns[j].workload.push(Sunday) }
					if (ObjectArray[m].HOLIDAY != null && ObjectArray[m].HOLIDAY != "") { AllJobPatterns[i].jobPatterns[j].workload.push(Holiday) }


				}
			}


		}
	}
	console.log(AllJobPatterns)

	FinalStuff = []
	for (let i = 0, l = AllJobPatterns.length; i < l; i++) {
		//KVP = ListOfDVs[i].split('&--&')
		map =
		{
			"effectiveDate": AllJobPatterns[i].LocationID.split('-//-')[1],
			"expirationDate": AllJobPatterns[i].LocationID.split('-//-')[2],
			"jobPatterns": AllJobPatterns[i].jobPatterns,
			"location": {
				"qualifier": AllJobPatterns[i].LocationID.split('-//-')[0]
			},
			"planType": "BUDGET"
		}

		console.log(map)

		FinalStuff.push(map)

		LoadingData = LoaderHOT.getData()

		for (let y = 0, z = LoadingData.length; y < z; y++) {
			console.log()
			if (LoadingData[y][1] == map.name) {
				LoaderHOT.setDataAtCell(y, 0, "Pending")
				LoaderHOT.setCellMeta(y, 0, 'className', 'YellowCellBackground')
			}
		}
		console.log(AccessToken)
		var options4 = {
			'method': 'POST',
			'url': 'https://' + SelectedConnection.url + "/api/v1/scheduling/workload_patterns/multi_upsert",
			'headers': {
				'appkey': SelectedConnection.appKey,
				'Authorization': AccessToken,
				'Content-Type': ['application/json']
			},
			body: JSON.stringify(map)

		};
		rp(options4)
			.then(function (parsedBody) {
				console.log(parsedBody)
				console.log(parsedBody)
				for (let y = 0, z = LoadingData.length; y < z; y++) {
					RequestBody = JSON.parse(parsedBody)
					if (LoadingData[y][1] == RequestBody[0].location.qualifier + '-' + RequestBody[0].effectiveDate + '-' + RequestBody[0].expirationDate) {
						LoaderHOT.setDataAtCell(y, 0, "Successfully Imported")
						LoaderHOT.setCellMeta(y, 0, 'className', 'GreenCellBackground')
						LoaderHOT.render()
					}

				}

			})
			.catch(function (err) {
				console.log('fail')
				console.log(err)
				for (let y = 0, z = LoadingData.length; y < z; y++) {
					RequestBody = JSON.parse(err.options.body)
					if (LoadingData[y][1] == RequestBody.location.qualifier + '-' + RequestBody.effectiveDate + '-' + RequestBody.expirationDate) {
						LoaderHOT.setDataAtCell(y, 0, JSON.parse(err.error).errorCode + JSON.parse(err.error).message)
						if (JSON.parse(err.error).errorCode == "WCO-106384") {
							LoaderHOT.setCellMeta(y, 0, 'className', 'BlueCellBackground')

						}
						else {

							LoaderHOT.setCellMeta(y, 0, 'className', 'RedCellBackground')
						}

						LoaderHOT.render()
					}
				}

			});

	}



	console.log(FinalStuff)

	fs.renameSync('./RESPONSEJSON/DVresponse.json', './RESPONSEJSON/DVresponse_old.json')
	fs.writeFileSync('./RESPONSEJSON/DVresponse.json', JSON.stringify(FinalStuff));
	//End Save

	//---------------------------------------------------New Zip Stuff---------------------------------------------------


	//---------------------------------------------------End of New Zip Stuff--------------------------------------------

	CloseLoadingModal()
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
	console.log(SelectedConnectionName)
	SelectedConnection = {}
	for (let i = 0, l = connectionData.length; i < l; i++) {
		if (connectionData[i].name == SelectedConnectionName) {
			SelectedConnection = connectionData[i]
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

		connectionData.push(
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
		fs.writeFileSync('./Settings/connections.json', JSON.stringify(connectionData));
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
		console.log(connectionData)
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
		for (let i = 0, l = connectionData.length; i < l; i++) {
			if (connectionData[i].name == SelectedConnectionName) {
				Object.assign(connectionData[i], ConnectionDetails)
			}
		}




		fs.writeFileSync('./Settings/connections.json', JSON.stringify(connectionData));
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


function LoadingScreenModal(YN) {
	document.getElementById('PopUpLoader').style.display = YN

}

LoadingScreenModal('none')