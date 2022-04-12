//--------------------------------Define GLobal Variables---------------------------------

var hotdata;
var changedata;
var global_data;
var SDMZipFileName;
var hot;
var SelectedRuleIndex;
var currentFile;
var paycodesResponse;
var ExportConfig;


//------------------------------------------Close the loading thing---------------
function CloseLoadingModal() {
	loadingmodal.style.display = "none";
	loadingmodal.style.visibility= "hidden";
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
document.getElementById("UploadAndParse").addEventListener("click", 

function () {var loadingmodal = document.getElementById("load");
	loadingmodal.style.display = "block";
	loadingmodal.style.visibility= "visible";
	setTimeout(parseInputJson,1000);	
})	

function parseInputJson(data) {
	
	

	//--------------------------------------------Require functions----------------------------------------------
	console.log(SDMZipFileName)
	var firstBy = require('thenby');
	var AdmZip = require('adm-zip');


	//--------------------------------------------Get files--------------------------------------------
	var SDMZipFileName = document.getElementById("ChooseFile").value
	console.log(currentFile)
	console.log(SDMZipFileName)
	if (currentFile == SDMZipFileName) {
		const fs = require('fs')
		const config = require('./RESPONSEJSON/response.json')
		var global_data = fs.readFileSync("./RESPONSEJSON/response.json");
		global_data = JSON.parse(global_data)

	}

	/*	
	
	*/

	else {

		//var Handsontable = require('handsontable')
		try {
			var zip = new AdmZip(SDMZipFileName)
			var zipEntries = zip.getEntries(); // an array of ZipEntry records
		}
		catch { window.alert("File not found");CloseLoadingModal(); return; }

		zipEntries.forEach(function (zipEntry) {
			console.log(zipEntry.entryName)
			try {
			var label = zip.readAsText(zipEntry)
			console.log(JSON.parse(label).uniqueKey)
			label = JSON.parse(label).uniqueKey
			}
			catch{}
			if (zipEntry.entryName == "WSAPayCode\\response.json") {
				var decompressedData = zip.readFile(zipEntry);
				paycodesResponse = zip.readAsText(zipEntry)
				console.log(JSON.parse(paycodesResponse));
				paycodesResponse = JSON.parse(paycodesResponse)
			}


			else if 
			(zipEntry.entryName == "WSACFGPaycodeDistribution\\response.json" 
			|| zipEntry.entryName == 'WSACFGPaycodeDistribution\Response.json'
			|| label == 'WSACFGPaycodeDistribution') 
			{
				var decompressedData = zip.readFile(zipEntry);
				var data = zip.readAsText(zipEntry)
				console.log('true')
				console.log(data)
				console.log(JSON.parse(data));
				global_data = JSON.parse(data)

			}

			else if (zipEntry.entryName == "ExportConfig.json") {
				var decompressedData = zip.readFile(zipEntry);
				var exportdata = zip.readAsText(zipEntry)
				console.log(JSON.parse(exportdata));
				ExportConfig = JSON.parse(exportdata)


			}
			const fs = require('fs')
			try {
				fs.renameSync('./RESPONSEJSON/response.json', './RESPONSEJSON/response_old.json')
			}
			catch { 'file not found for rename' }
			fs.writeFileSync('./RESPONSEJSON/response.json', JSON.stringify(global_data));


		});
	}

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

	//--------------------------------------------Store Data and check if empty-------------------------------

	data = global_data
	console.log(data)
	try { console.log(data.itemsRetrieveResponses[0].responseObjectNode.WSACFGPaycodeDistribution.DistributionAssignments.WSACFGDistributionAssignment.length) }
	catch { window.alert("File is empty, or no file has been provided"); CloseLoadingModal(); return; }
	//document.getElementById("ruleName").value = data.itemsRetrieveResponses[0].itemDataInfo.title;
	//---------------------------------------------Get Selected Option-------------------------------------

	var e = document.getElementById("ruleName");
	console.log(e.options[e.selectedIndex].text)
	if (e.options[e.selectedIndex].text != "Rule Name Here")
		var SelectedRuleName = e.options[e.selectedIndex].text;
	console.log(SelectedRuleName)

	//---------------------------------------------Empty Drop Down-------------------------------------
	var select = document.getElementById("ruleName");
	var length = select.options.length;
	for (i = length - 1; i >= 0; i--) {
		select.options[i] = null;
	}

	//---------------------------------------------Fill Drop Down-------------------------------------
	for (let i = 0, l = data.itemsRetrieveResponses.length; i < l; i++) {
		value = data.itemsRetrieveResponses[i].itemDataInfo.title
		var x = document.getElementById("ruleName");
		var option = document.createElement("option");
		option.text = value;
		x.add(option);
	}

	//---------------------------------------------Get Selected Option Index---------------------------
	SelectedRuleIndex = 0
	for (let i = 0, l = data.itemsRetrieveResponses.length; i < l; i++) {
		value = data.itemsRetrieveResponses[i].itemDataInfo.title
		console.log(value)
		if (value == SelectedRuleName) SelectedRuleIndex = i

	}

	FinalSelectedValue = ""
	if (SelectedRuleName == "Rule Name Here" || SelectedRuleName == null)
		FinalSelectedValue = data.itemsRetrieveResponses[0].itemDataInfo.title
	else FinalSelectedValue = SelectedRuleName
	//---------------------------------------------Set Selected Option-----------------------------
	console.log(SelectedRuleIndex)
	document.getElementById("ruleName").value = FinalSelectedValue;
	console.log(document.getElementById("OldSchool").checked)
	//---------------------------------------------Destroy HOT---------------------------------------
	try {
		if (hotdata) hotdata.destroy()
	}
	catch{ }

	//------------------------------------------------------------Variables--------------------------------------------------

	console.log(data)

	headers = []
	overtimes = []
	overtimecombinations = []
	zones = []
	zonescombinations = []
	paycode = []
	paycodecombinations = []
	complete = []
	currentFile = SDMZipFileName

	//---------------------------------------------------------------------------Convert JSON into table data----------------------------

	for (let i = 0, l = data.itemsRetrieveResponses[SelectedRuleIndex].responseObjectNode.WSACFGPaycodeDistribution.DistributionAssignments.WSACFGDistributionAssignment.length; i < l; i++) { headers.push(data.itemsRetrieveResponses[SelectedRuleIndex].responseObjectNode.WSACFGPaycodeDistribution.DistributionAssignments.WSACFGDistributionAssignment[i]) }

	for (let i = 0, l = headers.length; i < l; i++) {
		complete.push([])
		paycode = []
		zones = []
		overtimes = []
		scheduledeviations = []
		scheduledevcombination = []
		extensions = []
		extensionscombinations = []
		//console.log(headers)

		if (Array.isArray(headers[i].ExtensionProcessorComponents.WSACFGExtProcessorComponent) == true && headers[i].ExtensionProcessorComponents != '') {
			for (let y = 0, f = headers[i].ExtensionProcessorComponents.WSACFGExtProcessorComponent.length; y < f; y++) {
				extensions.push(headers[i].ExtensionProcessorComponents.WSACFGExtProcessorComponent[y]['@ExtentionProcessorName']);
			} extensionscombinations.push(extensions.join(',')); complete[i].push(extensionscombinations.map(function (x) { return { "Extensions": x } })[0])
			extensionscombinations = []; extensions = []
		}
		else if (Array.isArray(headers[i].ExtensionProcessorComponents.WSACFGExtProcessorComponent) == false && headers[i].ExtensionProcessorComponents != '') {
			extensions.push(headers[i].ExtensionProcessorComponents.WSACFGExtProcessorComponent['@ExtentionProcessorName']);
			extensionscombinations.push(extensions.join(',')); complete[i].push(extensionscombinations.map(function (x) { return { "Extensions": x } })[0])
			extensionscombinations = []; extensions = []
		}
		else { complete[i].push({ "Extensions": "" }) }

		if (Array.isArray(headers[i].ZoneComponents.WSACFGZoneComponent) == true && headers[i].ZoneComponents != '') {
			for (let y = 0, f = headers[i].ZoneComponents.WSACFGZoneComponent.length; y < f; y++) {
				zones.push(headers[i].ZoneComponents.WSACFGZoneComponent[y]['@ZoneName'])
			} zonescombinations.push(zones.join(',')); complete[i].push(zonescombinations.map(function (x) { return { "Zones": x } })[0]);
			zonescombinations = []; zones = []
		}
		else if (Array.isArray(headers[i].ZoneComponents.WSACFGZoneComponent) == false && headers[i].ZoneComponents != '') {
			zones.push(headers[i].ZoneComponents.WSACFGZoneComponent['@ZoneName'])
			zonescombinations.push(zones.join(',')); complete[i].push(zonescombinations.map(function (x) { return { "Zones": x } })[0]);
			zonescombinations = []; zones = []
		}
		else { complete[i].push({ "Zones": "" }) }

		if (Array.isArray(headers[i]['@ScheduledDeviation']) == true && (headers[i]['@ScheduledDeviation'] != '' && headers[i]['@ScheduledDeviation'] != null)) {
			for (let y = 0, f = headers[i]['@ScheduledDeviation'].WSACFGOvertimeComponent.length; y < f; y++) {
				scheduledeviations.push(headers[i]['@ScheduledDeviation'].WSACFGOvertimeComponent[y]);
			} scheduledevcombination.push(scheduledeviations.join(',')); complete[i].push(scheduledevcombination.map(function (x) { return { "Schedule Deviations": x } })[0])
			scheduledevcombination = []; scheduledeviations = []
		}
		else if (Array.isArray(headers[i]['@ScheduledDeviation']) == false && (headers[i]['@ScheduledDeviation'] != '' && headers[i]['@ScheduledDeviation'] != null)) {
			scheduledeviations.push(headers[i]['@ScheduledDeviation']);
			scheduledevcombination.push(scheduledeviations.join(',')); complete[i].push(scheduledevcombination.map(function (x) { return { "Schedule Deviations": x } })[0])
			scheduledevcombination = []; scheduledeviations = []
		}
		else { complete[i].push({ "Schedule Deviations": "" }) }

		if (Array.isArray(headers[i].OvertimeComponents.WSACFGOvertimeComponent) == true && headers[i].OvertimeComponents != '') {
			for (let y = 0, f = headers[i].OvertimeComponents.WSACFGOvertimeComponent.length; y < f; y++) {
				overtimes.push(headers[i].OvertimeComponents.WSACFGOvertimeComponent[y]['@OvertimeName']);
			} overtimecombinations.push(overtimes.join(',')); complete[i].push(overtimecombinations.map(function (x) { return { "Overtimes": x } })[0])
			overtimecombinations = []; overtimes = []
		}
		else if (Array.isArray(headers[i].OvertimeComponents.WSACFGOvertimeComponent) == false && headers[i].OvertimeComponents != '') {
			overtimes.push(headers[i].OvertimeComponents.WSACFGOvertimeComponent['@OvertimeName']);
			overtimecombinations.push(overtimes.join(',')); complete[i].push(overtimecombinations.map(function (x) { return { "Overtimes": x } })[0])
			overtimecombinations = []; overtimes = []
		}
		else { complete[i].push({ "Overtimes": "" }) }

		if (Array.isArray(headers[i].PaycodeAssignments.WSACFGPaycodeAssignment) == true && headers[i].PaycodeAssignments != '') {
			for (let y = 0, f = headers[i].PaycodeAssignments.WSACFGPaycodeAssignment.length; y < f; y++) {
				paycode.push(headers[i].PaycodeAssignments.WSACFGPaycodeAssignment[y]['@PaycodeAssignmentName'])
			} paycodecombinations.push(paycode.join(',')); complete[i].push(paycodecombinations.map(function (x) { return { "Pay Codes": x } })[0])
			paycodecombinations = []; paycode = []
		}
		else if (Array.isArray(headers[i].PaycodeAssignments.WSACFGPaycodeAssignment) == false && headers[i].PaycodeAssignments != '') {
			paycode.push(headers[i].PaycodeAssignments.WSACFGPaycodeAssignment['@PaycodeAssignmentName'])
			paycodecombinations.push(paycode.join(',')); complete[i].push(paycodecombinations.map(function (x) { return { "Pay Codes": x } })[0])
			paycodecombinations = []; paycode = []
		}
		else { complete[i].push({ "Pay Codes": "" }) }
	}
	console.log(JSON.stringify(complete))
	console.log(complete.length)


	//----------------------------------------------------------------Format data into datatable format
	FinalArray = []

	for (let i = 0, l = complete.length; i < l; i++) {
		FinalArray.push(Object.assign({}, ...complete[i]))
	}

	try {
		headers = Object.keys(FinalArray[0])
	}
	catch { window.alert("PCD is empty"); CloseLoadingModal(); return; }

	console.log(FinalArray)
	FinalArray = Array.from(new Set(FinalArray))
	//headers = Object.keys(FinalArray[0])

	var checked = document.getElementById("OldSchool").checked
	if (checked == true) {
		console.log(JSON.stringify(FinalArray))
		OldSchool = OldSchoolView(FinalArray)
		OldSchool = AddRowHeaders(OldSchool)
		OldSchool = OldSchool.sort(
			firstBy(function (v1, v2) { return (v1.SortVariable.split("+").length - 1) - (v2.SortVariable.split("+").length - 1) })
				.thenBy(function (v1, v2) { return v1.SortVariable - v2.SortVariable }, -1)
		)

		//headers = Object.keys(OldSchool[0])
		FinalArray = OldSchool
	}
	//console.log(headers)

	//headers = 
	//console.log(Array.from(new Set(FinalArray)))
	//FinalArray = Array.from(new Set(FinalArray))
	console.log(JSON.stringify(FinalArray))
	//console.log(Object.keys(FinalArray[0]))

	//console.log(Object.keys(OldSchool[0]))
	//if (hot) hot.destroy()
	//console.log(hot)

	//--------------------------------------------------Create headers and hide columns if needed---------------------------

	try {
		headers = Object.keys(FinalArray[0])
	}
	catch { window.alert("File is empty"); return; }
	console.log(FinalArray)
	console.log(headers)
	hiddencolumn = {}
	var HideHelpers = document.getElementById("HideHelpers").checked
	if (HideHelpers == true && checked == true) { hiddencolumn = { columns: [1, 2, 3] } }
	var fixcolumns = {}
	if (checked == true) { fixcolumns = 1 }

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
	var DisableEditing = document.getElementById("DisableEditingOfConfigCol").checked
	if (DisableEditing == true) {
		for (let i = 0, l = headers.length; i < l; i++) {
			if (i <= 3) { columneditorsettings.push({ data: headers[i], editor: false, readOnly: true }) }
			else if (i == 4) { columneditorsettings.push({ data: headers[i], editor: CustomTextEditor }) }
			else if (i >= 5) { columneditorsettings.push({ data: headers[i], editor: 'text' }) }
		}
	}
	else {
		for (let i = 0, l = headers.length; i < l; i++) {
			if (i <= 3) { columneditorsettings.push({ data: headers[i], editor: 'text' }) }
			else if (i == 4) { columneditorsettings.push({ data: headers[i], editor: CustomTextEditor }) }
			else if (i >= 5) { columneditorsettings.push({ data: headers[i], editor: 'text' }) }
		}
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
		fixedColumnsLeft: fixcolumns,
		outsideClickDeselects: false,
		hiddenColumns: hiddencolumn,
		undo: true,
		licenseKey: 'non-commercial-and-evaluation',
		search: {
			searchResultClass: 'hot_search_found',
			queryMethod: AllMatches
		},
		trimDropdown: false,
		stretchH: 'all',
		modifyColWidth: function(width, col){
			if(width > 500){
				return 500
			}
		  },
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
	AddPaycodeField = document.getElementById('paycode_name')
	ReplaceField = document.getElementById('replace_field');
	Replace = document.getElementById('Replace');
	queryResult = ""

	//----------------------------------------------------------Search function------------------------

	Handsontable.dom.addEvent(SearchField, 'keyup', function (event) {
		var search = hot.getPlugin('search');
		queryResult = search.query(this.value);
		hot.render();
	});


	//---------------------------------------------------------Set variables on change------------------
	// Value that will replace the search results
	Handsontable.dom.addEvent(ReplaceField, 'keyup', function (event) {
		replace = this.value;
	});
	Handsontable.dom.addEvent(AddPaycodeField, 'keyup', function (event) {
		AddPaycodeField = this.value;
	});

	//----------------------------------------------------------- Replace Value feature


	Handsontable.dom.addEvent(Replace, 'click', function () {
		loadingmodal.style.display = "block";
		loadingmodal.style.visibility= "visible";
		setTimeout(ReplaceValueFunction,1000);	
	})	 

function ReplaceValueFunction () {
	var DisableEditing = document.getElementById("DisableEditingOfConfigCol").checked

	SearchField = document.getElementById('search_field')		
	ReplaceField = document.getElementById('replace_field');		
			replace = ReplaceField.value
			//var queryResult = hot.getSelected();
	/*	for (row = 0, r_len = queryResult.length; row < r_len; row++) {

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
	*/
try{
	if (hot && hot.getSelected().length > 0){
	var selected = hot.getSelected();
	console.log(selected)
	for (var index = 0; index < selected.length; index += 1) {
		var item = selected[index];
		var startRow = Math.min(item[0], item[2]);
		var endRow = Math.max(item[0], item[2]);
		var startCol = Math.min(item[1], item[3]);
		var endCol = Math.max(item[1], item[3]);

		for (var rowIndex = startRow; rowIndex <= endRow; rowIndex += 1) {
			for (var columnIndex = startCol; columnIndex <= endCol; columnIndex += 1) {


				if (DisableEditing == true && columnIndex > 3) {

					currentValue = hot.getDataAtCell(rowIndex, columnIndex)
					replaceValue = replace.toString()
					FinalValue = currentValue.replace(SearchField.value, replaceValue)
					FinalValue = FinalValue.replace(/(^[,\s]+)|([,\s]+$)/g, '')
					FinalValue = FinalValue.replace(',,', ',')
					hot.setDataAtCell(rowIndex, columnIndex, FinalValue);
					}
				else if (DisableEditing == false){ 
						currentValue = hot.getDataAtCell(rowIndex, columnIndex)
						replaceValue = replace.toString()
						FinalValue = currentValue.replace(SearchField.value, replaceValue)
						FinalValue = FinalValue.replace(/(^[,\s]+)|([,\s]+$)/g, '')
						FinalValue = FinalValue.replace(',,', ',')
						hot.setDataAtCell(rowIndex, columnIndex, FinalValue);

				}

				
			}
		}
	}
}
}
catch{window.alert('Please make a selection')}

		console.log('test')
		SearchField = "";
		ReplaceField = "";
		queryResult = "";
		hot.render();
		CloseLoadingModal()
	}

	//--------------------------------------------------Add paycode feature

	document.getElementById('AddPaycode').addEventListener('click', function () {
		loadingmodal.style.display = "block";
		loadingmodal.style.visibility= "visible";
		setTimeout(AddPaycode,1000);	
	})	 
	function AddPaycode () {
		//-------------Paycode Field Check
		var AddPaycodeField = document.getElementById('paycode_name')
		console.log(AddPaycodeField.value)
		if (typeof AddPaycodeField.value == 'undefined' || AddPaycodeField.value == '' || AddPaycodeField.value == null) { window.alert('The Paycode field is empty'); CloseLoadingModal(); return }

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
					FinalValue = currentValue + ',' + AddPaycodeField.value
					FinalValue = FinalValue.split(',')
					FinalValue = Array.from(new Set(FinalValue)).join(',')
					FinalValue = FinalValue.replace(/(^[,\s]+)|([,\s]+$)/g, '')
					FinalValue = FinalValue.replace(',,', ',')

					if (columnIndex >= 4) {
						hot.setDataAtCell(rowIndex, columnIndex, FinalValue);
					}
				}
			}
		}

		hot.render();
		CloseLoadingModal()
	}



	
	//Handsontable.hooks.add('afterRender', CloseLoadingModal());

	//----------------------------------------delete paycode feature---------------------------------------

	document.getElementById('DeletePaycode').addEventListener('click', function () {
		loadingmodal.style.display = "block";
		loadingmodal.style.visibility= "visible";
		setTimeout(DeletePayCode,1000);	
	})	 

		function DeletePayCode (){
		//-------------Paycode Field Check
		var AddPaycodeField = document.getElementById('paycode_name')
		console.log(AddPaycodeField.value)
		if (typeof AddPaycodeField.value == 'undefined' || AddPaycodeField.value == '' || AddPaycodeField.value == null) { window.alert('The Paycode field is empty'); CloseLoadingModal(); return }
		//-------------Loader
		var selected = hot.getSelected();
		//var target = event.target.id;
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
						document.getElementById("myModalcontenttext").value = rowIndex + '-' + rowIndex
						FinalValue = currentValue.replace(AddPaycodeField, '')
						FinalValue = FinalValue.split(',')
						FinalValue = Array.from(new Set(FinalValue)).join(',')
						FinalValue = FinalValue.replace(/(^[,\s]+)|([,\s]+$)/g, '')
						FinalValue = FinalValue.replace(',,', ',')
						if ( columnIndex >= 4) {
							hot.setDataAtCell(rowIndex, columnIndex, FinalValue);
						
						}
					}
				}
			}
		}
		//OpenLoadingModal()
		
		DeleteData()
		//hot.render(setTimeout(CloseLoadingModal()),3000);
		CloseLoadingModal();
		}


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
	changedata = data
	console.log(changedata.itemsRetrieveResponses[SelectedRuleIndex].responseObjectNode.WSACFGPaycodeDistribution.DistributionAssignments.WSACFGDistributionAssignment.length)
	changedata.itemsRetrieveResponses[SelectedRuleIndex].responseObjectNode.WSACFGPaycodeDistribution.DistributionAssignments.WSACFGDistributionAssignment = []
	console.log(JSON.stringify(changedata))

	CloseLoadingModal()
}
//console.log(document.getElementById("example").Handsontable)

