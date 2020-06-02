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
var AccessToken;
var AddOrEdit;
var Complete;
var complete;
var BASEPERSON;
var ADJUSTMENTRULES = [];
//IncludeStatuses = document.getElementById("Status").options[document.getElementById("Status").selectedIndex].value
//StartDate = document.getElementById("From Date").value
//EndDate = document.getElementById("To Date").value
Hyperfind = document.getElementById("Hyperfind").value
var SelectedConnection;
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
//---------------------------------------Empty connections Drop Down
function RemoveNullFromArray(array) {
	return array.filter(function (e) {
		return e;
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
	RefreshConnections()

	//--------------------------------------------Require functions----------------------------------------------
	console.log(SDMZipFileName)
	var firstBy = require('thenby');
	var AdmZip = require('adm-zip');



	//--------------------------------------------Make API CALL---
	var request = require('request');
	var rp = require('request-promise')
	AccessToken = ""
	//	IncludeStatuses = document.getElementById("Status").options[document.getElementById("Status").selectedIndex].value
	//	StartDate = document.getElementById("From Date").value
	//	EndDate = document.getElementById("To Date").value
	Hyperfind = document.getElementById("Hyperfind").value
	console.log(global_data)
	SelectedConnectionName = document.getElementById("Connection").options[document.getElementById("Connection").selectedIndex].value
	SelectedConnection = {}
	for (let i = 0, l = global_data.length; i < l; i++) {
		if (global_data[i].name == SelectedConnectionName) {
			SelectedConnection = global_data[i]
		}
	}



	function Batching(x) {
		console.log(x)
		AccessToken = JSON.parse(x).access_token
		var options2 = {
			'method': 'POST',
			'url': 'https://' + SelectedConnection.url + '/api/v1/commons/hyperfind/execute',
			'headers': {
				'appkey': SelectedConnection.appKey,
				'Authorization': AccessToken,
				'Content-Type': ['application/json']
			},
			body: JSON.stringify({ "dateRange": { "symbolicPeriod": { "id": 1 } }, "hyperfind": { "qualifier": Hyperfind } })

		};
		rp(options2)
			.then(function (parsedBody) {
				console.log(parsedBody)
				Types = document.getElementById('REQUESTTYPE').value
				console.log(Types)
				GETADDITIONALASSIGNMENTS(parsedBody, '/api/v1/commons/persons/adjustment_rule/multi_read', ADJUSTMENTRULES)
				GETBASEPERSON(parsedBody)
				console.log("TOR")

			})
			.catch(function (err) {
				console.log(err)
				window.alert('Parsing Hyperfind Failed ' + err.error)
				CloseLoadingModal()
				return
			});
	}
	function GETBASEPERSON(x) {
		moment = require('moment')
		CurrentDate = moment().format('YYYY-MM-DD')
		x = JSON.parse(x)
		PersonNumbers = []
		for (let i = 0, l = x.result.refs.length; i < l; i++) {
			PersonNumbers.push(x.result.refs[i].qualifier)
		}

		BodyCreator = JSON.stringify(
			{
				"returnUnassignedEmployees": false,
				"where": {
					"employees": {
						"key": "PERSONNUMBER",
						"values": PersonNumbers
					},
					"hyperFindFilter": {
						"dateRange": {
							"symbolicPeriod": {
								"qualifier": "Today"
							}
						},
						"hyperfind": {
							"qualifier": "All Home"
						}
					},
					"snapshotDate": CurrentDate
				}
			}
		)
		var options3 = {
			'method': 'POST',
			'url': 'https://' + SelectedConnection.url + '/api/v1/commons/persons/extensions/multi_read',
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
				BASEPERSON = parsedBody
				RenderHandsOnTable(parsedBody)
			})
			.catch(function (err) {
				console.log(err)
				window.alert('Could not retrieve employee requests ' + err.error)
				CloseLoadingModal()
				return
			});
	}
	function GETADDITIONALASSIGNMENTS(x, y, variable) {
		moment = require('moment')
		CurrentDate = moment().format('YYYY-MM-DD')
		x = JSON.parse(x)
		PersonNumbers = []
		for (let i = 0, l = x.result.refs.length; i < l; i++) {
			PersonNumbers.push(x.result.refs[i].qualifier)
		}
		BatchPersonData = []
		while (PersonNumbers.length) {
			BatchPersonData.push(PersonNumbers.splice(0, 100));
		}
		console.log(BatchPersonData)
		for (let f = 0, g = BatchPersonData.length; f < g; f++) {

			BodyCreator = JSON.stringify(
				{
					"returnUnassignedEmployees": false,
					"where": {
						"employees": {
							"key": "PERSONNUMBER",
							"values": BatchPersonData[f]
						},
						"hyperFindFilter": {
							"dateRange": {
								"symbolicPeriod": {
									"qualifier": "Today"
								}
							},
							"hyperfind": {
								"qualifier": "All Home"
							}
						},
						"snapshotDate": CurrentDate
					}
				}
			)
			var options3 = {
				'method': 'POST',
				'url': 'https://' + SelectedConnection.url + y,
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
					variable.push(JSON.parse(parsedBody))
					//RenderHandsOnTable(parsedBody)
				})
				.catch(function (err) {
					console.log(err)
					window.alert('Could not retrieve Adjustment Rule Assignments ' + err.error)
					CloseLoadingModal()
					return
				});
		}
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
				Batching(parsedBody)

			})
			.catch(function (err) {
				window.alert('Login failed ' + err.error)
				CloseLoadingModal()
				return
			});
	}


	Access()
	function RenderHandsOnTable(x) {

		Types = document.getElementById('REQUESTTYPE').value
		if (Types == "Base Person") {
			console.log('GotThiSFAr')
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

			//console.log(x)
			//if (JSON.parse(x) instanceof Array == true && JSON.parse(x).length == 0) { window.alert('No Requests found in target system'); CloseLoadingModal(); return }
			FinalArray = JSON.parse(BASEPERSON) 
			AdjustmentRuleFinalArray = [].concat.apply([],ADJUSTMENTRULES)


			console.log(FinalArray)

			for (let i = 0, l = FinalArray.length; i < l; i++) {
				g = FinalArray[i]
				Periods = []
				//for (let z = 0, a = g.periods.length; z < a; z++) {
				//		Periods.push(g.periods[z].payCode.qualifier + '-' + g.periods[z].startDate + '-' + g.periods[z].endDate)
				//	}

				//	Periods = Periods.join(',\n')
				try { DisplayProfile = g.allExtension.employeeExtension.preferenceProfileDataEntry.preferenceProfile } catch{ DisplayProfile = "" }


				AdjustmentRule = ""
				for (let y = 0, f = AdjustmentRuleFinalArray.length; y < f; y++) {
					if (AdjustmentRuleFinalArray[y].personIdentity.personNumber == g.allExtension.employeeExtension.personNumber) {
						AdjustmentRule = AdjustmentRuleFinalArray[y].processor
					}
				}


				if (g.allExtension.accrualExtension) {
					if (g.allExtension.accrualExtension.accrualProfilesEntriesForSnapshotDate instanceof Array == true) {
						AccrualProfile = g.allExtension.accrualExtension.accrualProfilesEntriesForSnapshotDate[0].accrualProfileName
					}
					else AccrualProfile = ""
					if (g.allExtension.accrualExtension.fullTimeEquivalencyForExtensionSnapshotDate instanceof Array == true) {
						FTE = g.allExtension.accrualExtension.fullTimeEquivalencyForExtensionSnapshotDate[0].fullTimeEquivalencyPercent
						FTEFTHours = g.allExtension.accrualExtension.fullTimeEquivalencyForExtensionSnapshotDate[0].fullTimeStandardHoursQuantity
						FTEEMPHours = g.allExtension.accrualExtension.fullTimeEquivalencyForExtensionSnapshotDate[0].employeeStandardHoursQuantity
					}
					else { FTE = ""; FTEFTHours = ""; FTEEMPHours = "" }
				}
				if (g.allExtension.timekeepingExtension) {
					if (g.allExtension.timekeepingExtension.baseWagesForExtensionSnapshotDate instanceof Array == true) {
						BaseWage = g.allExtension.timekeepingExtension.baseWagesForExtensionSnapshotDate[0].hourlyRate
					}
					else BaseWage = ""
					if (g.allExtension.timekeepingExtension.accessAssignmentEntriesForSnapshotDate instanceof Array == true) {
						TEType = g.allExtension.timekeepingExtension.accessAssignmentEntriesForSnapshotDate[0].timeEntryType
					}
					else TEType = ""

					if (g.allExtension.timekeepingExtension.employeeTermsForExtensionSnapshotDate instanceof Array == true && g.allExtension.timekeepingExtension.employeeTermsForExtensionSnapshotDate.length > 0) {
						Eterm = g.allExtension.timekeepingExtension.employeeTermsForExtensionSnapshotDate[0].employmentTerm
					}
					else Eterm = ""

					if (g.allExtension.timekeepingExtension.accessAssignmentDetailsDataEntries) {
						SSEWRP = g.allExtension.timekeepingExtension.accessAssignmentDetailsDataEntries.sseWorkRuleProfile
					}
					else SSEWRP = ""

					if (g.allExtension.timekeepingExtension.accessAssignmentDetailsDataEntries) {
						MGRWRP = g.allExtension.timekeepingExtension.accessAssignmentDetailsDataEntries.workRuleProfile
					}
					else MGRWRP = ""

					if (g.allExtension.timekeepingExtension.accessAssignmentDetailsDataEntries) {
						SSEPCP = g.allExtension.timekeepingExtension.accessAssignmentDetailsDataEntries.ssePayCode
					}
					else SSEPCP = ""

					if (g.allExtension.timekeepingExtension.accessAssignmentDetailsDataEntries) {
						MGRPCE = g.allExtension.timekeepingExtension.accessAssignmentDetailsDataEntries.payCodeProfile
					}
					else MGRPCE = ""

					if (g.allExtension.timekeepingExtension.accessAssignmentDetailsDataEntries) {
						MGRPCV = g.allExtension.timekeepingExtension.accessAssignmentDetailsDataEntries.payCodeViewProfile
					}
					else MGRPCV = ""
				}
				if (g.allExtension.schedulingExtension) {
					if (g.allExtension.schedulingExtension.jobTransferForSnapshotDate instanceof Array == true) {
						EmpGroup = g.allExtension.schedulingExtension.jobTransferForSnapshotDate[0].managerAccessEmployeeGroup
					}
					else EmpGroup = ""
					if (g.allExtension.schedulingExtension.jobTransferForSnapshotDate instanceof Array == true) {
						OrgSet = g.allExtension.schedulingExtension.jobTransferForSnapshotDate[0].managerTransferOrganizationSet
					}
					else OrgSet = ""
					if (g.allExtension.schedulingExtension.jobTransferForSnapshotDate instanceof Array == true) {
						JTS = g.allExtension.schedulingExtension.jobTransferForSnapshotDate[0].professionalTransferOrganizationSet
					}
					else JTS = ""
					if (g.allExtension.schedulingExtension.jobTransferForSnapshotDate instanceof Array == true) {
						ManagerAdditionsJTS = g.allExtension.schedulingExtension.jobTransferForSnapshotDate[0].empMgrTransferOrganizationSet
					}
					else ManagerAdditionsJTS = ""
					if (g.allExtension.schedulingExtension.groupAssignmentsForExtensionSnapshotDate instanceof Array == true &&
						g.allExtension.schedulingExtension.groupAssignmentsForExtensionSnapshotDate.length > 0) {
						ScheduleGroupEmp = g.allExtension.schedulingExtension.groupAssignmentsForExtensionSnapshotDate[0].group
					}
					else ScheduleGroupEmp = ""
				}

				if (g.allExtension.deviceExtension) {
					if (g.allExtension.deviceExtension.badgeDetailsForExtensionSnapshotDate instanceof Array == true && g.allExtension.deviceExtension.badgeDetailsForExtensionSnapshotDate.length > 0) {
						BadgeID = g.allExtension.deviceExtension.badgeDetailsForExtensionSnapshotDate[g.allExtension.deviceExtension.badgeDetailsForExtensionSnapshotDate.length - 1].badgeNumber
					}
					else BadgeID = ""
				}

				if (g.allExtension.employeeExtension && g.allExtension.employeeExtension.postalAddressDataEntries) {
					if (g.allExtension.employeeExtension.postalAddressDataEntries instanceof Array == true && g.allExtension.employeeExtension.postalAddressDataEntries.length > 0) {
						city = g.allExtension.employeeExtension.postalAddressDataEntries[0].city
						country = g.allExtension.employeeExtension.postalAddressDataEntries[0].country
						state = g.allExtension.employeeExtension.postalAddressDataEntries[0].state
						zipCode = g.allExtension.employeeExtension.postalAddressDataEntries[0].zipCode
						street = g.allExtension.employeeExtension.postalAddressDataEntries[0].street
					}
					else { city = ""; country = ""; state = ""; zipCode = ""; street = "" }
				}
				else { city = ""; country = ""; state = ""; zipCode = ""; street = "" }

				if (g.allExtension.employeeExtension) {
					if (g.allExtension.employeeExtension.licenseTypeList instanceof Array == true) {
						LicensesCSV = RemoveNullFromArray(g.allExtension.employeeExtension.licenseTypeList
							.map(function (licenseitem) {
								if (
									['Workforce MobileEmployee', 'Workforce TabletEmployee', 'Workforce MobileManager', 'Workforce TabletManager']
										.includes(licenseitem.licenseType) == false
								) { return licenseitem.licenseType }
							})
						)
							.join('|')
					}
					else LicensesCSV = ""

				}
				else LicensesCSV = ""

				if (g.allExtension.employeeExtension) {
					if (g.allExtension.employeeExtension.personCustomDataEntries instanceof Array == true) {
						CDATACSV = RemoveNullFromArray(g.allExtension.employeeExtension.personCustomDataEntries
							.map(function (licenseitem) {
								if (licenseitem.customText != null && licenseitem.customText != '') { return licenseitem.customDataType + ':' + licenseitem.customText }
							})
						)
							.join('|')
					}
					else CDATACSV = ""
				}
				else CDATACSV = ""
				if (!g.allExtension.timekeepingExtension.workEmployee) {
					defaultActivityName = ''
					idleActivityName = ''
					paidActivityName = ''
					unpaidActivityName = ''
					profileName = ''
				}
				else {
					defaultActivityName = g.allExtension.timekeepingExtension.workEmployee.defaultActivityName
					idleActivityName = g.allExtension.timekeepingExtension.workEmployee.idleActivityName
					paidActivityName = g.allExtension.timekeepingExtension.workEmployee.paidActivityName
					unpaidActivityName = g.allExtension.timekeepingExtension.workEmployee.unpaidActivityName
					profileName = g.allExtension.timekeepingExtension.workEmployee.profileName
				}

				if (!g.allExtension.timekeepingExtension.userCurrency) { UserCurrencyCode = '' }
				else { UserCurrencyCode = g.allExtension.timekeepingExtension.userCurrency.currencyCode }

				if (!g.allExtension.employeeExtension.dataAccessGroupsForSnapshotDate) { GDAP = '' }
				else { GDAP = g.allExtension.employeeExtension.dataAccessGroupsForSnapshotDate[0].dataAccessGroup }



				map =
				{
					"PersonNumber": g.allExtension.employeeExtension.personNumber,
					"FirstName": g.allExtension.employeeExtension.firstName,
					"LastName": g.allExtension.employeeExtension.lastName,
					"Middle Initial": g.allExtension.employeeExtension.middleName,
					"Short Name": g.allExtension.employeeExtension.shortName,
					"Birth Date": g.allExtension.employeeExtension.birthDate,
					"UserName": g.allExtension.employeeExtension.userName,
					//"Password": g.allExtension.employeeExtension.password,
					"Display Profile": DisplayProfile,
					"FAP": g.allExtension.employeeExtension.accessProfile,
					"Delegate Profile": g.allExtension.employeeExtension.delegateProfile,
					"Auth Type": g.allExtension.employeeExtension.authenticationType,
					"Locale": g.allExtension.employeeExtension.localeProfile,
					"Logon profile": g.allExtension.employeeExtension.logonProfile,
					"Notification Profile": g.allExtension.employeeExtension.notificationProfile,
					"Accrual Profile": AccrualProfile,
					"Adjustment Rules": AdjustmentRule,
					"TimeZone": g.allExtension.employeeExtension.timeZone,
					"Licenses": LicensesCSV,
					"CustomData": CDATACSV,
					"City": city,
					"Country": country,
					"State": state,
					"ZipCode": zipCode,
					"Street": street,
					"FTE %": FTE,
					"FTE Full Time Hours": FTEFTHours,
					"FTE Employee Hours": FTEEMPHours,
					"Employee Schedule Group": ScheduleGroupEmp,
					"ManagerID": g.allExtension.employeeExtension.supervisorPersonNumber,
					"Base Wage": BaseWage,
					"Currency": g.allExtension.timekeepingExtension.employeeCurrency.currencyCode,
					"Pay Rule": g.allExtension.timekeepingExtension.payRuleName,
					"WorkerType": g.allExtension.timekeepingExtension.workerType,
					"ETerm": Eterm,
					"BadgeID": BadgeID,
					"DeviceGroup": g.allExtension.deviceExtension.deviceGroup,
					"Emp Group": EmpGroup,
					"Org Set": OrgSet,
					"JTS": JTS,
					"Default Activity": defaultActivityName,
					"Idle Activity": idleActivityName,
					"Paid Activity": paidActivityName,
					"Unpaid Activity": unpaidActivityName,
					"Activity Profile": profileName,
					"Employee Process Profile": g.allExtension.employeeExtension.processEmployeeProfile,
					"Manager Process Profile": g.allExtension.employeeExtension.processManagerProfile,
					"Delegate Profile": g.allExtension.employeeExtension.delegateProfile,
					"User Currency": UserCurrencyCode,
					"GDAP": GDAP,
					"JTS Manager Additions": ManagerAdditionsJTS,
					"Shift Template Profile": g.allExtension.schedulingExtension.shiftCode,
					"Pattern Template Profile": g.allExtension.schedulingExtension.schedulePattern,
					"Schedule Group Profile": g.allExtension.schedulingExtension.groupSchedule,
					"Forecast Category Profile": g.allExtension.schedulingExtension.forecastingCategoryProfile,
					"TEType": TEType,
					"Can Approve OT Requests": g.allExtension.timekeepingExtension.accessAssignmentDetailsDataEntries.canApproveOvertime,
					"Employee LC Profile": g.allExtension.timekeepingExtension.accessAssignmentDetailsDataEntries.sseLaborCategoryProfile,
					"Employee LC Profile Manager Additions": g.allExtension.timekeepingExtension.accessAssignmentDetailsDataEntries.sseMgrLaborCategoryProfile,
					"Manager LC Profile": g.allExtension.timekeepingExtension.accessAssignmentDetailsDataEntries.laborCategoryProfile,
					"Report Profile": g.allExtension.timekeepingExtension.accessAssignmentDetailsDataEntries.reportName,
					"Employee Work Rule Profile": SSEWRP,
					"Employee Pay Code Profile": SSEPCP,
					"Manager Work Rule Profile": MGRWRP,
					"Manager Pay Code Edit": MGRPCE,
					"Manager Pay Code View": MGRPCV,
					"ExpectedDaily": g.allExtension.schedulingExtension.expectedDailyHours,
					"ExpectedWeekly": g.allExtension.schedulingExtension.expectedWeeklyHours,
					"ExpectedPayPeriod": g.allExtension.schedulingExtension.expectedByPayPeriodHours



				}
				Complete.push(map)
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

			/*
			headers = [
			"PersonNumber","FullName","UserName","Display Profile","FAP","Accrual Profile","FTE",
			"Base Wage", "Pay Rule","TEType","ETerm","Emp Group","Org Set",
			"JTS","Pattern Template Profile","Shift Template Profile","Schedule Group Profile"
			]
			*/
			for (let i = 0, l = headers.length; i < l; i++) {
				if (headers[i] == 'approve?') { columneditorsettings.push({ data: headers[i], type: 'dropdown', source: ['No Action', 'Approve', 'Refuse', 'Cancel'] }) }
				else if (headers[i] == 'Progress') { columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: true, width: '180' }) }
				else if (headers[i] == "periods") { columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: true, renderer: 'html' }) }
				else { columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: true }) }
			}

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

		var hot = new Handsontable(container, {
			data: FinalArray,
			startRows: 30,
			minSpareCols: 1,
			minSpareRows: 0,
			rowHeaders: true,
			colHeaders: headers,
			columns: columneditorsettings,
			contextMenu: ['cut', 'copy', 'row_above', 'row_below', 'remove_row', 'undo', 'redo', 'hidden_columns_hide', 'hidden_columns_show'],
			columnSorting: { sortEmptyCells: true },
			filters: true,
			dropdownMenu: ['---------', 'filter_by_condition', 'filter_by_value', 'filter_action_bar'],
			//autocolumnsize: true,
			autoRowSize: true,
			manualRowResize: true,
			manualColumnResize: true,
			hiddenColumns: {
				indicators: true
			},
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


		for (let i = 0, l = ObjectArray.length; i < l; i++) {
			if (ObjectArray[i]['approve?'] == "Approve" || ObjectArray[i]['approve?'] == "Refuse" || ObjectArray[i]['approve?'] == "Cancel") {
				console.log(ObjectArray[i])
				console.log(AccessToken)
				hot2.setDataAtCell(i, 1, "In Progress")

				if (ObjectArray[i].RequestType == 'TIME_OFF') {
					if (ObjectArray[i]['approve?'] == "Approve") { StatusToChange = "Approved" }
					else if (ObjectArray[i]['approve?'] == "Refuse") { StatusToChange = "Refused" }
					else if (ObjectArray[i]['approve?'] == "Cancel") { StatusToChange = "Cancelled" }
					var options4 = {
						'method': 'POST',
						'url': 'https://' + SelectedConnection.url + '/api/v1/scheduling/timeoff/apply_update',
						'headers': {
							'appkey': SelectedConnection.appKey,
							'Authorization': AccessToken,
							'Content-Type': ['application/json']
						},
						body: JSON.stringify({ "changeState": { "do": { "toStatus": { "name": StatusToChange } }, "where": { "timeOffRequestId": ObjectArray[i].id } } })

					};
					rp(options4)
						.then(function (parsedBody) {
							ID = JSON.parse(parsedBody).timeOff.id
							for (let iz = 0, lz = ObjectArray.length; iz < lz; iz++) {
								if (ObjectArray[iz].id == ID) {
									hot2.setDataAtCell(iz, 1, StatusToChange)
									hot2.setDataAtCell(iz, 0, "No Action");
									hot2.setCellMeta(iz, 1, 'className', 'GreenCellBackground')
									hot2.render()
								}
							}

							console.log(parsedBody)
							//StartOffAPIS(parsedBody)

						})
						.catch(function (err) {
							console.log('fail')
							console.log(err)
							console.log(JSON.parse(err.options.body).changeState.where.timeOffRequestId)
							ID = JSON.parse(err.options.body).changeState.where.timeOffRequestId
							for (let iz = 0, lz = ObjectArray.length; iz < lz; iz++) {
								if (ObjectArray[iz].id == ID) {
									hot2.setDataAtCell(iz, 1, "Error" + err.error);
									hot2.setDataAtCell(iz, 0, "No Action");
									hot2.setCellMeta(iz, 1, 'className', 'RedCellBackground')
									hot2.render()
								}
							}

						});
				}

				else if (ObjectArray[i].RequestType == 'SCHEDULE_SWAP') {
					if (ObjectArray[i]['approve?'] == "Approve") { StatusToChange = "ApproveByManager" }
					else if (ObjectArray[i]['approve?'] == "Refuse") { StatusToChange = "refuse" }
					//else if (ObjectArray[i]['approve?'] == "Cancel") { StatusToChange = "cancel_by_initiator" }
					var options4 = {
						'method': 'POST',
						'url': 'https://' + SelectedConnection.url + '/api/v1/scheduling/manager_swap/apply_update',
						'headers': {
							'appkey': SelectedConnection.appKey,
							'Authorization': AccessToken,
							'Content-Type': ['application/json']
						},
						body: JSON.stringify(
							{
								"do": {
									"event": StatusToChange
								},
								"where": {
									"requestId": ObjectArray[i].id
								}
							}
						)

					};
					rp(options4)
						.then(function (parsedBody) {
							ID = JSON.parse(parsedBody).timeOff.id
							for (let iz = 0, lz = ObjectArray.length; iz < lz; iz++) {
								if (ObjectArray[iz].id == ID) {
									hot2.setDataAtCell(iz, 1, StatusToChange)
									hot2.setDataAtCell(iz, 0, "No Action");
									hot2.setCellMeta(iz, 1, 'className', 'GreenCellBackground')
									hot2.render()
								}
							}

							console.log(parsedBody)
							//StartOffAPIS(parsedBody)

						})
						.catch(function (err) {
							console.log('fail')
							console.log(err)
							console.log(JSON.parse(err.options.body).where.requestId)
							ID = JSON.parse(err.options.body).where.requestId
							for (let iz = 0, lz = ObjectArray.length; iz < lz; iz++) {
								if (ObjectArray[iz].id == ID) {
									hot2.setDataAtCell(iz, 1, "Error" + err.error);
									hot2.setDataAtCell(iz, 0, "No Action");
									hot2.setCellMeta(iz, 1, 'className', 'RedCellBackground')
									hot2.render()
								}
							}

						});
				}


				else if (ObjectArray[i].RequestType == 'AVAILABILITY_REQUEST') {
					if (ObjectArray[i]['approve?'] == "Approve") { StatusToChange = "ApproveByManager" }
					else if (ObjectArray[i]['approve?'] == "Refuse") { StatusToChange = "refuse" }
					else if (ObjectArray[i]['approve?'] == "Cancel") { StatusToChange = "cancel" }
					var options4 = {
						'method': 'POST',
						'url': 'https://' + SelectedConnection.url + '/api/v1/scheduling/manager_availability_requests/apply_update',
						'headers': {
							'appkey': SelectedConnection.appKey,
							'Authorization': AccessToken,
							'Content-Type': ['application/json']
						},
						body: JSON.stringify(
							{
								"do": {
									"event": StatusToChange
								},
								"where": {
									"requestId": ObjectArray[i].id
								}
							}
						)

					};
					rp(options4)
						.then(function (parsedBody) {
							ID = JSON.parse(parsedBody).timeOff.id
							for (let iz = 0, lz = ObjectArray.length; iz < lz; iz++) {
								if (ObjectArray[iz].id == ID) {
									hot2.setDataAtCell(iz, 1, StatusToChange)
									hot2.setDataAtCell(iz, 0, "No Action");
									hot2.setCellMeta(iz, 1, 'className', 'GreenCellBackground')
									hot2.render()
								}
							}

							console.log(parsedBody)
							//StartOffAPIS(parsedBody)

						})
						.catch(function (err) {
							console.log('fail')
							console.log(err)
							console.log(JSON.parse(err.options.body).where.requestId)
							ID = JSON.parse(err.options.body).where.requestId
							for (let iz = 0, lz = ObjectArray.length; iz < lz; iz++) {
								if (ObjectArray[iz].id == ID) {
									hot2.setDataAtCell(iz, 1, "Error" + err.error);
									hot2.setDataAtCell(iz, 0, "No Action");
									hot2.setCellMeta(iz, 1, 'className', 'RedCellBackground')
									hot2.render()
								}
							}

						});
				}

				else if (ObjectArray[i].RequestType == 'SCHEDULE_OPEN_SHIFT') {
					if (ObjectArray[i]['approve?'] == "Approve") { StatusToChange = "ApproveByManager" }
					else if (ObjectArray[i]['approve?'] == "Refuse") { StatusToChange = "refuse" }
					else if (ObjectArray[i]['approve?'] == "Cancel") { StatusToChange = "cancel" }
					var options4 = {
						'method': 'POST',
						'url': 'https://' + SelectedConnection.url + '/api/v1/scheduling/open_shift_requests/apply_update',
						'headers': {
							'appkey': SelectedConnection.appKey,
							'Authorization': AccessToken,
							'Content-Type': ['application/json']
						},
						body: JSON.stringify(
							{
								"do": {
									"event": StatusToChange
								},
								"where": {
									"requestId": ObjectArray[i].id
								}
							}
						)

					};
					rp(options4)
						.then(function (parsedBody) {
							console.log(parsedBody)

							ID = JSON.parse(parsedBody).openShift.id
							for (let iz = 0, lz = ObjectArray.length; iz < lz; iz++) {
								if (ObjectArray[iz].id == ID) {
									hot2.setDataAtCell(iz, 1, StatusToChange)
									hot2.setDataAtCell(iz, 0, "No Action");
									hot2.setCellMeta(iz, 1, 'className', 'GreenCellBackground')
									hot2.render()
								}
							}

							//StartOffAPIS(parsedBody)

						})
						.catch(function (err) {
							console.log('fail')
							console.log(err)
							console.log(JSON.parse(err.options.body).where.requestId)
							ID = JSON.parse(err.options.body).where.requestId
							for (let iz = 0, lz = ObjectArray.length; iz < lz; iz++) {
								if (ObjectArray[iz].id == ID) {
									hot2.setDataAtCell(iz, 1, "Error" + err.error);
									hot2.setDataAtCell(iz, 0, "No Action");
									hot2.setCellMeta(iz, 1, 'className', 'RedCellBackground')
									hot2.render()
								}
							}
						}
						);
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