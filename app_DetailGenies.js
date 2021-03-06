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
const fs = require('fs')
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

	try {
		SelectedConnectionName = document.getElementById("Connection").options[document.getElementById("Connection").selectedIndex].value
	}
	catch {
		SelectedRuleIndex = global_data[0].name
		document.getElementById("Connection").value = SelectedRuleIndex;
		SelectedConnectionName = document.getElementById("Connection").options[document.getElementById("Connection").selectedIndex].value
	}



	SelectedConnection = {}
	for (let i = 0, l = global_data.length; i < l; i++) {
		if (global_data[i].name == SelectedConnectionName) {
			SelectedConnection = global_data[i]
		}
	}


}


RefreshConnections()



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
		if (zipEntry.entryName == "DATA_VIEWS\\response.json" || zipEntry.entryName == "DATA_VIEWS\response.json" || zipEntry.entryName == "DATA_VIEWS/response.json") {
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
			fs.renameSync('./RESPONSEJSON/DVresponse.json', './RESPONSEJSON/DVresponse_old.json')
		}
		catch { 'file not found for rename' }
		fs.writeFileSync('./RESPONSEJSON/DVresponse.json', JSON.stringify(global_data));


	});


	//-----------------------------------------------New XML STUFF---------------

	console.log(SDMZipFileName)


	var propertiesfordate

	var zip = new AdmZip(SDMZipFileName)
	var zipEntries = zip.getEntries();
	zipEntries.forEach(function (zipEntry) {
		console.log(zipEntry.entryName)
		if (zipEntry.entryName == "Settings.properties") {
			propertiesfordate = zip.readAsText(zipEntry).split('\n')
		}
		else if (zipEntry.entryName == "WSACfgAccrualCode.xml") {
			AccrualCodeData = zip.readAsText(zipEntry)
			console.log(AccrualCodeData)
		}
		else if (zipEntry.entryName == "WSAPayCode.xml") {
			PayCodeData = zip.readAsText(zipEntry)
		}
		else if (zipEntry.entryName == "WSADetail.xml") {
			DetailGenieData = zip.readAsText(zipEntry)
		}
		else if (zipEntry.entryName == "WSADetailColumnSet.xml") {
			DetailColumnSetData = zip.readAsText(zipEntry)
		}
		else if (zipEntry.entryName == "WSACombinedPayCodeRule.xml") {
			CombinedPayCodeData = zip.readAsText(zipEntry)
		}

	}
	)

	DateProperties = {}
	for (let i = 0, l = propertiesfordate.length; i < l; i++) {
		props =
			propertiesfordate[i].split('=')
		props = { [props[0]]: props[1] }
		console.log(props)
		propertiesfordate[i] = props
		Object.assign(DateProperties, props)
	}
	console.log(propertiesfordate)
	console.log(DateProperties)

	//const config = require('fs').readFileSync(SDMZipFileName, 'utf8')
	var convert = require('xml-js');

	console.log('testt')
	AccrualCodeData = JSON.parse(convert.xml2json(AccrualCodeData, { compact: true, spaces: 4 }))
	console.log('thisfar')
	CombinedPayCodeData = JSON.parse(convert.xml2json(CombinedPayCodeData, { compact: true, spaces: 4 }))
	console.log('thisfar')
	DetailGenieData = JSON.parse(convert.xml2json(DetailGenieData, { compact: true, spaces: 4 }))
	console.log('thisfar')
	DetailColumnSetData = JSON.parse(convert.xml2json(DetailColumnSetData, { compact: true, spaces: 4 }))
	console.log('thisfar')
	PayCodeData = JSON.parse(convert.xml2json(PayCodeData, { compact: true, spaces: 4 }))

	Mapping = JSON.parse(fs.readFileSync('./Settings/ColumnMapping.json'))

	console.log(AccrualCodeData, CombinedPayCodeData, DetailColumnSetData, DetailGenieData, PayCodeData)
	console.log(JSON.stringify(DetailColumnSetData))

	PaycodesList = []
	for (let i = 0, l = PayCodeData.root.Kronos_WFC.length; i < l; i++) {
		x = PayCodeData.root.Kronos_WFC[i]
		PaycodesList.push(
			{
				"Name": x.Response[1].WSAPayCode._attributes.Name,
				"Type": x.Response[1].WSAPayCode._attributes.AmountType

			})
	}
	for (let i = 0, l = CombinedPayCodeData.root.Kronos_WFC.length; i < l; i++) {
		x = CombinedPayCodeData.root.Kronos_WFC[i]
		PaycodesList.push(
			{
				"Name": x.Response[1].WSACombinedPayCodeRule._attributes.Name,
				"Type": x.Response[1].WSACombinedPayCodeRule._attributes.AmountType

			})
	}

	AccrualCodeList = []
	for (let i = 0, l = AccrualCodeData.root.Kronos_WFC.length; i < l; i++) {
		x = AccrualCodeData.root.Kronos_WFC[i]
		AccrualType = ""
		if (x.Response[1].WSACfgAccrualCode._attributes.Type == 1) { AccrualType = "Hour" }
		else if (x.Response[1].WSACfgAccrualCode._attributes.Type == 2) { AccrualType = "Day" }
		else { AccrualType = "Money" }
		AccrualCodeList.push(
			{
				"Name": x.Response[1].WSACfgAccrualCode._attributes.Name,
				"Type": AccrualType

			})
	}
	GenieList = []
	for (let i = 0, l = DetailGenieData.root.Kronos_WFC.length; i < l; i++) {
		x = DetailGenieData.root.Kronos_WFC[i]
		GenieList.push(
			{
				"Name": x.Response[1].WSADetail._attributes.Name,
				"Description": x.Response[1].WSADetail._attributes.Description,
				"DisplayName": x.Response[1].WSADetail._attributes.DisplayName,
				"Category": "OTHER",
				"Hyperfind": x.Response[1].WSADetail.DefaultHyperfindQuery.WSAHyperfindQuery._attributes.Name,
				"TimePeriod": x.Response[1].WSADetail.DefaultTimePeriod.WSADPTimePeriod._attributes.Name,
				"ColumnSetName": x.Response[1].WSADetail.ColumnSet.WSAWfgColumnSet._attributes.Name
			})
	}

	ColumnSetList = []
	for (let i = 0, l = DetailColumnSetData.root.Kronos_WFC.length; i < l; i++) {
		x = DetailColumnSetData.root.Kronos_WFC[i]
		for (let y = 0, z = x.Response[1].WSADetailColumnSet.ColumnDetail.WSAColumnDetail.length; y < z; y++) {
			PayCodeName = null
			if (x.Response[1].WSADetailColumnSet.ColumnDetail.WSAColumnDetail[y].PayCode) {
				PayCodeName = x.Response[1].WSADetailColumnSet.ColumnDetail.WSAColumnDetail[y].PayCode.WSADPPayCode._attributes.Name
			}
			AccrualCodeName = null
			if (x.Response[1].WSADetailColumnSet.ColumnDetail.WSAColumnDetail[y].AccrualCode) {
				AccrualCodeName = x.Response[1].WSADetailColumnSet.ColumnDetail.WSAColumnDetail[y].AccrualCode.WSAAccrualCode._attributes.Name
			}
			Calculate = null
			if (PayCodeName != null || AccrualCodeName != null) {
				Calculate = "SUM"
			}
			ColumnSetList.push(
				{
					"ColumnSetName": x.Response[1].WSADetailColumnSet._attributes.Name,
					"ColumnSetDisplayName": x.Response[1].WSADetailColumnSet._attributes.DisplayName,
					"ColumnSetDescription": x.Response[1].WSADetailColumnSet._attributes.DisplayDescription,
					"ColumnLabel": x.Response[1].WSADetailColumnSet.ColumnDetail.WSAColumnDetail[y]._attributes.DisplayName,
					"ColumnWidth": x.Response[1].WSADetailColumnSet.ColumnDetail.WSAColumnDetail[y]._attributes.ColumnWidth,
					"ColumnLUID": x.Response[1].WSADetailColumnSet.ColumnDetail.WSAColumnDetail[y].ColumnDefinition.WSAColumnDefinition._attributes.Name,
					"ColumnNumber": x.Response[1].WSADetailColumnSet.ColumnDetail.WSAColumnDetail[y]._attributes.VisualIndexNumber,
					"PayCode": PayCodeName,
					"AccrualCode": AccrualCodeName,
					"Parameter": PayCodeName || AccrualCodeName || "",
					"Calculate": Calculate
				})
		}
	}


	for (let i = 0, l = ColumnSetList.length; i < l; i++) {
		if (ColumnSetList[i].PayCode != "" && ColumnSetList[i].PayCode != null) {
			for (let y = 0, z = PaycodesList.length; y < z; y++) {
				if (ColumnSetList[i].PayCode == PaycodesList[y].Name) {
					Object.assign(ColumnSetList[i], { "AmountType": PaycodesList[y].Type })
					ColumnSetList[i].ColumnLUID = ColumnSetList[i].ColumnLUID + "_" + PaycodesList[y].Type.toUpperCase()

				}

			}

		}
		else if (ColumnSetList[i].AccrualCode != "" && ColumnSetList[i].AccrualCode != null) {
			for (let y = 0, z = AccrualCodeList.length; y < z; y++) {
				if (ColumnSetList[i].AccrualCode == AccrualCodeList[y].Name) {
					Object.assign(ColumnSetList[i], { "AmountType": AccrualCodeList[y].Type })
					ColumnSetList[i].ColumnLUID = ColumnSetList[i].ColumnLUID + "_" + AccrualCodeList[y].Type.toUpperCase()
				}

			}


		}
	}

	for (let i = 0, l = ColumnSetList.length; i < l; i++) {
		for (let y = 0, z = Mapping.length; y < z; y++) {
			if (ColumnSetList[i].ColumnLUID == Mapping[y].WFCNAME)
				ColumnSetList[i].ColumnLUID = Mapping[y].WFDNAME
		}
	}


	global_data = {
		"ColumnSets": ColumnSetList,
		"Genies": GenieList,
		"AccrualCodes": AccrualCodeList,
		"PayCodes": PaycodesList
	}


	console.log(PaycodesList, AccrualCodeList, GenieList, ColumnSetList)





	try {
		fs.renameSync('./RESPONSEJSON/DVresponse.json', './RESPONSEJSON/DVresponse_old.json')
	}
	catch { 'file not found for rename' }
	fs.writeFileSync('./RESPONSEJSON/DVresponse.json', JSON.stringify(global_data));




	data = global_data

	//--------------------------------------------Store Data and check if empty-------------------------------

	console.log(data)
	try {
		console.log(
			data.ColumnSets.length)
	}
	catch { window.alert("File is empty"); CloseLoadingModal(); return; }

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


	for (let i = 0, l = global_data.Genies.length; i < l; i++) {
		for (let y = 0, z = global_data.ColumnSets.length; y < z; y++) {
			if (global_data.Genies[i].ColumnSetName == global_data.ColumnSets[y].ColumnSetName) {
				Object.assign(global_data.ColumnSets[y], global_data.Genies[i])
				complete.push(global_data.ColumnSets[y])
			}

		}
	}


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


	headers = [
		"Name",
		"DisplayName",
		"Description",
		"Category",
		"Hyperfind",
		"TimePeriod",
		"ColumnSetName",
		"ColumnSetDisplayName",
		"ColumnSetDescription",
		"ColumnNumber",
		"ColumnLabel",
		"ColumnWidth",
		"ColumnLUID",
		//"PayCode",
		//"AccrualCode",
		"Calculate",
		"Parameter"
	]



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

		else { columneditorsettings.push({ data: headers[i], editor: 'text', readOnly: true }) }
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
		minSpareCols: 1,
		minSpareRows: 0,
		rowHeaders: true,
		colHeaders: headers,
		columns: columneditorsettings,
		contextMenu: ['cut', 'copy', 'undo', 'redo'],
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

	//-------------------------------------------------Register Renderer
	//Handsontable.renderers.registerRenderer('negativeValueRenderer', negativeValueRenderer);


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
					FinalValue = FinalValue.split(',')
					FinalValue = Array.from(new Set(FinalValue)).join(',')
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
						document.getElementById("myModalcontenttext").value = rowIndex + '-' + rowIndex
						FinalValue = currentValue.replace(AddPaycodeField, '')
						FinalValue = FinalValue.split(',')
						FinalValue = Array.from(new Set(FinalValue)).join(',')
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


	//Handsontable.hooks.add('afterRender', CloseLoadingModal());

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
	//console.log(changedata.itemsRetrieveResponses[SelectedRuleIndex].responseObjectNode.WSACFGPaycodeDistribution.DistributionAssignments.WSACFGDistributionAssignment.length)
	console.log(changedata)

	console.log(
		changedata.itemsRetrieveResponses[SelectedRuleIndex].responseObjectNode.ruleVersions.adjustmentRuleVersion[SelectedVersionIndex].triggers.adjustmentTriggerForRule
	)


	changedata.itemsRetrieveResponses[SelectedRuleIndex].responseObjectNode.ruleVersions.adjustmentRuleVersion[SelectedVersionIndex].triggers.adjustmentTriggerForRule = []

	console.log(changedata)
	console.log(JSON.stringify(changedata))


}
//console.log(document.getElementById("example").Handsontable)

