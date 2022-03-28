//index
/*
1) global declarations (line no. 10)
2) necessary functions declarations and definitions (line no. 82)
3) window load events (analogous to main function(entry point) of any programming language)  (line no. 530)
*/

///////////////////////////////////  SECTION 1 /////////////////////////////////////////

/* global declarations of data objects for the home page*/
//******************************************************************************************************************************************//

/* This is the default configuration for the wedding calender on the form page */
let defaultConfig = {
	weekDayLength: 1,
	date: new Date(),
	onClickDate: selectDate,
	startOnMonday: true,
	weekDayLength: 3,
	showTodayButton: false,
	disable: function (date) {
		today = new Date();
		today.setDate(today.getDate() - 1);
		return date < today; // This will disable all dates before today
	},
};

/* selected date and selected time variables dedicated for add event section */
let sDate = "";
let sTime = "";

/* This variable will store the number of events added by the user in add evetn section */
let event_count = 0;

/* This variable is used to store the elem which needs to be focused if its input field value is invalid */
let inputToBeFocused = "";

/* The add popup box variable stores the structure of the add event details popup */
let addPopupBox = ` <div id="addPopupBox" style="position:fixed; display:flex; justify-content: center; align-items: center; min-width: 100vw; min-height: 100vh; top:0; left:0; z-index: 999; ">
    <div class="addPopupContainer" >
        <div class="addPopup" style="display: block;">
        <div class="addPopupField" style="text-align: center;  margin-bottom:10px;">
            <span style="color:rgba(0,0,0,0.4); font-size:20px;"> Enter Event Details</span>
        </div>
        <div class="addPopupField">
            <div class="formfield">
            <input type="text"  name="eventName" id="eventName" required onfocus="selectDateAndTime()">
            <label placeholder="Name" for="eventName" >Event Name</label>
            </div>
        </div>
        <div class="addPopupField" style="display: block; justify-content:space-between;">
            <div class="formfield">
            <input type="text" class="picker dateAndTime" name="dateAndTime" id="dateAndTime" required onfocus="selectDateAndTime()">
            <label placeholder="Name" for="dateAndTime" >Date and Time</label>
            </div>
        </div>
        <div class="addPopupField">
            <div class="formfield">
            <input type="text"  name="venue" id="venue" required onfocus="selectDateAndTime()">
            <label placeholder="Name" for="venue" >Venue(address)</label>
            </div>
        </div>
        <div class="formfield" style="display: block;">
            <div style="display: flex; justify-content: center; align-items: center;">
            <button id="done" style="outline: none; border: transparent; background-color: tomato; color:white; border-radius: 0.5rem; margin-top:10px; padding:5px; width:100px; font-size: 20px;" onclick="checkAndAdd()">Done</button>
            </div>
        </div>
        </div>
        <input style="width:0px;height:0px;visibility: hidden;padding: 0;margin: 0;border: 0;" class="date" value=""> 
        <input style="width:0px;height:0px;visibility: hidden;padding: 0;margin: 0;border: 0;"  class="time" value="">
    </div>
    </div>`;

//******************************************************************************************************************************************//

///////////////////////////////////  SECTION 2 /////////////////////////////////////////

/* Necessary functions declarations */
/****************************************************************************************************************************************************/

/* to select wedding date*/
function selectDate(date) {
	$("#wedding-date-cal").updateCalendarOptions({
		date: date,
	});
	document.getElementById("weddingDate").value = date;
}

/* This function is dedicated to grab wedding side (ladki vale/ladke vale)*/
function grabSide(id) {
	let element = document.getElementById(id);
	let ladkiVale = document.getElementById("ladki-vale");
	let ladkeVale = document.getElementById("ladke-vale");

	if (id == "ladki-vale") {
		ladkeVale.style.backgroundColor = "white";
		ladkeVale.style.color = "black";
		ladkeVale.style.opacity = "0.3";
		ladkiVale.style.opacity = "1";
		element.style.backgroundColor = "red";
		element.style.color = "white";
	} else {
		ladkiVale.style.backgroundColor = "white";
		ladkiVale.style.color = "black";
		ladkeVale.style.opacity = "1";
		ladkiVale.style.opacity = "0.3";
		element.style.backgroundColor = "red";
		element.style.color = "white";
	}
	document.getElementById("weddingSide").value = id;
}

