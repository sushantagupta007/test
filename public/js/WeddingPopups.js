/* this js file is required for the popups that will be shown when the user clicks a particular wedding card on home page & section page */

//index
/*
1) Global declarations for the popups (line 11)
2) function declaraton and definition (line 30)
*/

///////////////////////////////////  SECTION 1 /////////////////////////////////////////

/*This price variable will store the price of each category including striked and original price*/
let price = {};
/*This allWeddingCards variable will store the 10 wedding cards information that will be loaded on home page */
let allWeddingCards = {};
/*This allWeddingCards variable will store the 5 royal cards information that will be loaded on home page */
let royalCards = {};


/* global declarations for the popup*/
//******************************************************************************************************************************************//

//to store the current card selected for popup
let popupCards = {};

//scaling factor and breakpoints for media queries according to device width for responsive mode
let popUpScalingFactors = { 300: 0.85, 0: 0.65 };
let popUpBreakPoints = [300, 0];

/*This dictionary is storing the break points according to the scaling factor to find the appropriate scaling factor for the card(rc-royal_card, wc-wedding_card)*/
let break_points = {
	rc: [1200, 992, 455, 360, 250, 0],
	wc: [1200, 992, 480, 420, 360, 325, 300, 0],
};


/*This dictionary is storing the scaling factor which will be multiplied to 300x450 card (rc-royal_card and wc-wedding_card) for resizing the card according to the width of screen*/
/*it is nothing but the @media queries css size of the images on the slides*/
/* reference size taken => 300x450 px card */
let scaling_factor = {
	rc: { 1200: 1.2, 992: 1, 455: 0.8, 360: 0.7, 250: 0.55, 0: 0.4 },
	wc: {
		1200: 0.8,
		992: 0.7,
		480: 0.6,
		420: 0.55,
		360: 0.5,
		325: 0.45,
		300: 0.4,
		0: 0.35,
	},
};


var userSessionData = {
	selectedCard: "",
	brideFirstName: "Bride",
	brideLastName: "",
	brideFatherName: "",
	brideMotherName: "",
	brideGFatherName: "",
	brideGMotherName: "",
	groomFirstName: "Groom",
	groomLastName: "",
	groomFatherName: "",
	groomMotherName: "",
	groomGFatherName: "",
	groomGMotherName: "",
	weddingDate: new Date(),
	weddingDateFormatted: "",
	events: [],
	weddingSide: "",
	sectionCardCategory: "",
	editCardDetails: "",
	NameChanged: false,
	RCmainPageCards: {},
	RCmainPageCardsDetails: [],
	WCmainPageCardsDetails: [],
	countryCode: 0,
	popupCardsData: {},
	WCsectionCards: {},
	RCsectionCards: {},
	priceData: [],
};



//******************************************************************************************************************************************//

///////////////////////////////////  SECTION 2 /////////////////////////////////////////

/* Function declarations and definitions for the popup*/
//******************************************************************************************************************************************//


/* This function will be called when user clicks on any wedding card */
//element - the dom which is comprising the current clicked card

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


async function show() {

	let params = getParameters();
	if (params.cardID == undefined || params.cardID == "") {
		window.location.href = "./weddingcard.html";
	}

	// google analytics logging event
	// analytics.logEvent("website_wedding_card_big_view");
	let id = params.cardID
	let elem = document.getElementById(`popup`);
	document.body.style.overflowY = "scroll";

	/* positioning of the popup for responsive mode */
	if (window.innerWidth > 900) elem.style.top = "50%";
	else elem.style.top = "55%";

	/* basically there will be 3 cards so 3 popup slides structure is hardcoded in popup div (see html page) */
	/* below 3 statements will remove the previous background images on the popup slides */
	document.getElementById(`popup-slide-1`).style.backgroundImage = `url("")`;
	document.getElementById(`popup-slide-2`).style.backgroundImage = `url("")`;
	document.getElementById(`popup-slide-3`).style.backgroundImage = `url("")`;

	//to load popup slides on popup
	loadPopupSlides(id);

	/* updating the session storage */
	let userSessionDataObject = getLocalStorage();
	userSessionDataObject["selectedCard"] = id;

	if (userSessionDataObject.countryCode == 0 || userSessionDataObject.countryCode == undefined) {
		await fetch_ip("http://ip-api.com/json/")
	}
	if (userSessionDataObject.priceData.length == 0 || userSessionDataObject.priceData == undefined) {
		await fetchPrice();
	}

	localStorage.setItem("userSessionData", JSON.stringify(userSessionDataObject));

	/* disable pointer outside the popup and apply some transition */
	// document.body.style.pointerEvents = "none";
	// elem.style.pointerEvents = "auto";
	elem.style.transition = "top 0.7s ease";
	elem.style.visibility = "visible";
}




