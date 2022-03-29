/*initializing the side bar slider*/
let galleryThumbs = new Swiper(".gallery-thumbs", {
	direction: "vertical",
	spaceBetween: 10,
	slidesPerView: "auto",
	freeMode: true,
	watchSlidesVisibility: true,
	watchSlidesProgress: true,
	scrollbar: {
		el: ".swiper-scrollbar",
		draggable: true,
	},
	freeMode: true,
	mousewheel: true,
});
let galleryTop = new Swiper(".gallery-top", {
	spaceBetween: 10,
	navigation: {
		nextEl: ".swiper-button-next",
		prevEl: ".swiper-button-prev",
	},
	pagination: {
		el: ".swiper-pagination",
		clickable: true,
	},
	thumbs: {
		swiper: galleryThumbs,
	},
});

galleryTop.on("slideChangeTransitionStart", function () {
	galleryThumbs.slideTo(galleryTop.activeIndex);
});

galleryThumbs.on("slideChangeTransitionStart", function () {
	galleryTop.slideTo(galleryThumbs.activeIndex);
});

/*common loaderAnimation function*/
function LoaderAnimation(elem) {
	let animation = bodymovin.loadAnimation({
		container: elem,
		renderer: "svg",
		loop: true,
		autoplay: true,
		path: "./animations/loading.json",
	});
}

/*getting the session Storage Variables*/
function getLocalStorage() {
	let obj = {};
	if (typeof localStorage.userSessionData !== "undefined") {
		obj = JSON.parse(localStorage.userSessionData);
	}
	return obj;
}

/*storage for selected card*/
let selectedCardData = {};
let totalCards = 0;
let ec_cardList = {};
let sc_cardList = {};
let cardOrder = [1, 2, 3];
let editedCardData;
let category;
/*naming notations
ec - editable cards
sc - side bar cards
rc - reorder/rearrange popup cards
*/


// Script by aman !
function getParametersID() {
	let params = {};
	let urlString = window.location.href;
	let paramString = urlString.split('?')[1];
	let queryString = new URLSearchParams(paramString);
	for (let pair of queryString.entries()) {
		params[pair[0]] = pair[1]
	}

	return params.cardID;
}
// Script by aman end !



// Script modified by aman !
fetchSelectedCardData = async () => {

	let id = getParametersID();
	if (id == undefined || id == "") window.location.href = "./weddingcard.html";


	let userSessionDataObject = getLocalStorage();
	let data = await getData('weddingcard2/allcard/cards/' + id);
	data = data.data();

	selectedCard = {
		front: data["mediumImgFrontLink"],
		back:  data["mediumImgBackLink"],
		text1: data["text1"],
		text2: data["text2"],
		text3: data["text3"],
	};
	category = data["category"];

	$("#customize-screen-loader").remove();

	loadScreenCards();
	loadScreenBgImage();


};

/* this function is dedicated for loading the basic 3 cards bg images and text*/
loadScreenBgImage = async () => {
	for (let i = 1; i <= 3; i++) {
		let img = new Image();
		img.onload = function () {
			$(`#sc-${i}-loader`).remove();
			$(`#ec-${i}-loader`).remove();

			document.getElementById(
				`ec-${i}`
			).style.backgroundImage = `url("${img.src}")`;
			document.getElementById(
				`sc-${i}`
			).style.backgroundImage = `url("${img.src}")`;
			addScreenCardText(i);
			if (i == 3) {
				loadExtraCards();
				setTimeout(function () {
					localStorage.setItem(
						"defaultFonts",
						JSON.stringify(defaultFonts.byCount())
					);
					localStorage.setItem(
						"defaultColor",
						JSON.stringify(defaultColor.byCount())
					);
				}, 1000);
				//localStorage.setItem('defaultFonts', JSON.stringify(defaultFonts.byCount()));
			}
		};

		if (i == 1) {
			imgLink = "front";
		} else {
			imgLink = "back";
		}

		img.src = selectedCard[imgLink];
	}
};