/* This function is used to select date and time for event (add event section)*/
function selectDateAndTime() {
	let elem = document.querySelector(".picker");
	let dDate = "";
	if ($(`#addPopupBox`).find(".date")[0].value == "") {
		dDate = new Date();
	} else {
		dDate = $(`#addPopupBox`).find(".date")[0].value;
	}

	let dPoptions = {
		autoClose: false,
		format: "mmmm yyyy",
		onClose: function () {
			if (this.date) {
				let selected_date = this.date;
				let selected_month_year = document.getElementById("dateAndTime").value;
				let string_date = this.date.getDate().toString();
				$(`#addPopupBox`).find(".dateAndTime")[0].value =
					$(`#addPopupBox`).find(".time")[0].value;
				chooseTime(selected_date, selected_month_year, string_date);
				this.destroy();
			} else {
				this.destroy();
			}
		},
	};

	let datePicker = M.Datepicker.init(elem, dPoptions);
	let instance = M.Datepicker.getInstance(elem);
	instance.setDate(dDate);
}

/*This function is used to choose time for event*/
function chooseTime(oriDate, eventDate, eventD) {
	let elem = document.querySelector(".picker");
	let dTime = "";
	if ($(`#addPopupBox`).find(".time")[0].value == "") {
		dTime = "00:00";
	} else {
		dTime = $(`#addPopupBox`).find(".time")[0].value;
	}

	let tPoptions = {
		autoClose: false,
		defaultTime: dTime,
		twelvehour: true,
		onCloseEnd: function () {
			if (this.time) {
				let dtString = convertDT(
					eventD,
					eventDate,
					document.getElementById("dateAndTime").value
				);
				if (document.getElementById("dateAndTime").value.search("PM")) {
					let hour = this.time.split(":");
					let min = hour[1];
					hour = parseInt(hour[0]);
					hour += 12;
					sTime = hour + ":" + min;
				} else {
					sTime = this.time;
				}
				$(`#addPopupBox`).find(".date")[0].value = oriDate;
				$(`#addPopupBox`).find(".time")[0].value = sTime;

				document.getElementById("dateAndTime").value = dtString;
				this.destroy();
			} else {
				this.destroy();
				document.getElementById("dateAndTime").value = "";
			}
		},
	};
	let timePicker = M.Timepicker.init(elem, tPoptions);
	let tPinstance = M.Timepicker.getInstance(elem);
	tPinstance.open();
}

/*THis function is used to convert the date and time to the required string to be displayed*/
function convertDT(eventD, eventDate, eventTime) {
	let day = eventD;
	if (day == "11" || day == "12" || day == "13") {
		day += "th";
	} else if (day.charAt(day.length - 1) == "1") {
		day += "st";
	} else if (day.charAt(day.length - 1) == "2") {
		day += "nd";
	} else if (day.charAt(day.length - 1) == "3") {
		day += "rd";
	} else {
		day += "th";
	}

	if (eventTime.charAt(0) == "0") {
		eventTime = eventTime.substr(1);
	}
	return day + " " + eventDate + ", " + eventTime + " onwards";
}

