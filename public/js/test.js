/*price variable includes striked and striked */
let price = {};
/*Store the 10 wedding cards loaded on home page */
let allWeddingCards = {};
/*Store the 5 royal cards information that will be loaded on home page */
let royalCards = {};

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

/* Load animation inside the element and passed its id */
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
  let empty = {};
  if (
    localStorage.userSessionData == undefined ||
    localStorage.userSessionData == empty
  ) {
    localStorage.setItem("userSessionData", JSON.stringify(userSessionData));
  }

  let userSessionDataObject = getLocalStorage();
  let obj = [
    "selectedCard",
    "brideFirstName",
    "brideLastName",
    "brideFatherName",
    "brideMotherName",
    "brideGFatherName",
    "brideGMotherName",
    "groomFirstName",
    "groomLastName",
    "groomFatherName",
    "groomMotherName",
    "groomGFatherName",
    "groomGMotherName",
    "weddingDate",
    "weddingDateFormatted",
    "events",
    "weddingSide",
    "sectionCardCategory",
    "editCardDetails",
    "NameChanged",
    "RCmainPageCards",
    "RCmainPageCardsDetails",
    "WCmainPageCardsDetails",
    "countryCode",
    "popupCardsData",
    "WCsectionCards",
    "RCsectionCards",
    "priceData",
  ];
  count = 0;

  for (const key in userSessionDataObject) {
    if (key != obj[count]) {
      localStorage.setItem("userSessionData", JSON.stringify(userSessionData));
      break;
    }
    count += 1;
  }

  if (userSessionDataObject.countryCode == 0) {
    await fetch_ip("http://ip-api.com/json/");
  }
  if (
    userSessionDataObject.priceData == [] ||
    userSessionDataObject.priceData.length == 0
  ) {
    fetchPrice();
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

loadBgImage = async (id, url, cat) => {
  // console.log(id , url , cat	)
  let img = new Image();
  img.onload = function () {
    // $(`#${cat}-${id}-loader`).css("display", "none"); // this line will hide the loader from html filr
    $(`#${cat}-${id}-loader`).remove(); // this line will remove the loader from html code

    document.getElementById(
      `${cat}-${id}`
    ).style.backgroundImage = `url("${img.src}")`;

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
  let data = {};

  // This if condition simply checks that if the browser contains the data, we fetch earlier
  //  i.e. data for the slider, if not then the code inside if condition will fetch the data
  // else the code after the condition will take the data from localstorage of the browser !
  if (
    userSessionDataObject.RCmainPageCardsDetails.length == 0 ||
    userSessionDataObject.RCmainPageCardsDetails == undefined
  ) {
    data = await getData("weddingcard2/royal");
    data = data.data();
    userSessionDataObject["RCmainPageCardsDetails"] = royalCards;
  } else {
    data = userSessionDataObject["RCmainPageCardsDetails"];
  }

  
// Script written by Aman!
function getPrice(amount) {
  let price = "";
  let onceStarted = false;
  for (let i = 0; i < amount.length; i++) {
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

  return 100 - (offer_price * 100) / mrp_price;
}

/* This function will load the wedding cards.0 in the all wedding cards section  */
function loadWeddingCards() {
  // loading the structure
  for (id in allWeddingCards) {
    // Script modified by aman !
    let offer_price = price[`${allWeddingCards[id]["category"]}Price`];
    let mrp_price = price[`${allWeddingCards[id]["category"]}StrikePrice`];
    let offer = Math.round(getdiscount(offer_price, mrp_price));
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



/* This function will fetch the all wedding cards section first page according to the database and also the price  */
async function fetchAllWeddingData() {
  let userSessionDataObject = getLocalStorage();

  price = userSessionDataObject["priceData"];

  // fetching the wedding cards data
  if (
    userSessionDataObject.WCmainPageCardsDetails.length == 0 ||
    userSessionDataObject["WCmainPageCardsDetails"] == undefined
  ) {
    let weddingCardData = await getData("weddingcard2/allcards/cards/first");
    weddingCardData = weddingCardData.data();
    for (index in weddingCardData) {
      allWeddingCards[weddingCardData[index][1]] = {
        url: weddingCardData[index][0],
        text_string: weddingCardData[index][3],
        category: weddingCardData[index][2],
      };
    }
    userSessionDataObject["WCmainPageCardsDetails"] = allWeddingCards;
    localStorage.setItem(
      "userSessionData",
      JSON.stringify(userSessionDataObject)
    );
  } else {
    allWeddingCards = userSessionDataObject["WCmainPageCardsDetails"];
  }

  $(`#wedding-loader`).css("display", "none");

  // /* all wedding cards data captured -> now load the cards */
  loadWeddingCards();
}

function showPopup(element) {
  let id = element.id.split("-")[1];
  window.open("./popupCard.html?cardID=" + id, "_blank");
}

var countriesAvailable = { ae: 1, gb: 1, in: 1, my: 1, pk: 1, us: 1 };
var myCountryCode = "in";

async function fetch_ip(path) {
  let ipInfo = await fetch(path)
    .then()
    .catch(function () {
      console.log("Unable to fetch Country Code !");
    });

  try {
    let ip_data = await ipInfo.json();
    let country_code = ip_data["countryCode"].toLowerCase();
    myCountryCode = country_code;
    if (!countriesAvailable[myCountryCode]) myCountryCode = "in";
  } catch {
    myCountryCode = "in";
  }

  let userSessionDataObject = getLocalStorage();
  if (userSessionDataObject.countryCode == 0) {
    userSessionDataObject["countryCode"] = myCountryCode;
    localStorage.setItem(
      "userSessionData",
      JSON.stringify(userSessionDataObject)
    );
  }
}

async function fetchPrice() {
  if (getLocalStorage().countryCode == 0)
    await fetch_ip("http://ip-api.com/json/");
  let price = await getData(
    "weddingcards/country_pricing/prices/" + myCountryCode
  );
  price = price.data();
  let userSessionDataObject = getLocalStorage();
  userSessionDataObject["priceData"] = price;
  localStorage.setItem(
    "userSessionData",
    JSON.stringify(userSessionDataObject)
  );
}

window.addEventListener("load", (event) => {
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
  console.log("before");
  $(document).ready(function () {
    console.log("after");
    let userSessionDataObject = getLocalStorage();
    setTimeout(function () {
      checkLocalStorage();
      userSessionDataObject = getLocalStorage();
    }, 1000);
    if (
      !userSessionDataObject["NameChanged"] ||
      userSessionDataObject["brideFirstName"] == "" ||
      userSessionDataObject["groomFirstName"] == ""
    ) {
      setTimeout(() => {
        console.log("Get Storage after 3000", getLocalStorage());
        getBrideGroomNamePopup();
      }, 3000);
    }

    setTimeout(function () {
      if (
        getLocalStorage().priceData.length == 0 ||
        getLocalStorage().priceData == undefined
      ) {
        fetchPrice();
      }
      if (
        getLocalStorage().countryCode == 0 ||
        getLocalStorage().countryCode == undefined
      ) {
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
