"use strict";

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
var price = {};
/*This allWeddingCards variable will store the 10 wedding cards information that will be loaded on home page */

var allWeddingCards = {};
/*This allWeddingCards variable will store the 5 royal cards information that will be loaded on home page */

var royalCards = {};
/*This dictionary is storing the scaling factor which will be multiplied to 300x450 card (rc-royal_card and wc-wedding_card) for resizing the card according to the width of screen*/

/*it is nothing but the @media queries css size of the images on the slides*/

/* reference size taken => 300x450 px card */

var scaling_factor = {
  rc: {
    1200: 1.2,
    992: 1,
    455: 0.8,
    360: 0.7,
    250: 0.55,
    0: 0.4
  },
  wc: {
    1200: 0.8,
    992: 0.7,
    480: 0.6,
    420: 0.55,
    360: 0.5,
    325: 0.45,
    300: 0.4,
    0: 0.35
  }
};
/*This dictionary is storing the break points according to the scaling factor to find the appropriate scaling factor for the card(rc-royal_card, wc-wedding_card)*/

var break_points = {
  rc: [1200, 992, 455, 360, 250, 0],
  wc: [1200, 992, 480, 420, 360, 325, 300, 0]
};
/*This variable  */

var flag = true;
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
  priceData: []
}; //******************************************************************************************************************************************//
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
    path: "./animations/loading.json"
  });
}
/*This function will return the session Storage Variable object */


function getLocalStorage() {
  var obj = {};

  if (typeof localStorage.userSessionData !== "undefined") {
    obj = JSON.parse(localStorage.userSessionData);
  }

  return obj;
}

function checkLocalStorage() {
  var empty, userSessionDataObject, obj, key;
  return regeneratorRuntime.async(function checkLocalStorage$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          empty = {};

          if (localStorage.userSessionData == undefined || localStorage.userSessionData == empty) {
            localStorage.setItem("userSessionData", JSON.stringify(userSessionData));
          }

          userSessionDataObject = getLocalStorage();
          obj = ["selectedCard", "brideFirstName", "brideLastName", "brideFatherName", "brideMotherName", "brideGFatherName", "brideGMotherName", "groomFirstName", "groomLastName", "groomFatherName", "groomMotherName", "groomGFatherName", "groomGMotherName", "weddingDate", "weddingDateFormatted", "events", "weddingSide", "sectionCardCategory", "editCardDetails", "NameChanged", "RCmainPageCards", "RCmainPageCardsDetails", "WCmainPageCardsDetails", "countryCode", "popupCardsData", "WCsectionCards", "RCsectionCards", "priceData"];
          count = 0;
          _context.t0 = regeneratorRuntime.keys(userSessionDataObject);

        case 6:
          if ((_context.t1 = _context.t0()).done) {
            _context.next = 14;
            break;
          }

          key = _context.t1.value;

          if (!(key != obj[count])) {
            _context.next = 11;
            break;
          }

          localStorage.setItem("userSessionData", JSON.stringify(userSessionData));
          return _context.abrupt("break", 14);

        case 11:
          count += 1;
          _context.next = 6;
          break;

        case 14:
          if (!(userSessionDataObject.countryCode == 0)) {
            _context.next = 17;
            break;
          }

          _context.next = 17;
          return regeneratorRuntime.awrap(fetch_ip("http://ip-api.com/json/"));

        case 17:
          if (userSessionDataObject.priceData == [] || userSessionDataObject.priceData.length == 0) {
            fetchPrice();
          }

        case 18:
        case "end":
          return _context.stop();
      }
    }
  });
} // Called in weddingcard.html

/*refer this reference details structure that would be placed on each card*/

/* according to this structure the addText() function will work for each card */
//   <div class="details" style="position:absolute; width:1000px; height:1500px; background-color:yellow; transform:scale(0.18, 0.18); transform-origin: 0% 0%;left:0px; top:0px;">
//     <span class="card-details" style="font-size: 40px; font-family: Cinzel, serif; font-weight: 700; color: rgb(255, 213, 192); top: 480px;">Wedding Invitation</span>
//     <span class="card-details" style="font-size: 70px; text-align:right; font-family: Pacifico, cursive; font-weight: 400; color: rgb(255, 213, 192); top: 520px; right: 550px;">Groom</span>
//     <span class="card-details" style="font-size: 30px; font-family: Cinzel, serif; font-weight: 700; color: rgb(255, 213, 192); top: 583.95px;">weds</span>
//     <span class="card-details" style="font-size: 70px; text-align:left;;font-family: Pacifico, cursive; font-weight: 400; color: rgb(255, 213, 192); top: 520px; left: 550px;">Bride</span>
//     <span class="card-details" style="font-size: 30px; font-family: Cinzel, serif; font-weight: 700; color: rgb(255, 213, 192); top: 667.489px;">16th, November, 2020</span>
//   </div>


