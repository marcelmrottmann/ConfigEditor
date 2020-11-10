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
document.getElementById("UploadAndParse").addEventListener("click", function () {
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
		const config = require('./RESPONSEJSON/response_PayCodes.json')
		var global_data = fs.readFileSync("./RESPONSEJSON/response_PayCodes.json");
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
		catch { window.alert("File not found"); CloseLoadingModal(); return; }

		zipEntries.forEach(function (zipEntry) {

			console.log(zipEntry.entryName)
			var label = zip.readAsText(zipEntry)
			console.log(JSON.parse(label).uniqueKey)
			label = JSON.parse(label).uniqueKey


			if (zipEntry.entryName == "WSAPayCode\\response.json" || label =="WSAPayCode") {
				var decompressedData = zip.readFile(zipEntry);
				var data = zip.readAsText(zipEntry)
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
				fs.renameSync('./RESPONSEJSON/response_PayCodes.json', './RESPONSEJSON/response_PayCodes_old.json')
			}
			catch { 'file not found for rename' }
			fs.writeFileSync('./RESPONSEJSON/response_PayCodes.json', JSON.stringify(global_data));


		});
	}

	//--------------------------------------------Store Data and check if empty-------------------------------

	data = global_data
	console.log(data)
	try { console.log(data.itemsRetrieveResponses.length) }
	catch { window.alert("File is empty"); CloseLoadingModal(); return; }
	//document.getElementById("ruleName").value = data.itemsRetrieveResponses[0].itemDataInfo.title;

	//---------------------------------------------Destroy HOT---------------------------------------
	try {
		if (hotdata) hotdata.destroy()
	}
	catch{ }

	//------------------------------------------------------------Variables--------------------------------------------------

	console.log(data)
	headers = []
	currentFile = SDMZipFileName

	//---------------------------------------------------------------------------Convert JSON into table data----------------------------

	PayCodes = []
	for (let i = 0, l = data.itemsRetrieveResponses.length; i < l; i++) {
		PayCodes.push({})
		keys = Object.keys(data.itemsRetrieveResponses[i].responseObjectNode.WSAPayCode)
		values = Object.values(data.itemsRetrieveResponses[i].responseObjectNode.WSAPayCode)
		for (let y = 0, x = keys.length; y < x; y++) {
			key = keys[y]
			value = values[y]
			Object.assign(PayCodes[i], ({ [key]: value }))
		}
	}
	complete = PayCodes

	//--------------------------------------------------------------------------Replacement Paycodes----------------

	for (let y = 0, x = complete.length; y < x; y++) {
		if (complete[y].TotalsPayCodeReplacementItems) {//console.log('true to')
			console.log(complete[y].TotalsPayCodeReplacementItems.WSAMappedPayCodesItem)
			console.log(Array.isArray(complete[y].TotalsPayCodeReplacementItems.WSAMappedPayCodesItem))
			if (Array.isArray(complete[y].TotalsPayCodeReplacementItems.WSAMappedPayCodesItem) == true) {
				ReplList = []
				for (let i = 0, l = complete[y].TotalsPayCodeReplacementItems.WSAMappedPayCodesItem.length; i < l; i++) {

					if (i === 0){
					ReplList.push(
						complete[y].TotalsPayCodeReplacementItems.WSAMappedPayCodesItem[i]['@IntermediatePayCode']
						+
						' : '
						+
						complete[y].TotalsPayCodeReplacementItems.WSAMappedPayCodesItem[i]['@ReplacementPayCode']

					)
					}
					if (i > 0){
						ReplList.push(
							'\n'
							+
							complete[y].TotalsPayCodeReplacementItems.WSAMappedPayCodesItem[i]['@IntermediatePayCode']
							+
							' : '
							+
							complete[y].TotalsPayCodeReplacementItems.WSAMappedPayCodesItem[i]['@ReplacementPayCode']
											
	
						)
						}
				}

				complete[y].TotalsPayCodeReplacementItems = ReplList
			}

			else {
				console.log('true1')
				complete[y].TotalsPayCodeReplacementItems =
					complete[y].TotalsPayCodeReplacementItems.WSAMappedPayCodesItem['@IntermediatePayCode']
					+
					' : '
					+
					complete[y].TotalsPayCodeReplacementItems.WSAMappedPayCodesItem['@ReplacementPayCode']

				console.log(JSON.stringify(complete[y].TotalsPayCodeReplacementItems))
			}

		}

	}
	//----------------------------------------------------------------------------Reformat Types
	for (let y = 0, x = complete.length; y < x; y++) {
		if (complete[y]['@Type'] == 'C') complete[y]['@Type'] = 'Cascading'
		else if (complete[y]['@Type'] == 'P') complete[y]['@Type'] = 'Regular'
		else if (complete[y]['@Type'] == 'N') complete[y]['@Type'] = 'Duration'
	}

	issuePaycodes = []
	complete = complete.filter(function (value) {
		if (value['@PayUsingWeightedAverageRate'] == true) { issuePaycodes.push(value['@Name']); return false }
		else if (value['@ContributesToWeightedAverageRates'] == true) { issuePaycodes.push(value['@Name']); return false }
		else return true
	}
	)
	console.log(issuePaycodes)

	if (issuePaycodes.length > 0) {
		window.alert('The following Paycodes could not be loaded as they use weighted average calculation: ' + JSON.stringify(issuePaycodes))
	}

	console.log(JSON.stringify(complete))
	FinalArray = complete

	//--------------------------------------------------Create headers and hide columns if needed---------------------------

	headers = []
	console.log(FinalArray)
	try {
		for (let y = 0, x = FinalArray.length; y < x; y++) {
			for (let x = 0, z = FinalArray.length; x < z; x++) {
				headers.push(Object.keys(FinalArray[y])[x])
			}
		}
	}
	catch { window.alert("File is empty");CloseLoadingModal(); return; }


	headers = Array.from(new Set(headers))
	console.log(headers)
	var container = document.getElementById('HandsOnTableValue');
	headers = headers.filter(function (fil) { return fil != null })
	headers.sort(function (x) {

		//----------------------------Headers Override---------------------------------------------------------------------------------------------------------------
		headers =
			[
				//--------------------------------------------------Names and Abbreviations------------
				"@Name",
				"@AbbreviationChar",
				"@TerminalCdNum",
				//--------------------------------------------------Types
				"@Type",
				"@DurationWorkRule",
				"@AmountType",
				//--------------------------------------------------Auto Resolve
				"@AutoResolved",
				"@RequiresMgrApproval",
				"@UnjustAutoResExpAsWorked",
				"@JustAutoResExpAsWorked",

				//-------------------------------------------------Associated PC
				"@AssociatedPayCodeName",
				//-------------------------------------------------Process separately shift
				"@SeparateShiftSw",
				//-------------------------------------------------Replacement items
				"TotalsPayCodeReplacementItems",
				//-------------------------------------------------Multipliers
				"@WageMultiply",
				"@WageAddition",
				//-------------------------------------------------Suite wide options
				//"@IsMoneyCategory",

				"@VisibleInMainArea",
				"@VisibleToUser",
				"@VisibleInReport",
				//--------------------------------------------------Time and Attendance Options

				"@EditAffShfTotal",
				"@EditCntToOt",
				"@EditCntToCdotSw",
				"@EditExcuseAbsn",
				"@PersistPceSw",

				//--------------------------------------------------HCAN
				"@PayrollOnly",
				"@TimekeepingOnly",

				//--------------------------------------------------Schedule hours type
				"@ScheduleHoursType",
				"@CheckAvlbltySw"
			]
	}
	)
	//----------------------------------------------------------------Format data into datatable format

	//--------------------------------------------------------------------Check Boxes:
	boxes =
		[
			"@AutoResolved",
			"@RequiresMgrApproval",
			"@UnjustAutoResExpAsWorked",
			"@JustAutoResExpAsWorked",
			"@SeparateShiftSw",
			"@VisibleInMainArea",
			"@VisibleToUser",
			"@VisibleInReport",
			"@EditAffShfTotal",
			"@EditCntToOt",
			"@EditCntToCdotSw",
			"@EditExcuseAbsn",
			"@PersistPceSw",
			"@PayrollOnly",
			"@TimekeepingOnly",
			"@CheckAvlbltySw"
		]

	console.log(FinalArray)
	FinalArray = Array.from(new Set(FinalArray))
	console.log(JSON.stringify(FinalArray))
	columneditorsettings = []

	checkboxview = document.getElementById("CheckBoxView").checked

	for (let i = 0, l = headers.length; i < l; i++) {

		if (headers[i] == '@Name'){
			columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: false, validator: 'ReservedCharacterValidator' })
		}
		else if (boxes.includes(headers[i]) == true && checkboxview == true) {
			columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: false, type: 'checkbox', renderer: checkRenderer, className: 'htCenter' })
		}
		else if (boxes.includes(headers[i]) == true && checkboxview == false) {
			columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: false, renderer: checktextRenderer })
		}
		else if (headers[i] == 'TotalsPayCodeReplacementItems') {
			columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: false, width: '400', renderer: 'html' })
		}
		else { columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: false }) }
	}

	//---------------------------------------------------Renderer for True False------------------------------------
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

	//----------------------------------------------------Custom Validator
			ReservedCharacterValidator = function (value, callback) {
				regex1 = /[\/\|\\\*\(\)\:\;\#\%\^\?\[\]\=]/g
				setTimeout(function(){
				  if (value.search(regex1) == -1) {
					callback(true);
				  }
				  else {
					callback(false);
				  }
				  
				}, 1000);
			  };
	//----------------------------------------Create Handsontable----------------------------------------------------------------------------
	Handsontable.validators.registerValidator('ReservedCharacterValidator', ReservedCharacterValidator);

	var hot = new Handsontable(container, {
		data: FinalArray,
		startRows: 30,
		minSpareCols: 1,
		minSpareRows: 1,
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
		//stretchH: 'all',
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
	//changedata.itemsRetrieveResponses[SelectedRuleIndex].responseObjectNode.WSACFGPaycodeDistribution.DistributionAssignments.WSACFGDistributionAssignment = []
	data.itemsRetrieveResponses = []
	console.log(JSON.stringify(changedata))


}
//console.log(document.getElementById("example").Handsontable)

document.getElementById("DownloadNewFile").addEventListener("click",function (change_data) {
	loadingmodal.style.display = "block";
	loadingmodal.style.visibility= "visible";
	setTimeout(downloadNewFile,1000,change_data);	
})	 
document.getElementById("DownloadFinalFile").addEventListener("click",function (change_data) {
	loadingmodal.style.display = "block";
	loadingmodal.style.visibility= "visible";
	setTimeout(downloadNewFile,1000,change_data);	
})	 

//console.log(hot.getdata())

//-------------------------------------------------------Save Changes to file-----------------------------------
function downloadNewFile(change_data) {
	changedata.itemsRetrieveResponses = []
	console.log(changedata)
	const fs = require('fs')
	console.log(changedata)
	//var pop = hotdata.getData().pop()
	//var resultdata = hotdata.getData()
	var ObjectArray = []

	var OnlySaveFiltered = document.getElementById("OnlySaveFiltered").checked
	hot2 = hotdata
	console.log(hot)

	if (OnlySaveFiltered == true) {
		hot2.getPlugin('Filters').clearConditions();
		hot2.getPlugin('Filters').filter();
	}

	resultdata = hot2.getData();
	headers = hot2.getColHeader();

	resultdata.splice(-1,1)

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

	console.log(JSON.stringify(resultdata))
	var ConvertedArray = []
	var dataconvert = ObjectArray.map(function (x) {
		name = encodeURI(x['@Name'])

		if (x['@Type'] == 'Cascading') x['@Type'] = 'C'
		else if (x['@Type'] == 'Regular') x['@Type'] = 'P'
		else if (x['@Type'] == 'Duration') x['@Type'] = 'N'

		ReplacementPaycodes = 'notvalid'

		if (x.TotalsPayCodeReplacementItems != null && x.TotalsPayCodeReplacementItems != '') {

			//try {
			console.log('true')
			console.log(x.TotalsPayCodeReplacementItems)
			try {x.TotalsPayCodeReplacementItems = x.TotalsPayCodeReplacementItems.join(',')} catch{}
			x.TotalsPayCodeReplacementItems = x.TotalsPayCodeReplacementItems.replace( /[\r\n]+/gm, "" )
			x.TotalsPayCodeReplacementItems = x.TotalsPayCodeReplacementItems.split(',')
			if (x.TotalsPayCodeReplacementItems.length == 1) {
				console.log('step2')
				Codes = x.TotalsPayCodeReplacementItems[0].split(' : ')
				ReplacementPaycodes =
				{
					"@ReplacementPayCode": Codes[1].replace( /[\r\n]+/gm, "" ),
					"@IntermediatePayCode": Codes[0].replace( /[\r\n]+/gm, "" )
				}

			}
			else if (x.TotalsPayCodeReplacementItems.length > 1) {
				ReplacementPaycodes = []
				for (let i = 0, l = x.TotalsPayCodeReplacementItems.length; i < l; i++) {
					Codes = x.TotalsPayCodeReplacementItems[i].split(' : ')
					ReplacementPaycodes.push(
						{
							"@ReplacementPayCode": Codes[1].replace( /[\r\n]+/gm, "" ),
							"@IntermediatePayCode": Codes[0].replace( /[\r\n]+/gm, "" )
						}
					)
				}
			}
			//}
			//catch (error) {
			//	console.error(error)
			//}
		}


		map =
		{
			"itemDataInfo": {
				"title": x['@Name'],
				"key": name,
				"env": null,
				"urlparams": "Name=" + x['@Name']
			},
			"responseObjectNode": {
				"@Status": "Success",
				"WSAPayCode": {
					"@PersistPceSw": x['@PersistPceSw'],
					"@CalculateAndUseHighestRate": false,
					"@RequiresMgrApproval": x['@RequiresMgrApproval'],
					"@Name": x['@Name'],
					"@AbbreviationChar": x['@AbbreviationChar'],
					"@TerminalCdNum": x['@TerminalCdNum'],
					"@EditCntToCdotSw": x['@EditCntToCdotSw'],
					"@AmountType": x['@AmountType'],
					"@JustAutoResExpAsWorked": x['@JustAutoResExpAsWorked'],
					"TotalsPayCodeReplacementItems": {
						"WSAMappedPayCodesItem": ReplacementPaycodes
					},
					"@VisibleToUser": x['@VisibleToUser'],
					"@VisibleInReport": x['@VisibleInReport'],
					"@SeparateShiftSw": x['@SeparateShiftSw'],
					"@ContributesToWeightedAverageRates": false,
					"@AssociatedPayCodeName": x['@AssociatedPayCodeName'],
					"@PayrollOnly": x['@PayrollOnly'],
					"@WeightedAverageRateContributionsUseAnAdjustedRate": false,
					"@DurationWorkRule": x['@DurationWorkRule'],
					"@EditCntToOt": x['@EditCntToOt'],
					"@WeightedAverageRateIsComputedDaily": false,
					"@TimekeepingOnly": x['@TimekeepingOnly'],
					"@CheckAvlbltySw": x['@CheckAvlbltySw'],
					"@WageMultiply": x['@WageMultiply'],
					"@AutoResolved": x['@AutoResolved'],
					"@HolShiftRule": "",
					"@EditAffShfTotal": x['@EditAffShfTotal'],
					"@WageAddition": x['@WageAddition'],
					"@Type": x['@Type'],
					"@UnjustAutoResExpAsWorked": x['@UnjustAutoResExpAsWorked'],
					"@ScheduleHoursType": x['@ScheduleHoursType'],
					"@VisibleInMainArea": x['@VisibleInMainArea'],
					"@IsMoneyCategory": false,
					"@EditExcuseAbsn": x['@EditExcuseAbsn'],
					"@PayUsingWeightedAverageRate": false
				},
				"@Action": "RetrieveForUpdate"
			}
		}

		console.log(ReplacementPaycodes)
		if (ReplacementPaycodes == 'notvalid') delete map.responseObjectNode.WSAPayCode.TotalsPayCodeReplacementItems
		if (x['@ScheduleHoursType'] == null || x['@ScheduleHoursType'] == '') map.responseObjectNode.WSAPayCode['@ScheduleHoursType'] = ''
		if (x['@DurationWorkRule'] == null || x['@DurationWorkRule'] == '') delete map.responseObjectNode.WSAPayCode['@DurationWorkRule']
		if (x['@AbbreviationChar'] == null || x['@AbbreviationChar'] == '') delete map.responseObjectNode.WSAPayCode['@AbbreviationChar']
		if (x['@TerminalCdNum'] == null || x['@TerminalCdNum'] == '') delete map.responseObjectNode.WSAPayCode['@TerminalCdNum']

		if (x['@Type'] == 'C') {
			map.responseObjectNode.WSAPayCode['@JustAutoResExpAsWorked'] = false
			map.responseObjectNode.WSAPayCode['@RequiresMgrApproval'] = false
			map.responseObjectNode.WSAPayCode['@AutoResolved'] = false
			map.responseObjectNode.WSAPayCode['@UnjustAutoResExpAsWorked'] = false
			map.responseObjectNode.WSAPayCode['@AssociatedPayCodeName'] = ''
			map.responseObjectNode.WSAPayCode['@SeparateShiftSw'] = false
			delete map.responseObjectNode.WSAPayCode.TotalsPayCodeReplacementItems
		}

		if (x['@Type'] == 'N') {
			if (x['@AutoResolved'] == 'false') {
				map.responseObjectNode.WSAPayCode['@JustAutoResExpAsWorked'] = false
				map.responseObjectNode.WSAPayCode['@RequiresMgrApproval'] = false
				map.responseObjectNode.WSAPayCode['@UnjustAutoResExpAsWorked'] = false
				map.responseObjectNode.WSAPayCode['@SeparateShiftSw'] = false
			}
			map.responseObjectNode.WSAPayCode['@AssociatedPayCodeName'] = ''
			map.responseObjectNode.WSAPayCode['@WageAddition'] = 0
			map.responseObjectNode.WSAPayCode['@WageMultiply'] = 1
			map.responseObjectNode.WSAPayCode['@EditCntToOt'] = false
			map.responseObjectNode.WSAPayCode['@EditCntToCdotSw'] = false
			map.responseObjectNode.WSAPayCode['@EditExcuseAbsn'] = false
		}

		if (x['@Type'] == 'P') {
			map.responseObjectNode.WSAPayCode['@JustAutoResExpAsWorked'] = false
			map.responseObjectNode.WSAPayCode['@RequiresMgrApproval'] = false
			map.responseObjectNode.WSAPayCode['@UnjustAutoResExpAsWorked'] = false
			map.responseObjectNode.WSAPayCode['@SeparateShiftSw'] = false
			delete map.responseObjectNode.WSAPayCode.TotalsPayCodeReplacementItems
		}

		if (x['@AmountType'] == 'Day') {
			delete map.responseObjectNode.WSAPayCode['@WageAddition']
			delete map.responseObjectNode.WSAPayCode['@WageMultiply']
			map.responseObjectNode.WSAPayCode['@EditCntToOt'] = false
			map.responseObjectNode.WSAPayCode['@IsMoneyCategory'] = false
		}
		if (x['@AmountType'] == 'Hour') {
			map.responseObjectNode.WSAPayCode['@AssociatedPayCodeName'] = ''
			map.responseObjectNode.WSAPayCode['@IsMoneyCategory'] = false
		}
		if (x['@AmountType'] == 'Money') {
			map.responseObjectNode.WSAPayCode['@IsMoneyCategory'] = true
			map.responseObjectNode.WSAPayCode['@EditAffShfTotal'] = false
			map.responseObjectNode.WSAPayCode['@EditCntToOt'] = false
			map.responseObjectNode.WSAPayCode['@EditCntToCdotSw'] = false
			map.responseObjectNode.WSAPayCode['@PersistPceSw'] = false
			map.responseObjectNode.WSAPayCode['@ScheduleHoursType'] = ''
			map.responseObjectNode.WSAPayCode['@CheckAvlbltySw'] = false
			map.responseObjectNode.WSAPayCode['@AssociatedPayCodeName'] = ''
			map.responseObjectNode.WSAPayCode['@WageAddition'] = 0
			map.responseObjectNode.WSAPayCode['@WageMultiply'] = 1
		}





		if (typeof map != "undefined") {
			console.log(JSON.stringify(map))
			changedata.itemsRetrieveResponses.push(map)
			return map
		}

	}
	)
	//Save Locally.
	console.log(JSON.stringify(changedata))
	console.log(changedata.itemsRetrieveResponses.length)
	fs.renameSync('./RESPONSEJSON/response_PayCodes.json', './RESPONSEJSON/response_PayCodes_old.json')
	changedata.itemsRetrieveResponses =
		Array.from(new Set(changedata.itemsRetrieveResponses))
	fs.writeFileSync('./RESPONSEJSON/response_PayCodes.json', JSON.stringify(changedata));
	//End Save

	//---------------------------------------------------New Zip Stuff-------------------------------------------------

	console.log(change_data.target.id)
	if (change_data.target.id == "DownloadFinalFile") {
		var JSZip = require('jszip')
		var saveAs = require('file-saver');
		var zip = new JSZip();
		zip.file("ExportConfig.json", JSON.stringify(ExportConfig))
		zip.folder("PayCodes")
		zip.folder("PayCodes").file("response.json", JSON.stringify(changedata))
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
	document.getElementById('HandsOnTableValue').style.display = "none"
	document.getElementById("SideBarRight").style.width = "25%"
}))

//--------------------------------------------PayCode QuickAdd
document.getElementById('AddPaycodeID').addEventListener('click', function (event) {
	PCName 			= document.getElementById('PCName').value
	PCType	 		= document.getElementById('PCType').value
	PCUnit	 		= document.getElementById('Unit').value
	PCMultiplier	= parseInt(document.getElementById('Multiplier').value,10)
	PCAddition 		= parseInt(document.getElementById('Addition').value,10)
	PCMain 			= (/true/i).test(document.getElementById('MainArea').value)
	PCTotals 		= (/true/i).test(document.getElementById('Totals').value)
	PCReports 		= (/true/i).test(document.getElementById('Reports').value)
	PCColumns 		= (/true/i).test(document.getElementById('Columns').value)
	PCOvertime 		= (/true/i).test(document.getElementById('Overtime').value)
	PCCDOT	 		= (/true/i).test(document.getElementById('Consecutive').value)
	PCAbsences 		= (/true/i).test(document.getElementById('Absences').value)

insertValue = [PCName,null,null,PCType,null,PCUnit,false,false,false,false,"",false,null,PCMultiplier,PCAddition,PCMain,PCTotals,PCReports,PCColumns,PCOvertime,PCCDOT,PCAbsences,false,false,false,"",false]
hot2=hotdata
console.log(insertValue)

console.log(document.getElementById('Multiplier').value)


var col = hot2.countRows() -1;
hot2.alter('insert_row', col, 1);
for (let i = 0, l = insertValue.length ; i < l; i++) {
    hot2.setDataAtCell(col, i, insertValue[i]);
}

	document.getElementById("SideBarRight").style.width = "0";
	document.getElementById('HandsOnTableValue').style.display = "block"

	document.getElementById('PCName').value = ''
	document.getElementById('PCType').value = 'Regular'
	document.getElementById('Unit').value = 'Hour'
	document.getElementById('Multiplier').value = '1'
	document.getElementById('Addition').value = '0'
	document.getElementById('MainArea').value = 'true'
	document.getElementById('Totals').value  = 'true'
	document.getElementById('Reports').value = 'true'
	document.getElementById('Columns').value = 'true'
	document.getElementById('Overtime').value = 'true'
	document.getElementById('Consecutive').value = 'true'
	document.getElementById('Absences').value = 'true'


})