function getTextLines() {
	let userSessionDataObject = getLocalStorage();
	let text_string1, text_string2, text_string3, groomgpString, bridegpString;

	/* for generating 2nd page strings */
	let groomextra_offset = 0,
		brideextra_offset = 0;
	if (
		userSessionDataObject["groomGFatherName"] == "" &&
		userSessionDataObject["groomGMotherName"] == ""
	) {
		groomgpString = `Son of<br> ${userSessionDataObject["groomFatherName"]}  &   ${userSessionDataObject["groomMotherName"]}`;
		groomextra_offset = 50;
	} else if (userSessionDataObject["groomGFatherName"] == "") {
		groomgpString = `Son of<br> ${userSessionDataObject["groomFatherName"]}  &   ${userSessionDataObject["groomMotherName"]}<br>Grandson of<br> ${userSessionDataObject["groomGMotherName"]}`;
	} else if (userSessionDataObject["groomGMotherName"] == "") {
		groomgpString = `Son of<br> ${userSessionDataObject["groomFatherName"]}  &   ${userSessionDataObject["groomMotherName"]}<br>Grandson of<br> ${userSessionDataObject["groomGFatherName"]}`;
	} else {
		groomgpString = `Son of<br> ${userSessionDataObject["groomFatherName"]}  &   ${userSessionDataObject["groomMotherName"]}<br>Grandson of<br> ${userSessionDataObject["groomGFatherName"]}  &   ${userSessionDataObject["groomGMotherName"]}`;
	}

	if (
		userSessionDataObject["brideGFatherName"] == "" &&
		userSessionDataObject["brideGMotherName"] == ""
	) {
		bridegpString = `Daughter of<br> ${userSessionDataObject["brideFatherName"]}  &   ${userSessionDataObject["brideMotherName"]}`;
		brideextra_offset = 50;
	} else if (userSessionDataObject["brideGFatherName"] == "") {
		bridegpString = `Daughter of<br> ${userSessionDataObject["brideFatherName"]}  &   ${userSessionDataObject["brideMotherName"]}<br>Grandson of<br> ${userSessionDataObject["brideGMotherName"]}`;
	} else if (userSessionDataObject["brideGMotherName"] == "") {
		bridegpString = `Daughter of<br> ${userSessionDataObject["brideFatherName"]}  &   ${userSessionDataObject["brideMotherName"]}<br>Grandson of<br> ${userSessionDataObject["brideGFatherName"]}`;
	} else {
		bridegpString = `Daughter of<br> ${userSessionDataObject["brideFatherName"]}  &   ${userSessionDataObject["brideMotherName"]}<br>Grandson of<br> ${userSessionDataObject["brideGFatherName"]}  &   ${userSessionDataObject["brideMotherName"]}`;
	}

	/* for generating 3rd page string */
	if (userSessionDataObject["events"].length == 1) {
		text_string3 = [
			"Wedding Functions",
			"",
			"",
			`${userSessionDataObject["events"][0]["eventName"]}`,
			`${userSessionDataObject["events"][0]["eventDT"]}<br>${userSessionDataObject["events"][0]["eventVenue"]}`,
			"",
			"",
			"",
			"",
			"Your Presence is Awaited",
		];
	} else if (userSessionDataObject["events"].length == 2) {
		text_string3 = [
			"Wedding Functions",
			"",
			"",
			`${userSessionDataObject["events"][0]["eventName"]}`,
			`${userSessionDataObject["events"][0]["eventDT"]}<br>${userSessionDataObject["events"][0]["eventVenue"]}`,
			`${userSessionDataObject["events"][1]["eventName"]}`,
			`${userSessionDataObject["events"][1]["eventDT"]}<br>${userSessionDataObject["events"][0]["eventVenue"]}`,
			"",
			"",
			"Your Presence is Awaited",
		];
	} else if (userSessionDataObject["events"].length == 3) {
		text_string3 = [
			"Wedding Functions",
			`${userSessionDataObject["events"][0]["eventName"]}`,
			`${userSessionDataObject["events"][0]["eventDT"]}<br>${userSessionDataObject["events"][0]["eventVenue"]}`,
			`${userSessionDataObject["events"][1]["eventName"]}`,
			`${userSessionDataObject["events"][1]["eventDT"]}<br>${userSessionDataObject["events"][1]["eventVenue"]}`,
			`${userSessionDataObject["events"][2]["eventName"]}`,
			`${userSessionDataObject["events"][2]["eventDT"]}<br>${userSessionDataObject["events"][2]["eventVenue"]}`,
			"",
			"",
			"Your Presence is Awaited",
		];
	} else if (userSessionDataObject["events"].length == 4) {
		text_string3 = [
			"Wedding Functions",
			`${userSessionDataObject["events"][0]["eventName"]}`,
			`${userSessionDataObject["events"][0]["eventDT"]}<br>${userSessionDataObject["events"][0]["eventVenue"]}`,
			`${userSessionDataObject["events"][1]["eventName"]}`,
			`${userSessionDataObject["events"][1]["eventDT"]}<br>${userSessionDataObject["events"][1]["eventVenue"]}`,
			`${userSessionDataObject["events"][2]["eventName"]}`,
			`${userSessionDataObject["events"][2]["eventDT"]}<br>${userSessionDataObject["events"][2]["eventVenue"]}`,
			`${userSessionDataObject["events"][3]["eventName"]}`,
			`${userSessionDataObject["events"][3]["eventDT"]}<br>${userSessionDataObject["events"][3]["eventVenue"]}`,
			"Your Presence is Awaited",
		];
	}

	if (userSessionDataObject["weddingSide"] == "ladke-vale") {
		text_string1 = [
			"Wedding Invitation",
			userSessionDataObject["groomFirstName"],
			"weds",
			userSessionDataObject["brideFirstName"],
			userSessionDataObject["weddingDateFormatted"],
		];
		text_string2 = [
			"Wedding Ceremony",
			`${userSessionDataObject["groomFirstName"] +
			" " +
			userSessionDataObject["groomLastName"]
			}`,
			groomgpString,
			"With",
			`${userSessionDataObject["brideFirstName"] +
			" " +
			userSessionDataObject["brideLastName"]
			}`,
			bridegpString,
			"We request the honour of your presence and<br>blessings on the auspicious occasion of<br>the wedding ceremony of our Son.",
			groomextra_offset,
		];
	} else {
		text_string1 = [
			"Wedding Invitation",
			userSessionDataObject["brideFirstName"],
			"weds",
			userSessionDataObject["groomFirstName"],
			userSessionDataObject["weddingDateFormatted"],
		];
		text_string2 = [
			"Wedding Ceremony",
			`${userSessionDataObject["brideFirstName"] +
			" " +
			userSessionDataObject["brideLastName"]
			}`,
			bridegpString,
			"With",
			`${userSessionDataObject["groomFirstName"] +
			" " +
			userSessionDataObject["groomLastName"]
			}`,
			groomgpString,
			"We request the honour of your presence and<br>blessings on the auspicious occasion of<br>the wedding ceremony of our Son.",
			brideextra_offset,
		];
	}
	let text = [text_string1, text_string2, text_string3];
	return text;
}

