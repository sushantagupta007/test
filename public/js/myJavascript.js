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