document.getElementById("DownloadNewFile").addEventListener("click", function (change_data) {
	loadingmodal.style.display = "block";
	loadingmodal.style.visibility = "visible";
	setTimeout(downloadNewFile, 1000, change_data);
})
/*
document.getElementById("DownloadFinalFile").addEventListener("click", function (change_data) {
	loadingmodal.style.display = "block";
	loadingmodal.style.visibility = "visible";
	setTimeout(downloadNewFile, 1000, change_data);
})
*/
//-------------------------------------------------------Save Changes to file-----------------------------------
function downloadNewFile(change_data) {
	//changedata.itemsRetrieveResponses = []
	LoadingScreenModal('block')

	var request = require('request');
	var rp = require('request-promise')
	AccessToken=""

	LoadingHandsOnTable = document.getElementById('LoadingHandsOnTable')

	Columns = [
		{ data: headers[i], editor: 'text', readOnly: true }

	]



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
		DetailGenie =
		{
			"Name": ObjectArray[i].DisplayName,
			"Status": "None",
			"Hyperfind": ObjectArray[i].Hyperfind,
			"TimePeriod": ObjectArray[i].TimePeriod,
			"Description": ObjectArray[i].Description,
			"Category": ObjectArray[i].Category

		}
		if (i == 0) {
			ListOfDVs.push(DetailGenie)
		}
		else if (ObjectArray[i].DisplayName != ObjectArray[i - 1].DisplayName) {
			ListOfDVs.push(DetailGenie)
		}
	}
	ListOfDVs = Array.from(new Set(ListOfDVs))
	console.log(ListOfDVs)



	Columns = [
		{ data: "Status", editor: 'text', readOnly: true },
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

			})
			.catch(function (err) {
				window.alert('Login Failed ' + err.error)
			});
	}

	Access2()


	ListOfColumns = []
	for (let i = 0, l = ObjectArray.length; i < l; i++) {


		Column =
		{
			"GenieName": ObjectArray[i].DisplayName,
			"Operation": ObjectArray[i].Calculate,
			"ColumnData": {
				"key": ObjectArray[i].ColumnLUID,
				"alias": ObjectArray[i].ColumnLUID + "_" + ObjectArray[i].ColumnNumber,
				"properties": [
					{
						"value": ObjectArray[i].Parameter
					}
				],
				"label": ObjectArray[i].ColumnLabel,
				"width": ObjectArray[i].ColumnWidth,
				"selected": true
			}
		}
		if (Column.ColumnData.properties[0].value == "" || Column.ColumnData.properties[0].value == null) { delete Column.ColumnData.properties }
		ListOfColumns.push(Column)


	}
	FinalStuff = []
	for (let i = 0, l = ListOfDVs.length; i < l; i++) {
		//KVP = ListOfDVs[i].split('&--&')
		map = {
			"name": ListOfDVs[i].Name,
			"consumer": "SPRING",
			"content": {
				"metadata": {
					"label": ListOfDVs[i].Name,
					"description": ListOfDVs[i].Description,
					"uiView": "grid",
					"groupedByColumnWidth": 150,
					"applyRules": true
				},
				"from": {
					"view": 0,
					"employeeSet": {
						"hyperfind": {
							"id": 1
						},
						"dateRange": {
							"symbolicPeriod": {
								"id": 1
							}
						}
					},
					"viewPresentation": "People"
				},
				"select": [],
				"reduce": [],
				"options": {
					"currencyType": "PREFERRED_CURRENCY",
					"dataViewCategory": ListOfDVs[i].Category
				}
			}
		}
		console.log(map)

		for (let y = 0, z = ListOfColumns.length; y < z; y++) {
			if (ListOfDVs[i].Name == ListOfColumns[y].GenieName) {
				if (ListOfColumns[y].ColumnData.key != "UNMAPPED" && ListOfColumns[y].ColumnData.key != "" && ListOfColumns[y].ColumnData.key != null) {
					map.content.select.push(ListOfColumns[y].ColumnData)
					if (ListOfColumns[y].ColumnData.properties) {
						map.content.reduce.push(
							{
								"key": ListOfColumns[y].ColumnData.key,
								"alias": ListOfColumns[y].ColumnData.alias,
								"operation": ListOfColumns[y].Operation
							}
						)
					}
				}
			}

		}

		FinalStuff.push(map)

		LoadingData = LoaderHOT.getData()

		for (let y = 0, z = LoadingData.length; y < z; y++) {
			console.log()
				if (LoadingData[y][1] ==  map.name){
					LoaderHOT.setDataAtCell(y,0,"Pending")
					LoaderHOT.setCellMeta(y,0,'className', 'YellowCellBackground')
				}
		}
		console.log(AccessToken)
		var options4 = {
			'method': 'POST',
			'url': 'https://' + SelectedConnection.url + "/api/v1/commons/dataviews",
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
							console.log(parsedBody.request.body)
							for (let y = 0, z = LoadingData.length; y < z; y++) {
								if (LoadingData[y][1] ==  JSON.parse(parsedBody.request.body).name){
									LoaderHOT.setDataAtCell(y,0,parsedBody.request.body)
									LoaderHOT.setCellMeta(y,0,'className', 'GreenCellBackground')
									LoaderHOT.render()
								}
								
						}
						
						})
						.catch(function (err) {
							console.log('fail')
							console.log(err)
							for (let y = 0, z = LoadingData.length; y < z; y++) {
									if (LoadingData[y][1] ==  JSON.parse(err.options.body).name){
										LoaderHOT.setDataAtCell(y,0,err.error)
										LoaderHOT.setCellMeta(y,0,'className', 'RedCellBackground')
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

	console.log(change_data.target.id)
	if (change_data.target.id == "DownloadFinalFile") {
		var JSZip = require('jszip')
		var saveAs = require('file-saver');
		var zip = new JSZip();
		if (ExportConfig == '' || ExportConfig == null) { ExportConfig = { "sourceTenantId": "192.168.33.10", "targetTenantId": "C:\\Users\\Marcel Rottmann\\Desktop\\ParagonTransferManager\\XML\\test\\test_1588315981.zip" } }
		zip.file("ExportConfig.json", JSON.stringify(ExportConfig))
		zip.folder("AdjustmentRule")
		zip.folder("AdjustmentRule").file("response.json", JSON.stringify(changedata))
		datetimestamp = Date.now()
		zip.generateAsync({ type: "blob" })
			.then(function (blob) {
				saveAs(blob, "PCDEditorExport_" + datetimestamp + ".zip");
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


function LoadingScreenModal(YN) {
	document.getElementById('PopUpLoader').style.display = YN

}

LoadingScreenModal('none')