let defaultFonts = [];
let defaultColor = [];

addScreenCardText = async (card_page_no) => {
	userSessionDataObject = getLocalStorage();

	let text = getTextLines();

	let text_string = selectedCard[`text${card_page_no}`];
	let splitted_text_lines = text_string.split("=");
	let currentWIdth = window.innerWidth;
	let val_ec = 0.3;
	if (currentWIdth >= 600) {
		val_ec = 0.3 * 1;
	} else {
		val_ec = 0.3 * 0.8;
	}
	let val_sc = 0.15;

	//declaring div details
	let created_elem_string_ec = `<div id = 'ec-details-${card_page_no}' class="ec-details-${card_page_no}" style="position:absolute; width:1000px; height:1500px; transform-origin: 0% 0%; left:0px; top:0px; transform:scale(${val_ec}, ${val_ec}); overflow:hidden; z-index:900;">`;
	let created_elem_string_sc = `<div class="sc-details-${card_page_no}" style="position:absolute; width:1000px; height:1500px; transform-origin: 0% 0%; left:0px; top:0px; transform:scale(${val_sc}, ${val_sc}); overflow:hidden; z-index:900;">`;

	for (let i = 0; i < splitted_text_lines.length; i++) {
		//spltting text properties for splitted text lines
		let properties = splitted_text_lines[i].split(",");
		//extracting properties ;
		let font_family = properties[0];
		defaultFonts.push(properties[0]);
		defaultColor.push(properties[2]);
		let font_size = properties[1];
		let color = properties[2];
		let top_margin = properties[3];
		let left_margin = properties[4];
		let extra = "";
		if (left_margin < 0)
			extra =
				"right:" +
				Math.abs(left_margin) +
				"px; text-align:right; transform: translate3d(0,0,0);";
		else if (left_margin > 0)
			extra =
				"left:" +
				left_margin +
				"px; text-align:left; transform: translate3d(0,0,0); ";
		else if (left_margin == 0)
			extra =
				" left: 50%;  transform: translate3d(-50%, 0, 0); text-align:center; ";
		if (card_page_no == 2 && (i == 1 || i == 2)) {
			let topMargin =
				parseInt(top_margin) + parseInt(text[card_page_no - 1][7]);
			created_elem_string_ec += `<div class="card-details" spellcheck="false" style=" width:max-content; z-index: 1; font-size: ${font_size}px ; ${fonts[font_family]
				} color: ${color}; top: ${topMargin}px; ${extra}" >${text[card_page_no - 1][i]
				}</div>`;
			created_elem_string_sc += `<div class="card-details" style="width: max-content;  font-size: ${font_size}px ; ${fonts[font_family]
				} color: ${color}; top: ${topMargin}px; ${extra}">${text[card_page_no - 1][i]
				}</span></div>`;
		} else {
			created_elem_string_ec += `<div class="card-details" spellcheck="false" style=" width: max-content; z-index: 1; font-size: ${font_size}px ; ${fonts[font_family]
				} color: ${color}; top: ${top_margin}px; ${extra}" >${text[card_page_no - 1][i]
				}</div>`;
			created_elem_string_sc += `<div class="card-details" style="width: max-content;font-size: ${font_size}px ; ${fonts[font_family]
				} color: ${color}; top: ${top_margin}px; ${extra}">${text[card_page_no - 1][i]
				}</span></div>`;
		}
	}

	created_elem_string_ec += `</div>`;
	created_elem_string_sc += `</div>`;
	if (editedCardData[`${card_page_no}`] == "") {
		$(`#ec-${card_page_no}`).append(created_elem_string_ec);
		editedCardData[`${card_page_no}`] = created_elem_string_ec;
		localStorage.setItem("editedCardData", JSON.stringify(editedCardData));
		$(`#sc-${card_page_no}`).append(created_elem_string_sc);
	} else {
		$(`#ec-${card_page_no}`).append(editedCardData[`${card_page_no}`]);
		let scDiv = editedCardData[`${card_page_no}`].replace(`ec`, `sc`);
		scDiv = scDiv.replace(`ec`, `sc`);
		scDiv = scDiv.replace(
			`transform: scale(0.24, 0.24)`,
			`transform: scale(${val_sc}, ${val_sc})`
		);
		scDiv = scDiv.replace(
			`transform: scale(0.3, 0.3)`,
			`transform: scale(${val_sc}, ${val_sc})`
		);
		scDiv = scDiv.replace(
			`transform:scale(0.3, 0.3)`,
			`transform: scale(${val_sc}, ${val_sc})`
		);
		scDiv = scDiv.replace(
			`transform:scale(0.24, 0.24)`,
			`transform: scale(${val_sc}, ${val_sc})`
		);
		changePropertiesCustomize();
		$(`#sc-${card_page_no}`).append(scDiv);
	}
};