document.getElementById("DownloadNewFile").addEventListener("click", function (change_data) {
	loadingmodal.style.display = "block";
	loadingmodal.style.visibility= "visible";
	setTimeout(downloadNewFile,1000,change_data);	
})	 
document.getElementById("DownloadFinalFile").addEventListener("click", function (change_data) {
	loadingmodal.style.display = "block";
	loadingmodal.style.visibility= "visible";
	setTimeout(downloadNewFile,1000,change_data);	
})	 

//console.log(hot.getdata())

//-------------------------------------------------------Save Changes to file-----------------------------------
function downloadNewFile(change_data) {
	try{
	changedata.itemsRetrieveResponses[SelectedRuleIndex].responseObjectNode.WSACFGPaycodeDistribution.DistributionAssignments.WSACFGDistributionAssignment = []
	}
	catch{window.alert('No Data Found In Handsontable');CloseLoadingModal();return}
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
	resultdata = hot2.getData();
	console.log(resultdata.length)

	console.log(resultdata)

	//for (let i = 0, l = resultdata.length; i < l; i++) { //removed minus 1?
	//	console.log(Object.assign({}, resultdata[i]))

	//	ObjectArray.push(Object.assign({}, resultdata[i]))
	//console.log(JSON.stringify(resultdata[i][0].map(function(a){return{"test":a}})))
	//var test2 = ''
	//test2.push(resultdata[i][0].map(function (x) { return { "Pay Codes": x } }))
	//}
	//console.log(ObjectArray)
	//resultdata = JSON.stringify(resultdata)
	console.log('test')

	var checked = document.getElementById("OldSchool").checked
	if (checked == true) {
		ObjectArray = reconvertToList(resultdata)
	}

	console.log(JSON.stringify(ObjectArray))
	var ConvertedArray = []
	//for (let i = 0, l = ObjectArray.length; i < l; i++) {
	var dataconvert = ObjectArray.map(function (x) {
		y = { "Extensions": x['0'], "Zones": x['1'], "Schedule Deviation": x['2'], "Overtimes": x['3'], "Paycodes": x['4'] }
		//y = { "Extensions": x['0'],"Schedule Deviation": x['1'], "Overtimes": x['2'], "Zones": x['3'], "Paycodes": x['4'] }
		console.log(x)
		console.log(y)
		console.log(x['2'])

		if (x['1'] == null || x['1'] == '' || x['1'] == "") {
			ZonesFile = 'null'
		}
		else {
			console.log('ZonesisTrue')
			zones = x['1'].split(',')
			console.log(zones)
			console.log(zones.length)
			if (zones.length == 1) ZonesFile = { "@ZoneName": zones[0] }
			else {
				ZonesFile = []
				//for (let i = 0, l = zones.length; i < l; i++) {
				ZonesFile = zones.map(function (x) { return { "@ZoneName": x } })
				//}
			}
		}
		console.log(ZonesFile)

		if (x['4'] == null || x['4'] == '' || x['4'] == "") {
			PaycodesFile = 'null'
		}
		else {
			console.log('paycodesisTrue')
			paycodes = x['4'].split(',')
			console.log(paycodes)
			console.log(paycodes.length)
			if (paycodes.length == 1) PaycodesFile = { "@PaycodeAssignmentName": paycodes[0] }
			else {
				PaycodesFile = []
				//for (let i = 0, l = paycodes.length; i < l; i++) {
				PaycodesFile = paycodes.map(function (x) { return { "@PaycodeAssignmentName": x } })
				//}
			}
		}
		console.log(PaycodesFile)


		if (x['3'] == null || x['3'] == '' || x['3'] == "") {
			OvertimesFile = 'null'
		}
		else {
			console.log('OTisTrue')
			overtimes = x['3'].split(',')
			console.log(overtimes)
			console.log(overtimes.length)
			if (overtimes.length == 1) {
				if (overtimes[0] != '.Default') {
					OvertimesFile = { "@OvertimeName": overtimes[0] }
				}
				else OvertimesFile = 'null'
			}

			else {
				OvertimesFile = []
				//for (let i = 0, l = zones.length; i < l; i++) {
				OvertimesFile = overtimes.map(function (x) { return { "@OvertimeName": x } })

				//}
			}
		}

		console.log(OvertimesFile)

		if (x['0'] == null || x['0'] == '' || x['0'] == "") {
			ExtensionsFile = 'null'
		}
		else {
			console.log('OTisTrue')
			extensions = x['0'].split(',')
			console.log(extensions)
			console.log(extensions.length)
			if (extensions.length == 1) {
				if (extensions[0] != '.Default') {
					ExtensionsFile = { "@ExtentionProcessorName": extensions[0] }
				}
				else ExtensionsFile = 'null'
			}

			else {
				ExtensionsFile = []
				//for (let i = 0, l = zones.length; i < l; i++) {
				ExtensionsFile = extensions.map(function (x) { return { "@ExtentionProcessorName": x } })

				//}
			}
		}

		console.log(ExtensionsFile)

		ScheduleDeviations = x['2']

		map =

		{
			"@ScheduledDeviation": ScheduleDeviations,
			"OvertimeComponents": {
				"WSACFGOvertimeComponent": OvertimesFile
			},
			"ExtensionProcessorComponents": { "WSACFGExtProcessorComponent": ExtensionsFile },
			"ZoneComponents": { "WSACFGZoneComponent": ZonesFile },
			"PaycodeAssignments": {
				"WSACFGPaycodeAssignment": PaycodesFile
			}
		}

		if (ZonesFile == 'null' || ZonesFile == null || ZonesFile == '') { delete map.ZoneComponents.WSACFGZoneComponent; map.ZoneComponents = ''; console.log('zonesisweird') }
		if (OvertimesFile == '' || OvertimesFile == null || OvertimesFile == 'null' || OvertimesFile == '{ "@OvertimeName": "null" }' || OvertimesFile == '{"@OvertimeName":".Default"}') { delete map.OvertimeComponents.WSACFGOvertimeComponent; map.OvertimeComponents = '' }
		if (ExtensionsFile == '' || ExtensionsFile == null || ExtensionsFile == 'null' || ExtensionsFile == '{ "@ExtentionProcessorName": "null" }') { delete map.ExtensionProcessorComponents.WSACFGExtProcessorComponent; map.ExtensionProcessorComponents = '' }
		if (ScheduleDeviations == '' || ScheduleDeviations == 'null' || ScheduleDeviations == null) { delete map['@ScheduledDeviation'] }
		if (PaycodesFile == '' || PaycodesFile == null || PaycodesFile == 'null' || PaycodesFile == '{ "@PaycodeAssignmentName": "null" }') { delete map.PaycodeAssignments.WSACFGPaycodeAssignment; map.PaycodeAssignments = ''; delete map }



		if (typeof map != "undefined") {
			console.log(JSON.stringify(map))
			changedata.itemsRetrieveResponses[SelectedRuleIndex].responseObjectNode.WSACFGPaycodeDistribution.DistributionAssignments.WSACFGDistributionAssignment.push(map)

			return map
		}

	}
	)
	//WriteFileStuffDeprecated.
	console.log(JSON.stringify(changedata))
	console.log(SelectedRuleIndex)
	console.log(changedata.itemsRetrieveResponses[SelectedRuleIndex].responseObjectNode.WSACFGPaycodeDistribution.DistributionAssignments.WSACFGDistributionAssignment.length)
	fs.renameSync('./RESPONSEJSON/response.json', './RESPONSEJSON/response_old.json')
	changedata.itemsRetrieveResponses[SelectedRuleIndex].responseObjectNode.WSACFGPaycodeDistribution.DistributionAssignments.WSACFGDistributionAssignment =
		Array.from(new Set(changedata.itemsRetrieveResponses[SelectedRuleIndex].responseObjectNode.WSACFGPaycodeDistribution.DistributionAssignments.WSACFGDistributionAssignment))
	fs.writeFileSync('./RESPONSEJSON/response.json', JSON.stringify(changedata));
	//End Deprecated

	//---------------------------------------------------New Zip Stuff-------------------------------------------------

	console.log(change_data.target.id)
	if (change_data.target.id == "DownloadFinalFile") {
		var JSZip = require('jszip')
		var saveAs = require('file-saver');
		var zip = new JSZip();
		zip.file("ExportConfig.json", JSON.stringify(ExportConfig))
		zip.folder("WSACFGPaycodeDistribution")
		zip.folder("WSACFGPaycodeDistribution").file("response.json", JSON.stringify(changedata))
		datetimestamp = Date.now()
		zip.generateAsync({ type: "blob" })
			.then(function (blob) {
				saveAs(blob, "PCDEditorExport_" + datetimestamp + ".zip");
			});
	}

	//---------------------------------------------------End of New Zip Stuff--------------------------------------------

	CloseLoadingModal()


}



