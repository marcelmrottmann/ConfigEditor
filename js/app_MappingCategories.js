//--------------------------------Define GLobal Variables---------------------------------

var hotdata;
var changedata;
var global_data;
var CurrentConnection;
var SDMZipFileName;
var hot;
var SelectedRuleIndex;
var currentFile;
var paycodesResponse;
var ExportConfig;
var AccessToken;
var AddOrEdit;
var RootNodeOptions;
RootNodeOptions = []

RefreshConnections()


var SelectedConnection;


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
	CloseLoadingModal()
}
//------------------------------------------Close the loading thing---------------
function CloseLoadingModal() {
	var loadingmodal = document.getElementById("load");
	loadingmodal.style.display = "none";
	loadingmodal.style.visibility = "hidden";
	document.getElementById('HandsOnTableValue').style.display = "block"
}
//DownloadCSV



function reloadDropDown(x) {
	console.log('trigger')
	var request = require('request');
	var rp = require('request-promise')
	SelectedConnectionName = document.getElementById("Connection").options[document.getElementById("Connection").selectedIndex].value

	SelectedConnection = {}
	for (let i = 0, l = global_data.length; i < l; i++) {
		if (global_data[i].name == SelectedConnectionName) {
			SelectedConnection = global_data[i]
		}
	}
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

//-----------------------------------------Fill Connections Dropdown.

function toggleField(hideObj, showObj) {
	hideObj.disabled = true;
	hideObj.style.display = 'none';
	showObj.disabled = false;
	showObj.style.display = 'inline';
	showObj.focus();
}




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


//---------------------------------------------ParseInput function---------------------------------
document.getElementById("UploadAndParse").addEventListener("click", function () {
	var loadingmodal = document.getElementById("load");
	loadingmodal.style.display = "block";
	loadingmodal.style.visibility = "visible";
	setTimeout(parseInputJson, 1000);
})


function parseInputJson(data) {
	//RefreshConnections()

	//--------------------------------------------Require functions----------------------------------------------
	console.log(SDMZipFileName)
	var firstBy = require('thenby');
	var AdmZip = require('adm-zip');



	//--------------------------------------------Make API CALL---
	var request = require('request');
	var rp = require('request-promise')
	AccessToken = ""


	console.log(global_data)
	SelectedConnectionName = document.getElementById("Connection").options[document.getElementById("Connection").selectedIndex].value
	SelectedConnection = {}
	for (let i = 0, l = global_data.length; i < l; i++) {
		if (global_data[i].name == SelectedConnectionName) {
			SelectedConnection = global_data[i]
		}
	}


	function GETMAPCATS(x) {
		x = JSON.parse(x)
		AccessToken = x.access_token
		var options3 = {
			'method': 'GET',
			'url': 'https://' + SelectedConnection.url + '/api/v1/platform/analytics/mapping_categories?mapping_category_type_id=1',
			'headers': {
				'appkey': SelectedConnection.appKey,
				'Authorization': AccessToken,
				'Content-Type': ['application/json']
			}

		};
		console.log(options3.url)

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

				GETMAPCATS(parsedBody)
			})
			.catch(function (err) {

				console.log(err)
				window.alert('Login failed ' + err.error)
				CloseLoadingModal()

				return
			});
	}

	Access()
	function RenderHandsOnTable(x) {
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

		console.log(x)
		//if (JSON.parse(x) instanceof Array == true && JSON.parse(x).length == 0){window.alert('No Requests found in target system') ;CloseLoadingModal(); return}
		FinalArray = JSON.parse(x)
		for (let i = 0, l = FinalArray.length; i < l; i++) {
			g = FinalArray[i]
			CategoriesList = []
			for (let y = 0, z = g.mappingCategoryAttributes.length; y < z; y++) {
				CategoriesList.push(g.mappingCategoryAttributes[y].name)
			}
			map =
			{
				"Action": "None",
				"Status": "None",
				"name": g.name,
				"description": g.description,
				"ItemList": CategoriesList.join(',\n'),
				"Type": g.mappingCategoryType.name,
				"Id": g.id

			}


			Complete.push(map)
		}



		FinalArray = Complete
		//console.log(FinalArray)
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

		headers = [
			"Action",
			"Status",
			"name",
			"description",
			"ItemList",
			"Type",
			"Id"
		]


		for (let i = 0, l = headers.length; i < l; i++) {
			if (headers[i] == 'Action') { columneditorsettings.push({ data: headers[i], type: 'dropdown', source: ['None', 'Update'] }) }
			else if (headers[i] == 'description') { columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: false, width: '200' }) }
			else if (headers[i] == "ItemList") { columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: false, renderer: 'html' }) }
			//else if (headers[i] == "ExpirationDate") { columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: false }) }
			//else if (headers[i] == "EffectiveDate") { columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: false }) }
			//else if (headers[i] == "LastRevision") { columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: false }) }
			else { columneditorsettings.push({ name: headers[i], data: headers[i], readOnly: false }) }
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


		//end else
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
			stretchH: 'all',
			afterRender: CloseLoadingModal()
		});

		hot.render()


		document.getElementById('AddPaycode1').addEventListener('click', function () {
			console.log('wooo')
			loadingmodal.style.display = "block";
			loadingmodal.style.visibility = "visible";
			setTimeout(AddPaycode, 1000);
		})
		function AddPaycode() {
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
						currentValue = currentValue.replace(/(\r\n|\n|\r)/gm, "")
						FinalValue = currentValue + ',' + AddPaycodeField.value
						FinalValue = FinalValue.split(',')
						FinalValue = Array.from(new Set(FinalValue)).join(',\n')
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
			loadingmodal.style.visibility = "visible";
			setTimeout(DeletePayCode, 1000);
		})

		function DeletePayCode() {
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
							currentValue = currentValue.replace(/(\r\n|\n|\r)/g, "")
							FinalValue = currentValue.replace(AddPaycodeField, '')
							FinalValue = FinalValue.split(',')
							FinalValue = Array.from(new Set(FinalValue)).join(',\n')
							FinalValue = FinalValue.replace(/(^[,\s]+)|([,\s]+$)/g, '')
							FinalValue = FinalValue.replace(',,', ',').replace(',\n,\n', ',\n')
							if (columnIndex >= 4) {
								hot.setDataAtCell(rowIndex, columnIndex, FinalValue);

							}
						}
					}
				}
			}
			//OpenLoadingModal()
			hot.render()
			DeleteData()
			//hot.render(setTimeout(CloseLoadingModal()),3000);
			CloseLoadingModal();
		}

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