loadScreenCards = () => {
	/*loading basic 3 cards*/
	for (let i = 1; i <= 3; i++) {
		totalCards++;

		/*main editing card(page)*/
		galleryTop.appendSlide([
			`
            <div class="swiper-slide" id="ec-${i}-container" >
                <div  class="card-images" id="ec-${totalCards}" style="position: relative; background-size: 100% 100%; display: flex; justify-content: center; align-items: center;">
                     <div id="ec-${totalCards}-loader" style="width:100%; height:100%;"></div>
                </div>
            </div>  
        `,
		]);

		/*side bar card*/
		galleryThumbs.appendSlide([
			`
            <div class="swiper-slide sc-cards thumbImages mx-auto mt-3" id="sc-${i}-container">
                <div  class="sidebar-cards" id="sc-${totalCards}" style="position: relative; background-size: 100% 100%; display: flex; justify-content: center; align-items: center;">
                     <div id="sc-${totalCards}-loader"  style="width:100%; height:100%;"></div>
                </div>
            </div>  
        `,
		]);

		LoaderAnimation(document.getElementById(`ec-${totalCards}-loader`));
		LoaderAnimation(document.getElementById(`sc-${totalCards}-loader`));
	}
};

function changePropertiesCustomize() {
	let width = window.innerWidth;
	if (width < 600) {
		$("#desktop-view-edit-button").css("display", "none");
		$("#mobile-view-edit-button").css("display", "flex");
	} else {
		$("#desktop-view-edit-button").css("display", "flex");
		$("#mobile-view-edit-button").css("display", "none");
	}

	/* cards text */
	if (width >= 600) {
		for (let i = 1; i <= totalCards; i++) {
			$(`.ec-details-${i}`).css("transform", `scale(${0.3},${0.3})`);
		}
	} else {
		for (let i = 1; i <= totalCards; i++) {
			$(`.ec-details-${i}`).css(
				"transform",
				`scale(${0.3 * 0.8},${0.3 * 0.8})`
			);
		}
	}
}

new Sortable(rpages, {
	ghostClass: "ghost",
	animation: 400, // ms, animation speed moving items when sorting, `0` — without animation
	easing: "cubic-bezier(1, 0, 0, 1)",

	chosenClass: "sortable-chosen", // Class name for the chosen item
	dragClass: "sortable-drag", // Class name for the dragging item
});

let count;

function loadRearrangePopup() {
	for (let i = 1; i <= totalCards; i++) {
		$(`#rpages`).append(`
            <li class="r-li" style="position:relative;" id="rc-${cardOrder[i - 1]
			}-container">
                        <div class="r-images" id="rc-${cardOrder[i - 1]
			}">     </div>
                        <div class="r-pageNo">   <span class="rpageNumber" >Page ${cardOrder[i - 1]
			}</span>   </div>
                        <div class="delete-images"> <img src="./img/delete_icon.png" id="deleteCard${cardOrder[i - 1]
			}" onclick="deleteCard(${cardOrder[i - 1]
			})" class="delete-images-icon"></div>
            </li>
        `);
		html2canvas(document.querySelector(`#ec-${cardOrder[i - 1]}`), {
			allowTaint: true,
			scrollY: -window.scrollY,
		}).then((canvas) => {
			document.getElementById(`rc-${cardOrder[i - 1]}`).append(canvas);
		});
	}

	count = totalCards;
}