/*This function will return the session Storage Variable object */
function getLocalStorage() {
	let obj = {};
	if (typeof localStorage.userSessionData !== "undefined") {
		obj = JSON.parse(localStorage.userSessionData);
	}
	return obj;
}








// script written by aman !

// This code sets the country code of the current user !
var countriesAvailable = { 'ae': 1, 'gb': 1, 'in': 1, 'my': 1, 'pk': 1, 'us': 1 }
var myCountryCode = 'in';
async function fetch_ip(path) {
	let ipInfo = await fetch(path).then().catch(function () {
		alert('Unable to fetch Country Code !')
	});

	try {
		let ip_data = await ipInfo.json();
		let country_code = ip_data["countryCode"].toLowerCase();
		myCountryCode = country_code;
		if (!countriesAvailable[myCountryCode]) myCountryCode = "in"
	}
	catch {
		myCountryCode = 'in';
	}

	let userSessionDataObject = getLocalStorage();
	if (userSessionDataObject.countryCode == null) {
		userSessionDataObject["countryCode"] = myCountryCode;
		localStorage.setItem("userSessionData", JSON.stringify(userSessionDataObject));
	}
}
// This code sets the country code of the current user !





// This code fetches the price from database, according to country code
async function fetchPrice() {
	if (myCountryCode == null) await fetch_ip("http://ip-api.com/json/");
	let price = await getData('weddingcards/country_pricing/prices/' + myCountryCode);
	price = price.data();
	let userSessionDataObject = getLocalStorage();
	userSessionDataObject["priceData"] = price;
	localStorage.setItem("userSessionData", JSON.stringify(userSessionDataObject));
}
// This code fetches the price from database, according to country code




async function checkLocalStorage() {

	let empty = {}
	if (localStorage.userSessionData == undefined || localStorage.userSessionData == empty) {
		localStorage.setItem("userSessionData", JSON.stringify(userSessionData));
	}

	let userSessionDataObject = getLocalStorage();
	let obj = ["selectedCard", "brideFirstName", "brideLastName", "brideFatherName", "brideMotherName", "brideGFatherName", "brideGMotherName", "groomFirstName", "groomLastName", "groomFatherName", "groomMotherName", "groomGFatherName", "groomGMotherName", "weddingDate", "weddingDateFormatted", "events", "weddingSide", "sectionCardCategory", "editCardDetails", "NameChanged", "RCmainPageCards", "RCmainPageCardsDetails", "WCmainPageCardsDetails", "countryCode", "popupCardsData", "WCsectionCards", "RCsectionCards", "priceData"]
	count = 0


	for (const key in userSessionDataObject) {
		if (key != obj[count]) {
			localStorage.setItem("userSessionData", JSON.stringify(userSessionData));
			break;
		}
		count += 1;
	}


	if (userSessionDataObject.countryCode == 0) {
		await fetch_ip("http://ip-api.com/json/")
	}
	if (userSessionDataObject.priceData == [] || userSessionDataObject.priceData.length == 0) {
		fetchPrice()
	}

}

function getPrice(amount) {
	let price = '';
	let onceStarted = false;
	for (let i = 0; i < amount.length; i++) {
		if (amount[i] >= 0 && amount[i] <= 9) {
			price += amount[i]
			onceStarted = true;
		}
		else {
			if (onceStarted) break;
		}
	}
	return parseInt(price);
}
function getdiscount(offer_price, mrp_price) {
	offer_price = getPrice(offer_price + "");
	mrp_price = getPrice(mrp_price + "");

	return 100 - (offer_price * 100 / mrp_price)
}




function openForm() {

	let params = getParameters();
	if (params.cardID == undefined || params.cardID == "") {
		window.location.href = "./weddingcard.html";
	}
	else
	{
		window.location.href = "./form.html?cardID="+params.cardID;
	}

}







// Script written by Aman End !