addText = function addText(id, cat) {
  /*to get the desired bride and Groom Name */
  var userSessionDataObject = getLocalStorage();
  brideName = userSessionDataObject["brideFirstName"];
  groomName = userSessionDataObject["groomFirstName"];

  if (cat == "rc") {
    userSessionDataObject["RCmainPageCards"] = {
      id: cat
    };
  }

  localStorage.setItem("userSessionData", JSON.stringify(userSessionDataObject));
  var text = ["Wedding Invitation", groomName, "weds", brideName, "16th, November, 2020"];
  var text_string;
  if (cat == "wc") text_string = allWeddingCards[id]["text_string"];else text_string = royalCards[id]["text_string"];
  var splitted_text_lines = text_string.split("="); //calculating the breakpoint;

  var current_width = window.innerWidth;
  var break_point;
  var ratio = 450 / 1500;

  for (var i = 0; i < break_points[cat].length; i++) {
    if (current_width >= break_points[cat][i]) {
      break_point = break_points[cat][i];
      break;
    }
  }

  var val = ratio * scaling_factor[cat][break_point]; // console.log("all good till here")
  //declaring div details

  var created_elem_string = "<div id=\"".concat(cat, "-").concat(id, "-details\" style=\"position:absolute; width:1000px; height:1500px; transform-origin: 0% 0%; left:0px; top:0px; transform:scale(").concat(val, ", ").concat(val, "); overflow:hidden;\">");

  for (var _i = 0; _i < splitted_text_lines.length; _i++) {
    //spltting text properties for splitted text lines
    var properties = splitted_text_lines[_i].split(","); //extracting properties ;


    var font_family = properties[0];
    var font_size = properties[1];
    var color = properties[2];
    var top_margin = properties[3];
    var left_margin = properties[4];
    var extra = "";
    if (left_margin < 0) extra = "right:" + Math.abs(left_margin) + "px; text-align:right;  ";else if (left_margin > 0) extra = "left:" + left_margin + "px; text-align:left;  ";else if (left_margin == 0) extra = "left: 50%;  transform: translate(-50%, 0);";
    created_elem_string += "<span class=\"card-details\" style=\"font-size: ".concat(font_size, "px ; ").concat(fonts[font_family], " color: ").concat(color, "; top: ").concat(top_margin, "px; ").concat(extra, "\">").concat(text[_i], "</span>");
  }

  created_elem_string += "</div>";
  /* the created_elem_string contains the details structure for the card with category cat and identity no. id , after that append this details to the required card*/

  $("#".concat(cat, "-").concat(id)).append(created_elem_string);
}; // Called in weddingcard.html

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
  var current_width = window.innerWidth;
  var break_point; //as the reference card size is 300x450 and the original size is 1000x1500, thus each card must be multiplied by this ratio

  var ratio = 450 / 1500; //getting the scaling factor of the royal slides according to current width of window

  for (var i = 0; i < break_points["rc"].length; i++) {
    if (current_width >= break_points["rc"][i]) {
      break_point = break_points["rc"][i];
      break;
    }
  } //as the slides are scaled from 300x450 to their required sizes(in media queries of css) we need to get the val of scaling factor * ratio


  var val = ratio * scaling_factor["rc"][break_point]; //performing the scaling of the slides(details) :NOTE: The slides are scaled according to media queries in css , we just need to scale the details on each slide

  for (var _id in royalCards) {
    var elem = document.getElementById("rc-".concat(_id, "-details"));
    elem.style.transform = "scale(".concat(val, ", ").concat(val, ")");
  }
  /*wedding cards */


  for (var _i2 = 0; _i2 < break_points["wc"].length; _i2++) {
    if (current_width >= break_points["wc"][_i2]) {
      break_point = break_points["wc"][_i2];
      break;
    }
  }

  val = ratio * scaling_factor["wc"][break_point];

  for (var _id2 in allWeddingCards) {
    document.getElementById("wc-".concat(_id2, "-details")).style.transform = "scale(".concat(val, ", ").concat(val, ")");
  }
} // Called in weddingcard.html