/* this function will load rearrange cards popup */
function rearrange() {
	let elelm = document.getElementById(`reorder-page-popup`);
	elelm.style.visibility = "visible";
	captureCardData("ec");
	captureCardData("sc");
	loadRearrangePopup();
}

function cancelRearrange() {
	/*removing the popup data and its visibility*/
	let elelm = document.getElementById(`reorder-page-popup`);
	elelm.style.visibility = "hidden";
	document.getElementById("rpages").innerHTML = "";
}

function cancelNewCard() {
	$("#new-card-popup").remove();
}

/* */
function deleteCard(card_no) {
	/*removing the deleted card data from the page*/
	$(`#rc-${card_no}-container`).remove();

	/*for rc cards*/
	for (let i = card_no; i < count; i++) {
		$(`#rc-${i + 1}-container`).find(".rpageNumber")[0].innerHTML = `Page ${i}`;

		let elem = document.getElementById(`deleteCard${i + 1}`);
		$(`#deleteCard${i + 1}`).attr("onclick", `deleteCard(${i})`);
		elem.id = `deleteCard${i}`;

		elem = document.getElementById(`rc-${i + 1}-container`);
		elem.id = `rc-${i}-container`;
		elem = document.getElementById(`rc-${i + 1}`);
		elem.id = `rc-${i}`;

		ec_cardList[i] = ec_cardList[i + 1];
		sc_cardList[i] = sc_cardList[i + 1];
	}

	delete ec_cardList[count];
	delete sc_cardList[count];
	count--;
	/*updating the ec-cardList*/
}

/*this function will rearrange the cards*/
function rearrangeScreenCards() {
	let li = document.querySelectorAll(".rpageNumber");
	let reorderedPages = new Array();
	li.forEach(function (text) {
		let pNo = text.innerHTML;
		pNo = pNo.substr(5);
		reorderedPages.push(parseInt(pNo));
	});

	cardOrder = reorderedPages;

	/*got the new order of pages now applying on the page*/
	for (let i = 0; i <= totalCards; i++) {
		galleryTop.removeSlide(0);
		galleryThumbs.removeSlide(0);
	}
	totalCards = count;

	console.log(sc_cardList);
	for (let i = 0; i < totalCards; i++) {
		/*replacing the ids*/

		/*ec cards*/
		let data = ec_cardList[reorderedPages[i]].innerHTML;
		let data_string = "";
		/*convert html dom to string*/
		for (id in data) {
			data_string += data[id];
		}
		data_string = data_string.replace(/ec-\d*/, `ec-${reorderedPages[i]}`);
		data_string = data_string.replace(
			/ec-details-\d*/,
			`ec-details-${reorderedPages[i]}`
		);
		galleryTop.appendSlide(
			` <div class="swiper-slide "  id="ec-${reorderedPages[i]}-container" >  ${data_string}    </div>  `
		);

		/*sc-cards*/
		data = sc_cardList[reorderedPages[i]].innerHTML;
		data_string = "";
		for (id in data) {
			data_string += data[id];
		}
		data_string = data_string.replace(/sc-\d*/, `sc-${reorderedPages[i]}`);
		data_string = data_string.replace(
			/ec-details-\d*/,
			`ec-details-${reorderedPages[i]}`
		);
		galleryThumbs.appendSlide(
			` <div class="swiper-slide sc-cards thumbImages mx-auto mt-3" id="sc-${reorderedPages[i]}-container" > ${data_string} </div>`
		);
	}

	galleryThumbs.update();
	galleryTop.update();

	/*removing the popup data and its visibility*/
	let elelm = document.getElementById(`reorder-page-popup`);
	elelm.style.visibility = "hidden";
	document.getElementById("rpages").innerHTML = "";
}

captureCardData = (screenCardType) => {
	for (let i = 1; i <= totalCards; i++) {
		if (screenCardType == "ec") {
			ec_cardList[i] = document.getElementById(
				`${screenCardType}-${i}-container`
			);
		} else if (screenCardType == "sc") {
			sc_cardList[i] = document.getElementById(
				`${screenCardType}-${i}-container`
			);
		}
	}
};

let selected_card_img_url = "";