/*This function is dedicated for adding new event*/
function addEvent(eventName, eventDT, eventVenue, eventDate, eventTime) {
	if (event_count == 0) {
		$("#add-event").remove();
		$(".event-section").append(`
                        <div style="display:flex; justify-content:center ; align-items:center;" id="add-Event-button" >
                            <div id="addEventButton-div">
                            <button id="addEventButton" class="event-details-button"style="display: flex; justify-content: center; align-items: center; width:150px; height: 35px; font-size:15px;" onclick="addPopup()"><img src="./img/add_icon.svg" alt=""> Add new event</button>
                            </div>
                        </div>
            `);
	}
	let box = ` <div class="event-box" id="${event_count + 1}">
                                <div style="text-align: center; color:rgba(0,0,0,0.5); font-family: sans-serif;"><span class="event-box-head" id="event-box-head-${event_count + 1
		}">Event ${event_count + 1}</span></div>
                                <div class="event-details-field">
                                    <input type="text" class="eventName" value="${eventName}" >
                                    <label>Event Name</label>
                                </div>
                                <div class="event-details-field">
                                    <input type="text" class="dateAndTime" value="${eventDT}">
                                    <label>Date and Time</label>
                                </div>
                                <div class="event-details-field">
                                    <input type="text" class="venue" value="${eventVenue}">
                                    <label>Venue(address)</label>
                                </div> 
                                <div class=" event-details">
                                    <button class="event-details-button" style="display: flex;" id="edit-${event_count + 1
		}" onclick="editEvent(${event_count + 1
		})"><img src="./img/edit.png" alt="" style="width:18px; height:18px;"> Edit</button>
                                    <button class="event-details-button" style="display: flex;" id="delete-${event_count + 1
		}" onclick="deleteEvent(${event_count + 1
		})"><img src="./img/delete_icon.png" alt=""  style="width:20px; height:20px">Delete</button>
                                </div> 
                                <input style="width:0px;height:0px;visibility: hidden;padding: 0;margin: 0;border: 0;" class="date" value="${eventDate}"> 
                                <input style="width:0px;height:0px;visibility: hidden;padding: 0;margin: 0;border: 0;"  class="time" value="${eventTime}">
                        
                    </div>`;

	if (event_count > 1) {
		$(".event-container-2").append(box);
	} else {
		$(".event-container-1").append(box);
	}
	event_count++;
	if (event_count == 4) {
		$("#addEventButton-div").css("cursor", "no-drop");
		$("#addEventButton").css("pointer-events", "none");
	}
}

/*This function is called when user tries to edit an event in add event section*/
function editEvent(eventNo) {
	let eventName = $(`#${eventNo}`).find(".eventName")[0].value;
	if (eventName == "Event Name") {
		eventName = "";
	}
	let eventDateAndTime = $(`#${eventNo}`).find(".dateAndTime")[0].value;
	if (eventDateAndTime == "Event Date and Time") {
		eventDateAndTime = "";
	}
	let eventVenue = $(`#${eventNo}`).find(".venue")[0].value;
	if (eventVenue == "Event Venue") {
		eventVenue = "";
	}

	let popupbox = `<div id="addPopupBox" style="position:fixed; display:flex; justify-content: center; align-items: center; min-width: 100vw; min-height: 100vh; top:0; left:0; z-index: 999; ">
        <div class="addPopupContainer" >
            <div class="addPopup" style="display: block;">
            <div class="addPopupField" style="text-align: center;  margin-bottom:10px;">
                <span style="color:rgba(0,0,0,0.4); font-size:20px;"> Enter Event Details</span>
            </div>
            <div class="addPopupField">
                <div class="formfield">
                <input type="text"  name="eventName" id="eventName" required value = "${eventName}" >
                <label placeholder="Name" for="eventName" >Event Name</label>
                </div>
            </div>
            <div class="addPopupField" style="display: block; justify-content:space-between;">
                <div class="formfield">
                <input type="text" class="picker dateAndTime" name="dateAndTime"  id="dateAndTime" value="${eventDateAndTime}" required onfocus="selectDateAndTime()">
                <label placeholder="Name" for="dateAndTime" >Date and Time</label>
                </div>
            </div>
            <div class="addPopupField">
                <div class="formfield">
                <input type="text"  name="venue" id="venue" value = "${eventVenue}" required>
                <label placeholder="Name" for="venue" >Venue(address)</label>
                </div>
            </div>
            <div class="formfield" style="display: block;">
                <div style="display: flex; justify-content: center; align-items: center;">
                <button id="done" style="outline: none; border: transparent; background-color: tomato; color:white; border-radius: 0.5rem; margin-top:10px; padding:5px; width:100px; font-size: 20px;" onclick="checkAndEdit(${eventNo})">Done</button>
                </div>
            </div>
            </div>
            <input style="width:0px;height:0px;visibility: hidden;padding: 0;margin: 0;border: 0;" class="date" value="${$(`#${eventNo}`).find(".date")[0].value
		}"> 
            <input style="width:0px;height:0px;visibility: hidden;padding: 0;margin: 0;border: 0;"  class="time" value="${$(`#${eventNo}`).find(".time")[0].value
		}">
        </div>
        </div>`;

	$("body").append(popupbox);
}

/* This function will be called when user clicks done on the add event details popup when he/she is trying to edit an event */
function checkAndEdit(eventNo) {
	/* gathering data */
	let eventDateAndTime = document.getElementById("dateAndTime").value;
	if (eventDateAndTime == "") {
		eventDateAndTime = "Event Date and Time";
	}
	let eventName = document.getElementById("eventName").value;
	if (eventName == "") {
		eventName = "Event Name";
	}
	let eventVenue = document.getElementById("venue").value;
	if (eventVenue == "") {
		eventVenue = "Event Venue";
	}

	/*updating the event box*/
	$(`#${eventNo}`).find(".eventName")[0].value = eventName;
	$(`#${eventNo}`).find(".dateAndTime")[0].value = eventDateAndTime;
	$(`#${eventNo}`).find(".venue")[0].value = eventVenue;
	$(`#${eventNo}`).find(".date")[0].value =
		$(`#addPopupBox`).find(".date")[0].value;
	$(`#${eventNo}`).find(".date")[0].value =
		$(`#addPopupBox`).find(".time")[0].value;

	/*updating session storage event data*/
	let userSessionDataObject = getLocalStorage();
	userSessionDataObject["events"][eventNo - 1]["eventName"] = eventName;
	userSessionDataObject["events"][eventNo - 1]["eventDT"] = eventDateAndTime;
	userSessionDataObject["events"][eventNo - 1]["eventVenue"] = eventVenue;
	userSessionDataObject["events"][eventNo - 1]["date"] =
		$(`#addPopupBox`).find(".date")[0].value;
	userSessionDataObject["events"][eventNo - 1]["time"] =
		$(`#addPopupBox`).find(".time")[0].value;
	localStorage.setItem(
		"userSessionData",
		JSON.stringify(userSessionDataObject)
	);
	$("#addPopupBox").remove();
}