//--------------------------------Convert data to oldschool wfc/wfd view, enabled if using datatable view-------------------------
function OldSchoolView(data) {
	var firstBy = require('thenby');

	for (let i = 0, l = data.length; i < l; i++) {
		if (data[i].Overtimes == '') data[i].Overtimes = '.Default'
	}

	headers = []
	headers_temp = []
	for (let i = 0, l = data.length; i < l; i++) {
		const allowed = ['Overtimes'];
		const filtered = Object.keys(data[i])
			.filter(key => allowed.includes(key))
			.reduce((obj, key) => {
				return {
					...obj,
					[key]: data[i][key]
				};
			}, {});
		headers.push(Object.values(filtered))
	}
	//console.log(filtered);
	for (let i = 0, l = headers.length; i < l; i++) {
		headers_temp.push(headers[i][0].replace(/\s/g, '%').replace(',', '#'))
		//console.log(reduce(headers))
	}
	headers = Array.from(new Set(headers_temp))
	console.log(JSON.stringify(headers))
	console.log(headers[0].split(',').length)
	headers = headers.sort()

	headers = headers.sort(
		firstBy(function (v1, v2) { return (v1.split("#").length - 1) - (v2.split("#").length - 1) })
			.thenBy(function (v1, v2) { return v1 - v2 })
	)

	headers_temp = []
	console.log(headers)
	for (let i = 0, l = headers.length; i < l; i++) {
		headers_temp.push(headers[i].replace(/%/g, ' ').replace('#', ','))
	}
	headers = headers_temp
	console.log(headers)

	//headers.unshift("Schedule Deviations","Zones")
	headers = Array.from(new Set(headers))
	content = []
	for (let i = 0, l = data.length; i < l; i++) {
		content.push([])
		for (let y = 0, k = headers.length + 3; y < k; y++) {
			content[i].push("")
		}
		for (let z = 0, j = headers.length; z < j; z++) {
			TEST3 = []
			TEST3.push(headers[z])
			let obj = TEST3.reduce(function (acc, curr) {
				acc[curr] = '';
				return acc;
			}, {});
			content[i][z + 3] = obj
			// content[i][z+2] =     
		}
	}

	for (let i = 0, l = data.length; i < l; i++) {
		OvertimeValueTemp = data[i].Overtimes
		test2 = headers.indexOf(OvertimeValueTemp) + 3
		test4 = headers.indexOf(OvertimeValueTemp)
		test5 = headers[test4]
		console.log(test2,test5,test4)
		content[i][test2][test5] = data[i]['Pay Codes']
		content[i][0] = { "Schedule_Deviations": data[i]['Schedule Deviations'] }
		content[i][1] = { "Zones": data[i]['Zones'] }
		content[i][2] = { "Extensions": data[i]['Extensions'] }
		console.log(content[i])
	}

	Array.prototype.unique = function () {
		var a = this.concat();
		for (var i = 0; i < a.length; ++i) {
			for (var j = i + 1; j < a.length; ++j) {
				if (a[i] === a[j])
					a.splice(j--, 1);
			}
		}

		return a;
	};

	content_temp = []
	for (let i = 0, l = content.length; i < l; i++) {
		content_temp.push(Object.assign({}, ...content[i]))
		
	}
	content = content_temp
	content_temp = []
	content_temp.push(content[0])
	for (let i = 0, l = content.length - 1; i < l; i++) {
		console.log(content[i])
		if (content[i].Zones != content[i + 1].Zones || content[i].Schedule_Deviations != content[i + 1].Schedule_Deviations || content[i].Extensions != content[i + 1].Extensions) { content_temp.push(content[i + 1]) }
		console.log(content[i + 1])
		console.log(content_temp)
	}
	content_temp = Array.from(new Set(content_temp))
	console.log(content_temp)
	for (let x = 0, l = content_temp.length; x < l; x++) {
		for (let y = 0, m = content.length; y < m; y++) {
			for (let z = 0, n = headers.length; z < n; z++) {
				if (content_temp[x].Zones == content[y].Zones && content_temp[x].Schedule_Deviations == content[y].Schedule_Deviations &&  content_temp[x].Extensions == content[y].Extensions) {
					if (content_temp[x][headers[z]] != content[y][headers[z]] && content_temp[x][headers[z]] == '') {
						content_temp[x][headers[z]] = content[y][headers[z]]
					}
				}
			}
		}
	}
	//console.log('test')
	content = Array.from(new Set(content_temp))
	content = Array.from(new Set(content))
	console.log(content)
	return content
}