function addNewPage() {
	$("body").append(`
        <div style=" min-height: 95vh; position: fixed;z-index: 10000;" id="new-card-popup">
            <div id="add-new-page-popup">
                <div>
                    <ul id="add_new_card_pages">
                        <li class="r-li" onclick="selectCard(1)" id="ac-1" style="cursor:pointer;">
                            <div class="r-images">   <img src="${selectedCard["front"]}" alt="" >  </div>
                            <div class="r-pageNo">   <span class="rpageNumber" id="ac-pno-1"  style="margin:10px;">Add new front Page</span>   </div>
                        </li>
                        <li class="r-li" onclick="selectCard(2)" id="ac-2" style="cursor:pointer;">
                            <div class="r-images">   <img src="${selectedCard["back"]}" alt=""  >  </div>
                            <div class="r-pageNo">   <span class="rpageNumber" id="ac-pno-2" style="margin:10px;">Add new inside Page</span>   </div>
                        </li>
                    </ul>                
                </div>
                <div>
                    <button onclick="confirmNewCard()">Done</button>
                    <button onclick="cancelNewCard()">Cancel</button>
                </div>
            </div>
        </div>    
    `);

	//selectCard(1);
}

async function confirmNewCard() {
	totalCards++;
	galleryTop.appendSlide([
		`
        <div class="swiper-slide" id="ec-${totalCards}-container" >
            <div  class="card-images" id="ec-${totalCards}" style="position: relative; background-size: 100% 100%; display: flex; justify-content: center; align-items: center;">
                <div id="ec-${totalCards}-loader" style="width:100%; height:100%;"></div>
            </div>
        </div>  
    `,
	]);

	/*side bar card*/
	galleryThumbs.appendSlide([
		`
        <div class="swiper-slide sc-cards thumbImages mx-auto mt-3" id="sc-${totalCards}-container">
            <div  class="sidebar-cards" id="sc-${totalCards}" style="position: relative; background-size: 100% 100%; display: flex; justify-content: center; align-items: center;">
                <div id="sc-${totalCards}-loader"  style="width:100%; height:100%;"></div>
            </div>
        </div>  
    `,
	]);

	cardOrder.push(totalCards);
	galleryTop.update();
	galleryThumbs.update();

	document.getElementById(
		`ec-${totalCards}`
	).style.backgroundImage = `url("${selected_card_img_url}")`;
	await loadBgImageNewCard(selected_card_img_url, totalCards);

	LoaderAnimation(document.getElementById(`ec-${totalCards}-loader`));
	LoaderAnimation(document.getElementById(`sc-${totalCards}-loader`));
	document.getElementById(
		`ec-${totalCards}`
	).innerHTML = `<div id="ec-details-${totalCards}" class="ec-details-${totalCards}" style="position: absolute; width: 1000px; height: 1500px; transform-origin: 0% 0%; left: 0px; top: 0px; transform: scale(0.3, 0.3); overflow: hidden; z-index: 900;"></div>`;

	let obj = JSON.parse(localStorage.editedCardData);
	obj[`${totalCards}`] = document.getElementById(
		`ec-${totalCards}-container`
	).innerHTML;
	console.log(obj);
	localStorage.setItem("editedCardData", JSON.stringify(obj));

	$("#new-card-popup").remove();
	galleryThumbs.slideTo(totalCards, false, false);
	galleryTop.slideTo(totalCards, false, false);
}

function loadBgImageNewCard(url, card_no_info) {
	let img = new Image();
	img.onload = function () {
		$(`#ec-${card_no_info}-loader`).css("visibility", "hidden");
		$(`#sc-${card_no_info}-loader`).css("visibility", "hidden");
		$(`#sc-${card_no_info}-loader`).remove();
		$(`#ec-${card_no_info}-loader`).remove();

		document.getElementById(
			`ec-${card_no_info}`
		).style.backgroundImage = `url("${img.src}")`;
		document.getElementById(
			`sc-${card_no_info}`
		).style.backgroundImage = `url("${img.src}")`;
	};
	img.src = url;
}

function selectCard(no) {
	if (no == 1) {
		$(`#ac-1`).css("background-color", "red");
		$(`#ac-2`).css("background-color", "white");
		$(`#ac-2`).css("opacity", "0.3");
		$(`#ac-1`).css("opacity", "1");

		$(`#ac-pno-1`).css("color", "white");
		$(`#ac-pno-2`).css("color", "rgba(0,0,0,0.8)");
		selected_card_img_url = selectedCard["front"];
	} else if (no == 2) {
		$(`#ac-2`).css("background-color", "red");
		$(`#ac-1`).css("background-color", "white");
		$(`#ac-pno-2`).css("color", "white");
		$(`#ac-pno-1`).css("color", "rgba(0,0,0,0.8)");
		$(`#ac-2`).css("opacity", "1");
		$(`#ac-1`).css("opacity", "0.3");
		selected_card_img_url = selectedCard["back"];
	}
}