/*This function is called when user tries to delete an event in add events section*/
function deleteEvent(eventNo) {
	if (event_count == 4) {
		$("#addEventButton-div").css("cursor", "pointer");
		$("#addEventButton").css("pointer-events", "auto");
	}

	if (event_count == 1) {
		$(".event-container-1").append(`
                            <div id="add-event" class="event-box" onclick="addPopup()">
                                <div>
                                    <div class="event-details"><img src="./img/add_icon.svg" alt=""></div>
                                    <div style="text-align: center; color:rgba(0,0,0,0.5); font-family:sans-serif;"><span>Add atleast 1 event<br>to continue</span></div>
                                </div>
                            </div>
            `);

		$("#add-Event-button").remove();
	} else {
		for (let i = eventNo; i < event_count; i++) {
			let box = document.getElementById(i + 1);
			/*change of event heading*/
			document.getElementById(
				`event-box-head-${i + 1}`
			).innerHTML = `Event ${i}`;
			document.getElementById(
				`event-box-head-${i + 1}`
			).id = `event-box-head-${i}`;

			/*delete button change of id*/
			let delete_button = document.getElementById(`delete-${i + 1}`);
			$(`#delete-${i + 1}`).attr("onclick", `deleteEvent(${i})`);
			delete_button.id = `delete-${i}`;

			/*edit button change of id*/
			let edit_button = document.getElementById(`edit-${i + 1}`);
			$(`#edit-${i + 1}`).attr("onclick", `editEvent(${i})`);
			edit_button.id = `edit-${i}`;

			document.getElementById(i).innerHTML = box.innerHTML;
		}
	}
	$(`#${event_count}`).remove();
	/*updating the session storage */
	let userSessionDataObject = getLocalStorage();
	userSessionDataObject["events"].splice(eventNo - 1, 1);
	localStorage.setItem(
		"userSessionData",
		JSON.stringify(userSessionDataObject)
	);
	event_count--;
}

/*getting the session Storage Variables*/
function getLocalStorage() {
	let obj = {};
	if (typeof localStorage.userSessionData !== "undefined") {
		obj = JSON.parse(localStorage.userSessionData);
	}
	return obj;
}

/* This function is used to add popup box on the webpage (add event details popup box)*/
function addPopup() {
	$("body").append(addPopupBox);
}