/* This function will update the bride groom name on each of the cards*/


function updateBrideGroomName(brideName, groomName) {
  var userSessionDataObject = getLocalStorage();
  userSessionDataObject["brideFirstName"] = brideName;
  userSessionDataObject["groomFirstName"] = groomName;
  userSessionDataObject["NameChanged"] = true;
  localStorage.setItem("userSessionData", JSON.stringify(userSessionDataObject)); //again getting the updated userSessionDataObject;

  userSessionDataObject = getLocalStorage();
  /* royal cards */
  // script modified by aman !
  // for (let key in userSessionDataObject["RCmainPageCards"]) {
  // 	$(`#rc-${key}-details`).remove();
  // 	addText(key, "rc");
  // }
  // script modified by aman !

  for (var key in royalCards) {
    $("#rc-".concat(key, "-details")).remove();
    addText(key, "rc");
  }
  /* wedding cards */


  for (var _key in userSessionDataObject["WCmainPageCardsDetails"]) {
    $("#wc-".concat(_key, "-details")).remove();
    addText(_key, "wc");
  }
} // Called in weddingcard.html

/* This function will be called when user press done on bride groom name popup*/


function changeBrideGroomName() {
  document.body.style.pointerEvents = "auto";
  var brideNameValue = document.getElementById("PopupBrideNameMainPage").value;
  var groomNameValue = document.getElementById("PopupGroomNameMainPage").value;

  if (brideNameValue == "" || brideNameValue == undefined) {
    brideNameValue = "Bride";
  }

  if (groomNameValue == "" || groomNameValue == undefined) {
    groomNameValue = "Groom";
  }

  updateBrideGroomName(brideNameValue, groomNameValue);
  $("#brideGroomName").css("box-shadow", "none");
  $("#brideGroomName").css("top", "200%");
  setTimeout(function () {
    $("#brideGroomName").css("z-index", "-1");
  }, 2000);
}
/****************************************************************************************************************************************************/
///////////////////////////////////  SECTION 3 /////////////////////////////////////////
// this is for PopupCard.html

/*This function will be called when the user presses show royal cards or view all cards button on the home page and will store the subcategory(sectionCat) in userSessionData variable*/


loadSectionCard = function loadSectionCard(sectionCat) {
  window.location.href = "./WeddingSection.html?category=" + sectionCat;
}; // this is for PopupCard.html

/* This function will initialize the royal slider of the royal cards section, for reference visit Swiper js  : https://swiperjs.com/demos#effect-coverflow */


royalSlider = function royalSlider() {
  var swiper = new Swiper("#swiper-container-royal", {
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
      disableOnInteraction: false
    },
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      scale: 0.8,
      depth: 0,
      modifier: 0.6,
      slideShadows: false
    },
    scrollbar: {
      el: ".swiper-scrollbar",
      snapOnRelease: true,
      draggable: true
    }
  });
  $(".swiper-images").hover(function () {
    swiper.autoplay.stop();
  }, function () {
    swiper.autoplay.start();
  });
  $(".swiper-images").click(function () {
    swiper.autoplay.stop();
  }, function () {
    swiper.autoplay.start();
  });
}; // this is for PopupCard.html

/*This function will load the background image on the slide(royal slider) or card(all wedding cards sections' cards display) */

/* 
id  : the id of the card
url : the url of the image to be applied as background image
cat : category of the card whose id is passed (rc - royal card, wc- all wedding card)
*/