document.getElementById("DownloadtoCSV").addEventListener('click', function () {
	var exportPlugin = hotdata.getPlugin('exportFile');
	exportPlugin.downloadFile('csv', { filename: "Mapping_Categories", columnHeaders: true, });
});



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

		IDsforCompletionTracking = []

		for (let i = 0, l = ObjectArray.length; i < l; i++) {

			if (ObjectArray[i].Action == "Update") {
				IDsforCompletionTracking.push(ObjectArray[i].Id)

				ObjectArray[i].ItemList.replace(/(\r\n|\n|\r)/g, "").split(',').map(function (x){return {"name":x}})
				if ( ObjectArray[i].ItemList != "" &&  ObjectArray[i].ItemList != null){
				AttributesList = ObjectArray[i].ItemList.replace(/(\r\n|\n|\r)/g, "").split(',').map(function (x){return {"name":x}})
				}
				else {AttributesList = []}
				


				console.log(ObjectArray[i])
				console.log(AccessToken)
				hot2.setCellMeta(i, 1, 'className', 'YellowCellBackground')
				BodyCreator =
				{
					"id": ObjectArray[i].Id,
					"name":ObjectArray[i].name ,
					"description": ObjectArray[i].description,
					"mappingCategoryType": {
						"id": 1
					},
					"mappingCategoryAttributes": AttributesList
				}

				if (ObjectArray[i].timezoneRef == "" || ObjectArray[i].timezoneRef == null || ObjectArray[i].timezoneRef == undefined){delete BodyCreator.timeZoneRef}

				console.log(BodyCreator)

				var options4 = {
					'method': 'PUT',
					'url': 'https://' + SelectedConnection.url + '/api/v1/platform/analytics/mapping_categories/' + ObjectArray[i].Id,
					'resolveWithFullResponse': true,
					'headers': {
						'appkey': SelectedConnection.appKey,
						'Authorization': AccessToken,
						'Content-Type': ['application/json']

					},



					body: JSON.stringify(BodyCreator)



				};
				rp(options4)
					.then(function (parsedBody) {
						console.log(parsedBody)
						console.log(parsedBody.request.path)
						ID = parsedBody.request.path.split('/mapping_categories/')[1]
						StatusResponse = "Successfully Updated"
						for (let iz = 0, lz = ObjectArray.length; iz < lz; iz++) {
							console.log(ID, ObjectArray[i].Id)
							if (ObjectArray[iz].Id == ID) {
								hot2.setDataAtCell(iz, 1, StatusResponse)
								hot2.setDataAtCell(iz, 0, "None");
								hot2.setCellMeta(iz, 1, 'className', 'GreenCellBackground')
								hot2.render()
							}
						}


						/*
													hot2.setDataAtCell(i, 1, ObjectArray[i].Action)
													hot2.setDataAtCell(i, 0, "None");
													hot2.setCellMeta(i, 1, 'className', 'GreenCellBackground')
													hot2.render()
						*/
						//StartOffAPIS(parsedBody)

					})
					.catch(function (err) {
						console.log('fail')
						console.log(err)

						ID = err.options.url.split('/mapping_categories/')[1]
						for (let iz = 0, lz = ObjectArray.length; iz < lz; iz++) {
							if (ObjectArray[iz].Id == ID) {
								hot2.setDataAtCell(iz, 1, "Error" + err.error);
								hot2.setDataAtCell(iz, 0, "None");
								hot2.setCellMeta(iz, 1, 'className', 'RedCellBackground')
								hot2.render()
							}
						}
					});
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

Object.defineProperty(Array.prototype, 'chunk', {
	value: function (chunkSize) {
		var temporal = [];

		for (var i = 0; i < this.length; i += chunkSize) {
			temporal.push(this.slice(i, i + chunkSize));
		}

		return temporal;
	}
});
