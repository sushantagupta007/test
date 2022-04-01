//index
/*
1) global declarations (line no. 10)
2) necessary functions declarations and definitions (line no. 51)
3) window load events (analogous to main function(entry point) of any programming language)  (line no. 583)
*/

///////////////////////////////////  SECTION 1 /////////////////////////////////////////

/* global declarations of data objects for the home page*/
//******************************************************************************************************************************************//
let scaling_factor = {
	rc: { 1200: 1.2, 992: 1, 455: 0.8, 360: 0.6, 250: 0.5, 0: 0.4 },
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

let break_points = {
	rc: [1200, 992, 455, 360, 250, 0],
	wc: [1200, 992, 480, 420, 360, 325, 300, 0],
};

const LocationMap = {
	// Script modified by aman !
	allcards: ["weddingcard2/allcards/cards"],
	royal: ["weddingcard2/royal/cards"],
};

let cards = [];
let page_number = 1; //initial page no.
var price;
let section_breakpoints = {
	1200: 0.8,
	992: 0.7,
	480: 0.6,
	420: 0.55,
	360: 0.5,
	325: 0.45,
	300: 0.4,
	0: 0.35,
};
let cardCategory = "";
let lastPageNo = 10000; //arbitrary no;
//******************************************************************************************************************************************//

///////////////////////////////////  SECTION 2 /////////////////////////////////////////

/* Necessary functions declarations */
/****************************************************************************************************************************************************/

function loadAnimation(id) {
	let animation1 = bodymovin.loadAnimation({
		container: document.getElementById(id),
		renderer: "svg",
		loop: true,
		autoplay: true,
		path: "./animations/loading.json",
	});
}

/* This function is used to load the section cards according to page number */
function loadSectionCards(page) {
	// loading the structure
	$("#section-card-loader").remove();
	let userSessionDataObject = getLocalStorage()
	let price = getLocalStorage().priceData
	for (
		let card_no = (page - 1) * 15;
		card_no < page * 15 && card_no < cards.length;
		card_no++
	) {

		let url = cards[card_no][0];
		let text_string = cards[card_no][3];
		let category = cards[card_no][2];
		let id = cards[card_no][1];

		let offer_price = price[`${category}Price`].substr(1);
		if (offer_price == "ree") {
			offer_price = 0;
		}
		let ori_price = price[`${category}StrikePrice`].substr(1);
		let offer = ((ori_price - offer_price) * 100) / ori_price;
		offer = Math.round(offer);

		$("#all_wedding_cards_display").append(`
      <div class="col-4 col-sm-4 wedding-card style='height:max-content;'">
        <div class="wedding-card-image" id="wc-${id}" data-id="${id}" onclick="showPopup(this)" style="position: relative; background-size: 100% 100%; display: flex; justify-content: center; align-items: center;">
          <div id="wc-${id}-loader" style="width:100%; height:100%;"></div>
        </div>
        <div class="details" id="${id}-price-details" style="display: flex; width: 100%; justify-content: space-around;">
          <span class="cost">${price[`${category}Price`]}</span>
          <span class="deleted" style="font-style: italic; text-decoration: line-through;">
            ${price[`${category}StrikePrice`]}
          </span>
          <span class="offer">${offer}%off</span>
        </div>
      </div>`
		);

		loadSectionBgImage(id, url, text_string, "wc");

		loadAnimation(`wc-${id}-loader`);

		if (card_no == cards.length - 1) {
			document.getElementById("nextbdiv").classList.add("disabled-wrapper");
			document.getElementById("nextSectionButton").classList.add("disabled");
		}
	}
}

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
	/*currently loaded section cards*/
	let current_width = window.innerWidth;
	let break_point;
	let ratio = 450 / 1500;

	for (let i = 0; i < break_points["wc"].length; i++) {
		if (current_width >= break_points["wc"][i]) {
			break_point = break_points["wc"][i];
			break;
		}
	}
	val = ratio * scaling_factor["wc"][break_point];

	for (
		let card_no = (page_number - 1) * 15;
		card_no < page_number * 15 && card_no < cards.length;
		card_no++
	) {
		let id = cards[card_no][1];
		document.getElementById(`wc-${id}-details`).style.transform = `scale(${val}, ${val})`;
	}

	/*for popup*/

	// if (current_width < 300) {
	// 	val = ratio * 0.65;
	// } else {
	// 	val = ratio * 0.85;
	// }
	// for (let i = 1; i <= 3; i++) {
	// 	let elem2 = document.getElementById(`popup-details-${i}`);
	// 	elem2.style.transform = `scale(${val}, ${val})`;
	// }
}

loadSectionBgImage = async (id, url, text_string, cat) => {
	let img = new Image();
	img.onload = function () {
		$(`#${cat}-${id}-loader`).remove();
		document.getElementById(`wc-${id}`).style.backgroundImage = `url("${img.src}")`;
		// loaded background image - adding the text;
		addSectionText(text_string, id, cat);
	};
	img.src = url;
};

addSectionText = (text_string, id, cat) => {
	/*to get the desired bride and Groom Name */
	let userSessionDataObject = getLocalStorage();
	brideName = userSessionDataObject["brideFirstName"];
	groomName = userSessionDataObject["groomFirstName"];

	let text = [
		"Wedding Invitation",
		groomName,
		"weds",
		brideName,
		"16th, November, 2020",
	];

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

	//declaring div details
	let created_elem_string = `<div id="${cat}-${id}-details"style="position:absolute; width:1000px; height:1500px; transform-origin: 0% 0%; left:0px; top:0px; transform:scale(${val}, ${val}); overflow:hidden">`;

	for (let i = 0; i < splitted_text_lines.length; i++) {
		//splitting text properties for splitted text lines
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
			extra = "left:" + left_margin + "px; text-align:left; ";
		else if (left_margin == 0) extra = "text-align:center;";

		created_elem_string += `<span class="card-details" style="font-size: ${font_size}px ; ${fonts[font_family]} color: ${color}; top: ${top_margin}px; ${extra}">${text[i]}</span>`;
	}

	created_elem_string += `</div>`;
	$(`#${cat}-${id}`).append(created_elem_string);
};