loadBgImage = function loadBgImage(id, url, cat) {
  var img;
  return regeneratorRuntime.async(function loadBgImage$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          // console.log(id , url , cat	)
          img = new Image();

          img.onload = function () {
            // $(`#${cat}-${id}-loader`).css("display", "none"); // this line will hide the loader from html filr
            $("#".concat(cat, "-").concat(id, "-loader")).remove(); // this line will remove the loader from html code

            document.getElementById("".concat(cat, "-").concat(id)).style.backgroundImage = "url(\"".concat(img.src, "\")");
            addText(id, cat);
          };

          img.src = url;

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
}; // this is for PopupCard.html

/* This function will just load the basic structure of slides in body  */


loadRoyalCards = function loadRoyalCards() {
  for (id in royalCards) {
    $("#royal_cards_display").append("\n\t\t<div class=\"swiper-slide\" >\n\t\t<div class=\"swiper-images\" id=\"rc-".concat(id, "\"  data-id=\"").concat(id, "\" onclick=\"showPopup(this)\"  style=\"position: relative; background-size: 100% 100%; display: flex; justify-content: center; align-items: center;\">\n              <div id=\"rc-").concat(id, "-loader\" style=\"width:100%; height:100%;\"></div>\n          </div>\n\t\t  </div>"));
    LoadAnimation("rc-".concat(id, "-loader"));
  }
  /*at last the append the slide of view all card*/


  viewAllRoyalCard();
}; // this is for PopupCard.html

/*This function will only load the single view all card slide of royal cards' section*/


viewAllRoyalCard = function viewAllRoyalCard() {
  var img;
  return regeneratorRuntime.async(function viewAllRoyalCard$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          $("#royal_cards_display").append("\n    <div class=\"swiper-slide\" >\n        <div class=\"swiper-images\" id=\"view-all-cards\" onclick=\"loadSectionCard('royal')\"  style=\"position: relative; background-size: 100% 100%; display: flex; justify-content: center; align-items: center;\">\n            <div id=\"view-all-loader\" style=\"width:100%; height:100%;\"></div>\n        </div>\n    </div>");
          LoadAnimation("view-all-loader");
          img = new Image();

          img.onload = function () {
            $("#view-all-loader").css("display", "none");
            document.getElementById("view-all-cards").style.backgroundImage = "url(\"".concat(img.src, "\")");
          };

          img.src = "https://firebasestorage.googleapis.com/v0/b/celebrare-b43da.appspot.com/o/weddingcards%2Fextras%2Fview_all.jpg?alt=media&token=d173bbe0-1e7f-43bb-a561-f4e4bfff0276";

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
}; // Script Modified by aman !

/* This function is responsible for fetching the 5 royal cards to be used in royal card section slider */


fetchRoyalData = function fetchRoyalData() {
  var userSessionDataObject, data, i;
  return regeneratorRuntime.async(function fetchRoyalData$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          userSessionDataObject = getLocalStorage();
          data = {}; // This if condition simply checks that if the browser contains the data, we fetch earlier
          //  i.e. data for the slider, if not then the code inside if condition will fetch the data
          // else the code after the condition will take the data from localstorage of the browser !

          if (!(userSessionDataObject.RCmainPageCardsDetails.length == 0 || userSessionDataObject.RCmainPageCardsDetails == undefined)) {
            _context4.next = 10;
            break;
          }

          _context4.next = 5;
          return regeneratorRuntime.awrap(getData("weddingcard2/royal"));

        case 5:
          data = _context4.sent;
          data = data.data();
          userSessionDataObject["RCmainPageCardsDetails"] = royalCards;
          _context4.next = 11;
          break;

        case 10:
          data = userSessionDataObject["RCmainPageCardsDetails"];

        case 11:
          for (i = 1; i <= 5; i++) {
            // Every id of the card is stored as a key in the global object => royalCards
            // So that we can access the data in the whole file !
            royalCards[data[i][1]] = {
              id: data[i][1],
              url: data[i][0],
              category: data[i][2],
              text_string: data[i][3]
            };
          } // Later on the loader will be removed !


          $("#royal-loader").remove(); // $("#royal-loader").css("display", "none");
          // And this loop will add the cards in swiper container !

          for (id in royalCards) {
            $("#royal_cards_display").append("\n\t\t<div class=\"swiper-slide\" >\n\t\t<div class=\"swiper-images\" id=\"rc-".concat(id, "\"  data-id=\"").concat(id, "\" onclick=\"showPopup(this)\"  style=\"position: relative; background-size: 100% 100%; display: flex; justify-content: center; align-items: center;\">\n\t\t\t  <div id=\"rc-").concat(id, "-loader\" style=\"width:100%; height:100%;\"></div>\n\t\t  </div>\n\t\t  </div>"));
            LoadAnimation("rc-".concat(id, "-loader"));
          } // This code simply detects, if the user visits the page for the first time
          // then it will start playing the slider


          if (flag) {
            royalSlider();
            flag = false;
          }
          /* Once the slides structure is loaded, load the background image(card image) and for further details refer this function*/


          for (id in royalCards) {
            loadBgImage(id, royalCards[id]["url"], "rc");
          }

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  });
}; // Script Modified by aman End!
// Script written by Aman!


function getPrice(amount) {
  var price = "";
  var onceStarted = false;

  for (var i = 0; i < amount.length; i++) {
    if (amount[i] >= 0 && amount[i] <= 9) {
      price += amount[i];
      onceStarted = true;
    } else {
      if (onceStarted) break;
    }
  }

  return parseInt(price);
}

function getdiscount(offer_price, mrp_price) {
  offer_price = getPrice(offer_price + "");
  mrp_price = getPrice(mrp_price + "");
  return 100 - offer_price * 100 / mrp_price;
} // Script written by Aman End !
// this is for PopupCard.html

/* This function will load the wedding cards.0 in the all wedding cards section  */


function loadWeddingCards() {
  // loading the structure
  console.log(allWeddingCards);

  for (id in allWeddingCards) {
    // Script modified by aman !
    var offer_price = price["".concat(allWeddingCards[id]["category"], "Price")];
    var mrp_price = price["".concat(allWeddingCards[id]["category"], "StrikePrice")];
    var offer = Math.round(getdiscount(offer_price, mrp_price)); // Script modified by aman end!

    $("#all_wedding_cards_display").append("\n      <div class=\"col-4 col-sm-4 wedding-card\">\n          <div class=\"wedding-card-image\" id=\"wc-".concat(id, "\" data-id=\"").concat(id, "\" onclick=\"showPopup(this)\" style=\"position: relative; background-size: 100% 100%; display: flex; justify-content: center; align-items: center;\">\n              <div id=\"wc-").concat(id, "-loader\" style=\"width:100%; height:100%;\"></div>\n          </div>\n          <div class=\"details\" id=\"").concat(id, "-price-details\" style=\"display: flex; width: 100%; justify-content: space-around;\">\n              <span class=\"cost\">").concat(offer_price, "</span>\n              <span class=\"deleted\" style=\"font-style: italic; text-decoration: line-through;\">").concat(mrp_price, "</span>\n              <span class=\"offer\">").concat(offer, "%off</span>\n          </div>\n      </div>")); //loading background image

    loadBgImage(id, allWeddingCards[id]["url"], "wc"); //loading animation inside the card till the background image is loaded

    LoadAnimation("wc-".concat(id, "-loader"));
  }
} // Script written by aman

/* This function will fetch the all wedding cards section first page according to the database and also the price  */


function fetchAllWeddingData() {
  var userSessionDataObject, weddingCardData;
  return regeneratorRuntime.async(function fetchAllWeddingData$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          userSessionDataObject = getLocalStorage();
          price = userSessionDataObject["priceData"]; // fetching the wedding cards data

          if (!(userSessionDataObject.WCmainPageCardsDetails.length == 0 || userSessionDataObject["WCmainPageCardsDetails"] == undefined)) {
            _context5.next = 12;
            break;
          }

          _context5.next = 5;
          return regeneratorRuntime.awrap(getData("weddingcard2/allcards/cards/first"));

        case 5:
          weddingCardData = _context5.sent;
          weddingCardData = weddingCardData.data();

          for (index in weddingCardData) {
            allWeddingCards[weddingCardData[index][1]] = {
              url: weddingCardData[index][0],
              text_string: weddingCardData[index][3],
              category: weddingCardData[index][2]
            };
          }

          userSessionDataObject["WCmainPageCardsDetails"] = allWeddingCards;
          localStorage.setItem("userSessionData", JSON.stringify(userSessionDataObject));
          _context5.next = 13;
          break;

        case 12:
          allWeddingCards = userSessionDataObject["WCmainPageCardsDetails"];

        case 13:
          $("#wedding-loader").css("display", "none"); // /* all wedding cards data captured -> now load the cards */

          loadWeddingCards();

        case 15:
        case "end":
          return _context5.stop();
      }
    }
  });
} // Script written by Aman !