//--------------------------------------------If using datatable view add the first column to combine config-------------------

function AddRowHeaders(content) {
	HeaderValue = []
	for (let x = 0, l = content.length; x < l; x++) {
		newVar = []
		if (content[x].Schedule_Deviations != '') {
			newVar.push(content[x].Schedule_Deviations.split(','))
		}
		if (content[x].Zones != '') {
			newVar.push(content[x].Zones.split(','))
		}
		if (content[x].Extensions != '') {
			newVar.push(content[x].Extensions.split(','))
		}
		if (newVar.length == 2) {
			newVar = newVar[0].concat(newVar[1])
		}
		else if (newVar.length == 3) { newVar = (newVar[0].concat(newVar[1].concat(newVar[2]))) }
		else newVar = newVar[0]

		if (content[x].Schedule_Deviations == '' && content[x].Zones == '' && content[x].Extensions == '') { newVar = [".Default"] }
		newVar.sort()
		//console.log(newVar)
		newVar = newVar.join(' + ')
		content[x] = { "SortVariable": newVar, ...content[x] }
		//console.log(content[x])
	}
	var firstBy = require('thenby');
	console.log(content)
	content = Array.from(new Set(content))
	content = content.sort(firstBy("SortVariable"))
	for (let x = 0, l = content.length - 1; x < l; x++) {
		if (content[x].SortVariable == content[x + 1].SortVariable) { delete content[x] }

	}
	content = content.filter(function (el) {
		return el != null;
	})

	return content

}