/* this function will load the 3 popup slides on the popup  */
// id - represents id of the card to fetch the card info from firestore
loadPopupSlides = async (id) => {

	let userSessionDataObject = getLocalStorage();
	let popupCardData = 0;
	if (userSessionDataObject["popupCardsData"] == undefined || userSessionDataObject["popupCardsData"][id] == undefined) {
		popupCardData = await getData('weddingcard2/allcard/cards/' + id);
		popupCardData = popupCardData.data();



		if (popupCardData == undefined) window.location.href = "./weddingcard.html";

		popupCards[id] = {
			bg1: popupCardData["smallImgFrontLink"],
			bg2: popupCardData["smallImgBackLink"],
			bg3: popupCardData["smallImgBackLink"],
			front: popupCardData["mediumImgFrontLink"],
			back: popupCardData["mediumImgBackLink"],
			description: popupCardData[`description`],
			title: popupCardData[`title`],
			category: popupCardData["category"],
			text1: popupCardData["text1"],
			text2: popupCardData["text2"],
			text3: popupCardData["text3"],
		};
		userSessionDataObject["popupCardsData"] = { id: popupCards[id] };
		localStorage.setItem("userSessionData", JSON.stringify(userSessionDataObject));
	}

	/* this will append the loader in each of the three slides */
	for (let i = 1; i <= 3; i++) {
		$(`#popup-slide-${i}`).append(
			`<div class="swiper-slide-popup" id="popup-slide-${i}-loader" style="width:100%; height:100%; z-index:inherit;"></div>`
		);
		let animation = bodymovin.loadAnimation({
			container: document.getElementById(`popup-slide-${i}-loader`),
			renderer: "svg",
			loop: true,
			autoplay: true,
			path: "./animations/loading.json",
		});
	}



	let cardCategory = popupCardData.category
	let offer_price = userSessionDataObject.priceData[cardCategory + "Price"];
	let mrp_price = userSessionDataObject.priceData[cardCategory + "StrikePrice"];
	let offer = Math.round(getdiscount(offer_price, mrp_price));


	document.getElementById(`popup-description`).innerHTML = popupCards[id]["description"];
	document.getElementById(`popup-title`).innerHTML = popupCards[id]["title"];
	// document.getElementById(`popup-price`).innerHTML = document.getElementById(`${id}-price-details`).innerHTML;
	document.getElementById(`popup-price`).innerHTML = `<span class="cost">${offer_price}</span>
														<span class="deleted" style="font-style: italic; text-decoration: line-through;">${mrp_price}</span>
														<span class="offer">${offer}%off</span>`


	for (let looper = 1; looper <= 3; looper++) {
		loadPopupBgImage(id, looper);
	}

	addPopupText(id);
};












/* this function will load the background image of the card for each slide */
loadPopupBgImage = (id, looper) => {
	let img = new Image();
	img.onload = function () {
		$(`#popup-slide-${looper}-loader`).css("visibility", "hidden");
		document.getElementById(
			`popup-slide-${looper}`
		).style.backgroundImage = `url("${img.src}")`;
	};
	img.src = popupCards[id][`bg${looper}`];
};















