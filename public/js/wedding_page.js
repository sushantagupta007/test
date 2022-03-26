//index
/*
1) global declarations (line no. 10)
2) necessary functions declarations and definitions (line no. 51)
3) window load events (analogous to main function(entry point) of any programming language)  (line no. 583)
*/

///////////////////////////////////  SECTION 1 /////////////////////////////////////////

/* global declarations of data objects for the home page*/
//******************************************************************************************************************************************//

/*This price variable will store the price of each category including striked and original price*/
let price = {};
/*This allWeddingCards variable will store the 10 wedding cards information that will be loaded on home page */
let allWeddingCards = {};
/*This allWeddingCards variable will store the 5 royal cards information that will be loaded on home page */
let royalCards = {};

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

/*This dictionary is storing the break points according to the scaling factor to find the appropriate scaling factor for the card(rc-royal_card, wc-wedding_card)*/
let break_points = {
	rc: [1200, 992, 455, 360, 250, 0],
	wc: [1200, 992, 480, 420, 360, 325, 300, 0],
};

/*This variable  */
let flag = true;

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

/* Necessary functions declarations */
/****************************************************************************************************************************************************/
/* This function will load animation inside the element whose id is passed as an arg */
function LoadAnimation(id) {
	var animation = bodymovin.loadAnimation({
		container: document.getElementById(id),
		renderer: "svg",
		loop: true,
		autoplay: true,
		path: "./animations/loading.json",
	});
}


/*This function will return the session Storage Variable object */
function getLocalStorage() {
	let obj = {};
	if (typeof localStorage.userSessionData !== "undefined") {
		obj = JSON.parse(localStorage.userSessionData);
	}
	return obj;
}




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


	if(userSessionDataObject.countryCode == 0)
	{
		await fetch_ip("http://ip-api.com/json/")
	}
	if(userSessionDataObject.priceData == [] || userSessionDataObject.priceData.length == 0)
	{
		fetchPrice()
	}

}










// Called in weddingcard.html

/*refer this reference details structure that would be placed on each card*/
/* according to this structure the addText() function will work for each card */
//   <div class="details" style="position:absolute; width:1000px; height:1500px; background-color:yellow; transform:scale(0.18, 0.18); transform-origin: 0% 0%;left:0px; top:0px;">
//     <span class="card-details" style="font-size: 40px; font-family: Cinzel, serif; font-weight: 700; color: rgb(255, 213, 192); top: 480px;">Wedding Invitation</span>
//     <span class="card-details" style="font-size: 70px; text-align:right; font-family: Pacifico, cursive; font-weight: 400; color: rgb(255, 213, 192); top: 520px; right: 550px;">Groom</span>
//     <span class="card-details" style="font-size: 30px; font-family: Cinzel, serif; font-weight: 700; color: rgb(255, 213, 192); top: 583.95px;">weds</span>
//     <span class="card-details" style="font-size: 70px; text-align:left;;font-family: Pacifico, cursive; font-weight: 400; color: rgb(255, 213, 192); top: 520px; left: 550px;">Bride</span>
//     <span class="card-details" style="font-size: 30px; font-family: Cinzel, serif; font-weight: 700; color: rgb(255, 213, 192); top: 667.489px;">16th, November, 2020</span>
//   </div>

