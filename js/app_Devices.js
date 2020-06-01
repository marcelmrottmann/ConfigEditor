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
var TimeZones;
var TimeZonesConfiguration;
var hot;


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
		const config = require('./RESPONSEJSON/response_Devices.json')
		var global_data = fs.readFileSync("./RESPONSEJSON/response_Devices.json");
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
			var label = zip.readAsText(zipEntry)
			console.log(JSON.parse(label).uniqueKey)
			label = JSON.parse(label).uniqueKey
			console.log(zipEntry.entryName)
			if (zipEntry.entryName == "Devices\\response.json" || zipEntry.entryName == "Devices\Response.json" || label == 'Devices') {console.log('truueuu')
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

			else if (zipEntry.entryName == "KTimeZone\\response.json") {
				var decompressedData = zip.readFile(zipEntry);
				var TZData = zip.readAsText(zipEntry)
				console.log(JSON.parse(TZData));
				TimeZones = JSON.parse(TZData)

			}
			const fs = require('fs')
			try {
				fs.renameSync('./RESPONSEJSON/response_Devices.json', './RESPONSEJSON/response_Devices_old.json')
			}
			catch { 'file not found for rename' }
			fs.writeFileSync('./RESPONSEJSON/response_Devices.json', JSON.stringify(global_data));


		});
	}
	//-------------------------------------------Store TimeZones and Check if Empty
	TimeZonesConfiguration = []
	try{
		console.log(TimeZones.itemsRetrieveResponses.length)
	}
	catch { 
		const fs = require('fs')
		const TZFileAddress = require('./RESPONSEJSON/PROPERTIESJSONS/TIMEZONES.json')
		var TimeZones = fs.readFileSync("./RESPONSEJSON/PROPERTIESJSONS/TIMEZONES.json");
		TimeZones = JSON.parse(TimeZones)
		
	}

	if (TimeZones.itemsRetrieveResponses){
	for (let i = 0, l = TimeZones.itemsRetrieveResponses.length; i < l; i++) {
		TimeZoneString = 
		{
		"TimeZoneName":TimeZones.itemsRetrieveResponses[i].responseObjectNode.KTimeZone['@Name'] ,
		"TimeZoneID":TimeZones.itemsRetrieveResponses[i].responseObjectNode.KTimeZone['@ID']
		}
		TimeZonesConfiguration.push(TimeZoneString)
		}
	}

	console.log(TimeZonesConfiguration)

	//--------------------------------------------Store Data and check if empty-------------------------------

	data = global_data
	console.log(data)
	try { console.log(data.itemsRetrieveResponses.length) }
	catch { window.alert("File is empty");CloseLoadingModal(); return; }
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

