const cardCategory = localStorage.getItem('cardCategory');
const cardSubCategory = localStorage.getItem('cardSubCategory');
const cardPosition = localStorage.getItem('cardPosition');
const today = new Date();
const month = today.getMonth() + 1;
const date = today.getDate();
const socialTitleMap = {
    "love": "Love You",
    "sorry": "I am Sorry",
    "wedding": "Congratulations!",
    "getwellsoon": "Get Well Soon",
    "congrats": "Congratulations!",
    "missyou": "Miss You",
    "thankyou": "Thanks a lot",
    "birthday": "Happy Birthday",
    "anniversary": "Anniversary cheers!"
}

const socialDescriptionMap = {
    "love": "I am happiest when I’m right next to you.",
    "sorry": "I messed up I know, I'm really sorry.",
    "wedding": "Best wishes on this wonderful journey.",
    "getwellsoon": "I pray you return to full health soon.",
    "congrats": "You have made us all Proud.",
    "missyou": "I miss you more than anything.",
    "thankyou": "Thank you for being the reason I smile.",
    "birthday": "You gotta smile. It’s your Birthday.",
    "anniversary": "Always knew you two had something special."
}

let docId;
let uId;
let finalLink;
let cardImageLink;
let orientation
let cardType1

const API_KEY = 'AIzaSyB9ufE0LKxUtsxVaABVChV-qCeVEgMy14U'
const cardType = localStorage.getItem('card-type')

const key = cardCategory === "feelings" ? cardSubCategory : cardCategory
    // const key=cardCategory;
const socialTitle = socialTitleMap[key]
const socialDescription = socialDescriptionMap[key]

if (cardType === 'ecard-p') {
    orientation = 'p';
    cardType1 = 'ecard';
} else if (cardType === 'ecard-l') {
    orientation = 'l';
    cardType1 = 'ecard';
} else if (cardType === 'ecard-s') {
    orientation = 's';
    cardType1 = 'ecard';
} else if (cardType === 'gcard-p') {
    orientation = 'p';
    cardType1 = 'gcard';
} else if (cardType === 'gcard-l') {
    orientation = 'l';
    cardType1 = 'gcard';
} else if (cardType === 'gcard-s') {
    orientation = 's';
    cardType1 = 'gcard';
}
localStorage.setItem("cardType", cardType1);
const musicName = localStorage.getItem('music-name')
if (musicName !== ' ') {
    $('.music-name').text(musicName)
    $('#add-music-button').text('CHANGE MUSIC')
} else {
    $('#add-music-button').text('ADD MUSIC')
}

if (cardType === 'ecard-l' || cardType === 'ecard-p' || cardType === 'ecard-s') {
    $('.download-option-container').css('display', 'block')
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        uId = user.uid
        $('.user-details-container').css('display', 'flex')
        $('.user-name-container').css('display', 'flex')
        $('.user-name').text(user.displayName)
        $('.user-profile-image-container img').attr('src', user.photoURL)
    }
});

