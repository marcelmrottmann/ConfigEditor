//--------------------------------Define GLobal Variables---------------------------------

var hotdata;
var changedata;
var global_data;
var SDMZipFileName;
var hot;
var SelectedRuleIndex;
var SelectedVersionIndex;
var currentFile;
var paycodesResponse;
var ExportConfig;

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

//---------------------------Remove from array
function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
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




	//--------------------------------------------Require functions----------------------------------------------
	console.log(SDMZipFileName)
	var firstBy = require('thenby');
	var AdmZip = require('adm-zip');
	var SDMZipFileName = document.getElementById("ChooseFile").value
	//--------------------------------------------Get files--------------------------------------------
		console.log(currentFile)
		console.log(SDMZipFileName)
		if (currentFile == SDMZipFileName) {
			const fs = require('fs')
			const config = require('./RESPONSEJSON/response_WR.json')
			var global_data = fs.readFileSync("./RESPONSEJSON/response_WR.json");
			global_data = JSON.parse(global_data)

		}

		/*	
		
		*/

		else {

			//var Handsontable = require('handsontable')
			try {
				var zip = new AdmZip(SDMZipFileName)
				var zipEntries = zip.getEntries();
				console.log(zipEntries)
				// an array of ZipEntry records
			}
			catch { window.alert("File not found"); CloseLoadingModal(); return; }

			zipEntries.forEach(function (zipEntry) {
				console.log(zipEntry.entryName)
				if (zipEntry.entryName == "WSAWorkRule\\response.json" || zipEntry.entryName == "WSAWorkRule\response.json" || zipEntry.entryName == "WSAWorkRule/response.json") {
					var decompressedData = zip.readFile(zipEntry);
					var data = zip.readAsText(zipEntry)
					console.log(JSON.parse(data));
					global_data = JSON.parse(data)

				}

				if (zipEntry.entryName == "WSAPayCode\\response.json" || zipEntry.entryName == "WSAPayCode/response.json") {
					var decompressedData = zip.readFile(zipEntry);
					paycodesResponse = zip.readAsText(zipEntry)
					console.log(JSON.parse(paycodesResponse));
					paycodesResponse = JSON.parse(paycodesResponse)
				}


				else if (zipEntry.entryName == "ExportConfig.json") {
					var decompressedData = zip.readFile(zipEntry);
					var exportdata = zip.readAsText(zipEntry)
					console.log(JSON.parse(exportdata));
					ExportConfig = JSON.parse(exportdata)


				}
				const fs = require('fs')
				try {
					fs.renameSync('./RESPONSEJSON/response_WR.json', './RESPONSEJSON/response_WR_old.json')
				}
				catch { 'file not found for rename' }
				fs.writeFileSync('./RESPONSEJSON/response_WR.json', JSON.stringify(global_data));


			});
		}
	
	data = global_data
	//--------------------------------------------Store Data and check if empty-------------------------------

	
	try {
		console.log(
			data.itemsRetrieveResponses[0].responseObjectNode.WSAWorkRule.EffectiveWorkRules.WSAEffectiveWorkRule.length)
	}
	catch { window.alert("File is empty"); CloseLoadingModal(); return; }
	//document.getElementById("ruleName").value = data.itemsRetrieveResponses[0].itemDataInfo.title;

	//-------------------------------------------------Filter Pay Codes and check if file exists

	try {

		paycodesResponse =
			paycodesResponse.itemsRetrieveResponses.filter(function (x) {
				condition = ''
				//			console.log(x.responseObjectNode.WSAPayCode['@AmountType'] )
				//			console.log(x.responseObjectNode.WSAPayCode['@Type'])
				if (x.responseObjectNode.WSAPayCode['@AmountType'] == 'Hour' && x.responseObjectNode.WSAPayCode['@Type'] == 'P') condition = true
				else condition = false
				return condition
			}
			)

		//---------------------------------------------------------------------------Delete PayCode Drop Down Content--------------------------
		var WSAPayCodeList = document.getElementById("paycodelist");
		var WSAPayCodeListlength = WSAPayCodeList.options.length;
		for (let i = 0, l = WSAPayCodeList.options.length; i < l; i++) {
			WSAPayCodeList.removeChild(WSAPayCodeList.options[0])
		}

		//	console.log(WSAPayCodeList.options.innerHTML)
		//	WSAPayCodeList.options.innerHTML = ""

		//---------------------------------------------------------------------------Create PayCode Drop Down Content--------------------------

		for (let i = 0, l = paycodesResponse.length; i < l; i++) {
			value = paycodesResponse[i].itemDataInfo.title
			var y = document.getElementById("paycodelist");
			var option = document.createElement("option");
			option.text = value;
			y.appendChild(option);
		}
		console.log(JSON.stringify(paycodesarray))

	}
	catch {
		// window.alert("Paycodes file not supplied, not all features will be available"); 
	}


	VersionValue = ""

	for (let c = 0, d = data.itemsRetrieveResponses.length; c < d; c++) {
		if (data.itemsRetrieveResponses[c].responseObjectNode.WSAWorkRule.EffectiveWorkRules.WSAEffectiveWorkRule instanceof Array != true) {
			tempStor = []
			tempStor.push(data.itemsRetrieveResponses[c].responseObjectNode.WSAWorkRule.EffectiveWorkRules.WSAEffectiveWorkRule)
			data.itemsRetrieveResponses[c].responseObjectNode.WSAWorkRule.EffectiveWorkRules.WSAEffectiveWorkRule = tempStor
		}
	}
	console.log(data)

	headers = []
	OvertimeRuleNames = []
	ZoneRuleNames = []
	ExtensionNames = []
	ExtensionProcessorNames = []
	BreakRuleNames = []
	DeductionRuleNames = []
	complete = []
	currentFile = SDMZipFileName
	//---------------------------------------------------------------------------Convert JSON into table data----------------------------


	for (let c = 0, d = data.itemsRetrieveResponses.length; c < d; c++) {
		for (let e = 0, f = data.itemsRetrieveResponses[c].responseObjectNode.WSAWorkRule.EffectiveWorkRules.WSAEffectiveWorkRule.length; e < f; e++) {
			OvertimeRuleNames = []
			ZoneRuleNames = []
			ExtensionNames = []
			ExtensionProcessorNames = []
			BreakRuleNames = []
			CoreHoursRuleNames = []
			DeductionRuleNames = []
			ScheduleDeviationRuleNames = []
			console.log(data.itemsRetrieveResponses[c].responseObjectNode.WSAWorkRule.EffectiveWorkRules.WSAEffectiveWorkRule)
			edata = data.itemsRetrieveResponses[c].responseObjectNode.WSAWorkRule.EffectiveWorkRules.WSAEffectiveWorkRule[e]
			console.log(edata)
			//------------------------------------Overtimes
			if (edata.WorkRulePCDistr.WSAWorkRulePCDistr.OvertimeRuleNames && edata.WorkRulePCDistr.WSAWorkRulePCDistr.OvertimeRuleNames != "") {
				if (edata.WorkRulePCDistr.WSAWorkRulePCDistr.OvertimeRuleNames.SimpleValue instanceof Array == true) {
					for (let i = 0, l = edata.WorkRulePCDistr.WSAWorkRulePCDistr.OvertimeRuleNames.SimpleValue.length; i < l; i++) {
						if (i == 0) {
							OvertimeRuleNames.push(
								edata.WorkRulePCDistr.WSAWorkRulePCDistr.OvertimeRuleNames.SimpleValue[i]['@Value']
							)
						}
						else if (i > 0) {
							OvertimeRuleNames.push(
								'\n' + edata.WorkRulePCDistr.WSAWorkRulePCDistr.OvertimeRuleNames.SimpleValue[i]['@Value']
							)
						}
					}
					OvertimeRuleNames = OvertimeRuleNames.join(',')
				}
				else { OvertimeRuleNames = edata.WorkRulePCDistr.WSAWorkRulePCDistr.OvertimeRuleNames.SimpleValue['@Value'] }
			}
			else OvertimeRuleNames = null
			//------------------------------------Zones
			if (edata.WorkRulePCDistr.WSAWorkRulePCDistr.ZoneRuleNames && edata.WorkRulePCDistr.WSAWorkRulePCDistr.ZoneRuleNames != "") {
				if (edata.WorkRulePCDistr.WSAWorkRulePCDistr.ZoneRuleNames.SimpleValue instanceof Array == true) {
					for (let i = 0, l = edata.WorkRulePCDistr.WSAWorkRulePCDistr.ZoneRuleNames.SimpleValue.length; i < l; i++) {
						if (i == 0) {
							ZoneRuleNames.push(
								edata.WorkRulePCDistr.WSAWorkRulePCDistr.ZoneRuleNames.SimpleValue[i]['@Value']
							)
						}
						else if (i > 0) {
							ZoneRuleNames.push(
								'\n' + edata.WorkRulePCDistr.WSAWorkRulePCDistr.ZoneRuleNames.SimpleValue[i]['@Value']
							)
						}
					}
					ZoneRuleNames = ZoneRuleNames.join(',')
				}
				else { ZoneRuleNames = edata.WorkRulePCDistr.WSAWorkRulePCDistr.ZoneRuleNames.SimpleValue['@Value'] }
			}
			else ZoneRuleNames = null

			//------------------------------------RBShifts
			if (edata.WorkRulePCDistr.WSAWorkRulePCDistr.ExtensionNames && edata.WorkRulePCDistr.WSAWorkRulePCDistr.ExtensionNames != "") {
				if (edata.WorkRulePCDistr.WSAWorkRulePCDistr.ExtensionNames.SimpleValue instanceof Array == true) {
					for (let i = 0, l = edata.WorkRulePCDistr.WSAWorkRulePCDistr.ExtensionNames.SimpleValue.length; i < l; i++) {
						if (i == 0) {
							ExtensionNames.push(
								edata.WorkRulePCDistr.WSAWorkRulePCDistr.ExtensionNames.SimpleValue[i]['@Value']
							)
						}
						else if (i > 0) {
							ExtensionNames.push(
								'\n' + edata.WorkRulePCDistr.WSAWorkRulePCDistr.ExtensionNames.SimpleValue[i]['@Value']
							)
						}
					}
					ExtensionNames = ExtensionNames.join(',')
				}
				else { ExtensionNames = edata.WorkRulePCDistr.WSAWorkRulePCDistr.ExtensionNames.SimpleValue['@Value'] }
			}
			else ExtensionNames = null

			//-----------------------------------ProcessorExtensions

			if (edata.ExtensionProcessorNames && edata.ExtensionProcessorNames != "") {
				if (edata.ExtensionProcessorNames.SimpleValue instanceof Array == true) {
					for (let i = 0, l = edata.ExtensionProcessorNames.SimpleValue.length; i < l; i++) {
						if (i == 0) {
							ExtensionProcessorNames.push(
								edata.ExtensionProcessorNames.SimpleValue[i]['@Value']
							)
						}
						else if (i > 0) {
							ExtensionProcessorNames.push(
								'\n' + edata.ExtensionProcessorNames.SimpleValue[i]['@Value']
							)
						}
					}
					ExtensionProcessorNames = ExtensionProcessorNames.join(',')
				}
				else { ExtensionProcessorNames = edata.ExtensionProcessorNames.SimpleValue['@Value'] }
			}
			else ExtensionProcessorNames = null

			//---------------------------------Breaks
			if (edata.WorkRuleGeneral.WSAWorkRuleGeneral.BreakRuleNames && edata.WorkRuleGeneral.WSAWorkRuleGeneral.BreakRuleNames != "") {
				if (edata.WorkRuleGeneral.WSAWorkRuleGeneral.BreakRuleNames.SimpleValue instanceof Array == true) {
					for (let i = 0, l = edata.WorkRuleGeneral.WSAWorkRuleGeneral.BreakRuleNames.SimpleValue.length; i < l; i++) {
						if (i == 0) {
							BreakRuleNames.push(
								edata.WorkRuleGeneral.WSAWorkRuleGeneral.BreakRuleNames.SimpleValue[i]['@Value']
							)
						}
						else if (i > 0) {
							BreakRuleNames.push(
								'\n' + edata.WorkRuleGeneral.WSAWorkRuleGeneral.BreakRuleNames.SimpleValue[i]['@Value']
							)
						}
					}
					BreakRuleNames = BreakRuleNames.join(',')
				}
				else { BreakRuleNames = edata.WorkRuleGeneral.WSAWorkRuleGeneral.BreakRuleNames.SimpleValue['@Value'] }
			}
			else BreakRuleNames = null

			//---------------------------------Deductions
			if (edata.WorkRuleGeneral.WSAWorkRuleGeneral.BonusDeductRuleNames && edata.WorkRuleGeneral.WSAWorkRuleGeneral.BonusDeductRuleNames != "") {
				if (edata.WorkRuleGeneral.WSAWorkRuleGeneral.BonusDeductRuleNames.SimpleValue instanceof Array == true) {
					for (let i = 0, l = edata.WorkRuleGeneral.WSAWorkRuleGeneral.BonusDeductRuleNames.SimpleValue.length; i < l; i++) {
						if (i == 0) {
							DeductionRuleNames.push(
								edata.WorkRuleGeneral.WSAWorkRuleGeneral.BonusDeductRuleNames.SimpleValue[i]['@Value']
							)
						}
						else if (i > 0) {
							DeductionRuleNames.push(
								'\n' + edata.WorkRuleGeneral.WSAWorkRuleGeneral.BonusDeductRuleNames.SimpleValue[i]['@Value']
							)
						}
					}
					DeductionRuleNames = DeductionRuleNames.join(',')
				}
				else { DeductionRuleNames = edata.WorkRuleGeneral.WSAWorkRuleGeneral.BonusDeductRuleNames.SimpleValue['@Value'] }
			}
			else DeductionRuleNames = null

			//---------------------------------Core Hours
			if (edata.WorkRuleGeneral.WSAWorkRuleGeneral.CoreHoursRuleNames && edata.WorkRuleGeneral.WSAWorkRuleGeneral.CoreHoursRuleNames != "") {
				if (edata.WorkRuleGeneral.WSAWorkRuleGeneral.CoreHoursRuleNames.SimpleValue instanceof Array == true) {
					for (let i = 0, l = edata.WorkRuleGeneral.WSAWorkRuleGeneral.CoreHoursRuleNames.SimpleValue.length; i < l; i++) {
						if (i == 0) {
							CoreHoursRuleNames.push(
								edata.WorkRuleGeneral.WSAWorkRuleGeneral.CoreHoursRuleNames.SimpleValue[i]['@Value']
							)
						}
						else if (i > 0) {
							CoreHoursRuleNames.push(
								'\n' + edata.WorkRuleGeneral.WSAWorkRuleGeneral.CoreHoursRuleNames.SimpleValue[i]['@Value']
							)
						}
					}
					CoreHoursRuleNames = CoreHoursRuleNames.join(',')
				}
				else { CoreHoursRuleNames = edata.WorkRuleGeneral.WSAWorkRuleGeneral.CoreHoursRuleNames.SimpleValue['@Value'] }
			}
			else CoreHoursRuleNames = null

			//------------------------------------Sched Deviations
			if (edata.WorkRulePCDistr.WSAWorkRulePCDistr.ScheduleDeviationRuleNames && edata.WorkRulePCDistr.WSAWorkRulePCDistr.ScheduleDeviationRuleNames != "") {
				if (edata.WorkRulePCDistr.WSAWorkRulePCDistr.ScheduleDeviationRuleNames.SimpleValue instanceof Array == true) {
					for (let i = 0, l = edata.WorkRulePCDistr.WSAWorkRulePCDistr.ScheduleDeviationRuleNames.SimpleValue.length; i < l; i++) {
						if (i == 0) {
							ScheduleDeviationRuleNames.push(
								edata.WorkRulePCDistr.WSAWorkRulePCDistr.ScheduleDeviationRuleNames.SimpleValue[i]['@Value']
							)
						}
						else if (i > 0) {
							ScheduleDeviationRuleNames.push(
								'\n' + edata.WorkRulePCDistr.WSAWorkRulePCDistr.ScheduleDeviationRuleNames.SimpleValue[i]['@Value']
							)
						}
					}
					ScheduleDeviationRuleNames = ScheduleDeviationRuleNames.join(',')
				}
				else { ScheduleDeviationRuleNames = edata.WorkRulePCDistr.WSAWorkRulePCDistr.ScheduleDeviationRuleNames.SimpleValue['@Value'] }
			}
			else ScheduleDeviationRuleNames = null



			ScheduleDeviationRuleNames

			if (edata['@DayDivideOverride'] == 'S') edata['@DayDivideOverride'] = "SHIFT_START_TIME"
			else if (edata['@DayDivideOverride'] == 'E') edata['@DayDivideOverride'] = "SHIFT_END_TIME"
			else edata['@DayDivideOverride'] = "NONE"
			//------------------------------------


			complete.push({
				"Name": data.itemsRetrieveResponses[c].itemDataInfo.title,
				"Effective Date": edata['@EffectiveDate'],

				"RoundRuleName": edata['@RoundRuleName'],
				"ShiftGuaranteeName": edata['@ShiftGuaranteeName'],
				"ExceptionRuleName": edata['@ExceptionRuleName'],
				"ARExceptionRuleName": edata['@ARExceptionRuleName'],
				"CallInRuleName": edata['@CallInRuleName'],
				"DayDivideOverride": edata['@DayDivideOverride'],
				"UnapprovedOTPC": edata['@UnapprovedOvertimePayCodeName'],
				"DeniedOTPC": edata['@DeniedOvertimePayCodeName'],

				"BreakRuleNames": BreakRuleNames,
				"Core Hours": CoreHoursRuleNames,
				"DeductionRuleNames": DeductionRuleNames,


				"PayCodeDistributionName": edata['@PayCodeDistributionName'],
				"ScheduleDeviationRuleNames": ScheduleDeviationRuleNames,
				"Overtimes": OvertimeRuleNames,
				"Zones": ZoneRuleNames,
				"Extensions": ExtensionNames


				//,
			})

		}
	}

	console.log(complete)

	console.log(JSON.stringify(complete))
	console.log(complete.length)


	//----------------------------------------------------------------Format data into datatable format
	FinalArray = complete

	try {
		headers = Object.keys(FinalArray[0])
	}
	catch { window.alert("File is empty"); console.log('Format Data Into DataTable format issue'); CloseLoadingModal(); return; }



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

	/*headers =
		[

		]
*/

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
		if (headers[i] == 'timePeriod') { columneditorsettings.push({ data: headers[i], type: 'dropdown', source: ['Weekly', 'Shift', 'Pay Period'] }) }
		else { columneditorsettings.push({ data: headers[i], editor: 'text', renderer: 'html' }) }
		//else if (i == 4) { columneditorsettings.push({ data: headers[i], editor: CustomTextEditor }) }
		//else if (i >= 5) { columneditorsettings.push({ data: headers[i], editor: 'text' }) }
	}
	console.log(columneditorsettings)

	//----------------------------------------Create Handsontable----------------------------------------------------------------------------

	console.log('got this far')
	//if (hot) hot.destroy()
	console.log('got this far')
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
		autocolumnsize: true,
		autoRowSize: true,
		manualRowResize: true,
		manualColumnResize: true,
		trimDropdown: true,
		//fixedColumnsLeft: fixcolumns,
		outsideClickDeselects: false,
		//hiddenColumns: hiddencolumn,
		undo: true,
		licenseKey: 'non-commercial-and-evaluation',
		search: {
			searchResultClass: 'hot_search_found'
		},
		stretchH: 'all',
		afterRender: CloseLoadingModal()

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
	//----------------------------------------------------------- Replace Value feature


	Handsontable.dom.addEvent(Replace, 'click', function () {
		loadingmodal.style.display = "block";
		loadingmodal.style.visibility= "visible";
		setTimeout(ReplaceValueFunction,1000);	
	})	 