/* this function will add the text on all the three cards on the popup  */
addPopupText = (id) => {
	let userSessionDataObject = getLocalStorage();
	let groomName = userSessionDataObject["groomFirstName"];
	let brideName = userSessionDataObject["brideFirstName"];
	let text = [
		[
			"Wedding Invitation",
			groomName,
			"weds",
			brideName,
			"16th, November, 2020",
		],
		[
			"Wedding Ceremony",
			"Groom Name",
			"Son of<br> Your Father Name &  Your Mother Name<br>Grandson of <br>Your Grandfather name & Your Grandmother Name",
			"With",
			"Bride Name",
			"Daughter of<br>Your Father Name  &  Your Mother Name<br>Grandson of<br>Your Grandfather name & Your Grandmother Name",
			"We request the honour of your presence and<br>blessings on the auspicious occasion of<br>the wedding ceremony of our Son.",
		],
		[
			"Wedding Functions",
			"Sangeet",
			"13th November 2021, 7 pm onwards <br> Here the address of venue will come",
			"Tilak",
			"14th November 2021, 1 pm onwards <br> Here the address of venue will come",
			"Milni",
			"14th November 2021, 7 pm onwards <br> Here the address of venue will come",
			"Reception",
			"15th November 2021, 8 pm onwards <br> Here the address of venue will come",
			"Your Presence is Awaited",
		],
	];

	for (let looper = 1; looper <= 3; looper++) {
		let text_string = popupCards[id][`text${looper}`];
		let splitted_text_lines = text_string.split("=");
		let myNode = document.getElementById(`popup-slide-${looper}`);

		//calculating the breakpoint;
		let current_width = window.innerWidth;
		let break_point;
		let ratio = 450 / 1500;

		for (let i = 0; i < popUpBreakPoints.length; i++) {
			if (current_width >= popUpBreakPoints[i]) {
				break_point = popUpBreakPoints[i];
				break;
			}
		}

		let val = ratio * popUpScalingFactors[break_point];

		//declaring div details
		let created_elem_string = `<div id="popup-details-${looper}"style="position:absolute; width:1000px; height:1500px; transform-origin: 0% 0%; left:0px; top:0px; transform:scale(${val}, ${val}); overflow:hidden; z-index:inherit;">`;

		for (let i = 0; i < splitted_text_lines.length; i++) {
			//spltting text properties for splitted text lines
			let properties = splitted_text_lines[i].split(",");

			//extracting properties ;
			let font_family = properties[0];
			let font_size = properties[1];
			let color = properties[2];
			let top_margin = properties[3];
			let left_margin = properties[4];
			let extra = "";

			if (left_margin < 0)
				extra = "right:" + Math.abs(left_margin) + "px; text-align:right; ";
			else if (left_margin > 0)
				extra = "left:" + left_margin + "px; text-align:left;    ";
			else if (left_margin == 0)
				extra = "left: 50%;  transform: translate(-50%, 0);";
			created_elem_string +=
				`<span class="card-details" 
        style="font-size: ${font_size}px ; 
        ${fonts[font_family]} color: ${color}; top: ${top_margin}px; 
        ${extra}">${text[looper - 1][i]}
      </span>`;
		}

		created_elem_string += `</div>`;
		$(`#popup-slide-${looper}`).append(created_elem_string);
	}
};

//******************************************************************************************************************************************//





/* This function will perform the resizing of all the elements if reqiured when in responsive mode */
/* This function is used in body tag of home page with the event onresize */
/* The elements that are going to be resized in reponsive mode through js should be added in this function */
function changeProperties() {
	/* resizing popup box on resizing the window */
	let elem = document.getElementById(`popup`);
	if (elem.style.visibility == "visible") {
		if (window.innerWidth > 900) elem.style.top = "50%";
		else elem.style.top = "60%";
		elem.style.transition = "top 0.7s ease";
		elem.style.visibility = "visible";
	}

	/*Resizing the text on each card*/
	/*royal cards*/
	//getting the current width of the window;
	let current_width = window.innerWidth;
	let break_point;
	//as the reference card size is 300x450 and the original size is 1000x1500, thus each card must be multiplied by this ratio
	let ratio = 450 / 1500;

	//getting the scaling factor of the royal slides according to current width of window
	for (let i = 0; i < break_points["rc"].length; i++) {
		if (current_width >= break_points["rc"][i]) {
			break_point = break_points["rc"][i];
			break;
		}
	}

	//as the slides are scaled from 300x450 to their required sizes(in media queries of css) we need to get the val of scaling factor * ratio
	let val = ratio * scaling_factor["rc"][break_point];
	//performing the scaling of the slides(details) :NOTE: The slides are scaled according to media queries in css , we just need to scale the details on each slide
	for (let id in royalCards) {
		let elem = document.getElementById(`rc-${id}-details`);
		elem.style.transform = `scale(${val}, ${val})`;
	}

	/*wedding cards */
	for (let i = 0; i < break_points["wc"].length; i++) {
		if (current_width >= break_points["wc"][i]) {
			break_point = break_points["wc"][i];
			break;
		}
	}
	val = ratio * scaling_factor["wc"][break_point];

	for (let id in allWeddingCards) {
		let elem = document.getElementById(`wc-${id}-details`);
		elem.style.transform = `scale(${val}, ${val})`;
	}

	/* resizing popup slides text */
	//NOTE : this popupbreakpoints and scaling factors are defined in weddingPopups.js file
	for (let i = 0; i < popUpBreakPoints.length; i++) {
		if (current_width >= popUpBreakPoints[i]) {
			break_point = popUpBreakPoints[i];
			break;
		}
	}
	val = ratio * popUpScalingFactors[break_point];
	for (let i = 1; i <= 3; i++) {
		let elem = document.getElementById(`popup-details-${i}`);
		elem.style.transform = `scale(${val}, ${val})`;
	}
}