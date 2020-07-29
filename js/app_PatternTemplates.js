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
var ShiftSets;
var ZoneSets;
const fs = require('fs')
var request = require('request');
var rp = require('request-promise')
var moment = require('moment')
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


	function GETPATTERNS(x) {
		x = JSON.parse(x)

		AccessToken = x.access_token


		var options3 = {
			'method': 'GET',
			'url': 'https://' + SelectedConnection.url + '/api/v1/scheduling/schedule_pattern_templates',
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


				GETPATTERNS(parsedBody)

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

	FinalArray = JSON.parse(x)
	console.log(FinalArray)
	for (let i = 0, l = FinalArray.length; i < l; i++) {
		g = FinalArray[i]
		console.log(g.dayCount / 7)
		numberOfWeeks = (g.dayCount / 7)

		//for (let m = 0, n = numberOfWeeks; m < n; m++) {



		for (let f = 0, h = g.items.length; f < h; f++) {

			//if (g.items[f].day >= m*7 && g.items[f].day <= (m*7+7)){

			if (g.items[f].shiftTemplate) { shiftTemplate = g.items[f].shiftTemplate.name } else shiftTemplate = ""
			if (g.items[f].availabilityTemplate) {
				availabilities = []
				for (let j = 0, k = g.items[f].availabilityTemplate.segments.length; j < k; j++) {
					availabilities.push(
						g.items[f].availabilityTemplate.segments[j].availabilityType.qualifier
						+ "|" +
						g.items[f].availabilityTemplate.segments[j].startTime
						+ "|" +
						g.items[f].availabilityTemplate.segments[j].endTime
					)
				}
				availabilities.join(',')
			}
			else { availabilities = "" }
			if (g.items[f].payCodeEditTemplate) {
				paycode = g.items[f].payCodeEditTemplate.payCode.qualifier
					+ "|" +
					g.items[f].payCodeEditTemplate.startDateTime.split('T')[1]
					+ "|" +
					g.items[f].payCodeEditTemplate.endDateTime.split('T')[1]
			}
			else { paycode = "" }
			map = {
				"id": g.id,
				"name": g.name,
				"description": g.description,
				"timePeriodType": g.timePeriodType.name,
				"dayCount": g.dayCount,
				"startDate": g.startDate,
				"anchorStartDay": g.anchorStartDay,
				"day": g.items[f].day,
				"shiftTemplates": shiftTemplate,
				"availabilities": availabilities,
				"paycodes": paycode
			}



			Complete.push(map)
			console.log(map)
		}
		//}
		//}
	}

	if (document.getElementById('Status').value == 'PT') {
		headers = [
			"id",
			"name",
			"description",
			"timePeriodType",
			"dayCount",
			"startDate",
			"anchorStartDay",
			"day",
			"shiftTemplates",
			"availabilities",
			"paycodes"
		]
	}

	else {
		headers = [
			"personNumber",
			"StartDate",
			"EndDate",
			"name",
			"description",
			"timePeriodType",
			"dayCount",
			"startDate",
			"anchorStartDay",
			"day",
			"shiftTemplates",
			"availabilities",
			"paycodes"
		]
	}


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
		if (document.getElementById('Status').value == 'PT') {
			DetailGenie =
			{
				"Name": ObjectArray[i].name,
				"id": ObjectArray[i].id || "NOID",
				"Status": "None"
			}
			if (i == 0 && ObjectArray[i].name != '' && ObjectArray[i].name != null) {
				ListOfDVs.push(DetailGenie)
			}
			else if (ObjectArray[i - 1].name != ObjectArray[i].name && ObjectArray[i].name != '' && ObjectArray[i].name != null) {
				ListOfDVs.push(DetailGenie)
			}
		}
		else {
			DetailGenie =
			{
				"Name": ObjectArray[i].personNumber + '--' + ObjectArray[i].name,
				"id": ObjectArray[i].id || "NOID",
				"Status": "None"
			}
			if (i == 0 && ObjectArray[i].name != '' && ObjectArray[i].name != null && ObjectArray[i].personNumber != '' && ObjectArray[i].personNumber != null) {
				ListOfDVs.push(DetailGenie)
			}
			else if (ObjectArray[i - 1].name != ObjectArray[i].name
				&& ObjectArray[i - 1].personNumber != ObjectArray[i].personNumber
				&& ObjectArray[i].name != '' && ObjectArray[i].name != null
				&& ObjectArray[i].personNumber != '' && ObjectArray[i].personNumber != null) {
				ListOfDVs.push(DetailGenie)
			}




		}

	}
	ListOfDVs = Array.from(new Set(ListOfDVs))
	console.log(ListOfDVs)



	Columns = [
		{ data: "Status", editor: 'text', readOnly: false },
		{ data: "Name", editor: 'text', readOnly: false },
		{ data: "id", editor: 'text', readOnly: false }
	]

	ColumnHeaders = [
		"Status", "Name", "id"
	]
	var LoaderHOT = new Handsontable(LoadingHandsOnTable, {
		data: ListOfDVs,
		colHeaders: ColumnHeaders,
		//rowHeaders:true,
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
		wordWrap: true,
		//hiddenColumns: hiddencolumn,
		undo: true,
		licenseKey: 'non-commercial-and-evaluation',
		stretchH: 'all',
		afterRender: CloseLoadingModal()

	})


	FinalStuff = []

	LoadingData = LoaderHOT.getData()
	console.log(LoadingData)
	if (document.getElementById('Status').value == 'PT') {
		LoadedDataArray = []
		for (let y = 0, z = LoadingData.length; y < z; y++) {
			LoadedData = ""
			for (let i = 0, l = ObjectArray.length; i < l; i++) {
				if (LoadingData[y][1] == ObjectArray[i].name) {
					LoadedData =
					{
						"name": ObjectArray[i].name,
						"description": ObjectArray[i].description,
						"timePeriodType": {
							"name": ObjectArray[i].timePeriodType
						},
						"dayCount": ObjectArray[i].dayCount,
						"startDate": ObjectArray[i].startDate,
						"items": [],
						"anchorStartDay": ObjectArray[i].anchorStartDay
					}
				}
			}
			LoadedDataArray.push(LoadedData)
		}
		for (let y = 0, z = LoadedDataArray.length; y < z; y++) {
			for (let i = 0, l = ObjectArray.length; i < l; i++) {
				if (LoadedDataArray[y].name == ObjectArray[i].name) {
					console.log(ObjectArray[i])
					if (ObjectArray[i].availabilities != null && ObjectArray[i].availabilities != "") {
						availTempObject =
						{
							"day": ObjectArray[i].day,
							"availabilityTemplate": {
								"systemGenerated": true,
								"segments": []
							}
						}

						for (let zi = 0, zl = ObjectArray[i].availabilities.length; zi < zl; zi++) {

							availTemp = ObjectArray[i].availabilities[zi].split('|')
							availTempObject.availabilityTemplate.segments.push(
								{
									"availabilityType": {
										"qualifier": availTemp[0]
									},
									"startTime": availTemp[1],
									"endTime": availTemp[2]
								}
							)

						}
						LoadedDataArray[y].items.push(availTempObject)

					}
					else if (ObjectArray[i].shiftTemplates != null && ObjectArray[i].shiftTemplates != "") {

						STTempObject =
						{
							"day": ObjectArray[i].day,
							"shiftTemplate": {
								"name": ObjectArray[i].shiftTemplates,
							}
						}
						LoadedDataArray[y].items.push(STTempObject)
					}
					else if (ObjectArray[i].paycodes != null && ObjectArray[i].paycodes != "") {
						availTemp = ObjectArray[i].paycodes.split('|')
						if (availTemp[1] > availTemp[2]) { EndOffSet = 2 } else { EndOffSet = 1 }
						durationInTime = moment("1900-01-0" + EndOffSet + "T" + availTemp[2]).diff(("1900-01-01T" + availTemp[1]), 'seconds')

						availTempObject =
						{
							"day": ObjectArray[i].day,
							"payCodeEditTemplate": {
								"systemGenerated": true,
								"startDateTime": "1900-01-01T" + availTemp[1],
								"endDateTime": "1900-01-0" + EndOffSet + "T" + availTemp[2],
								"payCode": {
									"qualifier": availTemp[0]
								},
								"durationInTime": durationInTime,
							}
						}
						LoadedDataArray[y].items.push(availTempObject)
					}

				}
			}
		}

		console.log(LoadedDataArray)

		for (let y = 0, z = LoadingData.length; y < z; y++) {
			for (let g = 0, h = LoadedDataArray.length; g < h; g++) {
				console.log()
				if (LoadingData[y][1] == LoadedDataArray[g].name) {
					LoaderHOT.setDataAtCell(y, 0, "Pending")
					LoaderHOT.setCellMeta(y, 0, 'className', 'YellowCellBackground')

					map = LoadedDataArray[g]

					console.log(AccessToken)
					var options4 = {
						'method': 'PUT',
						'url': 'https://' + SelectedConnection.url + "/api/v1/scheduling/schedule_pattern_templates?name=" + LoadedDataArray[g].name,
						'headers': {
							'appkey': SelectedConnection.appKey,
							'Authorization': AccessToken,
							'Content-Type': ['application/json']
						},
						body: JSON.stringify(map)

					};
					if (LoadingData[y][2] == "NOID") { options4.method = 'POST' }

					rp(options4)
						.then(function (parsedBody) {
							console.log(parsedBody)
							console.log(parsedBody)
							for (let y = 0, z = LoadingData.length; y < z; y++) {
								RequestBody = JSON.parse(parsedBody)
								if (LoadingData[y][1] == RequestBody.name) {
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
								RequestBody = err.options.url.split("?name=")[1]
								console.log(RequestBody, LoadingData[y][1])
								if (LoadingData[y][1] == RequestBody) {
									LoaderHOT.setDataAtCell(y, 0, JSON.parse(err.error).errorCode + JSON.parse(err.error).message)
									LoaderHOT.setCellMeta(y, 0, 'className', 'RedCellBackground')
									LoaderHOT.render()
								}
							}

						});

				}
			}

		}
	}
	else {
		LoadedDataArray = []
		for (let y = 0, z = LoadingData.length; y < z; y++) {
			LoadedData = ""
			for (let i = 0, l = ObjectArray.length; i < l; i++) {
				console.log(LoadingData[y][1], ObjectArray[i].personNumber + "--" + ObjectArray[i].name)
				if (LoadingData[y][1] == ObjectArray[i].personNumber + "--" + ObjectArray[i].name) {
					LoadedData =

					{
						"employeeSchedulePatterns": {
							"do": {
								"employeeSchedulePatternCreates": [
									{
										"override": true,
										"employeeSchedulePattern": {
											"employeeRef": {
												"qualifier": ObjectArray[i].personNumber
											},
											"endDate": ObjectArray[i].EndDate,
											"startDate": ObjectArray[i].StartDate,

											"schedulePattern":
											{
												"name": ObjectArray[i].name,
												"description": ObjectArray[i].description,
												"timePeriodType": {
													"name": ObjectArray[i].timePeriodType
												},
												"dayCount": ObjectArray[i].dayCount,
												"startDate": ObjectArray[i].startDate,
												"items": [],
												"anchorStartDay": ObjectArray[i].anchorStartDay
											}
										}
									}
								]

							}
						}
					}
				}
			}
			if (LoadedData.employeeSchedulePatterns.do.employeeSchedulePatternCreates[0].employeeSchedulePattern.schedulePattern.anchorStartDay == null ||
				LoadedData.employeeSchedulePatterns.do.employeeSchedulePatternCreates[0].employeeSchedulePattern.schedulePattern.anchorStartDay == "" ){
					delete LoadedData.employeeSchedulePatterns.do.employeeSchedulePatternCreates[0].employeeSchedulePattern.schedulePattern.anchorStartDay}
			LoadedDataArray.push(LoadedData)
		}


		for (let y = 0, z = LoadedDataArray.length; y < z; y++) {
			for (let i = 0, l = ObjectArray.length; i < l; i++) {
				if (LoadedDataArray[y].employeeSchedulePatterns.do.employeeSchedulePatternCreates[0].employeeSchedulePattern.schedulePattern.name == ObjectArray[i].name) {
					console.log(ObjectArray[i])
					if (ObjectArray[i].availabilities != null && ObjectArray[i].availabilities != "") {
						availTempObject =
						{
							"day": ObjectArray[i].day,
							"availabilityTemplate": {
								"systemGenerated": true,
								"segments": []
							}
						}

						for (let zi = 0, zl = ObjectArray[i].availabilities.length; zi < zl; zi++) {

							availTemp = ObjectArray[i].availabilities[zi].split('|')
							availTempObject.availabilityTemplate.segments.push(
								{
									"availabilityType": {
										"qualifier": availTemp[0]
									},
									"startTime": availTemp[1],
									"endTime": availTemp[2]
								}
							)

						}
						LoadedDataArray[y].employeeSchedulePatterns.do.employeeSchedulePatternCreates[0].employeeSchedulePattern.schedulePattern.items.push(availTempObject)

					}
					else if (ObjectArray[i].shiftTemplates != null && ObjectArray[i].shiftTemplates != "") {

						STTempObject =
						{
							"day": ObjectArray[i].day,
							"shiftTemplate": {
								"name": ObjectArray[i].shiftTemplates,
							}
						}
						LoadedDataArray[y].employeeSchedulePatterns.do.employeeSchedulePatternCreates[0].employeeSchedulePattern.schedulePattern.items.push(STTempObject)
					}



					else if (ObjectArray[i].paycodes != null && ObjectArray[i].paycodes != "") {
						availTemp = ObjectArray[i].paycodes.split('|')
						if (availTemp[1] > availTemp[2]) { EndOffSet = 2 } else { EndOffSet = 1 }
						durationInTime = moment("1900-01-0" + EndOffSet + "T" + availTemp[2]).diff(("1900-01-01T" + availTemp[1]), 'seconds')

						availTempObject =
						{
							"day": ObjectArray[i].day,
							"payCodeEditTemplate": {
								"systemGenerated": true,
								"startDateTime": "1900-01-01T" + availTemp[1],
								"endDateTime": "1900-01-0" + EndOffSet + "T" + availTemp[2],
								"payCode": {
									"qualifier": availTemp[0]
								},
								"durationInTime": durationInTime,
							}
						}
						LoadedDataArray[y].employeeSchedulePatterns.do.employeeSchedulePatternCreates[0].employeeSchedulePattern.schedulePattern.items.push(availTempObject)
					}

				}
			}
		}

		console.log(LoadedDataArray)

		for (let y = 0, z = LoadingData.length; y < z; y++) {
			for (let g = 0, h = LoadedDataArray.length; g < h; g++) {
				console.log()
				if (LoadingData[y][1] == LoadedDataArray[g].employeeSchedulePatterns.do.employeeSchedulePatternCreates[0].employeeSchedulePattern.employeeRef.qualifier + '--' + LoadedDataArray[g].employeeSchedulePatterns.do.employeeSchedulePatternCreates[0].employeeSchedulePattern.schedulePattern.name) {
					LoaderHOT.setDataAtCell(y, 0, "Pending")
					LoaderHOT.setCellMeta(y, 0, 'className', 'YellowCellBackground')

					map = LoadedDataArray[g]

					console.log(AccessToken)
					var options4 = {
						'method': 'POST',
						'url': 'https://' + SelectedConnection.url + "/api/v1/scheduling/employee_schedule_patterns/apply_create?partial_success=true",
						'headers': {
							'appkey': SelectedConnection.appKey,
							'Authorization': AccessToken,
							'Content-Type': ['application/json']
						},
						body: JSON.stringify(map)

					};
					if (LoadingData[y][2] == "NOID") { options4.method = 'POST' }

					rp(options4)
						.then(function (parsedBody) {
							console.log(parsedBody)
							console.log(parsedBody)
							for (let y = 0, z = LoadingData.length; y < z; y++) {
								RequestBody = JSON.parse(parsedBody)
								if (LoadingData[y][1] == RequestBody.name) {
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
								console.log(RequestBody, LoadingData[y][1])
								if (LoadingData[y][1] == RequestBody.employeeSchedulePatterns.do.employeeSchedulePatternCreates[0].employeeSchedulePattern.employeeRef.qualifier + '--' + LoadedDataArray[g].employeeSchedulePatterns.do.employeeSchedulePatternCreates[0].employeeSchedulePattern.schedulePattern.name) {
									LoaderHOT.setDataAtCell(y, 0, JSON.parse(err.error).errorCode + JSON.parse(err.error).message)
									LoaderHOT.setCellMeta(y, 0, 'className', 'RedCellBackground')
									LoaderHOT.render()
								}
							}

						});

				}
			}

		}

	}



	console.log(FinalStuff)

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

document.getElementById("DownloadtoCSV").addEventListener('click', function () {
	var exportPlugin = hotdata.getPlugin('exportFile');
	exportPlugin.downloadFile('csv', { filename: RootNode, columnHeaders: true, });
});