function ReplaceValueFunction () {
	DisableEditing = false
	SearchField = document.getElementById('search_field')		
	ReplaceField = document.getElementById('replace_field');		
			replace = ReplaceField.value
		for (row = 0, r_len = queryResult.length; row < r_len; row++) {

	if (DisableEditing == true && queryResult[row].col > 3) {
		currentValue = hot.getDataAtCell(queryResult[row].row, queryResult[row].col)
			if (typeof replace == 'undefined') replace = ''
			currentValue = currentValue.toString()
			replaceValue = replace.toString()
			finalCellValue = currentValue.replace(SearchField.value, replaceValue)
			finalCellValue = finalCellValue.replace(/(^[,\s]+)|([,\s]+$)/g, '')
			finalCellValue = finalCellValue.replace(',,', ',')
			hot.setDataAtCell(queryResult[row].row, queryResult[row].col, finalCellValue);
		}
	
	else if (DisableEditing == false){
		currentValue = hot.getDataAtCell(queryResult[row].row, queryResult[row].col)
			if (typeof replace == 'undefined') replace = ''
			currentValue = currentValue.toString()
			replaceValue = replace.toString()
			finalCellValue = currentValue.replace(SearchField.value, replaceValue)
			finalCellValue = finalCellValue.replace(/(^[,\s]+)|([,\s]+$)/g, '')
			finalCellValue = finalCellValue.replace(',,', ',')
			hot.setDataAtCell(queryResult[row].row, queryResult[row].col, finalCellValue);
		}
	}

		SearchField = "";
		ReplaceField = "";
		queryResult = "";
		hot.render();
		CloseLoadingModal()
	}


	//--------------------------------------------------Add paycode feature

	document.getElementById('AddPaycode2').addEventListener('click', function (event) {
		loadingmodal.style.display = "block";
		loadingmodal.style.visibility = "visible";
		setTimeout(AddPaycode, 1000, event);
	})
	function AddPaycode() {
		//-------------Paycode Field Check
		var AddPaycodeField = document.getElementById('paycode_name')
		console.log(AddPaycodeField.value)
		if (typeof AddPaycodeField.value == 'undefined' || AddPaycodeField.value == '' || AddPaycodeField.value == null) { window.alert('The Paycode field is empty'); CloseLoadingModal(); return }
		//-------------Loader


		var selected = hot.getSelected();

		for (var index = 0; index < selected.length; index += 1) {
			var item = selected[index];
			var startRow = Math.min(item[0], item[2]);
			var endRow = Math.max(item[0], item[2]);
			var startCol = Math.min(item[1], item[3]);
			var endCol = Math.max(item[1], item[3]);

			for (var rowIndex = startRow; rowIndex <= endRow; rowIndex += 1) {
				for (var columnIndex = startCol; columnIndex <= endCol; columnIndex += 1) {


					currentValue = hot.getDataAtCell(rowIndex, columnIndex)
					if (currentValue == '' || currentValue == null) {
						FinalValue = AddPaycodeField.value
					}
					else {
						FinalValue = currentValue + ',' + AddPaycodeField.value
					}
					FinalValue = FinalValue.replace(/[\r\n]+/gm, "").split(',')
					FinalValue = Array.from(new Set(FinalValue)).join(',\n')
					FinalValue = FinalValue.replace(/(^[,\s]+)|([,\s]+$)/g, '')
					FinalValue = FinalValue.replace(',,', ',')
					hot.setDataAtCell(rowIndex, columnIndex, FinalValue);

				}
			}
		}

		hot.render();
		CloseLoadingModal()
	}

	//----------------------------------------delete paycode feature---------------------------------------

	document.getElementById('DeletePaycode').addEventListener('click', function (event) {
		loadingmodal.style.display = "block";
		loadingmodal.style.visibility = "visible";
		setTimeout(DeletePayCode, 1000, event);
	})
	function DeletePayCode() {
		//-------------Paycode Field Check
		var AddPaycodeField = document.getElementById('paycode_name')
		console.log(AddPaycodeField.value)
		if (typeof AddPaycodeField.value == 'undefined' || AddPaycodeField.value == '' || AddPaycodeField.value == null) { window.alert('The Paycode field is empty'); CloseLoadingModal(); return }
		//-------------Loader
		var selected = hot.getSelected();
		console.log(AddPaycodeField.value)

		function DeleteData() {
			AddPaycodeField = AddPaycodeField.value.toString()
			for (var index = 0; index < selected.length; index += 1) {
				var item = selected[index];
				var startRow = Math.min(item[0], item[2]);
				var endRow = Math.max(item[0], item[2]);
				var startCol = Math.min(item[1], item[3]);
				var endCol = Math.max(item[1], item[3]);

				for (var rowIndex = startRow; rowIndex <= endRow; rowIndex += 1) {
					for (var columnIndex = startCol; columnIndex <= endCol; columnIndex += 1) {
						currentValue = hot.getDataAtCell(rowIndex, columnIndex)
						console.log(rowIndex + '-' + columnIndex)
						console.log(currentValue)
						FinalValue = currentValue.replace(/[\r\n]+/gm, "")
						FinalValue = FinalValue.split(',')
						removeA(FinalValue, AddPaycodeField )
						FinalValue = Array.from(new Set(FinalValue)).join(',\n')
						FinalValue = FinalValue.replace(/(^[,\s]+)|([,\s]+$)/g, '')
						FinalValue = FinalValue.replace(',,', ',')

						hot.setDataAtCell(rowIndex, columnIndex, FinalValue);


					}
				}
			}
		}

		DeleteData()
		hot.render()
		CloseLoadingModal()
	}

	//-------------------------------------------put data table into a global variable-----------------------------
	console.log('got this far')
	hotdata = hot

	console.log(JSON.stringify(hotdata.getData()))
	console.log(JSON.stringify(hotdata.getColHeader()))

	//-----------------------------------------------Empty master json combinations for rule------------------------------
	changedata = data
	changedata.itemsRetrieveResponses = []
	//console.log(changedata.itemsRetrieveResponses[SelectedRuleIndex].responseObjectNode.WSACFGPaycodeDistribution.DistributionAssignments.WSACFGDistributionAssignment.length)
	console.log(changedata)
	console.log(JSON.stringify(changedata))


}
//console.log(document.getElementById("example").Handsontable)