var animation = bodymovin.loadAnimation({
    container: document.getElementById('lady-playing-guitar'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: '../animations/Lady-Playing-Guitar.json'
})

var animation1 = bodymovin.loadAnimation({
    container: document.getElementById('changing-person'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: '../animations/Changing-Illustration.json'
})

var animation2 = bodymovin.loadAnimation({
    container: document.getElementById('loader'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: '../animations/postbox.json'
})

// $('.login_main_display').on('click', function() {
//     $(this).css('display', 'none')
// })


//uploading user card image and music to storage and db 
async function uploader() {

    //rating
    const washingtonRef = firebase.firestore().doc(`rating/allrating/${cardCategory}/${cardSubCategory}`);
    try {
        washingtonRef.update(`${cardPosition}`, firebase.firestore.FieldValue.increment(1));
    } catch (err) {
        console.log(err);
    }
    //rating

    const date = new Date();
    const timeStamp = date.getTime();
    const musicLink = localStorage.getItem('music-link') ? localStorage.getItem('music-link') : ' ';

    let images = [];
    if (cardType === 'ecard-l' || cardType === 'ecard-p' || cardType === 'ecard-s') {

        const dataUrl = localStorage.getItem('ecard-image');
        const file = await fetch(dataUrl);
        const blob = await file.blob();

        const ref = firebase.storage().ref(`usercards/${month}/${date}/${uId}/${timeStamp}.jpg`);
        await ref.put(blob);

        const downloadUrl = await ref.getDownloadURL();
        const imageURI = downloadUrl.toString();
        images.push(imageURI);

    } else {
        const dataUrl1 = (localStorage.getItem('gcard-image-link-0') === " ") ? "../img/blank_portrait.png" : localStorage.getItem('gcard-image-link-0');
        const dataUrl2 = (localStorage.getItem('gcard-image-link-1') === " ") ? "../img/blank_portrait.png" : localStorage.getItem('gcard-image-link-1');
        const dataUrl3 = (localStorage.getItem('gcard-image-link-2') === " ") ? "../img/blank_portrait.png" : localStorage.getItem('gcard-image-link-2');
        const dataUrl4 = (localStorage.getItem('gcard-image-link-3') === " ") ? "../img/blank_portrait.png" : localStorage.getItem('gcard-image-link-3');

        const file1 = await fetch(dataUrl1);
        const blob1 = await file1.blob();
        const ref1 = firebase.storage().ref(`usercards/${month}/${date}/${uId}/g0-${timeStamp}.jpg`);
        await ref1.put(blob1);
        const downloadUrl1 = await ref1.getDownloadURL();
        const imageURI1 = downloadUrl1.toString();
        images.push(imageURI1);

        const file2 = await fetch(dataUrl2);
        const blob2 = await file2.blob();
        const ref2 = firebase.storage().ref(`usercards/${month}/${date}/${uId}/g1-${timeStamp}.jpg`);
        await ref2.put(blob2);
        const downloadUrl2 = await ref2.getDownloadURL();
        const imageURI2 = downloadUrl2.toString();
        images.push(imageURI2);

        const file3 = await fetch(dataUrl3);
        const blob3 = await file3.blob();
        const ref3 = firebase.storage().ref(`usercards/${month}/${date}/${uId}/g2-${timeStamp}.jpg`);
        await ref3.put(blob3);
        const downloadUrl3 = await ref3.getDownloadURL();
        const imageURI3 = downloadUrl3.toString();
        images.push(imageURI3);

        const file4 = await fetch(dataUrl4);
        const blob4 = await file4.blob();
        const ref4 = firebase.storage().ref(`usercards/${month}/${date}/${uId}/g3-${timeStamp}.jpg`);
        await ref4.put(blob4);
        const downloadUrl4 = await ref4.getDownloadURL();
        const imageURI4 = downloadUrl4.toString();
        images.push(imageURI4);
    }

    try {
        const response = await firebase.firestore().collection(`usercards/${uId}/${cardType1}`).add({
            date: timeStamp,
            imagelink: images,
            music: musicLink,
            type: cardType1,
            orientation: orientation
        })
        docId = response.id
    } catch (err) {
        console.error(err);
    }

    console.log(docId);
    console.log(uId);
    // dynamic linking updated
    try {
        const res = await fetch(`https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                "dynamicLinkInfo": {
                    "domainUriPrefix": "https://celebrare.in/userCards",
                    "link": `https://celebrare.in/finalPreviewPage/finalPreviewPage.html?docId=${docId}&uid=${uId}&cardtype=${cardType1}`,
                    "socialMetaTagInfo": {
                        "socialTitle": `${socialTitle}`,
                        "socialDescription": `${socialDescription}`,
                        "socialImageLink": `${images[0]}`,
                    },
                    "navigationInfo": {
                        "enableForcedRedirect": "1",
                    },
                }
            })
        })
        const resBody = await res.json()
        console.log("res1: "+resBody);
        const shortLink = resBody.shortLink
        console.log(resBody.previewLink);
        finalLink = shortLink
        $('#link').text(finalLink)
    } catch (err) {
        console.log(err);
    }
    //uploading user card image and music to storage and db 
}