addText = (id, cat) => {
	/*to get the desired bride and Groom Name */
	let userSessionDataObject = getLocalStorage();
	brideName = userSessionDataObject["brideFirstName"];
	groomName = userSessionDataObject["groomFirstName"];

	if (cat == "rc")
	{
		userSessionDataObject["RCmainPageCards"] = {id : cat};
	} 
	localStorage.setItem(
		"userSessionData",
		JSON.stringify(userSessionDataObject)
	);

	let text = [
		"Wedding Invitation",
		groomName,
		"weds",
		brideName,
		"16th, November, 2020",
	];
	let text_string;
	if (cat == "wc") text_string = allWeddingCards[id]["text_string"];
	else text_string = royalCards[id]["text_string"];

	let splitted_text_lines = text_string.split("=");

	//calculating the breakpoint;
	let current_width = window.innerWidth;
	let break_point;
	let ratio = 450 / 1500;

	for (let i = 0; i < break_points[cat].length; i++) {
		if (current_width >= break_points[cat][i]) {
			break_point = break_points[cat][i];
			break;
		}
	}
	let val = ratio * scaling_factor[cat][break_point];
	// console.log("all good till here")
	//declaring div details
	let created_elem_string = `<div id="${cat}-${id}-details" style="position:absolute; width:1000px; height:1500px; transform-origin: 0% 0%; left:0px; top:0px; transform:scale(${val}, ${val}); overflow:hidden;">`;

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
			extra = "right:" + Math.abs(left_margin) + "px; text-align:right;  ";
		else if (left_margin > 0)
			extra = "left:" + left_margin + "px; text-align:left;  ";
		else if (left_margin == 0)
			extra = "left: 50%;  transform: translate(-50%, 0);";

		created_elem_string += `<span class="card-details" style="font-size: ${font_size}px ; ${fonts[font_family]} color: ${color}; top: ${top_margin}px; ${extra}">${text[i]}</span>`;
	}

	created_elem_string += `</div>`;

	/* the created_elem_string contains the details structure for the card with category cat and identity no. id , after that append this details to the required card*/
	$(`#${cat}-${id}`).append(created_elem_string);
};












































// Called in weddingcard.html