function editPage() {
	let elem = $(".swiper-slide-active").find(".card-images")[0];
	let bgimage = elem.style.backgroundImage;
	bgimage = bgimage.split(`\"`)[1];
	let editId = elem.id;
	editId = editId.split("-")[1];
	let cardDetails = document.getElementById(`ec-details-${editId}`).outerHTML;
	let obj = JSON.parse(localStorage.editCardData);
	obj["bgImage"] = bgimage;
	obj["cardDetails"] = cardDetails;
	obj["editId"] = editId;
	localStorage.setItem("editCardData", JSON.stringify(obj));
	obj = JSON.parse(localStorage.editCardData);
	window.location = "weddingPageEdit.html";
}

async function getNodes() {
	let nodes = [];
	for (let i = 1; i <= totalCards + 1; i++) {
		if (i <= totalCards) {
			nodes[i] = document.getElementById(`ec-${i}`);
			nodes[i].style.margin = "0px 0px 0px 0px";
			//console.log(node[i].innerHTML);
		} else nodes[i] = nodes[0];
	}
	return nodes;
}

async function getCards() {
	let node = await getNodes();

	function filter(node) {
		return node.tagName !== "i";
	}

	var img_height = 1500;
	var img_width = 1000;
	//localStorage.setItem(`totalcards`, totalCards);
	var ecards = [];
	for (let i = totalCards; i >= 1; i--) {
		const dataUrl = await domtoimage.toSvg(document.getElementById(`ec-${i}`), {
			filter: filter,
		});
		var img = new Image();
		var canvas1 = document.createElement("canvas");
		img.width = img_width;
		img.height = img_height;
		img.src = await dataUrl;
		img.onload = () => {
			canvas1.width = img_width;
			canvas1.height = img_height;
			canvas1.getContext("2d").drawImage(img, 0, 0, canvas1.width, canvas1.height);
			ecards[i - 1] = canvas1.toDataURL("image/jpeg", 1.0);
		};
	}
	for (let i = 1; i <= totalCards; i++) {
		node[i].style.margin = "auto";
	}
	return ecards;
}
var hexDigits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");

