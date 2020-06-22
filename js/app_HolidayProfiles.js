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
		while ((ax = arr.indexOf(what)) !== -1) {
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
		const config = require('./RESPONSEJSON/HolProf_WR.json')
		var global_data = fs.readFileSync("./RESPONSEJSON/HolProf_WR.json");
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
			if (zipEntry.entryName == "APIHolidayProfile\\response.json" || zipEntry.entryName == "APIHolidayProfile\response.json" || zipEntry.entryName == "APIHolidayProfile/response.json") {
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
				fs.renameSync('./RESPONSEJSON/HolProf_WR.json', './RESPONSEJSON/HolProf_WR_old.json')
			}
			catch { 'file not found for rename' }
			fs.writeFileSync('./RESPONSEJSON/HolProf_WR.json', JSON.stringify(global_data));


		});
	}

	data = global_data
	//--------------------------------------------Store Data and check if empty-------------------------------




	try {
		console.log(
			data.itemsRetrieveResponses[0]
				.responseObjectNode
				.APIHolidayProfile
				.HolidayProfileDataSet
				.APIHolidayProfileDataSet
				.DataMembers
				.APIHolidayProfileData.length
		)
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
		if (data
			.itemsRetrieveResponses[c]
			.responseObjectNode
			.APIHolidayProfile
			.HolidayProfileDataSet
			.APIHolidayProfileDataSet
			.DataMembers
			.APIHolidayProfileDatae instanceof Array != true) {
			tempStor = []
			tempStor.push(
				data
					.itemsRetrieveResponses[c]
					.responseObjectNode
					.APIHolidayProfile
					.HolidayProfileDataSet
					.APIHolidayProfileDataSet
					.DataMembers
					.APIHolidayProfileData)

			data
				.itemsRetrieveResponses[c]
				.responseObjectNode
				.APIHolidayProfile
				.HolidayProfileDataSet
				.APIHolidayProfileDataSet
				.DataMembers
				.APIHolidayProfileData = tempStor
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

		edata =
			data.itemsRetrieveResponses[c]
				.responseObjectNode
				.APIHolidayProfile
				.HolidayProfileDataSet
				.APIHolidayProfileDataSet
				.DataMembers
				.APIHolidayProfileData

		for (let e = 0, f = edata.length; e < f; e++) {


			OvertimeRuleNames = []
			ZoneRuleNames = []
			ExtensionNames = []
			ExtensionProcessorNames = []
			BreakRuleNames = []
			CoreHoursRuleNames = []
			DeductionRuleNames = []
			ScheduleDeviationRuleNames = []
			console.log(data.itemsRetrieveResponses[c])


			console.log(edata[e])
			if (edata[e].Entries) {
				for (let g = 0, h = edata[e].Entries.APIHolidayProfileDataEntry.length; g < h; g++) {

					complete.push({
						"Name": data.itemsRetrieveResponses[c].itemDataInfo.title,
						"Description":  data.itemsRetrieveResponses[c].responseObjectNode.APIHolidayProfile['@Description'],
						"Default Zone Rule": edata[e]['@DefaultZoneRuleName'] || "None",
						"Default HC Rule": edata[e]['@DefaultCreditRuleName'] || "None",
						"Effective Date": edata[e]['@EffectiveDate'],
						"Expiration Date": edata[e]['@ExpirationDate'],
						"Holiday Name": edata[e].Entries.APIHolidayProfileDataEntry[g]['@HolidayName'],
						"Holiday Zone Rule": edata[e].Entries.APIHolidayProfileDataEntry[g]['@ZoneRuleName'] || "Default",
						"Holiday HC Name": edata[e].Entries.APIHolidayProfileDataEntry[g]['@CreditRuleName'] || "Default"
					})
				}
			}


			else {
				for (let j = 0, k = edata[e].length; j < k; j++) {
					for (let g = 0, h = edata[e][j].Entries.APIHolidayProfileDataEntry.length; g < h; g++) {

						complete.push({
							"Name": data.itemsRetrieveResponses[c].itemDataInfo.title,
							"Description":  data.itemsRetrieveResponses[c].responseObjectNode.APIHolidayProfile['@Description'],
							"Default Zone Rule": edata[e][j]['@DefaultZoneRuleName'] || "None",
							"Default HC Rule": edata[e][j]['@DefaultCreditRuleName'] || "None",
							"Effective Date": edata[e][j]['@EffectiveDate'],
							"Expiration Date": edata[e][j]['@ExpirationDate'],
							"Holiday Name": edata[e][j].Entries.APIHolidayProfileDataEntry[g]['@HolidayName'],
							"Holiday Zone Rule": edata[e][j].Entries.APIHolidayProfileDataEntry[g]['@ZoneRuleName'] || "Default",
							"Holiday HC Name": edata[e][j].Entries.APIHolidayProfileDataEntry[g]['@CreditRuleName'] || "Default"
						})
					}
				}
			}
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
		loadingmodal.style.visibility = "visible";
		setTimeout(ReplaceValueFunction, 1000);
	})

	function ReplaceValueFunction() {
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

			else if (DisableEditing == false) {
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
						removeA(FinalValue, AddPaycodeField)
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
	try { hot2.getData() } catch{ CloseLoadingModal(); return }
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
		"id": 89,
		"name": "Holiday Profiles",
		"uniqueKey": "APIHolidayProfile",
		"itemsRetrieveResponseDTOs": [],
		"itemsRetrieveResponses": [],
		"additionalProperties": {},
		"setupItemDTO": null,
		"restProperties": null
	}

	//console.log(JSON.stringify(resultdata))
	var ConvertedArray = []
	var WorkRuleNamesArray = []
	var HolProfVersions = []
	for (let i = 0, l = ObjectArray.length; i < l; i++) {
		x = ObjectArray[i]
		WorkRuleNamesArray.push(x.Name+'|'+x.Description)
		HolProfVersions.push(x.Name + '|' +x['Effective Date']+'|'+x['Expiration Date'] + '|' + x['Default Zone Rule']+'|'+x['Default HC Rule'])
	}
	var WorkRuleNamesArray = Array.from(new Set(WorkRuleNamesArray))
	var HolProfVersions = Array.from(new Set(HolProfVersions))
console.log(HolProfVersions)
	for (let i = 0, l = WorkRuleNamesArray.length; i < l; i++) {
		x = WorkRuleNamesArray[i].split('|')
		name = encodeURIComponent(x[0])
		console.log(x)
		Description = x[1] || "No Description"
		console.log(Description)
			if (Description == '' || Description == 'undefined' || Description == null || Description == undefined){Description = "No Description"}
		map =
		{
			"itemDataInfo": {
				"title": x[0],
				"key": name,
				"env": null,
				"urlparams": "Name=" + x[0]
			},
			"responseObjectNode": {
				"@Status": "Success",
				"@Action": "RetrieveForUpdate",
				"APIHolidayProfile": {
					"@Active": true,
					"@Description": Description,
					"@Name": x[0],
					"HolidayProfileDataSet": {
						"APIHolidayProfileDataSet": {
							"@Name": x[0],
							"DataMembers": {
								"APIHolidayProfileData": []
								
							}
						}
					}
				}
			}

		}
		
		if ( map.responseObjectNode.APIHolidayProfile['@Description'] =='No Description') {console.log('true');delete map.responseObjectNode.APIHolidayProfile['@Description']}
		ConvertedArray.push(map)
	}


	changedata.itemsRetrieveResponses = Array.from(new Set(ConvertedArray))
	console.log(ConvertedArray)
	console.log(changedata)
	InsertRuleIndex = ""

	for (let y = 0, z = HolProfVersions.length; y < z; y++) {
		InsertRuleIndex = ""
		x = HolProfVersions[y]
		for (let i = 0, l = changedata.itemsRetrieveResponses.length; i < l; i++) {
			if (x.split('|')[0] == changedata.itemsRetrieveResponses[i].responseObjectNode.APIHolidayProfile['@Name']) {
				InsertRuleIndex = i
			}
			console.log(InsertRuleIndex)
		}
		console.log(HolProfVersions[y])
		HCRULE = x.split('|')[4] ||"None"
		ZONERULE = x.split('|')[3] || "None"
		//window.alert(HCRULE,ZONERULE)

		map2 =
		{	"@DefaultCreditRuleName":HCRULE,
			"@DefaultZoneRuleName":ZONERULE,
			"@ExpirationDate": x.split('|')[2],
			"@EffectiveDate": x.split('|')[1],
			"Entries": {
				"APIHolidayProfileDataEntry": []
			}
		}
		if (HCRULE == "None") delete map2['@DefaultCreditRuleName']
		if (ZONERULE == "None") delete map2['@DefaultZoneRuleName']



		console.log(map2)

		changedata.
			itemsRetrieveResponses[InsertRuleIndex]
			.responseObjectNode
			.APIHolidayProfile
			.HolidayProfileDataSet
			.APIHolidayProfileDataSet
			.DataMembers
			.APIHolidayProfileData.push(map2)
			
			changedata.
				itemsRetrieveResponses[InsertRuleIndex]
				.responseObjectNode
				.APIHolidayProfile
				.HolidayProfileDataSet
				.APIHolidayProfileDataSet
				.DataMembers
				.APIHolidayProfileData = 
				Array.from(new Set(changedata.
				itemsRetrieveResponses[InsertRuleIndex]
				.responseObjectNode
				.APIHolidayProfile
				.HolidayProfileDataSet
				.APIHolidayProfileDataSet
				.DataMembers
				.APIHolidayProfileData))
			


	}





	for (let y = 0, z = ObjectArray.length; y < z; y++) {
		InsertRuleIndex = ""
		x = ObjectArray[y]
		for (let i = 0, l = changedata.itemsRetrieveResponses.length; i < l; i++) {
			for (let g = 0, h =
				changedata.itemsRetrieveResponses[i]
					.responseObjectNode
					.APIHolidayProfile
					.HolidayProfileDataSet
					.APIHolidayProfileDataSet
					.DataMembers
					.APIHolidayProfileData.length; g < h; g++) {

					 console.log(x.Name,changedata.itemsRetrieveResponses[i].responseObjectNode.APIHolidayProfile['@Name'])
					 console.log(x['Expiration Date'],changedata.itemsRetrieveResponses[i]
					 .responseObjectNode
					 .APIHolidayProfile
					 .HolidayProfileDataSet
					 .APIHolidayProfileDataSet
					 .DataMembers
					 .APIHolidayProfileData[g]['@ExpirationDate'])
					console.log(x['Effective Date'],				changedata.itemsRetrieveResponses[i]
					.responseObjectNode
					.APIHolidayProfile
					.HolidayProfileDataSet
					.APIHolidayProfileDataSet
					.DataMembers
					.APIHolidayProfileData[g]['@EffectiveDate'])
				if (x.Name == changedata.itemsRetrieveResponses[i].responseObjectNode.APIHolidayProfile['@Name'] 
					&&
					x['Effective Date'] ==
					changedata.itemsRetrieveResponses[i]
						.responseObjectNode
						.APIHolidayProfile
						.HolidayProfileDataSet
						.APIHolidayProfileDataSet
						.DataMembers
						.APIHolidayProfileData[g]['@EffectiveDate']
					&&
					x['Expiration Date'] ==
					changedata.itemsRetrieveResponses[i]
						.responseObjectNode
						.APIHolidayProfile
						.HolidayProfileDataSet
						.APIHolidayProfileDataSet
						.DataMembers
						.APIHolidayProfileData[g]['@ExpirationDate']
				) {
					console.log('trueueuueu')
					InsertRuleIndex = g

Holiday = {

	"@HolidayName": x['Holiday Name'],
	"@UseDefaultCreditRule": true,
	"@UseDefaultZoneRule": true,
	"@ZoneRuleName": x['Holiday Zone Rule'],
	"@CreditRuleName": x['Holiday HC Name']
}

if (Holiday['@ZoneRuleName'] == "Default" || Holiday['@ZoneRuleName'] == "" || Holiday['@ZoneRuleName'] == null){
	delete Holiday['@ZoneRuleName'] 
	Holiday['@UseDefaultZoneRule'] = true
}
else {Holiday['@UseDefaultZoneRule'] = false}

if (Holiday['@CreditRuleName'] == "Default" || Holiday['@CreditRuleName'] == "" || Holiday['@CreditRuleName'] == null){
	delete Holiday['@CreditRuleName'] 
	Holiday['@UseDefaultCreditRule'] = true
}
else {Holiday['@UseDefaultCreditRule'] = false}

					changedata.itemsRetrieveResponses[i]
						.responseObjectNode
						.APIHolidayProfile
						.HolidayProfileDataSet
						.APIHolidayProfileDataSet
						.DataMembers
						.APIHolidayProfileData[g].Entries.APIHolidayProfileDataEntry.push(Holiday

							
						)

				}




				console.log(InsertRuleIndex)
			}
		}

	}




console.log(changedata)

	for (let y = 0, z = changedata.itemsRetrieveResponses.length; y < z; y++) {

		if (changedata.itemsRetrieveResponses[y].responseObjectNode.APIHolidayProfile.HolidayProfileDataSet.APIHolidayProfileDataSet.DataMembers.APIHolidayProfileData.length == 1) {
			changedata.itemsRetrieveResponses[y].responseObjectNode.APIHolidayProfile.HolidayProfileDataSet.APIHolidayProfileDataSet.DataMembers.APIHolidayProfileData =
				changedata.itemsRetrieveResponses[y].responseObjectNode.APIHolidayProfile.HolidayProfileDataSet.APIHolidayProfileDataSet.DataMembers.APIHolidayProfileData[0]
		}
	}






	//Save Locally.
	console.log(JSON.stringify(changedata))
	console.log(changedata.itemsRetrieveResponses.length)
	fs.renameSync('./RESPONSEJSON/HolProf_WR.json', './RESPONSEJSON/HolProf_WR_old.json')
	changedata.itemsRetrieveResponses =
		Array.from(new Set(changedata.itemsRetrieveResponses))
	fs.writeFileSync('./RESPONSEJSON/HolProf_WR.json', JSON.stringify(changedata));
	//End Save

	//---------------------------------------------------New Zip Stuff---------------------------------------------------

	console.log(change_data.target.id)
	if (change_data.target.id == "DownloadFinalFile") {
		var JSZip = require('jszip')
		var saveAs = require('file-saver');
		var zip = new JSZip();
		if (ExportConfig == '' || ExportConfig == null) { ExportConfig = { "sourceTenantId": "192.168.33.10", "targetTenantId": "C:\\Users\\Marcel Rottmann\\Desktop\\ParagonTransferManager\\XML\\test\\test_1588315981.zip" } }
		zip.file("ExportConfig.json", JSON.stringify(ExportConfig))
		zip.folder("APIHolidayProfile")
		zip.folder("APIHolidayProfile").file("response.json", JSON.stringify(changedata))
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