/* This function will perform the resizing of all the elements if reqiured when in responsive mode */
/* This function is used in body tag of home page with the event onresize */
/* The elements that are going to be resized in reponsive mode through js should be added in this function */
function changeProperties() {
	/* resizing popup box on resizing the window */
	// let elem = document.getElementById(`popup`);
	// if (elem.style.visibility == "visible") {
	// 	if (window.innerWidth > 900) elem.style.top = "50%";
	// 	else elem.style.top = "60%";
	// 	elem.style.transition = "top 0.7s ease";
	// 	elem.style.visibility = "visible";
	// }

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




// Called in weddingcard.html
/* This function will update the bride groom name on each of the cards*/
function updateBrideGroomName(brideName, groomName) {
	let userSessionDataObject = getLocalStorage();
	userSessionDataObject["brideFirstName"] = brideName;
	userSessionDataObject["groomFirstName"] = groomName;
	userSessionDataObject["NameChanged"] = true;
	localStorage.setItem("userSessionData", JSON.stringify(userSessionDataObject));

	//again getting the updated userSessionDataObject;
	userSessionDataObject = getLocalStorage();

	/* royal cards */
	for (let key in userSessionDataObject["RCmainPageCards"]) {
		$(`#rc-${key}-details`).remove();
		addText(key, "rc");
	}

	/* wedding cards */
	for (let key in userSessionDataObject["WCmainPageCardsDetails"]) {
		$(`#wc-${key}-details`).remove();
		addText(key, "wc");
	}
}


// Called in weddingcard.html
/* This function will be called when user press done on bride groom name popup*/
function changeBrideGroomName() {
	document.body.style.pointerEvents = "auto";

	let brideNameValue = document.getElementById("PopupBrideNameMainPage").value;
	let groomNameValue = document.getElementById("PopupGroomNameMainPage").value;

	if (brideNameValue == "" || brideNameValue == undefined) {
		brideNameValue = "Bride";
	}
	if (groomNameValue == "" || groomNameValue == undefined) {
		groomNameValue = "Groom";
	}

	updateBrideGroomName(brideNameValue, groomNameValue);

	$("#brideGroomName").css("box-shadow", "none");
	$("#brideGroomName").css("top", "200%");
	setTimeout(() => {
		$("#brideGroomName").css("z-index", "-1");
	}, 2000);
}

/****************************************************************************************************************************************************/






























///////////////////////////////////  SECTION 3 /////////////////////////////////////////



// this is for PopupCard.html

/*This function will be called when the user presses show royal cards or view all cards button on the home page and will store the subcategory(sectionCat) in userSessionData variable*/
loadSectionCard = (sectionCat) => {
	let userSessionDataObject = getLocalStorage();
	userSessionDataObject["sectionCardCategory"] = sectionCat;
	localStorage.setItem("userSessionData", JSON.stringify(userSessionDataObject));
	window.location.href = "./WeddingSection.html";
};




// this is for PopupCard.html
/* This function will initialize the royal slider of the royal cards section, for reference visit Swiper js  : https://swiperjs.com/demos#effect-coverflow */
royalSlider = () => {
	let swiper = new Swiper("#swiper-container-royal", {
		effect: "coverflow",
		grabCursor: true,
		centeredSlides: true,
		slidesPerView: "auto",
		touchStartPreventDefault: false,
		watchSlidesVisibility: true,
		watchSlidesProgress: true,
		loop: false,
		autoplay: {
			delay: 2000,
			disableOnInteraction: false,
		},
		coverflowEffect: {
			rotate: 0,
			stretch: 0,
			scale: 0.8,
			depth: 0,
			modifier: 0.6,
			slideShadows: false,
		},
		scrollbar: {
			el: ".swiper-scrollbar",
			snapOnRelease: true,
			draggable: true,
		},
	});

	$(".swiper-images").hover(
		function () {
			swiper.autoplay.stop();
		},
		function () {
			swiper.autoplay.start();
		}
	);
	$(".swiper-images").click(
		function () {
			swiper.autoplay.stop();
		},
		function () {
			swiper.autoplay.start();
		}
	);
};





// this is for PopupCard.html

/*This function will load the background image on the slide(royal slider) or card(all wedding cards sections' cards display) */
/* 
id  : the id of the card
url : the url of the image to be applied as background image
cat : category of the card whose id is passed (rc - royal card, wc- all wedding card)
*/
loadBgImage = async (id, url, cat) => {
	// console.log(id , url , cat	)
	let img = new Image();
	img.onload = function () {
		$(`#${cat}-${id}-loader`).css("display", "none");
		// console.log(			`${cat}-${id}`)
		document.getElementById(
			`${cat}-${id}`
		).style.backgroundImage = `url("${img.src}")`;
		// loaded background image - now adding the text;
		addText(id, cat);
	};
	img.src = url;
};




// this is for PopupCard.html
/* This function will just load the basic structure of slides in body  */
loadRoyalCards = () => {
	for (id in royalCards) {
		$("#royal_cards_display").append(`
		<div class="swiper-slide" >
		<div class="swiper-images" id="rc-${id}"  data-id="${id}" onclick="showPopup(this)"  style="position: relative; background-size: 100% 100%; display: flex; justify-content: center; align-items: center;">
              <div id="rc-${id}-loader" style="width:100%; height:100%;"></div>
          </div>
		  </div>`);

		LoadAnimation(`rc-${id}-loader`);
	}

	/*at last the append the slide of view all card*/
	viewAllRoyalCard();
};








// this is for PopupCard.html
/*This function will only load the single view all card slide of royal cards' section*/
viewAllRoyalCard = async () => {
	$("#royal_cards_display").append(`
    <div class="swiper-slide" >
        <div class="swiper-images" id="view-all-cards" onclick="loadSectionCard('royal')"  style="position: relative; background-size: 100% 100%; display: flex; justify-content: center; align-items: center;">
            <div id="view-all-loader" style="width:100%; height:100%;"></div>
        </div>
    </div>`);

	LoadAnimation("view-all-loader");

	let img = new Image();
	img.onload = function () {
		$(`#view-all-loader`).css("display", "none");
		document.getElementById(
			`view-all-cards`
		).style.backgroundImage = `url("${img.src}")`;
	};
	img.src =
		"https://firebasestorage.googleapis.com/v0/b/celebrare-b43da.appspot.com/o/weddingcards%2Fextras%2Fview_all.jpg?alt=media&token=d173bbe0-1e7f-43bb-a561-f4e4bfff0276";
};




// Script Modified by aman !
/* This function is responsible for fetching the 5 royal cards to be used in royal card section slider */

fetchRoyalData = async () => {

	let userSessionDataObject = getLocalStorage();
	let data = {}
	

	// This if condition simply checks that if the browser contains the data, we fetch earlier
	//  i.e. data for the slider, if not then the code inside if condition will fetch the data
	// else the code after the condition will take the data from localstorage of the browser !
	if(userSessionDataObject.RCmainPageCardsDetails.length == 0 || userSessionDataObject.RCmainPageCardsDetails==undefined)
	{
		data = await getData('weddingcard2/royal');
		data = data.data();
		userSessionDataObject["RCmainPageCardsDetails"] = royalCards;
	}
	else
	{
		data = userSessionDataObject["RCmainPageCardsDetails"]
	}

	for (let i=1 ; i<=5 ; i++) {
		// Every id of the card is stored as a key in the global object => royalCards
		// So that we can access the data in the whole file !
		royalCards[data[i][1]] = {
			id : data[i][1],
			url : data[i][0],
			category : data[i][2],
			text_string : data[i][3]
		}
	}

	// Later on the loader will be removed !
	$("#royal-loader").css("display", "none");


	// And this loop will add the cards in swiper container !
	for (id in royalCards) {
		$("#royal_cards_display").append(`
		<div class="swiper-slide" >
		<div class="swiper-images" id="rc-${id}"  data-id="${id}" onclick="showPopup(this)"  style="position: relative; background-size: 100% 100%; display: flex; justify-content: center; align-items: center;">
			  <div id="rc-${id}-loader" style="width:100%; height:100%;"></div>
		  </div>
		  </div>`);

		LoadAnimation(`rc-${id}-loader`);
	}

	// This code simply detects, if the user visits the page for the first time
	// then it will start playing the slider
	if (flag) {
		royalSlider();
		flag = false;
	}

	/* Once the slides structure is loaded, load the background image(card image) and for further details refer this function*/
	for (id in royalCards) {
		loadBgImage(id, royalCards[id]["url"], "rc");
	}

};
// Script Modified by aman End!





// Script written by Aman!
function getPrice(amount)
{
	let price = '';
	let onceStarted = false;
	for(let i=0 ; i<amount.length ; i++)
	{
		if(amount[i]>=0 && amount[i]<=9){
			price += amount[i]
			onceStarted = true;
		} 
		else{
			if(onceStarted) break;
		}
	}
	return parseInt(price);
}
function getdiscount(offer_price , mrp_price)
{
	offer_price = getPrice(offer_price+"");
	mrp_price = getPrice(mrp_price+"");

	return 100-(offer_price * 100 / mrp_price)
}
// Script written by Aman End !




// this is for PopupCard.html
/* This function will load the wedding cards.0 in the all wedding cards section  */
function loadWeddingCards() {
	// loading the structure
	for (id in allWeddingCards) {
		
		
		// Script modified by aman !
		let offer_price = price[`${allWeddingCards[id]["category"]}Price`];
		let mrp_price = price[`${allWeddingCards[id]["category"]}StrikePrice`];
		let offer = Math.round(getdiscount(offer_price , mrp_price));
		// Script modified by aman end!
		

		$("#all_wedding_cards_display").append(`
      <div class="col-4 col-sm-4 wedding-card">
          <div class="wedding-card-image" id="wc-${id}" data-id="${id}" onclick="showPopup(this)" style="position: relative; background-size: 100% 100%; display: flex; justify-content: center; align-items: center;">
              <div id="wc-${id}-loader" style="width:100%; height:100%;"></div>
          </div>
          <div class="details" id="${id}-price-details" style="display: flex; width: 100%; justify-content: space-around;">
              <span class="cost">${offer_price}</span>
              <span class="deleted" style="font-style: italic; text-decoration: line-through;">${mrp_price}</span>
              <span class="offer">${offer}%off</span>
          </div>
      </div>`);

		//loading background image
		loadBgImage(id, allWeddingCards[id]["url"], "wc");
		//loading animation inside the card till the background image is loaded
		LoadAnimation(`wc-${id}-loader`);
	}
}


// Script written by aman

/* This function will fetch the all wedding cards section first page according to the database and also the price  */
async function fetchAllWeddingData () {
	
	
	let userSessionDataObject = getLocalStorage();

	price = userSessionDataObject['priceData']
	
	
	// fetching the wedding cards data
	if(userSessionDataObject.WCmainPageCardsDetails.length == 0 || userSessionDataObject["WCmainPageCardsDetails"] == undefined)
	{
		let weddingCardData = await getData('weddingcard2/allcards/cards/first');
		weddingCardData = weddingCardData.data();
		for (index in weddingCardData) {
			allWeddingCards[weddingCardData[index][1]] = {
				url: weddingCardData[index][0],
				text_string: weddingCardData[index][3],
				category: weddingCardData[index][2],
			};
		}
		userSessionDataObject["WCmainPageCardsDetails"] = allWeddingCards;
		localStorage.setItem("userSessionData", JSON.stringify(userSessionDataObject));
	}
	else
	{
		allWeddingCards = userSessionDataObject["WCmainPageCardsDetails"];
	}

	$(`#wedding-loader`).css("display", "none");

	
	// /* all wedding cards data captured -> now load the cards */
	loadWeddingCards();

};






// Script written by Aman !

function showPopup(element) {

	let id = element.id.split("-")[1]
	window.open("./popupCard.html?cardID="+id , "_blank")
}




// This code sets the country code of the current user !
var countriesAvailable = { 'ae': 1, 'gb': 1, 'in': 1, 'my': 1, 'pk': 1, 'us': 1 }
var myCountryCode = 'in';
async function fetch_ip(path){
    let ipInfo = await fetch(path).then().catch(function () {
        alert('Unable to fetch Country Code !')
    });

	try{
		let ip_data = await ipInfo.json();
		let country_code = ip_data["countryCode"].toLowerCase();
		myCountryCode = country_code;
		if (!countriesAvailable[myCountryCode]) myCountryCode = "in"
	}
	catch{
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


// Script written by Aman End !





// this is for PopupCard.html
/* After span of specified second the bride groom name popup will be made visible on the home page */
function getBrideGroomNamePopup() {
	$("#brideGroomName").css("box-shadow", "0px 0px 100px 10000px rgba(0,0,0,0.7)");
	$("#brideGroomName").css("top", "50%");
	$("#brideGroomName").css("z-index", "10000");
	document.body.style.pointerEvents = "none";
	document.getElementById("brideGroomName").style.pointerEvents = "auto";
	// document.getElementById(`popup`).style.top = "150%";
	// document.getElementById(`popup`).style.visibility = "hidden";
	// document.getElementById(`popup`).style.transition = "top 1s ease";
}









/* this section will load all the necessary elements as the window loads */
/*****************************************************************************************************************************************************/
window.addEventListener("load", async (event) => {
	/* royal wedding card loader */
	LoadAnimation("royal-loader");
	/* all wedding card loader */
	LoadAnimation("wedding-loader");

	/*This variable is initializing new slider for the popup*/
	let mySwiper = new Swiper(".swiper-container-popup", {
		effect: "coverflow",
		grabCursor: true,
		centeredSlides: true,
		slidesPerView: "auto",

		coverflowEffect: {
			rotate: 0,
			stretch: 50,
			depth: 150,
			modifier: 1,
			slideShadows: false,
		},
	});

	let userSessionDataObject = getLocalStorage();

	if (userSessionDataObject.countryCode == 0 || userSessionDataObject.countryCode == undefined) {
		await fetch_ip("http://ip-api.com/json/")
	}
	if (userSessionDataObject.priceData == [] || userSessionDataObject.priceData == undefined) {
        await fetchPrice();
    }
	
	/*this function will fetch and load all the royal cards in the slider in royal cards section*/
	fetchRoyalData();
	/*this function will fetch and load all the wedding cards in the slider in all wedding cards section*/
	fetchAllWeddingData();

	$(document).ready(function(){
		if (!userSessionDataObject["NameChanged"] || userSessionDataObject["brideFirstName"] == "" || userSessionDataObject["groomFirstName"] == "") {
			setTimeout(() => {
				getBrideGroomNamePopup();
			}, 2000);
		}
	})
});
/****************************************************************************************************************************************************/