//uploading user card image and music to storage and db 


//handling share option after authenticating the user
$('.share-link-button').on('click', async function(event) {
    event.stopPropagation()
    firebase.auth().onAuthStateChanged(async function(user) {
        if (user) {
            $('.loader-container').css('display', 'flex')
            await uploader()
            $('.loader-container').css('display', 'none')
            $('.sharing-option-popup-container').css('display', 'flex')
        } else {
            $('.login_main_display').css('display', 'flex')
        }
    });
})

$('.sharing-option-popup-container').on('click', function(event) {
    event.stopPropagation()
    $('.copy-link-button').text('Copy Link')
    $(this).css('display', 'none')
})

$('.sharing-option-popup').on('click', function(event) {
    event.stopPropagation()
})

$('#close-sharing-option-popup-container').on('click', function(event) {
    event.stopPropagation()
    $('.copy-link-button').text('Copy Link')
    $('.sharing-option-popup-container').css('display', 'none')
})

$('#facebook-share-button').on('click', function(event) {
    firebase.analytics().logEvent("Mode of using card", { "Mode": "Share using link" });
    window.open(`http://www.facebook.com/dialog/send?app_id=564571797575539&amp;link=${finalLink}&amp;redirect_uri=https://www.celebrare.in/`, '_blank')
})

$('#whatsapp-share-button').on('click', function(event) {
    firebase.analytics().logEvent("Mode of using card", { "Mode": "Share using link" });
    window.open(`whatsapp://send?text=${finalLink}`, '_blank')
})

$('.copy-link-button').on('click', function(event) {
    event.stopPropagation()
    firebase.analytics().logEvent("Mode of using card", { "Mode": "Share using link" });
    var range = document.createRange();
    range.selectNode(document.getElementById("link"));
    window.getSelection().removeAllRanges(); // clear current selection
    window.getSelection().addRange(range); // to select text
    document.execCommand("copy");
    window.getSelection().removeAllRanges()
    $(this).text('Copied')
})

$('.download-button').on('click', async function() {
    firebase.analytics().logEvent("Mode of using card", { "Mode": "Download" });
    const dataUrl = localStorage.getItem('ecard-image')
    var link = document.createElement('a');
    link.download = 'Image.jpeg';
    link.href = dataUrl;
    link.click();
})

function changeLayout(width1) {
    if (width1.matches) {
        $("#b-box").removeClass("col-3");
        $("#b-box").addClass("col-12");
        $("#b-box").css("position", "static")
        $("#m-box").removeClass("col-lg-9");
        $("#m-box").addClass("col-lg-12");
    } else {
        $("#b-box").removeClass("col-12");
        $("#b-box").addClass("col-3");
        $("#m-box").removeClass("col-lg-12");
        $("#m-box").addClass("col-lg-9");
        $("#b-box").css("position", "relative")
    }
}

var width1 = window.matchMedia("(max-width: 900px)")
changeLayout(width1); // Call listener function at run time
width1.addListener(changeLayout);



//showing login popup if user not logedin 

//login handler


$("#googleLogIn").on("click", function(event) {
    event.stopPropagation()
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
        .auth()
        .signInWithPopup(provider)
        .then(async(result) => {
            uid = result.user.uid
            const token = await result.credential.accessToken;
            const user = await result.user;
            $('.login_main_display').css('display', 'none')
            $('.loader-container').css('display', 'flex')
            await uploader()
            $('.loader-container').css('display', 'none')
            $('.sharing-option-popup-container').css('display', 'flex')
        })
        .catch(function(error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.email;
            const credential = error.credential;
            console.log(error.code, error.message);
        });
});