/* This fucntion will check the fields in add events popup and on pressing done will add the event on the page in event details section */
function checkAndAdd() {
	let eventDateAndTime = document.getElementById("dateAndTime").value;
	if (eventDateAndTime == "") {
		eventDateAndTime = "Event Date and Time";
	}
	let eventName = document.getElementById("eventName").value;
	if (eventName == "") {
		eventName = "Event Name";
	}
	let eventVenue = document.getElementById("venue").value;
	if (eventVenue == "") {
		eventVenue = "Event Venue";
	}
	{
		let userSessionDataObject = getLocalStorage();
		userSessionDataObject["events"].push({
			eventName: eventName,
			eventDT: eventDateAndTime,
			eventVenue: eventVenue,
			date: $(`#addPopupBox`).find(".date")[0].value,
			time: $(`#addPopupBox`).find(".time")[0].value,
		});
		localStorage.setItem(
			"userSessionData",
			JSON.stringify(userSessionDataObject)
		);

		addEvent(
			eventName,
			eventDateAndTime,
			eventVenue,
			$(`#addPopupBox`).find(".date")[0].value,
			$(`#addPopupBox`).find(".time")[0].value
		);
		$("#addPopupBox").remove();
	}
}

/* This function is used to validate all the data entered by the used before the user goes to customize screen */
function validate() {
	// validating the data
	/* getting value of all required fields */
	let message = "";
	let brideFName = document.getElementById("brideFirstName").value;
	let brideLName = document.getElementById("brideLastName").value;
	let brideFatherName = document.getElementById("brideFatherName").value;
	let brideMotherName = document.getElementById("brideMotherName").value;
	let groomFName = document.getElementById("groomFirstName").value;
	let groomLName = document.getElementById("groomLastName").value;
	let groomFatherName = document.getElementById("groomFatherName").value;
	let groomMotherName = document.getElementById("groomMotherName").value;
	let userSessionDataObject = getLocalStorage();
	let weddingEvents = userSessionDataObject["events"].length;
	let weddingSide = document.getElementById("weddingSide").value;

	if (brideFName == "" || brideFName.length <= 3) {
		message = `Please enter valid brides' first name`;
		inputToBeFocused = document.getElementById("brideFirstName");
	} else if (brideLName == "" || brideLName.length <= 3) {
		message = `Please enter valid brides' last name`;
		inputToBeFocused = document.getElementById("brideLastName");
	} else if (brideFatherName == "" || brideFatherName.length <= 3) {
		message = `Please enter valid brides' father name`;
		inputToBeFocused = document.getElementById("brideFatherName");
	} else if (brideMotherName == "" || brideMotherName.length <= 3) {
		message = `Please enter valid brides' mother name`;
		inputToBeFocused = document.getElementById("brideMotherName");
	} else if (groomFName == "" || groomFName.length <= 3) {
		message = `Please enter valid grooms' first name`;
		inputToBeFocused = document.getElementById("groomFirstName");
	} else if (groomLName == "" || groomLName.length <= 3) {
		message = `Please enter valid grooms' last name`;
		inputToBeFocused = document.getElementById("groomLastName");
	} else if (groomFatherName == "" || groomFatherName.length <= 3) {
		message = `Please enter valid grooms' father name`;
		inputToBeFocused = document.getElementById("groomFatherName");
	} else if (groomMotherName == "" || groomMotherName.length <= 3) {
		message = `Please enter valid grooms' mother name`;
		inputToBeFocused = document.getElementById("groomMotherName");
	} else if (weddingEvents < 1) {
		message = "Please enter at least one event details";
	} else if (weddingSide == "") {
		message = "Please grab one of the wedding side either Ladki or Ladke vale";
	} else {
		return true;
	}

	$("#toast-container").append(`
            <div class="toast" id="toast" data-autohide="false" role="alert" aria-live="assertive" aria-atomic="true">
                <div style="position: absolute; right:10px ; top:5px; ">
                    <button type="button" class="ml-2 mb-1 close" onclick="hideToast()"data-dismiss="toast" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="toast-body" style="display: flex; justify-content: center; align-items:center">
                    <div>
                        <img src="./img/reject-icon.png" alt="" style="width:45px ; height: 45px; margin-right:5px;">
                    </div>
                    <div style="display: flex; justify-content: center; align-items: center; margin:5px;">
                        <div>
                            <div style="font-size:20px; color:rgb(150, 150, 150); font-weight:600;">Invalid Details</div>
                            <div style="font-size:17px;">${message}</div>
                        </div>
                        
                    </div>
                </div>
            </div>
        `);
	$(".toast").toast("show");
	return false;
}