function findTimeZone(TZ,SearchString1) { 
  return TZ.TimeZoneID == SearchString1;
}


	Devices = []
	for (let i = 0, l = data.itemsRetrieveResponses.length; i < l; i++) {
		Devices.push({})
		keys = Object.keys(data.itemsRetrieveResponses[i].responseObjectNode)
		values = Object.values(data.itemsRetrieveResponses[i].responseObjectNode)
		for (let y = 0, x = keys.length; y < x; y++) {
			key = keys[y]
			value = values[y]
			if (key == "timeZoneConfiguration"){
				for (let b = 0, c = TimeZonesConfiguration.length; b < c; b++) {
					console.log(TimeZonesConfiguration[b].TimeZoneID)
					console.log(value.timeZone)
					if (TimeZonesConfiguration[b].TimeZoneID.toString() == value.timeZone.toString()){console.log('true')
					  TimeZoneIndex = TimeZonesConfiguration[b].TimeZoneName
					}
				  }
				TimeZoneIndex
				Object.assign(Devices[i], ({ "TimeZone": TimeZoneIndex  }))
				Object.assign(Devices[i], ({ "TimeZoneType": value.timeZoneType  }))
				Object.assign(Devices[i], ({ "DaylightSavings": value.autoAdjustDst  }))
			}
			if (key == "deviceContacts"){
				if (value.length > 0){
					Object.assign(Devices[i], ({ "__children": [] }))
					for (let z = 0, a = value.length; z < a; z++) {
						Devices[i].__children.push({ "ContactName": value[z].name  })
						Object.assign(Devices[i].__children[z], ({ "ContactTitle": value[z].title  }))
						for (let x = 0, y = value[z].contactInfo.length; x < y; x++) {
							Object.assign(Devices[i].__children[z], ({ ['Contact'+value[z].contactInfo[x].contactType]: value[z].contactInfo[x].contact  }))
						}
					}
				}
			}


			else {
			Object.assign(Devices[i], ({ [key]: value }))
			}
		}
	}
	complete = Devices

	
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
				"key",
				"name",
				"description",
				"enabled",
				"deviceType",
				"communicationAddress",
				"communicationType",
				"alerts",
				"deviceProfile",
				"location",
				"firmwareVersion",
				"TimeZone",
				"TimeZoneType",
				"DaylightSavings",
				//"deviceContacts",
				"ContactName",
				"ContactTitle",
				"ContactEMAIL",
				"ContactMOBILEPHONE",
				"ContactHOMEPHONE",
				"ContactWORKPHONE",
				"ContactCUSTOM"
			]
	}
	)
	//----------------------------------------------------------------Format data into datatable format

	//--------------------------------------------------------------------Check Boxes:
	boxes =
		[
			"enabled",
			"DaylightSavings"
		]

	console.log(FinalArray)
	FinalArray = Array.from(new Set(FinalArray))
	console.log(JSON.stringify(FinalArray))
	columneditorsettings = []

	checkboxview = document.getElementById("CheckBoxView").checked

		TimeZoneDropDown = [] 
		for (let i = 0, l = TimeZonesConfiguration.length; i < l; i++) {
			TimeZoneDropDown.push(TimeZonesConfiguration[i].TimeZoneName)
		}



	for (let i = 0, l = headers.length; i < l; i++) {

		if (headers[i] == 'Name'){
			columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: false, validator: 'ReservedCharacterValidator' })
		}
		else if (boxes.includes(headers[i]) == true && checkboxview == true) {
			columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: false, type: 'checkbox', renderer: checkRenderer, className: 'htCenter' })
		}
		else if (boxes.includes(headers[i]) == true && checkboxview == false) {
			columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: false, renderer: checktextRenderer })
		}
		else if (headers[i] == 'communicationType') {
			columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: false,type: 'dropdown', source: ['HOSTNAME','IPv4','IPv6'] })
		}
		else if (headers[i] == 'deviceType') {
			columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: false,type: 'dropdown', source: ['Kronos-4500','Kronos InTouch','Kronos Sirius'] })
		}
		else if (headers[i] == 'alerts') {
			columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: false,type: 'dropdown', source: ['ENABLED','DISABLED'] })
		}
		else if (headers[i] == 'TimeZone') {
			columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: false,type: 'dropdown', source: TimeZoneDropDown })
		}
		else if (headers[i] == 'TimeZoneType') {
			columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: false, type: 'dropdown',source: ['HOST'] })
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
		contextMenu: ['cut', 'copy', 'add_child', 'row_above', 'row_below', 'remove_row', 'undo', 'redo'],
		columnSorting: { sortEmptyCells: true },
		filters: true,
		dropdownMenu: ['---------', 'filter_by_condition', 'filter_by_value', 'filter_action_bar'],
		autocolumnsize: true,
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
		nestedRows:true,
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

	CloseLoadingModal();
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


	resultdata = hotdata.getPlugin("nestedRows").dataManager.data
	headers = hot2.getColHeader();
	

	ObjectArray = resultdata.filter(function(e) {return e.key;})
	console.log(ObjectArray)
	var dataconvert = ObjectArray.map(function (x) {
		name = encodeURI(x.name)

		console.log(x)
		var contactMap = []
		if (x.__children && x.__children.length >= 1){
			contactMap = []
			for (let i = 0, l = x.__children.length; i < l; i++) {
				z = {
					"name": x.__children[i].ContactName,
					"title": x.__children[i].ContactTitle,
					"contactInfo": [{
						"contactType": "EMAIL",
						"contact": x.__children[i].ContactEMAIL
					}, {
						"contactType": "HOMEPHONE",
						"contact": x.__children[i].ContactHOMEPHONE
					}, {
						"contactType": "WORKPHONE",
						"contact": x.__children[i].ContactWORKPHONE
					}, {
						"contactType": "MOBILEPHONE",
						"contact": x.__children[i].ContactMOBILEPHONE
					}, {
						"contactType": "CUSTOM",
						"contact": x.__children[i].ContactCUSTOM
						}]
					}

				if (x.__children[i].ContactEMAIL == '' || x.__children[i].ContactEMAIL == null){delete z.contactInfo[0]}
				if (x.__children[i].ContactHOMEPHONE == '' || x.__children[i].ContactHOMEPHONE == null){delete z.contactInfo[1]}
				if (x.__children[i].ContactWORKPHONE == '' || x.__children[i].ContactWORKPHONE == null){delete z.contactInfo[2]}
				if (x.__children[i].ContactMOBILEPHONE == '' || x.__children[i].ContactMOBILEPHONE == null){delete z.contactInfo[3]}
				if (x.__children[i].ContactCUSTOM == '' || x.__children[i].ContactCUSTOM == null){delete z.contactInfo[4]}

				function bouncer(array) {
                    return array.filter(function(e) {
                      return e;
                    });
                  }
				  
				  z.contactInfo = bouncer(z.contactInfo)
				  contactMap.push(z)
				}
		}

		console.log(TimeZonesConfiguration)
		TimeZoneIndex
		for (let b = 0, c = TimeZonesConfiguration.length; b < c; b++) {
			//console.log(TimeZonesConfiguration[b].TimeZoneName)
			//console.log(x.TimeZone)
		
			if (TimeZonesConfiguration[b].TimeZoneName == x.TimeZone){console.log('true',b)
			  TimeZoneIndex = TimeZonesConfiguration[b].TimeZoneID
			}
			
		  }
		  if (TimeZoneIndex == '' || TimeZoneIndex == null){TimeZoneIndex = TimeZonesConfiguration[0].TimeZoneID}

console.log(x.DaylightSavings)
		map =
		{
			"itemDataInfo": {
				"title": x.name,
				"key": x.key,
				"env": null,
				"urlparams": "key="+x.key+"&"+"name="+name
			},
			"responseObjectNode": {
				"key": x.key,
				"name": x.name,
				"description": x.description,
				"enabled": x.enabled,
				"deviceType": x.deviceType,
				"communicationAddress": x.communicationAddress,
				"communicationType": x.communicationType,
				"alerts": x.alerts,
				"deviceProfile": x.deviceProfile,
				"location": x.location,
				"deviceContacts": contactMap,
				"firmwareVersion": x.firmwareVersion,
				"timeZoneConfiguration": {
					"timeZone": TimeZoneIndex.toString(),
					"timeZoneType": x.TimeZoneType,
					"autoAdjustDst": x.DaylightSavings
				}
			}
		}
		if (map.responseObjectNode.firmwareVersion == '' || map.responseObjectNode.firmwareVersion == null)
				{map.responseObjectNode.firmwareVersion = null}

		if (map.responseObjectNode.location == '' || map.responseObjectNode.location == null)
				{map.responseObjectNode.location = null}


		if (map.responseObjectNode.timeZoneConfiguration.timeZoneType == '' || map.responseObjectNode.timeZoneConfiguration.timeZoneType == null)
				{map.responseObjectNode.timeZoneConfiguration.timeZoneType = "HOST"}

		if ((x.DaylightSavings == '' || x.DaylightSavings == null) && x.DaylightSavings != false)
				{map.responseObjectNode.timeZoneConfiguration.autoAdjustDst = true}
	
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
	fs.renameSync('./RESPONSEJSON/response_Devices.json', './RESPONSEJSON/response_Devices_old.json')
	changedata.itemsRetrieveResponses =
		Array.from(new Set(changedata.itemsRetrieveResponses))
	fs.writeFileSync('./RESPONSEJSON/response_Devices.json', JSON.stringify(changedata));
	//End Save

	//---------------------------------------------------New Zip Stuff-------------------------------------------------

	console.log(change_data.target.id)
	if (change_data.target.id == "DownloadFinalFile") {
		var JSZip = require('jszip')
		var saveAs = require('file-saver');
		var zip = new JSZip();
		zip.file("ExportConfig.json", JSON.stringify(ExportConfig))
		zip.folder("Devices")
		zip.folder("Devices").file("response.json", JSON.stringify(changedata))
		datetimestamp = Date.now()
		zip.generateAsync({ type: "blob" })
			.then(function (blob) {
				saveAs(blob, "PCDEditorExport_" + datetimestamp + ".zip");
			});
	}

	//---------------------------------------------------End of New Zip Stuff--------------------------------------------

CloseLoadingModal();
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
/*
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
*/