/*getting the session Storage Variables*/
function getLocalStorage() {
	let obj = {};
	if (typeof localStorage.userSessionData !== "undefined") {
		obj = JSON.parse(localStorage.userSessionData);
	}
	return obj;
}

function loadNextSec() {
	document.getElementById(
		"all_wedding_cards_display"
	).innerHTML = `<div id="section-card-loader" class="mx-auto my-auto" style="display: flex; min-width:30%; min-height:100vh ; align-self:center;"></div>`;

	loadAnimation("section-card-loader");
	setTimeout(() => {
		$(window).scrollTop(0);
	}, 100);

	page_number++;
	if (page_number == 2) {
		let elem = document.getElementById("prevbdiv");
		elem.classList.remove("disabled-wrapper");
		let elem2 = document.getElementById("prevSectionButton");
		elem2.classList.remove("disabled");
	}
	loadSectionCards(page_number);
}

function loadPrevSec() {
	document.getElementById(
		"all_wedding_cards_display"
	).innerHTML = `<div id="section-card-loader" class="mx-auto my-auto" style="display: flex; min-width:30%; min-height:100vh ; align-self:center;"></div>`;

	loadAnimation("section-card-loader");
	setTimeout(() => {
		$(window).scrollTop(0);
	}, 100);

	page_number--;
	console.log(lastPageNo);
	if (page_number == lastPageNo - 1) {
		let elem = document.getElementById("nextbdiv");
		elem.classList.remove("disabled-wrapper");
		let elem2 = document.getElementById("nextSectionButton");
		elem2.classList.remove("disabled");
	} else if (page_number == 1) {
		let elem = document.getElementById("prevbdiv");
		elem.classList.add("disabled-wrapper");
		let elem2 = document.getElementById("prevSectionButton");
		elem2.classList.add("disabled");
	}
	loadSectionCards(page_number);
}












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
	let userSessionDataObject = getLocalStorage();

	if (userSessionDataObject.countryCode == 0) await fetch_ip("http://ip-api.com/json/");
	price = await getData('weddingcards/country_pricing/prices/' + myCountryCode);
	price = price.data();
	userSessionDataObject["priceData"] = price;
	localStorage.setItem("userSessionData", JSON.stringify(userSessionDataObject));
}
// This code fetches the price from database, according to country code




function showPopup(element) {

	let id = element.id.split("-")[1]
	window.open("./popupCard.html?cardID=" + id, "_blank")
}


// Script written by Aman End !











/* getting all documents at once */
fetchSectionData = async (category) => {
	let userSessionDataObject = getLocalStorage();
	if (userSessionDataObject.priceData == "undefined" || userSessionDataObject.priceData.length == 0) await fetchPrice();
	else price = getLocalStorage.priceData;
	
	cards = []

	console.log("category is = " , category)
	try {
		if (category == "royal") {
			console.log("in royal")
			let data = await getData('weddingcard2/royal/');
			data = data.data();
			console.log(data)
			for (id in data) {
				cards.push(data[id]);
			}
			lastPageNo = Math.floor(cards.length / 15);
			if (cards.length % 15 != 0) {
				lastPageNo++;
			}
			loadSectionCards(page_number);
			// db.collection("weddingcard2/royal")
			// .get()
			// .then(function (doc) {
			// 	let rec_data = doc.data();
			// 		for (id in rec_data) {
			// 			cards.push(rec_data[id]);
			// 		}
			// 		console.log("cards = " , cards)
			// 	})
			// 	.then(() => {
			// 		lastPageNo = Math.floor(cards.length / 15);
			// 		if (cards.length % 15 != 0) {
			// 			lastPageNo++;
			// 		}
			// 		loadSectionCards(page_number);
			// 	});

			}
		else {
			db.collection("weddingcard2/allcards/cards")
				.get()
				.then((querySnapshot) => {
					console.log("in all cards")
					querySnapshot.forEach((doc) => {
						let rec_data = doc.data();
						for (id in rec_data) {
							cards.push(rec_data[id]);
						}
						console.log("cards = " , cards)
					});
				})
				.then(() => {
					lastPageNo = Math.floor(cards.length / 15);
					if (cards.length % 15 != 0) {
						lastPageNo++;
					}
					loadSectionCards(page_number);
				});
		}
	} catch (err) {
		console.log(err);
	}
};
/****************************************************************************************************************************************************/

///////////////////////////////////  SECTION 3 /////////////////////////////////////////

/* this section will load all the necessary elements as the window loads */
/*****************************************************************************************************************************************************/


function getParametersWeddingSection() {
	let params = {};
	let urlString = window.location.href;
	let paramString = urlString.split('?')[1];
	let queryString = new URLSearchParams(paramString);
	for (let pair of queryString.entries()) {
		params[pair[0]] = pair[1]
	}

	return params;
}

window.addEventListener("load", (event) => {
	/* section card loader */

	loadAnimation("section-card-loader");

	/*getting the subcategory*/
	let params = getParametersWeddingSection();

	if (params.category == "royal") {
		document.getElementById("section-heading").innerHTML = "Royal Cards";
	} else if (params.category == "allcards") {
		document.getElementById("section-heading").innerHTML = "All Wedding Cards";
	}
	else window.location.href = "weddingcard.html";
	fetchSectionData(params.category);
});

/****************************************************************************************************************************************************/