//Function to convert rgb color to hex format
function rgb2hex(rgb) {
	rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function hex(x) {
	return isNaN(x) ? "00" : hexDigits[(x - (x % 16)) / 16] + hexDigits[x % 16];
}
async function done_func() {
	var imagel = [], textl = [], propertyl = [], filename = '';
	var ratio = 0.3;
	if (window.innerWidth < 600) ratio = 0.24;
	for (var i = 0; i < totalCards; i++) {
		let selectedItem = document.getElementById(`ec-details-${i + 1}`).querySelectorAll(".card-details");
		// getting the image url
		var url = document.getElementById(`sc-${i + 1}`).style.backgroundImage;
		// removing the 'url(' from the start and ')' from the back to get the url
		imagel.push(url.slice(5, -2));
		var text = '', property = '';
		if (i == 0) {
			// setting the filename as groom weds bride
			filename = selectedItem[1].innerHTML + ' weds ' + selectedItem[3].innerHTML;
		}
		for (var j = 0; j < selectedItem.length; j++) {
			// Storing the text
			var temp1 = selectedItem[j].innerHTML;
			// setting all the <br> to '\n' and &amp; to & to synchronize with app version
			temp1 = temp1.replace(/<br>/g, '\n');
			temp1 = temp1.replace(/&amp;/g, '&');
			text = text + temp1;
			if (j != selectedItem.length - 1)
				text += '=';

			// storing all the properties
			var temp2 = selectedItem[j].style;
			var color = rgb2hex(temp2.color);
			let textfont = temp2.fontFamily + temp2.fontWeight + temp2.fontStyle;
			textfont = revFonts[`${textfont.replace(`'`, ``).replace(`'`, ``).replace(`"`, ``).replace(`"`, ``).replace(`,`, ``)}`];
			property = property + textfont + ',';
			property = property + temp2.fontSize.replace('px', '') + ',';
			property = property + color + ',';
			let left = selectedItem[j].getBoundingClientRect().x - document.getElementById(`ec-details-${i + 1}`).getBoundingClientRect().x;
			let top = selectedItem[j].getBoundingClientRect().y - document.getElementById(`ec-details-${i + 1}`).getBoundingClientRect().y;
			left = Math.ceil(left / ratio);
			top = Math.ceil(top / ratio);
			property = property + top + ',' + left;
			if (j != selectedItem.length - 1)
				property += '=';
		}
		textl.push(text);
		propertyl.push(property);
	}
	var currentCard = new WeddingDataClassForBackend(imagel, propertyl, textl, false, filename);
	userSessionDataObject = getLocalStorage();
	userSessionDataObject["sectionCardCategory"] = category;
	localStorage.setItem("card-type", JSON.stringify(category));
	localStorage.setItem("WeddingDataObjectForBackend", JSON.stringify(currentCard));
	console.log(localStorage.getItem("WeddingDataObjectForBackend"));

	let cards = [];
	for (let i = 1; i <= totalCards; ++i)
		cards[i - 1] = document.getElementById(`ec-${i}`).outerHTML;
	localStorage.setItem("final-card-images", JSON.stringify(cards));

	const cardType = JSON.parse(localStorage.getItem("card-type"));

	let pdoc = db.collection("weddingcards").doc("price");
	const observer = pdoc.onSnapshot(
		(docSnapshot) => {
			const priceList = docSnapshot.data();
			localStorage.setItem("card-price", JSON.stringify(priceList[`${cardType}Price`].substring(1)));
			localStorage.setItem("card-strike-price", JSON.stringify(priceList[`${cardType}StrikePrice`].substring(1)));
			window.location = "share.html";
		},
		(err) => {
			console.log(`Encountered error: ${err}`);
		}
	);
}

Array.prototype.byCount = function () {
	var itm,
		a = [],
		L = this.length,
		o = {};
	for (var i = 0; i < L; i++) {
		itm = this[i];
		if (!itm) continue;
		if (o[itm] == undefined) o[itm] = 1;
		else ++o[itm];
	}
	for (var p in o) a[a.length] = p;
	return a.sort(function (a, b) {
		return o[b] - o[a];
	});
};

function loadExtraCards() {
	for (let i = 4; i < 11; i++) {
		if (editedCardData[`${i}`] != "") {
			cardOrder.push(i);
			let ecDiv = editedCardData[`${i}`];
			//console.log(ecDiv);
			let scDiv = editedCardData[`${i}`].replace(`ec`, `sc`);
			let val_sc = 0.15;
			scDiv = scDiv.replace(`ec`, `sc`);
			scDiv = scDiv.replace(
				`transform: scale(0.3, 0.3)`,
				`transform: scale(0.15, 0.15)`
			);
			scDiv = scDiv.replace(
				`transform: scale(0.3, 0.3)`,
				`transform: scale(${val_sc}, ${val_sc})`
			);
			scDiv = scDiv.replace(
				`transform:scale(0.3, 0.3)`,
				`transform: scale(0.15, 0.15)`
			);
			scDiv = scDiv.replace(
				`transform:scale(0.24, 0.24)`,
				`transform: scale(${val_sc}, ${val_sc})`
			);
			scDiv = scDiv.replace(`card-images`, `sidebar-cards`);
			totalCards++;

			galleryTop.appendSlide([
				`
                <div class="swiper-slide" id="ec-${i}-container" >
                    ${ecDiv}
                </div>  
            `,
			]);

			/*side bar card*/
			galleryThumbs.appendSlide([
				`
                <div class="swiper-slide sc-cards thumbImages mx-auto mt-3" id="sc-${i}-container">
                    ${scDiv}
                </div>  
            `,
			]);

			changePropertiesCustomize();
		}
	}
	setTimeout(function () {
		for (let i = 4; i < 11; i++) {
			if (editedCardData[`${i}`] != "") {
				document.getElementById(`sc-details-${i}`).style.transform =
					"scale(0.15,0.15)";
			}
		}
	}, 1000);
}

window.addEventListener("load", (event) => {
	if (typeof localStorage.editCardData == "undefined") {
		let editCardData = {
			bgImage: "",
			cardDetails: "",
			editId: "",
		};
		localStorage.setItem("editCardData", JSON.stringify(editCardData));
		if (typeof localStorage.editedCardData == "undefined") {
			let editedCardData1 = {};
			for (let i = 0; i < 11; i++) editedCardData1[`${i}`] = "";
			localStorage.setItem("editedCardData", JSON.stringify(editedCardData1));
			editedCardData = editedCardData1;
		} else {
			editedCardData = JSON.parse(localStorage.editedCardData);
		}
	} else {
		if (typeof localStorage.editedCardData == "undefined") {
			let editedCardData = {};
			for (let i = 0; i < 11; i++) editedCardData[`${i}`] = "";
			localStorage.setItem("editedCardData", JSON.stringify(editedCardData));
		}
		let obj = JSON.parse(localStorage.editedCardData);
		let editCardData = JSON.parse(localStorage.editCardData);
		obj[editCardData["editId"]] = editCardData["cardDetails"];
		localStorage.setItem("editedCardData", JSON.stringify(obj));
		editedCardData = obj;
	}
	LoaderAnimation(document.getElementById("customize-screen-loader"));
	fetchSelectedCardData();

	let width = window.innerWidth;
	if (width < 600) {
		$("#desktop-view-edit-button").css("display", "none");
		$("#mobile-view-edit-button").css("display", "flex");
	} else {
		$("#desktop-view-edit-button").css("display", "flex");
		$("#mobile-view-edit-button").css("display", "none");
	}
});