function showPopup(element) {
  var id = element.id.split("-")[1];
  window.open("./popupCard.html?cardID=" + id, "_blank");
} // This code sets the country code of the current user !


var countriesAvailable = {
  ae: 1,
  gb: 1,
  "in": 1,
  my: 1,
  pk: 1,
  us: 1
};
var myCountryCode = "in";

function fetch_ip(path) {
  var ipInfo, ip_data, country_code, userSessionDataObject;
  return regeneratorRuntime.async(function fetch_ip$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(fetch(path).then()["catch"](function () {
            console.log("Unable to fetch Country Code !");
          }));

        case 2:
          ipInfo = _context6.sent;
          _context6.prev = 3;
          _context6.next = 6;
          return regeneratorRuntime.awrap(ipInfo.json());

        case 6:
          ip_data = _context6.sent;
          country_code = ip_data["countryCode"].toLowerCase();
          myCountryCode = country_code;
          if (!countriesAvailable[myCountryCode]) myCountryCode = "in";
          _context6.next = 15;
          break;

        case 12:
          _context6.prev = 12;
          _context6.t0 = _context6["catch"](3);
          myCountryCode = "in";

        case 15:
          userSessionDataObject = getLocalStorage();

          if (userSessionDataObject.countryCode == 0) {
            userSessionDataObject["countryCode"] = myCountryCode;
            localStorage.setItem("userSessionData", JSON.stringify(userSessionDataObject));
          }

        case 17:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[3, 12]]);
} // This code sets the country code of the current user !
// This code fetches the price from database, according to country code