document.getElementById("DownloadNewFile").addEventListener("click", function (change_data) {
	loadingmodal.style.display = "block";
	loadingmodal.style.visibility = "visible";
	setTimeout(downloadNewFile, 1000, change_data);
})
document.getElementById("DownloadFinalFile").addEventListener("click", function (change_data) {
	loadingmodal.style.display = "block";
	loadingmodal.style.visibility = "visible";
	setTimeout(downloadNewFile, 1000, change_data);
})

//-------------------------------------------------------Save Changes to file-----------------------------------
function downloadNewFile(change_data) {
	console.log(changedata)
	const fs = require('fs')
	console.log(changedata)
	var ObjectArray = []

	var OnlySaveFiltered = document.getElementById("OnlySaveFiltered").checked
	hot2 = hotdata
	console.log(hot)

	if (OnlySaveFiltered == true) {
		hot2.getPlugin('Filters').clearConditions();
		hot2.getPlugin('Filters').filter();
	}
try{hot2.getData()}catch{CloseLoadingModal(); return}
	resultdata = hot2.getData();
	headers = hot2.getColHeader();

	//resultdata.splice(-1,1)

	console.log(resultdata)
	console.log(headers)

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
	changedata.itemsRetrieveResponses = ''
	changedata.itemsRetrieveResponses = []
	console.log(changedata)

	changedata = {
		"id": 100,
		"name": "Work Rules",
		"uniqueKey": "WSAWorkRule",
		"itemsRetrieveResponseDTOs": [],
		"itemsRetrieveResponses": [],
		"additionalProperties": {},
		"setupItemDTO": null,
		"restProperties": null
	}

	//console.log(JSON.stringify(resultdata))
	var ConvertedArray = []
	var WorkRuleNamesArray = []
	for (let i = 0, l = ObjectArray.length; i < l; i++) {
		x = ObjectArray[i]
		WorkRuleNamesArray.push(x.Name)
	}
	var WorkRuleNamesArray = Array.from(new Set(WorkRuleNamesArray))

	for (let i = 0, l = WorkRuleNamesArray.length; i < l; i++) {
		x = WorkRuleNamesArray[i]
		name = encodeURIComponent(x)
		map =
		{
			"itemDataInfo": {
				"title": x,
				"key": name,
				"env": null,
				"urlparams": "Name=" + x
			},
			"responseObjectNode": {
				"@Status": "Success",
				"@Action": "RetrieveForUpdate",
				"WSAWorkRule": {
					"@Name": x,
					"EffectiveWorkRules": {
						"WSAEffectiveWorkRule": []
					}
				}
			}
		}
		ConvertedArray.push(map)
	}


	changedata.itemsRetrieveResponses = Array.from(new Set(ConvertedArray))
	console.log(ConvertedArray)
	console.log(changedata)
	InsertRuleIndex = ""

	for (let y = 0, z = ObjectArray.length; y < z; y++) {
		InsertRuleIndex = ""
		x = ObjectArray[y]
		for (let i = 0, l = changedata.itemsRetrieveResponses.length; i < l; i++) {
			if (x.Name == changedata.itemsRetrieveResponses[i].responseObjectNode.WSAWorkRule['@Name']) {
				InsertRuleIndex = i
			}
			console.log(InsertRuleIndex)
		}
		console.log(ObjectArray[y])

		if (x.BreakRuleNames != '' && x.BreakRuleNames != null) {
			j = x.BreakRuleNames.replace(/[\r\n]+/gm, "").split(',').map(function (k) { return { "@Value": k } })
			x.BreakRuleNames = j
		}
		else x.BreakRuleNames = []

		if (x.Overtimes != '' && x.Overtimes != null) {
			j = x.Overtimes.replace(/[\r\n]+/gm, "").split(',').map(function (k) { return { "@Value": k } })
			x.Overtimes = j
		}
		else x.Overtimes = []

		if (x.Extensions != '' && x.Extensions != null) {
			j = x.Extensions.replace(/[\r\n]+/gm, "").split(',').map(function (k) { return { "@Value": k } })
			x.Extensions = j
		}
		else x.Extensions = []

		if (x.Zones != '' && x.Zones != null) {
			j = x.Zones.replace(/[\r\n]+/gm, "").split(',').map(function (k) { return { "@Value": k } })
			x.Zones = j
		}
		else x.Zones = []

		if (x['Core Hours'] != '' && x['Core Hours'] != null) {
			j = x['Core Hours'].replace(/[\r\n]+/gm, "").split(',').map(function (k) { return { "@Value": k } })
			x['Core Hours'] = j
		}
		else x['Core Hours'] = []

		if (x.DeductionRuleNames != '' && x.DeductionRuleNames != null) {
			j = x.DeductionRuleNames.replace(/[\r\n]+/gm, "").split(',').map(function (k) { return { "@Value": k } })
			x.DeductionRuleNames = j
		}
		else x.DeductionRuleNames = []

		if (x.ScheduleDeviationRuleNames != '' && x.ScheduleDeviationRuleNames != null) {
			j = x.ScheduleDeviationRuleNames.replace(/[\r\n]+/gm, "").split(',').map(function (k) { return { "@Value": k } })
			x.ScheduleDeviationRuleNames = j
		}
		else x.ScheduleDeviationRuleNames = []


		

		map2 =
		{
			"@CallInRuleName": x.CallInRuleName,
			"@ExceptionRuleName": x.ExceptionRuleName,
			"@ShiftGuaranteeName": x.ShiftGuaranteeName,
			"@UnapprovedOvertimePayCodeName": x.UnapprovedOTPC,
			"@EffectiveDate": x['Effective Date'],
			"@DayDivideOverride": x.DayDivideOverride,
			"@ARExceptionRuleName": x.ARExceptionRuleName,
			"@DeniedOvertimePayCodeName": x.DeniedOTPC,
			"@RoundRuleName": x.RoundRuleName,
			"ExtensionProcessorNames": "",
			"@PayCodeDistributionName": x.PayCodeDistributionName,
			"WorkRuleGeneral": {
				"WSAWorkRuleGeneral": {
					"BonusDeductRuleNames": {
						"SimpleValue": x.DeductionRuleNames
					},
					"BreakRuleNames": {
						"SimpleValue": x.BreakRuleNames
					},
					"CoreHoursRuleNames": {
						"SimpleValue": x['Core Hours']
					}
				}
			},
			"AutoBreakPlacement": {
				"WSAAutoBreakPlacement": {
					"@MinTimeBetweenBreaks": "0:00",
					"@MinStartTimeForBreak": "0:00",
					"@MaxStartTimeForBreak": "0:00"
				}
			},
			"WorkRulePCDistr": {
				"WSAWorkRulePCDistr": {
					"OvertimeRuleNames": {
						"SimpleValue": x.Overtimes
					},
					"ScheduleDeviationRuleNames": {
						"SimpleValue": x.ScheduleDeviationRuleNames
					},
					"ExtensionNames": {
						"SimpleValue": x.Extensions
					},
					"ZoneRuleNames": {
						"SimpleValue": x.Zones
					}
				}
			}
		}

		if (map2['@DayDivideOverride'] == 'SHIFT_START_TIME') map2['@DayDivideOverride'] = "S"
		else if (map2['@DayDivideOverride'] == 'SHIFT_END_TIME') map2['@DayDivideOverride'] = "E"
		else map2['@DayDivideOverride'] = "F"

		if (map2['@CallInRuleName'] == '' || map2['@CallInRuleName'] == null) delete map2['@CallInRuleName']
		if (map2['@ExceptionRuleName'] == '' || map2['@ExceptionRuleName'] == null) delete map2['@ExceptionRuleName']
		if (map2['@ShiftGuaranteeName'] == '' || map2['@ShiftGuaranteeName'] == null) delete map2['@ShiftGuaranteeName']
		if (map2['@UnapprovedOvertimePayCodeName'] == '' || map2['@UnapprovedOvertimePayCodeName'] == null) delete map2['@UnapprovedOvertimePayCodeName']
		if (map2['@ARExceptionRuleName'] == '' || map2['@ARExceptionRuleName'] == null) delete map2['@ARExceptionRuleName']
		if (map2['@DeniedOvertimePayCodeName'] == '' || map2['@DeniedOvertimePayCodeName'] == null) delete map2['@DeniedOvertimePayCodeName']
		if (map2['@RoundRuleName'] == '' || map2['@RoundRuleName'] == null) delete map2['@RoundRuleName']

		if (map2.WorkRuleGeneral.WSAWorkRuleGeneral.BreakRuleNames.SimpleValue.length == 0) map2.WorkRuleGeneral.WSAWorkRuleGeneral.BreakRuleNames = ""
		else if (map2.WorkRuleGeneral.WSAWorkRuleGeneral.BreakRuleNames.SimpleValue.length == 1) map2.WorkRuleGeneral.WSAWorkRuleGeneral.BreakRuleNames.SimpleValue = x.BreakRuleNames[0]

		if (map2.WorkRuleGeneral.WSAWorkRuleGeneral.BonusDeductRuleNames.SimpleValue.length == 0) map2.WorkRuleGeneral.WSAWorkRuleGeneral.BonusDeductRuleNames = ""
		else if (map2.WorkRuleGeneral.WSAWorkRuleGeneral.BonusDeductRuleNames.SimpleValue.length == 1) map2.WorkRuleGeneral.WSAWorkRuleGeneral.BonusDeductRuleNames.SimpleValue = x.DeductionRuleNames[0]

		if (map2.WorkRuleGeneral.WSAWorkRuleGeneral.CoreHoursRuleNames.SimpleValue.length == 0) map2.WorkRuleGeneral.WSAWorkRuleGeneral.CoreHoursRuleNames = ""
		else if (map2.WorkRuleGeneral.WSAWorkRuleGeneral.CoreHoursRuleNames.SimpleValue.length == 1) map2.WorkRuleGeneral.WSAWorkRuleGeneral.CoreHoursRuleNames.SimpleValue = x['Core Hours'][0]

		if (map2.WorkRulePCDistr.WSAWorkRulePCDistr.OvertimeRuleNames.SimpleValue.length == 0) map2.WorkRulePCDistr.WSAWorkRulePCDistr.OvertimeRuleNames = ""
		else if (map2.WorkRulePCDistr.WSAWorkRulePCDistr.OvertimeRuleNames.SimpleValue.length == 1) map2.WorkRulePCDistr.WSAWorkRulePCDistr.OvertimeRuleNames.SimpleValue = x.Overtimes[0]

		if (map2.WorkRulePCDistr.WSAWorkRulePCDistr.ExtensionNames.SimpleValue.length == 0) map2.WorkRulePCDistr.WSAWorkRulePCDistr.ExtensionNames = ""
		else if (map2.WorkRulePCDistr.WSAWorkRulePCDistr.ExtensionNames.SimpleValue.length == 1) map2.WorkRulePCDistr.WSAWorkRulePCDistr.ExtensionNames.SimpleValue = x.Extensions[0]

		if (map2.WorkRulePCDistr.WSAWorkRulePCDistr.ScheduleDeviationRuleNames.SimpleValue.length == 0) map2.WorkRulePCDistr.WSAWorkRulePCDistr.ScheduleDeviationRuleNames = ""
		else if (map2.WorkRulePCDistr.WSAWorkRulePCDistr.ScheduleDeviationRuleNames.SimpleValue.length == 1) map2.WorkRulePCDistr.WSAWorkRulePCDistr.ScheduleDeviationRuleNames.SimpleValue = x.ScheduleDeviationRuleNames[0]

		if (map2.WorkRulePCDistr.WSAWorkRulePCDistr.ZoneRuleNames.SimpleValue.length == 0) map2.WorkRulePCDistr.WSAWorkRulePCDistr.ZoneRuleNames = ""
		else if (map2.WorkRulePCDistr.WSAWorkRulePCDistr.ZoneRuleNames.SimpleValue.length == 1) map2.WorkRulePCDistr.WSAWorkRulePCDistr.ZoneRuleNames.SimpleValue = x.Zones[0]

		if (map2.WorkRuleGeneral.WSAWorkRuleGeneral.BreakRuleNames == "") delete map2.WorkRuleGeneral.WSAWorkRuleGeneral.BreakRuleNames
		if (map2.WorkRuleGeneral.WSAWorkRuleGeneral.BonusDeductRuleNames == "") delete map2.WorkRuleGeneral.WSAWorkRuleGeneral.BonusDeductRuleNames
		if (map2.WorkRuleGeneral.WSAWorkRuleGeneral.CoreHoursRuleNames == "") delete map2.WorkRuleGeneral.WSAWorkRuleGeneral.CoreHoursRuleNames

		if (map2.WorkRulePCDistr.WSAWorkRulePCDistr.ScheduleDeviationRuleNames == "")delete map2.WorkRulePCDistr.WSAWorkRulePCDistr.ScheduleDeviationRuleNames
		if (map2.WorkRulePCDistr.WSAWorkRulePCDistr.OvertimeRuleNames == "") delete map2.WorkRulePCDistr.WSAWorkRulePCDistr.OvertimeRuleNames


		if (Object.keys(map2.WorkRuleGeneral.WSAWorkRuleGeneral).length === 0){map2.WorkRuleGeneral.WSAWorkRuleGeneral = ""}





		console.log(map2)

		changedata.
			itemsRetrieveResponses[InsertRuleIndex]
			.responseObjectNode
			.WSAWorkRule
			.EffectiveWorkRules
			.WSAEffectiveWorkRule.push(map2)



	}



	for (let y = 0, z = changedata.itemsRetrieveResponses.length; y < z; y++) {
		if (changedata.itemsRetrieveResponses[y].responseObjectNode.WSAWorkRule.EffectiveWorkRules.WSAEffectiveWorkRule.length == 1) {
			changedata.itemsRetrieveResponses[y].responseObjectNode.WSAWorkRule.EffectiveWorkRules.WSAEffectiveWorkRule =
				changedata.itemsRetrieveResponses[y].responseObjectNode.WSAWorkRule.EffectiveWorkRules.WSAEffectiveWorkRule[0]
		}
	}






	//Save Locally.
	console.log(JSON.stringify(changedata))
	console.log(changedata.itemsRetrieveResponses.length)
	fs.renameSync('./RESPONSEJSON/response_WR.json', './RESPONSEJSON/response_WR_old.json')
	changedata.itemsRetrieveResponses =
		Array.from(new Set(changedata.itemsRetrieveResponses))
	fs.writeFileSync('./RESPONSEJSON/response_WR.json', JSON.stringify(changedata));
	//End Save

	//---------------------------------------------------New Zip Stuff---------------------------------------------------

	console.log(change_data.target.id)
	if (change_data.target.id == "DownloadFinalFile") {
		var JSZip = require('jszip')
		var saveAs = require('file-saver');
		var zip = new JSZip();
		if (ExportConfig == '' || ExportConfig == null) { ExportConfig = { "sourceTenantId": "192.168.33.10", "targetTenantId": "C:\\Users\\Marcel Rottmann\\Desktop\\ParagonTransferManager\\XML\\test\\test_1588315981.zip" } }
		zip.file("ExportConfig.json", JSON.stringify(ExportConfig))
		zip.folder("WSAWorkRule")
		zip.folder("WSAWorkRule").file("response.json", JSON.stringify(changedata))
		datetimestamp = Date.now()
		zip.generateAsync({ type: "blob" })
			.then(function (blob) {
				saveAs(blob, "ConfigEditorExport_" + datetimestamp + ".zip");
			});
	}

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
	document.getElementById('HandsOnTableValue').style.display = "none"
	document.getElementById("SideBarRight").style.width = "25%"
}))

