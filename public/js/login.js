const phoneInputField = document.querySelector("#phone"),
    phoneNumberRef = window.intlTelInput(phoneInputField, { 
        initialCountry: "in", 
        preferredCountries: ["in", "gb", "us"], 
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js" 
    });

function phoneAuth(e, t) { firebase.auth().signInWithPhoneNumber(e, t).then(e => { window.confirmationResult = e, $("#container1").css("display", "none"), $(".container2").css("display", "block") }).catch(e => { $("#error-container").html("Invalid phone number"), $("#error-container").css("color", "#ff0000"), console.log(e) }) }

function show() {
    var e = document.getElementById("ist").value + document.getElementById("sec").value + document.getElementById("third").value + document.getElementById("fourth").value + document.getElementById("fifth").value + document.getElementById("sixth").value;
    alert(e), window.confirmationResult.confirm(e).then(function(e) {
        alert("successfull");
        var t = e.user;
        console.log(t), $(".login_main_display").css("display", "none"), scrolling = 2, document.body.classList.remove("stop-scrolling"), firebase.analytics().logEvent("login", { "Page title": "login-popup" })
    }).catch(function(e) {
        const t = e.code,
            o = e.message;
        console.log(t, o)
    })
}

function clickEvent(e, t) { var o = 0; "" == document.getElementById("ist").value ? (document.getElementById("ist").style.borderBottom = "1px solid gray", document.getElementById("store").disabled = !0) : (document.getElementById("ist").style.borderBottom = "2px solid black", o++), "" == document.getElementById("sec").value ? (document.getElementById("sec").style.borderBottom = "1px solid gray", document.getElementById("store").disabled = !0) : (document.getElementById("sec").style.borderBottom = "2px solid black", o++), "" == document.getElementById("third").value ? (document.getElementById("third").style.borderBottom = "1px solid gray", document.getElementById("store").disabled = !0) : (document.getElementById("third").style.borderBottom = "2px solid black", o++), "" == document.getElementById("fourth").value ? (document.getElementById("fourth").style.borderBottom = "1px solid gray", document.getElementById("store").disabled = !0) : (document.getElementById("fourth").style.borderBottom = "2px solid black", o++), "" == document.getElementById("fifth").value ? (document.getElementById("fifth").style.borderBottom = "1px solid gray", document.getElementById("store").disabled = !0) : (document.getElementById("fifth").style.borderBottom = "2px solid black", o++), "" == document.getElementById("sixth").value ? (document.getElementById("sixth").style.borderBottom = "1px solid gray", document.getElementById("store").disabled = !0) : (document.getElementById("sixth").style.borderBottom = "2px solid black", o++), 6 == o ? (document.getElementById("store").disabled = !1, document.getElementById("store").style.boxShadow = "10px 10px 10px gray") : document.getElementById("store").style.boxShadow = "none", e.value.length && document.getElementById(t).focus() }
    $(".login-button").on("click", function(e) { e.stopPropagation(), $(".login_main_display").css("display", "flex") }), $(".login_main_display").on("click", function(e) { e.stopPropagation(), $(this).css("display", "none") }), $(".login_page").on("click", function(e) { e.stopPropagation() }), $("#close-login-popup").on("click", function(e) { e.stopPropagation(), $(".login_main_display").css("display", "none") }), $("#googleLogIn").on("click", function(e) {
    e.stopPropagation();
    const t = new firebase.auth.GoogleAuthProvider;
    firebase.auth().signInWithPopup(t).then(async e => { $(".login_main_display").css("display", "none"), firebase.analytics().logEvent("login", { "Page title": "login-popup" }) }).catch(function(e) {
        const t = e.code,
            o = e.message;
        console.log(t, o)
    })
}), window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("sign-in-button", { size: "invisible", callback: e => { console.log("works-1"), phoneAuth(phoneNumberRef.getNumber(), window.recaptchaVerifier) } }), recaptchaVerifier.render().then(e => { window.recaptchaWidgetId = e });