function fetchPrice() {
  var price, userSessionDataObject;
  return regeneratorRuntime.async(function fetchPrice$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          if (!(getLocalStorage().countryCode == 0)) {
            _context7.next = 3;
            break;
          }

          _context7.next = 3;
          return regeneratorRuntime.awrap(fetch_ip("http://ip-api.com/json/"));

        case 3:
          _context7.next = 5;
          return regeneratorRuntime.awrap(getData("weddingcards/country_pricing/prices/" + myCountryCode));

        case 5:
          price = _context7.sent;
          price = price.data();
          userSessionDataObject = getLocalStorage();
          userSessionDataObject["priceData"] = price;
          localStorage.setItem("userSessionData", JSON.stringify(userSessionDataObject));

        case 10:
        case "end":
          return _context7.stop();
      }
    }
  });
} // This code fetches the price from database, according to country code
// Script written by Aman End !
// this is for PopupCard.html

/* After span of specified second the bride groom name popup will be made visible on the home page */


function getBrideGroomNamePopup() {
  $("#brideGroomName").css("box-shadow", "0px 0px 100px 10000px rgba(0,0,0,0.7)");
  $("#brideGroomName").css("top", "50%");
  $("#brideGroomName").css("z-index", "10000");
  document.body.style.pointerEvents = "none";
  document.getElementById("brideGroomName").style.pointerEvents = "auto"; // document.getElementById(`popup`).style.top = "150%";
  // document.getElementById(`popup`).style.visibility = "hidden";
  // document.getElementById(`popup`).style.transition = "top 1s ease";
}
/* this section will load all the necessary elements as the window loads */

/*****************************************************************************************************************************************************/


window.addEventListener("load", function (event) {
  /* royal wedding card loader */
  LoadAnimation("royal-loader");
  /* all wedding card loader */

  LoadAnimation("wedding-loader");
  /*This variable is initializing new slider for the popup*/

  var mySwiper = new Swiper(".swiper-container-popup", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    coverflowEffect: {
      rotate: 0,
      stretch: 50,
      depth: 150,
      modifier: 1,
      slideShadows: false
    }
  });
  console.log("before");
  $(document).ready(function () {
    console.log("after");
    var userSessionDataObject = getLocalStorage();
    setTimeout(function () {
      checkLocalStorage();
      userSessionDataObject = getLocalStorage();
    }, 1000);

    if (!userSessionDataObject["NameChanged"] || userSessionDataObject["brideFirstName"] == "" || userSessionDataObject["groomFirstName"] == "") {
      setTimeout(function () {
        console.log("Get Storage after 3000", getLocalStorage());
        getBrideGroomNamePopup();
      }, 3000);
    }

    setTimeout(function () {
      if (getLocalStorage().priceData.length == 0 || getLocalStorage().priceData == undefined) {
        fetchPrice();
      }

      if (getLocalStorage().countryCode == 0 || getLocalStorage().countryCode == undefined) {
        fetch_ip("http://ip-api.com/json/");
        console.log("Get Storage after 2000", getLocalStorage());
      }
    }, 2000);
    setTimeout(function () {
      console.log("Get Storage after 1000", getLocalStorage());
      /*this function will fetch and load all the royal cards in the slider in royal cards section*/

      fetchRoyalData();
      /*this function will fetch and load all the wedding cards in the slider in all wedding cards section*/

      fetchAllWeddingData();
    }, 1000);
  });
});
/****************************************************************************************************************************************************/