/* To hide the toast message (the invalid details popup) */
function hideToast() {
	$(".toast").toast("hide");
	$("#toast").remove();
	inputToBeFocused.focus();
}

/* This function is called when user clicks next on the add details page*/
function storeAndLoad(page) {
	/*events already updated, Storing the data*/
	let result = false;
	if (page == "weddingPageNew.html") {
		result = true;
	} else {
		result = validate();
	}
	if (result) {
		let userSessionDataObject = getLocalStorage();
		/* storing all input fields of bride groom details section */
		for (id in userSessionDataObject) {
			if (document.getElementById(id)) {
				userSessionDataObject[id] = document.getElementById(id).value;
				if (document.getElementById("brideFirstName").value == "") {
					userSessionDataObject["brideFirstName"] = "Bride";
				}
				if (document.getElementById("groomFirstName").value == "") {
					userSessionDataObject["groomFirstName"] = "Groom";
				}
				if (id == "weddingDate") {
					let selectedWeddingDate = userSessionDataObject[id];
					userSessionDataObject["weddingDateFormatted"] =
						moment(selectedWeddingDate).format("Do MMMM, YYYY");
				}
			}
		}
		// if(typeof localStorage.editedCardData != "undefined")
		//
		localStorage.removeItem("editedCardData");
		localStorage.removeItem("editCardData");
		//console.log(localStorage.editedCardData);
		localStorage.setItem("userSessionData", JSON.stringify(userSessionDataObject));
		if (page == "weddingPageNew.html") window.history.back();
		else window.location = page;
	}
}

/****************************************************************************************************************************************************/

///////////////////////////////////  SECTION 3 /////////////////////////////////////////

/* this section will load all the necessary elements as the window loads */
/*****************************************************************************************************************************************************/




// Script written by aman

function getParameters() {
	let params = {};
	let urlString = window.location.href;
	let paramString = urlString.split('?')[1];
	let queryString = new URLSearchParams(paramString);
	for (let pair of queryString.entries()) {
		params[pair[0]] = pair[1]
	}

	return params;
}


function openCustomizeScreen() {
	let params = getParameters();
	if (params.cardID == undefined || params.cardID == "") {
		window.location.href = "./weddingcard.html";
	}
	else {
		window.location.href = "./customize.html?cardID=" + params.cardID;
	}

}


// Script written by aman End








window.addEventListener("load", (event) => {
	/*to draw wedding date calendar*/
	$("#wedding-date-cal").calendar(defaultConfig);
	// document.getElementById('weddingDate').value = new Date();

	let userSessionDataObject = getLocalStorage();

	/* loading all input fields of bride groom details section */
	for (id in userSessionDataObject) {
		if (document.getElementById(id)) {
			document.getElementById(id).value = userSessionDataObject[id];
			if (
				userSessionDataObject["brideFirstName"] == "Bride" ||
				userSessionDataObject["groomFirstName"] == "Groom"
			) {
				document.getElementById(id).value = "";
			}
		}
	}

	/*loading event boxes*/
	if (userSessionDataObject["events"] == undefined || userSessionDataObject["events"].length == 0) {
		userSessionDataObject["events"] = []
		localStorage.setItem(
			"userSessionData",
			JSON.stringify(userSessionDataObject)
		);
		$(".event-container-1").append(`
                <div id="add-event" class="event-box" onclick="addPopup()">
                    <div>
                        <div class="event-details"><img src="./img/add_icon.svg" alt=""></div>
                        <div style="text-align: center; color:rgba(0,0,0,0.5); font-family:sans-serif;"><span>Add atleast 1 event<br>to continue</span></div>
                    </div>
                </div>
        `);
	} else {
		for (let i = 1; i <= userSessionDataObject["events"].length; i++) {
			addEvent(
				userSessionDataObject["events"][i - 1]["eventName"],
				userSessionDataObject["events"][i - 1]["eventDT"],
				userSessionDataObject["events"][i - 1]["eventVenue"],
				userSessionDataObject["events"][i - 1]["date"],
				userSessionDataObject["events"][i - 1]["time"]
			);
		}
	}

	/*loading user wedding side */
	if (userSessionDataObject["weddingSide"] != "")
		grabSide(userSessionDataObject["weddingSide"]);
	/*loading wedding date */
	selectDate(document.getElementById("weddingDate").value);
});

/****************************************************************************************************************************************************/