//showing login popup if user not logedin 


// adding different final preview pages for ecard and gcard

// if(cardType1 === "ecard") {
//     $("#final-preview-link").attr("href", "../finalPreviewPage/ecard-final-preview.html");
// }
// else {
$("#final-preview-link").attr("href", "../finalPreviewPage/finalPreviewPage.html");
// }

console.log(cardType);

const phoneInputField = document.querySelector("#phone"),
    phoneNumberRef = window.intlTelInput(phoneInputField, {
        initialCountry: "in",
        preferredCountries: ["in", "gb", "us"],
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
    });

function phoneAuth(e, t) {
    firebase.auth().signInWithPhoneNumber(e, t).then(e => {
        window.confirmationResult = e,
            $("#container1").css("display", "none"),
            $(".container2").css("display", "block")
    }).catch(e => {
        $("#error-container").html("Invalid phone number"),
            $("#error-container").css("color", "#ff0000"),
            console.log(e)
    })
}

function show() {
    var e = document.getElementById("ist").value + document.getElementById("sec").value + document.getElementById("third").value + document.getElementById("fourth").value + document.getElementById("fifth").value + document.getElementById("sixth").value;
    alert(e),
        window.confirmationResult.confirm(e).then(function(e) {
            alert("successfull");
            var t = e.user;
            console.log(t),
                $(".login_main_display").css("display", "none"),
                scrolling = 2,
                document.body.classList.remove("stop-scrolling"),
                firebase.analytics().logEvent("login", {
                    "Page title": "login-popup"
                })
        }).catch(function(e) {
            const t = e.code,
                o = e.message;
            console.log(t, o)
        })
}

function clickEvent(e, t) {
    var o = 0;
    "" == document.getElementById("ist").value ? (document.getElementById("ist").style.borderBottom = "1px solid gray",
            document.getElementById("store").disabled = !0) : (document.getElementById("ist").style.borderBottom = "2px solid black",
            o++),
        "" == document.getElementById("sec").value ? (document.getElementById("sec").style.borderBottom = "1px solid gray",
            document.getElementById("store").disabled = !0) : (document.getElementById("sec").style.borderBottom = "2px solid black",
            o++),
        "" == document.getElementById("third").value ? (document.getElementById("third").style.borderBottom = "1px solid gray",
            document.getElementById("store").disabled = !0) : (document.getElementById("third").style.borderBottom = "2px solid black",
            o++),
        "" == document.getElementById("fourth").value ? (document.getElementById("fourth").style.borderBottom = "1px solid gray",
            document.getElementById("store").disabled = !0) : (document.getElementById("fourth").style.borderBottom = "2px solid black",
            o++),
        "" == document.getElementById("fifth").value ? (document.getElementById("fifth").style.borderBottom = "1px solid gray",
            document.getElementById("store").disabled = !0) : (document.getElementById("fifth").style.borderBottom = "2px solid black",
            o++),
        "" == document.getElementById("sixth").value ? (document.getElementById("sixth").style.borderBottom = "1px solid gray",
            document.getElementById("store").disabled = !0) : (document.getElementById("sixth").style.borderBottom = "2px solid black",
            o++),
        6 == o ? (document.getElementById("store").disabled = !1,
            document.getElementById("store").style.boxShadow = "10px 10px 10px gray") : document.getElementById("store").style.boxShadow = "none",
        e.value.length && document.getElementById(t).focus()
}
$("#close-login-popup").on("click", function(e) {
    e.stopPropagation(),
        $(".login_main_display").css("display", "none")
});
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("sign-in-button", {
        size: "invisible",
        callback: e => {
            console.log("works-1"),
                phoneAuth(phoneNumberRef.getNumber(), window.recaptchaVerifier)
        }
    }),
    recaptchaVerifier.render().then(e => {
        window.recaptchaWidgetId = e
    });