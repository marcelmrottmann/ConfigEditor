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
  
	input.on('data', function(data) {
	  remaining += data;
	  var index = remaining.indexOf('\n');
	  var last  = 0;
	  while (index > -1) {
		var line = remaining.substring(last, index);
		last = index + 1;
		func(line);
		index = remaining.indexOf('\n', last);
	  }
  
	  remaining = remaining.substring(last);
	});
  
	input.on('end', function() {
	  if (remaining.length > 0) {
		func(remaining);
	  }
	});
  }



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

	inputFileType = document.getElementById("inputFileName").options[document.getElementById("inputFileName").selectedIndex].value
	console.log(inputFileType)
	//inputFileName = inputFileName
	//console.log(inputFileName)


	//--------------------------------------------Require functions----------------------------------------------
	console.log(SDMZipFileName)
	var firstBy = require('thenby');
	var AdmZip = require('adm-zip');
	var SDMZipFileName = document.getElementById("ChooseFile").value
	//--------------------------------------------Get files--------------------------------------------
	if (inputFileType == 'WFD') {


		console.log(currentFile)
		console.log(SDMZipFileName)
		if (currentFile == SDMZipFileName) {
			const fs = require('fs')
			const config = require('./RESPONSEJSON/ARresponse.json')
			var global_data = fs.readFileSync("./RESPONSEJSON/ARresponse.json");
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
				if (zipEntry.entryName == "AdjustmentRule\\response.json" || zipEntry.entryName == "AdjustmentRule\response.json" || zipEntry.entryName == "AdjustmentRule/response.json") {
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
					fs.renameSync('./RESPONSEJSON/ARresponse.json', './RESPONSEJSON/ARresponse_old.json')
				}
				catch { 'file not found for rename' }
				fs.writeFileSync('./RESPONSEJSON/ARresponse.json', JSON.stringify(global_data));


			});
		}
	}
	//-----------------------------------------------New XML STUFF---------------
	console.log(inputFileType)
	console.log(SDMZipFileName)


	if (inputFileType == 'WFC') {
		
		console.log('true')
		var AdjustmentRuleData;
		var propertiesfordate

		var zip = new AdmZip(SDMZipFileName)
		var zipEntries = zip.getEntries();
		zipEntries.forEach(function (zipEntry) {
			console.log(zipEntry.entryName)
			if (zipEntry.entryName == "Settings.properties") {
				propertiesfordate =	zip.readAsText(zipEntry).split('\n')
			}
			else if (zipEntry.entryName == "AdjustmentRule.xml"){
				AdjustmentRuleData =	zip.readAsText(zipEntry)
			}
			}
		)

		DateProperties = {}
		for (let i = 0, l = propertiesfordate.length; i < l; i++) {
			props =	
			propertiesfordate[i].split('=')
			props = {[props[0]]:props[1]}
			console.log(props)
			propertiesfordate[i] = props
			Object.assign(DateProperties,props)
		}
		console.log(propertiesfordate)
		console.log(DateProperties)

		//const config = require('fs').readFileSync(SDMZipFileName, 'utf8')
		var convert = require('xml-js');

		config = AdjustmentRuleData	

		console.log(config)
		var result = convert.xml2json(config, { compact: true, spaces: 4 });
		result = JSON.parse(result)

		console.log(result.root.Kronos_WFC[0].Response[1].AdjustmentRule)
		console.log(result.root.Kronos_WFC)
		var format = require('date-format');

		JWRAPPER =
		{
			"id": 83,
			"name": "Adjustment Rules",
			"uniqueKey": "AdjustmentRule",
			"itemsRetrieveResponseDTOs": [],
			"itemsRetrieveResponses": [],
			"additionalProperties": {},
			"setupItemDTO": null,
			"restProperties": null
		}
		for (let i = 0, l = result.root.Kronos_WFC.length; i < l; i++) {
			name = encodeURI(result.root.Kronos_WFC[i].Response[1].AdjustmentRule._attributes.Name)
			JSONMAP =
			{
				"itemDataInfo": {
					"title": result.root.Kronos_WFC[i].Response[1].AdjustmentRule._attributes.Name,
					"key": name,
					"env": null,
					"urlparams": "key=" + name + "name=" + name
				},
				"responseObjectNode": {
					"name": result.root.Kronos_WFC[i].Response[1].AdjustmentRule._attributes.Name,
					"ruleVersions": {
						"adjustmentRuleVersion": []
					}
				}
			}

			c = result.root.Kronos_WFC[i].Response[1].AdjustmentRule.RuleVersions.RuleVersion
			if (typeof c == 'object') {
				console.log(c)
				//try {
					if (c instanceof Array != true) {
						c = []
						c.push(result.root.Kronos_WFC[i].Response[1].AdjustmentRule.RuleVersions.RuleVersion)
						console.log(c)
					}
				//}
				//catch{ }
			}


			DateFormat = DateProperties['site.local.LONG_DATE']
			for (let a = 0, b = c.length; a < b; a++) {		
		try{
				moment = require('moment')
					c[a]._attributes.ExpirationDate = moment(c[a]._attributes.ExpirationDate,DateFormat).format("YYYY-MM-DD")				
					c[a]._attributes.EffectiveDate = moment(c[a]._attributes.EffectiveDate,DateFormat).format("YYYY-MM-DD")
					if (c[a]._attributes.EffectiveDate == '1753-01-01') {c[a]._attributes.EffectiveDate = '1900-01-01'}
		}
		catch{	window.alert('settings.properties File not Found in .Zip - Cannot reformat Date - Please provide correct Zip File');CloseLoadingModal() ;return}

				VERSIONMAP =
				{
					"expirationDate": c[a]._attributes.ExpirationDate,
					"effectiveDate": c[a]._attributes.EffectiveDate,
					"description": c[a]._attributes.Description,
					"triggers": {
						"adjustmentTriggerForRule": []
					}
				}
				if (typeof c[a].Triggers.AdjustmentTriggerForRule == 'object') {
					console.log(c[a].Triggers.AdjustmentTriggerForRule)

						if (c[a].Triggers.AdjustmentTriggerForRule instanceof Array != true) {
							tempStor = c[a].Triggers.AdjustmentTriggerForRule
							c[a].Triggers.AdjustmentTriggerForRule = []
							c[a].Triggers.AdjustmentTriggerForRule.push(tempStor)
						}

				}
				console.log(c[a].Triggers)
				if (c[a].Triggers.AdjustmentTriggerForRule) {
					for (let d = 0, e = c[a].Triggers.AdjustmentTriggerForRule.length; d < e; d++) {
						dtriggers = c[a].Triggers.AdjustmentTriggerForRule[d]

						payCodesArray = []
						console.log(dtriggers.PayCodes)

						if (dtriggers.PayCodes && dtriggers.PayCodes.SimpleValue) {
							if (dtriggers.PayCodes.SimpleValue instanceof Array == true) {
								payCodesArray = dtriggers.PayCodes.SimpleValue.map(function (x) {
									y = {
										"qualifier": x._attributes.Value,
										"name": x._attributes.Value
									}
									return y
								})
							}
							else payCodesArray = [
								{
									"qualifier": dtriggers.PayCodes.SimpleValue._attributes.Value,
									"name": dtriggers.PayCodes.SimpleValue._attributes.Value
								}]
						}
						console.log(dtriggers.AdjustmentAllocation.AdjustmentAllocation._attributes)
						if (dtriggers.AdjustmentAllocation.AdjustmentAllocation._attributes.Type == 'FlatRate') { dtriggers.AdjustmentAllocation.AdjustmentAllocation._attributes.Type = 'Flat Rate' }
						if (dtriggers.AdjustmentAllocation.AdjustmentAllocation._attributes.TimePeriod == 'PayPeriod'){dtriggers.AdjustmentAllocation.AdjustmentAllocation._attributes.TimePeriod = 'Pay Period'}
						if (dtriggers.AdjustmentAllocation.AdjustmentAllocation._attributes.OncePerDay == '' ||
							dtriggers.AdjustmentAllocation.AdjustmentAllocation._attributes.OncePerDay ==null){dtriggers.AdjustmentAllocation.AdjustmentAllocation._attributes.OncePerDay = false}

							jobOrLocationEffectiveDate = new Date().toISOString().substring(0,10)

						TRIGGERMAP = {
							"adjustmentAllocation": {
								"adjustmentAllocation": {
									"adjustmentType": dtriggers.AdjustmentAllocation.AdjustmentAllocation._attributes.AdjustmentType,
									//----------------------------------------------------------Bonus
									"bonusRateAmount": dtriggers.AdjustmentAllocation.AdjustmentAllocation._attributes.BonusRateAmount,
									"bonusRateHourlyRate": dtriggers.AdjustmentAllocation.AdjustmentAllocation._attributes.BonusRateHourlyRate,
									"oncePerDay": dtriggers.AdjustmentAllocation.AdjustmentAllocation._attributes.OncePerDay,
									"payCode": {
										"qualifier": dtriggers.AdjustmentAllocation.AdjustmentAllocation._attributes.PayCode,
										"name": dtriggers.AdjustmentAllocation.AdjustmentAllocation._attributes.PayCode
									},
									"timePeriod": dtriggers.AdjustmentAllocation.AdjustmentAllocation._attributes.TimePeriod,
									"weekStart": dtriggers.AdjustmentAllocation.AdjustmentAllocation._attributes.WeekStart,
									"jobCodeType": dtriggers.AdjustmentAllocation.AdjustmentAllocation._attributes.LaborAccountType,
									"jobOrLocation": {
										"qualifier": dtriggers.AdjustmentAllocation.AdjustmentAllocation._attributes.LaborAccount,
										"name": dtriggers.AdjustmentAllocation.AdjustmentAllocation._attributes.LaborAccount
									},
									"timeAmountMinimumTime": dtriggers.AdjustmentAllocation.AdjustmentAllocation._attributes.TimeAmountMinimumTime,
									"timeAmountMaximumAmount":  dtriggers.AdjustmentAllocation.AdjustmentAllocation._attributes.TimeAmountMaximumAmount,
									"timeAmountMaximumTime": dtriggers.AdjustmentAllocation.AdjustmentAllocation._attributes.TimeAmountMaximumTime,
									//----------------------------------------------------------Wage
									"amount": dtriggers.AdjustmentAllocation.AdjustmentAllocation._attributes.Amount,
									"type": dtriggers.AdjustmentAllocation.AdjustmentAllocation._attributes.Type,
									"overrideIfPrimaryJobSwitch": dtriggers.AdjustmentAllocation.AdjustmentAllocation._attributes.OverrideIfHomeSwitch,
									"useHighestWageSwitch": dtriggers.AdjustmentAllocation.AdjustmentAllocation._attributes.UseHighestWageSwitch
								}
							},
							"jobOrLocation": {
								"qualifier": dtriggers._attributes.JobCode,
								"name": dtriggers._attributes.JobCode
							},
							"jobOrLocationEffectiveDate": jobOrLocationEffectiveDate,
							"laborCategoryEntries": dtriggers._attributes.LaborAccountPattern,
							"matchAnywhere": false,
							"costCenter": "",
							"payCodes": payCodesArray,
							"versionNum": dtriggers._attributes.SequenceNumber
						}
						VERSIONMAP.triggers.adjustmentTriggerForRule.push(TRIGGERMAP)
					}
				}
				JSONMAP.responseObjectNode.ruleVersions.adjustmentRuleVersion.push(VERSIONMAP)
			}
			JWRAPPER.itemsRetrieveResponses.push(JSONMAP)
		}
		console.log(JWRAPPER)
		global_data = JWRAPPER

		const fs = require('fs')
		try {
			fs.renameSync('./RESPONSEJSON/ARresponse.json', './RESPONSEJSON/ARresponse_old.json')
		}
		catch { 'file not found for rename' }
		fs.writeFileSync('./RESPONSEJSON/ARresponse.json', JSON.stringify(global_data));

		document.getElementById("inputFileName").value = 'WFD'

	}

	data = global_data

	//--------------------------------------------Store Data and check if empty-------------------------------

	console.log(data)
	try {
		console.log(
			data.itemsRetrieveResponses[0].responseObjectNode.ruleVersions.adjustmentRuleVersion.length)
	}
	catch { window.alert("File is empty");CloseLoadingModal(); return; }
	//document.getElementById("ruleName").value = data.itemsRetrieveResponses[0].itemDataInfo.title;
	//---------------------------------------------Get Selected Option-------------------------------------

	var f = document.getElementById("ruleVersion");
	console.log((f.options[0]))
	console.log(f.options[f.selectedIndex].text)
	if (document.getElementById("ruleVersion").options[document.getElementById("inputFileName").selectedIndex].value != "Date Version")
		var SelectedRuleVersion = f.options[f.selectedIndex].text;
	console.log(SelectedRuleVersion)

	var e = document.getElementById("ruleName");
	console.log(e.options[e.selectedIndex].text)
	if (document.getElementById("ruleName").options[document.getElementById("inputFileName").selectedIndex].value != "Rule Name Here")
		var SelectedRuleName = e.options[e.selectedIndex].text;
	console.log(SelectedRuleName)


	
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


	//---------------------------------------------Empty Drop Down-------------------------------------
	var select = document.getElementById("ruleName");
	var length = select.options.length;
	for (i = length - 1; i >= 0; i--) {
		select.options[i] = null;
	}

	function emptyVersionDropDown() {
		var select = document.getElementById("ruleVersion");
		var length = select.options.length;
		for (i = length - 1; i >= 0; i--) {
			select.options[i] = null;
		}
	}
	emptyVersionDropDown()

	//---------------------------------------------Fill Drop Down-------------------------------------
	for (let i = 0, l = data.itemsRetrieveResponses.length; i < l; i++) {
		value = data.itemsRetrieveResponses[i].itemDataInfo.title.replace(/[.*+\-?^${}()|[\]\\]/g, '_')
		var x = document.getElementById("ruleName");
		var option = document.createElement("option");
		option.text = value;
		x.add(option);
	}

	//---------------------------------------------Get Selected Option Index---------------------------
	SelectedRuleIndex = 0
	SelectedRuleName = SelectedRuleName.replace(/[.*\-?^${}()|[\]\\]/g, '_')
	for (let i = 0, l = data.itemsRetrieveResponses.length; i < l; i++) {
		value = data.itemsRetrieveResponses[i].itemDataInfo.title.replace(/[.*\-?^${}()|[\]\\]/g, '_')
		console.log(value)
		console.log(SelectedRuleName)
		if (value == SelectedRuleName) { SelectedRuleIndex = i; console.log('index' + i) }

	}
	console.log(SelectedRuleName)
	FinalSelectedValue = ""
	if (SelectedRuleName == "Rule Name Here" || SelectedRuleName == null) {console.log('ttruururuu')
		console.log(data.itemsRetrieveResponses[0].itemDataInfo.title.replace(/[.*\-?^${}()|[\]\\]/g, '_'))
		FinalSelectedValue = data.itemsRetrieveResponses[0].itemDataInfo.title.replace(/[.*\-?^${}()|[\]\\]/g, '_')
	}
	else {
		FinalSelectedValue = SelectedRuleName.replace(/[.*\-?^${}()|[\]\\]/g, '_')
	}


	//--------------------------------------------Fill Versions Dropdown
	VersionValue = ""
	emptyVersionDropDown()
	console.log(data.itemsRetrieveResponses[SelectedRuleIndex]
		.responseObjectNode
		.ruleVersions
		.adjustmentRuleVersion)
		console.log(data.itemsRetrieveResponses[SelectedRuleIndex])

	for (let i = 0, l =
		data.itemsRetrieveResponses[SelectedRuleIndex]
			.responseObjectNode
			.ruleVersions
			.adjustmentRuleVersion
			.length; i < l; i++) {

		value =
			data.itemsRetrieveResponses[SelectedRuleIndex]
				.responseObjectNode
				.ruleVersions
				.adjustmentRuleVersion[i].effectiveDate
			+ ' - ' +
			data.itemsRetrieveResponses[SelectedRuleIndex]
				.responseObjectNode
				.ruleVersions
				.adjustmentRuleVersion[i].expirationDate

		VersionValue = value
		console.log(VersionValue)
		var x = document.getElementById("ruleVersion");
		var option = document.createElement("option");
		option.text = value;
		x.add(option);
	}

	console.log(VersionValue)
	FinalSelectedVersion = ""
	var versionSelect = document.getElementById("ruleVersion");
	var versionLength = versionSelect.options.length;

	SelectedVersionIndex = 0
	versionArray = []

	console.log(versionArray)

	for (let i = 0, l = versionSelect.options.length; i < l; i++) {
		versionArray.push(versionSelect.options[i].value)
	}

	console.log(versionSelect.options)

	if (SelectedRuleVersion == "Date Version" || SelectedRuleVersion == null)
		FinalSelectedVersion = VersionValue


	else if (versionArray.includes(SelectedRuleVersion) == false) {
		FinalSelectedVersion = VersionValue
	}
	else FinalSelectedVersion = SelectedRuleVersion

	console.log(versionSelect.options)
	for (let i = 0, l = versionSelect.options.length; i < l; i++) {
		if (versionSelect.options[i].value == FinalSelectedVersion) {
			SelectedVersionIndex = i; console.log(i)
		}
	}


	console.log(SelectedRuleVersion)




	//---------------------------------------------Set Selected Option-----------------------------
	console.log(SelectedRuleIndex)
	document.getElementById("ruleName").value = FinalSelectedValue;
	console.log(FinalSelectedVersion)
	document.getElementById("ruleVersion").value = FinalSelectedVersion;
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

	for (let i = 0, l = data.itemsRetrieveResponses[SelectedRuleIndex]
		.responseObjectNode
		.ruleVersions
		.adjustmentRuleVersion[SelectedVersionIndex].triggers.adjustmentTriggerForRule.length; i < l; i++) {
		headers.push(data.itemsRetrieveResponses[SelectedRuleIndex].responseObjectNode.ruleVersions.adjustmentRuleVersion[SelectedVersionIndex].triggers.adjustmentTriggerForRule[i])
		//console.log(data.itemsRetrieveResponses[SelectedRuleIndex].responseObjectNode.ruleVersions.adjustmentRuleVersion[SelectedVersionIndex].triggers.adjustmentTriggerForRule[i])
	}
	console.log(data.itemsRetrieveResponses[SelectedRuleIndex].responseObjectNode.ruleVersions.adjustmentRuleVersion[SelectedVersionIndex].triggers)
	console.log(JSON.stringify(headers))


	for (let i = 0, l = headers.length; i < l; i++) {
		console.log(headers[i].adjustmentAllocation.adjustmentAllocation.adjustmentType)
		if (headers[i].adjustmentAllocation.adjustmentAllocation.adjustmentType == 'Bonus') {

			x =
			{

				"adjustmentType": headers[i].adjustmentAllocation.adjustmentAllocation.adjustmentType,
				"jobCodeType": headers[i].adjustmentAllocation.adjustmentAllocation.jobCodeType,
				"BonusPayCode": headers[i].adjustmentAllocation.adjustmentAllocation.payCode.qualifier,
				"bonusRateAmount": headers[i].adjustmentAllocation.adjustmentAllocation.bonusRateAmount,
				"bonusRateHourlyRate": headers[i].adjustmentAllocation.adjustmentAllocation.bonusRateHourlyRate,
				"timePeriod": headers[i].adjustmentAllocation.adjustmentAllocation.timePeriod,
				"oncePerDay": headers[i].adjustmentAllocation.adjustmentAllocation.oncePerDay,
				"timeAmountMaximumTime": headers[i].adjustmentAllocation.adjustmentAllocation.timeAmountMaximumTime,
				"timeAmountMaximumAmount": headers[i].adjustmentAllocation.adjustmentAllocation.timeAmountMaximumAmount,
				"timeAmountMinimumTime": headers[i].adjustmentAllocation.adjustmentAllocation.timeAmountMinimumTime,
				"jobOrLocation": headers[i].jobOrLocation.qualifier,
				"jobOrLocationEffectiveDate": headers[i].jobOrLocationEffectiveDate,
				"matchAnywhere": headers[i].matchAnywhere,
				"laborCategoryEntries": headers[i].laborCategoryEntries,
				"costCenter": headers[i].costCenter,
				"weekStart": headers[i].adjustmentAllocation.adjustmentAllocation.weekStart,
				"OrderNum": headers[i].versionNum
			}

			if (headers[i].adjustmentAllocation.adjustmentAllocation.jobOrLocation) {
				Object.assign(x, { "SpecifiedJobOrLocation": headers[i].adjustmentAllocation.adjustmentAllocation.jobOrLocation.qualifier })

			}

			if (headers[i].payCodes) {
				if (headers[i].payCodes.length == 1) {
					Object.assign(x, { "payCodes": headers[i].payCodes[0].qualifier })
				}


				else {
					PayCodes = []
					for (let x = 0, y = headers[i].payCodes.length; x < y; x++) {
						PayCodes.push(headers[i].payCodes[x].qualifier)
					}
					PayCodes = PayCodes.join(',')
					Object.assign(x, { "payCodes": PayCodes })
				}
			}
			complete.push(x)
		}
		else {
			x =
			{
				"adjustmentType": headers[i].adjustmentAllocation.adjustmentAllocation.adjustmentType,
				"amount": headers[i].adjustmentAllocation.adjustmentAllocation.amount,
				"overrideIfPrimaryJobSwitch": headers[i].adjustmentAllocation.adjustmentAllocation.overrideIfPrimaryJobSwitch,
				"type": headers[i].adjustmentAllocation.adjustmentAllocation.type,
				"useHighestWageSwitch": headers[i].adjustmentAllocation.adjustmentAllocation.useHighestWageSwitch,
				"jobOrLocation": headers[i].jobOrLocation.qualifier,
				"jobOrLocationEffectiveDate": headers[i].jobOrLocationEffectiveDate,
				"matchAnywhere": headers[i].matchAnywhere,
				"laborCategoryEntries": headers[i].laborCategoryEntries,
				"costCenter": headers[i].costCenter,
				"OrderNum": headers[i].versionNum

			}

			if (headers[i].payCodes) {
				if (headers[i].payCodes.length == 1) {
					Object.assign(x, { "payCodes": headers[i].payCodes[0].qualifier })
				}


				else {
					PayCodes = []
					for (let x = 0, y = headers[i].payCodes.length; x < y; x++) {
						PayCodes.push(headers[i].payCodes[x].qualifier)
					}
					PayCodes = PayCodes.join(',')
					Object.assign(x, { "payCodes": PayCodes })
				}
			}
			complete.push(x)


		}








	}
	console.log(JSON.stringify(complete))
	console.log(complete.length)


	//----------------------------------------------------------------Format data into datatable format
	FinalArray = complete

	try {
		headers = Object.keys(FinalArray[0])
	}
	catch { window.alert("File is empty");console.log('Format Data Into DataTable format issue');CloseLoadingModal(); return; }



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

	allKeys =
		[
			"adjustmentAllocation.adjustmentAllocation.bonusRateAmount",//
			"adjustmentAllocation.adjustmentAllocation.adjustmentType",//
			"adjustmentAllocation.adjustmentAllocation.oncePerDay",//
			"adjustmentAllocation.adjustmentAllocation.payCode.qualifier",//
			"adjustmentAllocation.adjustmentAllocation.payCode.name",//
			"adjustmentAllocation.adjustmentAllocation.timePeriod",//
			"adjustmentAllocation.adjustmentAllocation.jobCodeType",//
			"jobOrLocation.qualifier",//
			"jobOrLocation.name",//
			"jobOrLocationEffectiveDate",//
			"laborCategoryEntries",//
			"versionNum",//
			"matchAnywhere",//
			"adjustmentAllocation.adjustmentAllocation.timeAmountMaximumTime",//
			"adjustmentAllocation.adjustmentAllocation.bonusRateHourlyRate",//
			"adjustmentAllocation.adjustmentAllocation.timeAmountMinimumTime",//
			"adjustmentAllocation.adjustmentAllocation.amount",//
			"adjustmentAllocation.adjustmentAllocation.overrideIfPrimaryJobSwitch",//
			"adjustmentAllocation.adjustmentAllocation.type",//
			"adjustmentAllocation.adjustmentAllocation.useHighestWageSwitch",//
			"adjustmentAllocation.adjustmentAllocation.weekStart",//
			"costCenter",//
			"adjustmentAllocation.adjustmentAllocation.timeAmountMaximumAmount",//
			"adjustmentAllocation.adjustmentAllocation.jobOrLocation.id",//
			"adjustmentAllocation.adjustmentAllocation.jobOrLocation.qualifier",//
			"adjustmentAllocation.adjustmentAllocation.jobOrLocation.name"//
		]


	headers =
		[
			"OrderNum",
			"jobOrLocation",
			"jobOrLocationEffectiveDate",
			"matchAnywhere",
			"laborCategoryEntries",
			"costCenter",
			"payCodes",
			//Type----------------------------------
			"adjustmentType",
			//Wage Adjustment-----------------------
			"type",
			"amount",
			"useHighestWageSwitch",
			"overrideIfPrimaryJobSwitch",
			//Bonus----------------------------------		

			"jobCodeType",
			"SpecifiedJobOrLocation",
			"BonusPayCode",
			"bonusRateAmount",
			"bonusRateHourlyRate",
			"timePeriod",
			"weekStart",
			"oncePerDay",
			"timeAmountMinimumTime",
			"timeAmountMaximumTime",
			"timeAmountMaximumAmount"


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
		if (headers[i] == 'timePeriod') { columneditorsettings.push({ data: headers[i], type: 'dropdown', source: ['Weekly', 'Shift', 'Pay Period'] }) }
		else if (headers[i] == 'jobCodeType') { columneditorsettings.push({ data: headers[i], type: 'dropdown', source: ['Worked', 'Primary', 'Specify'] }) }
		else if (headers[i] == 'type') { columneditorsettings.push({ data: headers[i], type: 'dropdown', source: ['Addition', 'FlatRate', 'Multiplier'] }) }
		else if (headers[i] == 'adjustmentType') { columneditorsettings.push({ data: headers[i], type: 'dropdown', source: ['Bonus', 'Wage'] }) }
		else if (headers[i] == 'oncePerDay' || headers[i] == 'overrideIfPrimaryJobSwitch' || headers[i] == 'useHighestWageSwitch' || headers[i] == 'matchAnywhere') { columneditorsettings.push({ data: headers[i], type: 'dropdown', source: ['true', 'false'] }) }

		else { columneditorsettings.push({ data: headers[i], editor: 'text' }) }
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
	document.getElementById("DownloadtoCSV").addEventListener('click', function () {
		var exportPlugin = hotdata.getPlugin('exportFile');
		exportPlugin.downloadFile('csv', { filename: "AdjustmentRules", columnHeaders: true, });
	});
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
			loadingmodal.style.visibility= "visible";
			setTimeout(AddPaycode,1000,event);	
		})	 
		function AddPaycode(){
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
					if (currentValue == '' || currentValue == null){
						FinalValue = AddPaycodeField.value
					}
					else{
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
	loadingmodal.style.visibility= "visible";
	setTimeout(DeletePayCode,1000,event);	
})	 
function DeletePayCode(){
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

//-------------------------------------------------------Save Changes to file-----------------------------------
function downloadNewFile(change_data) {
	//changedata.itemsRetrieveResponses = []
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

	//console.log(JSON.stringify(resultdata))
	var ConvertedArray = []
	var dataconvert = ObjectArray.map(function (x) {
		name = encodeURI(x['@Name'])

		/*
			[
			"adjustmentAllocation.adjustmentAllocation.bonusRateAmount",//
			"adjustmentAllocation.adjustmentAllocation.adjustmentType",//
			"adjustmentAllocation.adjustmentAllocation.oncePerDay",//
			"adjustmentAllocation.adjustmentAllocation.payCode.qualifier",//
			"adjustmentAllocation.adjustmentAllocation.payCode.name",//
			"adjustmentAllocation.adjustmentAllocation.timePeriod",//
			"adjustmentAllocation.adjustmentAllocation.jobCodeType",//
			"jobOrLocation.qualifier",//
			"jobOrLocation.name",//
			"jobOrLocationEffectiveDate",//
			"laborCategoryEntries",//
			"versionNum",//
			"matchAnywhere",//
			"adjustmentAllocation.adjustmentAllocation.timeAmountMaximumTime",//
			"adjustmentAllocation.adjustmentAllocation.bonusRateHourlyRate",//
			"adjustmentAllocation.adjustmentAllocation.timeAmountMinimumTime",//
			"adjustmentAllocation.adjustmentAllocation.amount",//
			"adjustmentAllocation.adjustmentAllocation.overrideIfPrimaryJobSwitch",//
			"adjustmentAllocation.adjustmentAllocation.type",//
			"adjustmentAllocation.adjustmentAllocation.useHighestWageSwitch",//
			"adjustmentAllocation.adjustmentAllocation.weekStart",//
			"costCenter",//
			"adjustmentAllocation.adjustmentAllocation.timeAmountMaximumAmount",//
			"adjustmentAllocation.adjustmentAllocation.jobOrLocation.id",//
			"adjustmentAllocation.adjustmentAllocation.jobOrLocation.qualifier",//
			"adjustmentAllocation.adjustmentAllocation.jobOrLocation.name"//
			]
		*/

		payCodesArray = 'Empty'
		if (x.payCodes && (x.payCodes != null || x.payCodes != '')) {
			payCodesArray = x.payCodes.split(',').map(function (x) {
				y = {
					"qualifier": x,
					"name": x
				}
				return y
			})
		}

		map =
		{
			"adjustmentAllocation": {
				"adjustmentAllocation": {
					"adjustmentType": x.adjustmentType,
					//----------------------------------------------------------Bonus
					"bonusRateAmount": x.bonusRateAmount,
					"bonusRateHourlyRate": x.bonusRateHourlyRate,
					"oncePerDay": x.oncePerDay,
					"payCode": {
						"qualifier": x.BonusPayCode,
						"name": x.BonusPayCode
					},
					"timePeriod": x.timePeriod,
					"weekStart": x.weekStart,
					"jobCodeType": x.jobCodeType,
					"jobOrLocation": {
						"qualifier": x.SpecifiedJobOrLocation,
						"name": x.SpecifiedJobOrLocation
					},
					"timeAmountMinimumTime": x.timeAmountMinimumTime,
					"timeAmountMaximumAmount": x.timeAmountMaximumAmount,
					"timeAmountMaximumTime": x.timeAmountMaximumTime,
					//----------------------------------------------------------Wage
					"amount": x.amount,
					"type": x.type,
					"overrideIfPrimaryJobSwitch": x.overrideIfPrimaryJobSwitch,
					"useHighestWageSwitch": x.useHighestWageSwitch
					//----------------------------------------------------------VersionNum

				}
			},
			"jobOrLocation": {
				"qualifier": x.jobOrLocation,
				"name": x.jobOrLocation
			},
			"jobOrLocationEffectiveDate": x.jobOrLocationEffectiveDate,
			"laborCategoryEntries": x.laborCategoryEntries,
			"matchAnywhere": x.matchAnywhere,
			"costCenter": x.costCenter,
			"payCodes": payCodesArray,
			"versionNum": x.OrderNum
		}
		console.log(map.payCodes)
		if (map.payCodes == 'Empty') {
			delete map.payCodes
		}

		if (x.adjustmentType == "Bonus") {
			delete map.adjustmentAllocation.adjustmentAllocation.amount
			delete map.adjustmentAllocation.adjustmentAllocation.type
			delete map.adjustmentAllocation.adjustmentAllocation.overrideIfPrimaryJobSwitch
			delete map.adjustmentAllocation.adjustmentAllocation.useHighestWageSwitch
			if (x.timeAmountMinimumTime == '' || x.timeAmountMinimumTime == null) { delete map.adjustmentAllocation.adjustmentAllocation.timeAmountMinimumTime }
			if (x.timeAmountMaximumAmount == '' || x.timeAmountMaximumAmount == null) { delete map.adjustmentAllocation.adjustmentAllocation.timeAmountMaximumAmount }
			if (x.timeAmountMaximumTime == '' || x.timeAmountMaximumTime == null) { delete map.adjustmentAllocation.adjustmentAllocation.timeAmountMaximumTime }
			if (x.SpecifiedJobOrLocation == '' || x.SpecifiedJobOrLocation == null) { delete map.adjustmentAllocation.adjustmentAllocation.jobOrLocation }
			if (x.weekStart == '' || x.weekStart == null) { delete map.adjustmentAllocation.adjustmentAllocation.weekStart }
		}
		if (x.adjustmentType == "Wage") {
			delete map.adjustmentAllocation.adjustmentAllocation.bonusRateAmount
			delete map.adjustmentAllocation.adjustmentAllocation.bonusRateHourlyRate
			delete map.adjustmentAllocation.adjustmentAllocation.oncePerDay
			delete map.adjustmentAllocation.adjustmentAllocation.payCode
			delete map.adjustmentAllocation.adjustmentAllocation.timePeriod
			delete map.adjustmentAllocation.adjustmentAllocation.weekStart
			delete map.adjustmentAllocation.adjustmentAllocation.jobCodeType
			delete map.adjustmentAllocation.adjustmentAllocation.jobOrLocation
			delete map.adjustmentAllocation.adjustmentAllocation.timeAmountMinimumTime
			delete map.adjustmentAllocation.adjustmentAllocation.timeAmountMaximumAmount
			delete map.adjustmentAllocation.adjustmentAllocation.timeAmountMaximumTime
		}
		if (x.costCenter == '' || x.costCenter == null) {
			delete map.costCenter
		}
		if (x.jobOrLocation == '' || x.jobOrLocation == null) {
			map.jobOrLocation = {}
		}
		console.log(changedata)
		console.log(SelectedRuleIndex)
		console.log(SelectedVersionIndex)

		if (typeof map != "undefined") {
			console.log(JSON.stringify(map))
			console.log(JSON.stringify(changedata))
			changedata.itemsRetrieveResponses[SelectedRuleIndex].responseObjectNode.ruleVersions.adjustmentRuleVersion[SelectedVersionIndex].triggers.adjustmentTriggerForRule.push(map)
			return map
		}

	}
	)
	//Save Locally.
	console.log(JSON.stringify(changedata))
	console.log(changedata.itemsRetrieveResponses.length)
	fs.renameSync('./RESPONSEJSON/ARresponse.json', './RESPONSEJSON/ARresponse_old.json')
	changedata.itemsRetrieveResponses =
		Array.from(new Set(changedata.itemsRetrieveResponses))
	fs.writeFileSync('./RESPONSEJSON/ARresponse.json', JSON.stringify(changedata));
	//End Save

	//---------------------------------------------------New Zip Stuff---------------------------------------------------

	console.log(change_data.target.id)
	if (change_data.target.id == "DownloadFinalFile") {
		var JSZip = require('jszip')
		var saveAs = require('file-saver');
		var zip = new JSZip();
		if (ExportConfig =='' || ExportConfig == null){ExportConfig = {"sourceTenantId":"192.168.33.10","targetTenantId":"C:\\Users\\Marcel Rottmann\\Desktop\\ParagonTransferManager\\XML\\test\\test_1588315981.zip"} }
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
	document.getElementById('HandsOnTableValue').style.display = "none"
	document.getElementById("SideBarRight").style.width = "25%"
}))