//---------------------------------------------Function to recovert datatable to list if tabular view is enabled---------------
function reconvertToList(resultdata) {
	staged_data = []
	console.log(JSON.stringify(resultdata))
	{
		for (let i = 0, l = resultdata.length; i < l; i++) {
			staged_data.push([])
			for (let z = 4, x = headers.length + 0.1; z < x; z++) {
				staged_data[i].push([])
				staged_data[i][z - 4].push(headers[z])
				staged_data[i][z - 4].push(resultdata[i][z])
			}
		}
		//console.log(staged_data)
		for (let i = 0, l = staged_data.length; i < l; i++) {
			for (let y = 0, m = headers.length; y < m; y++) {
				index = headers.indexOf(headers[y])
				for (let z = 4, x = headers.length; z < x; z++) {
					if (headers[y] == 'Zones') { staged_data[i][z - 4].unshift(resultdata[i][index]) }
					if (headers[y] == 'Schedule_Deviations') { staged_data[i][z - 4].unshift(resultdata[i][index]) }
					if (headers[y] == 'Extensions') { staged_data[i][z - 4].unshift(resultdata[i][index]) }
				}
			}
		}
		console.log(JSON.stringify(staged_data))
		resultdata = []
		for (let i = 0, l = staged_data.length; i < l; i++) {
			for (let y = 0, m = staged_data[i].length; y < m; y++) {
				resultdata.push(staged_data[i][y])
			}
		}
		console.log(resultdata)
	}
	return resultdata
}

//--------------------------Custom Handsontable Cell Renderer for Search -------------------------------------

function firstRowRenderer(instance, td, row, col, prop, value, cellProperties) {
	Handsontable.renderers.TextRenderer.apply(this, arguments);
	td.style.color = 'black';
	td.style.background = '#f5906c';
	td.style['background-color'] = '#f5906c';
	cellProperties.className = "htCenter"

}


document.getElementById("DownloadtoCSV").addEventListener('click', function () {

	var fe = document.getElementById("ruleName");
	console.log(fe.options[fe.selectedIndex].text)
	var exportPlugin = hotdata.getPlugin('exportFile');
	exportPlugin.downloadFile('csv', { filename: fe.options[fe.selectedIndex].text, columnHeaders: true, });

});


