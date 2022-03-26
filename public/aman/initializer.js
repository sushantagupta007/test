// File Created by aman !
// Script written by aman !



// This is firebase configurations !
const firestore = firebase.firestore

const firebaseConfig = {
    apiKey: "AIzaSyB9ufE0LKxUtsxVaABVChV-qCeVEgMy14U",
    authDomain: "celebrare-b43da.firebaseapp.com",
    databaseURL: "https://celebrare-b43da.firebaseio.com",
    projectId: "celebrare-b43da",
    storageBucket: "celebrare-b43da.appspot.com",
    messagingSenderId: "460151234667",
    appId: "1:460151234667:web:22165f866c80f623d0112e",
    measurementId: "G-SGWFJJCN1E"

}

firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();
const db = firebase.firestore();



function resolve(value) {
    return value;
}

async function getData(path = 'weddingcard2/allcard/cards/Dj9mMD0D5wprjxkSpTNP') {
    // weddingcard2/allcard/cards/Dj9mMD0D5wprjxkSpTNP
    let a = await db.doc(path).get()
    return resolve(a);
}


// This is firebase configurations !














// This code sets the country code of the current user !
var countriesAvailable = { 'ae': 1, 'gb': 1, 'in': 1, 'my': 1, 'pk': 1, 'us': 1 }
var myCountryCode = null;
const fetch_ip = async (path) => {
    let ipInfo = await fetch(path).then().catch(function () {
        alert('Unable to fetch Country Code !')
    });
    let ip_data = await ipInfo.json();
    let country_code = ip_data["countryCode"].toLowerCase();
    myCountryCode = country_code;
    if (!countriesAvailable[myCountryCode]) myCountryCode = "in"

    let userSessionDataObject = getLocalStorage();
    if (userSessionDataObject.countryCode == null) {
        userSessionDataObject["countryCode"] = myCountryCode;
        localStorage.setItem("userSessionData", JSON.stringify(userSessionDataObject));
    }
}
// This code sets the country code of the current user !






// This code fetches the price from database, according to country code
async function fetchPrice() {
    if (myCountryCode == null) {
        await fetch_ip();
    }
    let price = await getData('weddingcards/country_pricing/prices/' + myCountryCode);
    price = price.data();
    console.log("price data = ");
    console.log(price);
    let userSessionDataObject = getLocalStorage();
    userSessionDataObject["priceData"] = price;
    localStorage.setItem("userSessionData", JSON.stringify(userSessionDataObject));
}
// This code fetches the price from database, according to country code












// This function checks if userSessionData is present in localstorage or not !
// If not, then this function will create it !



async function checkLocalStorage() {
    console.log('im in')
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
    let empty = {}
    if (localStorage.userSessionData == "undefined" || localStorage.userSessionData == empty) {
        localStorage.setItem("userSessionData", JSON.stringify(userSessionData));
        console.log("localstorage was undefined so i created it")
    }

    let userSessionDataObject = getLocalStorage();
    let obj = ["selectedCard", "brideFirstName", "brideLastName", "brideFatherName", "brideMotherName", "brideGFatherName", "brideGMotherName", "groomFirstName", "groomLastName", "groomFatherName", "groomMotherName", "groomGFatherName", "groomGMotherName", "weddingDate", "weddingDateFormatted", "events", "weddingSide", "sectionCardCategory", "editCardDetails", "NameChanged", "RCmainPageCards", "RCmainPageCardsDetails", "WCmainPageCardsDetails", "countryCode", "popupCardsData", "WCsectionCards", "RCsectionCards", "priceData"]
    count = 0
    console.log("now checking key !")
    for (const key in userSessionDataObject) {
        if (key != obj[count]) {

            console.log("one key was not found !")
            localStorage.setItem("userSessionData", JSON.stringify(userSessionData));
            break;
        }
        count += 1;
    }

    // userSessionDataObject = getLocalStorage();
    // if (userSessionDataObject.countryCode == 0 || userSessionDataObject.countryCode == undefined) {
    //     console.log("fetching ip address now !")
    //     let a = await fetch_ip("http://ip-api.com/json/");
        
    // }
    // if (userSessionDataObject.priceData == [] || userSessionDataObject.priceData == undefined) {
    //     console.log("fetching price now !")
    //     fetchPrice();
    // }

}
// ////////////////////////////////////////////////////////////////////////////////////




/*This function will return the session Storage Variable object */
function getLocalStorage() {
    let obj = {};
    obj = JSON.parse(localStorage.userSessionData);
    console.log("CHecking COmplete !")
    return obj;
}
/*This function will return the session Storage Variable object */

