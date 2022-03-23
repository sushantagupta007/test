let price = {};
var allWeddingCards = [];
purchased_card = false;

// $( document ).ready(() => {
//     change_layout();
//     loadWeddingCards();
//     canvasdownload1();
// });

var canvas, ctx, img, img1, img2, img3, id;
var timer;
var u = 0;
var watemarks1 = document.getElementById("watermarkswiper1");
if (watemarks1) watemarks1.style.display = "none";
var watemarks2 = document.getElementById("watermarkswiper2");
if (watemarks2) watemarks2.style.display = "none";
var watemarks3 = document.getElementById("watermarkswiper3");
if (watemarks3) watemarks3.style.display = "none";
var watemarks4 = document.getElementById("watermarkswiper4");
if (watemarks4) watemarks4.style.display = "none";
var watemarks5 = document.getElementById("watermarkswiper5");
if (watemarks5) watemarks5.style.display = "none";
var watemarks6 = document.getElementById("watermarkswiper6");
if (watemarks6) watemarks6.style.display = "none";

//user login on clicking download

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    u = 1;
    if (user.displayName == null) {
      $(".login-button").css("display", "none");
      $(".logout-button").css("display", "block");
      $(".user-profile-image-container").css("display", "none");
      $(".user-details-container").css("display", "flex");
      $(".user-name").text(user.phoneNumber);
      $(".user-name-container").css("display", "flex");
    } else {
      $(".user-details-container").css("display", "flex");
      $(".user-name").text(user.displayName);
      $(".user-profile-image-container img").attr("src", user.photoURL);
      $(".logout-button").css("display", "block");
      $(".user-name-container").css("display", "flex");
      $(".login-button").css("display", "none");
      $("#pseudo-element").css("display", "none");
    }
  } else {
    u = 0;
    $(".logout-button").css("display", "none");
    $(".login-button").css("display", "flex");
    $(".user-details-container").css("display", "none");
    $(".user-name-container").css("display", "none");
    $(".user-name").text(" ");
  }
});

$(".logout-button").on("click", function () {
  firebase
    .auth()
    .signOut()
    .then(() => {
      document.getElementById("partner-loggedin").style.display = "none";
      document.getElementById("partner-signin-modal").style.display = "flex";
    });
  $(".user-details-container").css("display", "none");
  $(".user-name-container").css("display", "none");
  $(".user-name").text(" ");
  $(this).css("display", "none");
  window.location.reload();
});

$(".user-name-container").on("click", function () {
  firebase.auth().signOut();
  $(".user-details-container").css("display", "none");
  $(".user-name-container").css("display", "none");
  $(".user-name").text(" ");
  $(this).css("display", "none");
  window.location.reload();
});

var scrolling;
$(".login-button").on("click", function (event) {
  scrolling = 1;
  event.stopPropagation();
  $("#phone_div").css("display", "block");
  $(".login_main_display").css("display", "flex");
  $(".container").css("display", "block");
  $(".container2").css("display", "none");
  window.scrollTo({ top: 0, behavior: "smooth" });
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop == 0 && scrolling == 1) {
    document.body.classList.add("stop-scrolling");
  }
  window.onscroll = function () {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop == 0 && scrolling == 1) {
      document.body.classList.add("stop-scrolling");
    }
  };
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    "recaptcha-container",
    { size: "invisible" }
  );
  recaptchaVerifier.render();
});
//   $('#download1').on('click',function(event){
//     scrolling=1;
//     event.stopPropagation()
//     $('#phone_div').css('display','block')
//     $('.login_main_display').css('display','flex')
//     $('.container').css('display','block')
//     $('.container2').css('display','none')
//     window.scrollTo({top:0, behavior: 'smooth'})
//         var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//         if(scrollTop==0 && scrolling==1){
//             document.body.classList.add("stop-scrolling");
//         }
//         window.onscroll = function() {
//             var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//             if(scrollTop==0 && scrolling==1){
//                 document.body.classList.add("stop-scrolling");
//             }
//         }
//     window.recaptchaVerifier= new firebase.auth.RecaptchaVerifier('recaptcha-container',{size: "invisible"});
//     recaptchaVerifier.render();
//   })

$(".login_page").on("click", function (event) {
  event.stopPropagation();
});
$("#close-login-popup").on("click", function (event) {
  scrolling = 2;
  event.stopPropagation();
  $(".login_main_display").css("display", "none");
  document.body.classList.remove("stop-scrolling");
});

$("#googleLogIn1").on("click", function (event) {
  event.stopPropagation();
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(async (result) => {
      $(".login_main_display").css("display", "none");
      scrolling = 2;
      document.body.classList.remove("stop-scrolling");
      firebase.analytics().logEvent("login", { "Page title": "login-popup" });
    })
    .catch(function (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
});
$("#googleLogIn2").on("click", function (event) {
  event.stopPropagation();
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(async (result) => {
      $(".login_main_display").css("display", "none");
      scrolling = 2;
      document.body.classList.remove("stop-scrolling");
      firebase.analytics().logEvent("login", { "Page title": "login-popup" });
    })
    .catch(function (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
});

// const phoneInputField = document.querySelector("#phone");
const phoneInput = window.intlTelInput(phoneInputField, {
  preferredCountries: ["in", "gb", "us"],
  utilsScript:
    "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
});
function process(event) {
  event.preventDefault();

  const phoneNumber = phoneInput.getNumber();
  localStorage.setItem("no", phoneNumber);
  alert(phoneNumber);
  firebase
    .auth()
    .signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
    .then(function (confirmationResult) {
      window.confirmationResult = confirmationResult;
      coderesult = confirmationResult;
      console.log(coderesult);
      //alert("message sent");
      $(".container").css("display", "none");
      $(".container2").css("display", "block");
      $("#no_bold").append(phoneNumber);
      document.getElementById("store").disabled = true;
    })
    .catch(function (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
}
function resend() {
  var num = localStorage.getItem("no");
  firebase
    .auth()
    .signInWithPhoneNumber(num, window.recaptchaVerifier)
    .then(function (confirmationResult) {
      window.confirmationResult = confirmationResult;
      coderesult = confirmationResult;
      console.log(coderesult);
      alert("message sent");
      $(".container").css("display", "none");
      $(".container2").css("display", "block");
      document.getElementById("store").disabled = true;
    })
    .catch(function (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
}

//   function phoneauth(){
//       var number=document.getElementById('number').value;
//       firebase.auth().signInWithPhoneNumber(number,window.recaptchaVerifier).then(function(confirmationResult){

//           window.confirmationResult= confirmationResult;
//           coderesult=confirmationResult;
//           console.log(coderesult);
//           alert("message sent");
//       })
//       .catch(function (error) {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         console.log(errorCode,errorMessage);
//       });
//   }
function show() {
  var otp =
    document.getElementById("ist").value +
    document.getElementById("sec").value +
    document.getElementById("third").value +
    document.getElementById("fourth").value +
    document.getElementById("fifth").value +
    document.getElementById("sixth").value;
  alert(otp);
  coderesult
    .confirm(otp)
    .then(function (result) {
      alert("successfull");
      var user = result.user;
      console.log(user);
      $(".login_main_display").css("display", "none");
      scrolling = 2;
      document.body.classList.remove("stop-scrolling");
      firebase.analytics().logEvent("login", { "Page title": "login-popup" });
    })
    .catch(function (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
}

function clickEvent(first, last) {
  var c = 0;
  if (document.getElementById("ist").value == "") {
    document.getElementById("ist").style.borderBottom = "1px solid gray";
    document.getElementById("store").disabled = true;
  } else {
    document.getElementById("ist").style.borderBottom = "2px solid black";
    c++;
  }
  if (document.getElementById("sec").value == "") {
    document.getElementById("sec").style.borderBottom = "1px solid gray";
    document.getElementById("store").disabled = true;
  } else {
    document.getElementById("sec").style.borderBottom = "2px solid black";
    c++;
  }
  if (document.getElementById("third").value == "") {
    document.getElementById("third").style.borderBottom = "1px solid gray";
    document.getElementById("store").disabled = true;
  } else {
    document.getElementById("third").style.borderBottom = "2px solid black";
    c++;
  }
  if (document.getElementById("fourth").value == "") {
    document.getElementById("fourth").style.borderBottom = "1px solid gray";
    document.getElementById("store").disabled = true;
  } else {
    document.getElementById("fourth").style.borderBottom = "2px solid black";
    c++;
  }
  if (document.getElementById("fifth").value == "") {
    document.getElementById("fifth").style.borderBottom = "1px solid gray";
    document.getElementById("store").disabled = true;
  } else {
    document.getElementById("fifth").style.borderBottom = "2px solid black";
    c++;
  }
  if (document.getElementById("sixth").value == "") {
    document.getElementById("sixth").style.borderBottom = "1px solid gray";

    document.getElementById("store").disabled = true;
  } else {
    document.getElementById("sixth").style.borderBottom = "2px solid black";
    c++;
  }
  if (c == 6) {
    document.getElementById("store").disabled = false;
    document.getElementById("store").style.boxShadow = "10px 10px 10px gray";
  } else {
    document.getElementById("store").style.boxShadow = "none";
  }
  if (first.value.length) {
    document.getElementById(last).focus();
  }
}

//   function codeverify(){
//       var code=document.getElementById('verificationcode').value;
//       coderesult.confirm(code).then(function(result){
//           alert("successfull");
//           var user=result.user;
//           console.log(user);
//           $('.login_main_display').css('display','none');
//       })
//       .catch(function (error) {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         console.log(errorCode,errorMessage);
//       });
//   }

document.getElementById("see_all_mockup").onclick = function () {
  location.href = "./all_mockup.html";
};
document.getElementById("see_all_mockup_mob").onclick = function () {
  location.href = "./all_mockup.html";
};
function change_layout() {
  document.getElementById("mockupbox1").style.display = "none";
  document.getElementById("mockup_div").style.display = "block";
  document.getElementById("mob_pricing").style.display = "none ";
  localStorage.setItem("with_mockup", 0);
  var script = document.createElement("script");
  script.type = "text/javascript";

  script.src = "https://unpkg.com/swiper/swiper-bundle.min.js";
  document.body.appendChild(script);
  var mySwiper2 = new Swiper(".swiper2", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",

    coverflowEffect: {
      rotate: 0,
      stretch: 100,
      depth: 150,
      modifier: 1,
      slideShadows: false,
    },

    pagination: {
      el: ".swiper-pagination2",
    },
  });
  id = localStorage.getItem("data-id");
  function load1() {
    loadWeddingCards1();
  }
  function loadWeddingCards1() {
    let offer_price = price[`price`].substr(1);
    if (offer_price == "ree") {
      offer_price = 0;
    } else {
    }
    let ori_price = price[`strikePrice`].substr(1);
    let offer = ((ori_price - offer_price) * 100) / ori_price;
    offer = Math.round(offer);
    $("#mockup2").append(`
                   <div  style="display:flex;height:100%;justify-content: center;" id="canvas_price_div-1">
                   <div  id="canvas_div-1" style="position: relative; background-size: 100% 100%; display: flex; justify-content: center; align-items: center;">
                   <canvas id="canvas-1" style="justify-content: center;display: flex;height:100% ; width: 100%; border: 2px solid rgb(189, 186, 186);border-radius: 15px;"></canvas>
                   </div>
                   </div>`);
    var loader = document.getElementById("loader2");

    var paybutton1 = document.getElementById("rzp-button2");
    var paybutton2 = document.getElementById("rzp-button3");
    var downloadbutton2 = document.getElementById("download2");
    var downloadbutton3 = document.getElementById("download3");
    canvas = document.getElementById("canvas-1");
    canvas_pd = document.getElementById("canvas_price_div-1");
    ctx = canvas.getContext("2d");

    img = new Image();
    img1 = new Image();
    img2 = new Image();
    img3 = new Image();

    //img.crossOrigin = 'Anonymous';
    c = 0;
    img.addEventListener(
      "load",
      function () {
        canvas.height = 1000;
        canvas.width = 1000;
        ctx.drawImage(img, 0, 0, 1000, 1000);
        ctx.save();
        img1.addEventListener(
          "load",
          function () {
            ctx.translate(
              Number(allWeddingCards[c]["data12"][2]) +
                Number(allWeddingCards[c]["data12"][0]) * 0.667 * 0.5,
              Number(allWeddingCards[c]["data12"][1]) +
                Number(allWeddingCards[c]["data12"][0]) * 0.5
            );
            ctx.rotate(allWeddingCards[c]["data12"][3] * 0.0175);
            ctx.translate(
              -Number(allWeddingCards[c]["data12"][2]) -
                Number(allWeddingCards[c]["data12"][0]) * 0.667 * 0.5,
              -Number(allWeddingCards[c]["data12"][1]) -
                Number(allWeddingCards[c]["data12"][0]) * 0.5
            );
            ctx.shadowColor = "black";
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
            ctx.drawImage(
              img1,
              Number(allWeddingCards[c]["data12"][2]),
              Number(allWeddingCards[c]["data12"][1]),
              Number(allWeddingCards[c]["data12"][0]) * 0.667,
              Number(allWeddingCards[c]["data12"][0])
            );
            ctx.restore();
            ctx.save();
            img2.addEventListener(
              "load",
              function () {
                ctx.translate(
                  Number(allWeddingCards[c]["data11"][2]) +
                    Number(allWeddingCards[c]["data11"][0]) * 0.667 * 0.5,
                  Number(allWeddingCards[c]["data11"][1]) +
                    Number(allWeddingCards[c]["data11"][0]) * 0.5
                );
                ctx.rotate(Number(allWeddingCards[c]["data11"][3]) * 0.0175);
                ctx.translate(
                  -Number(allWeddingCards[c]["data11"][2]) -
                    Number(allWeddingCards[c]["data11"][0]) * 0.667 * 0.5,
                  -Number(allWeddingCards[c]["data11"][1]) -
                    Number(allWeddingCards[c]["data11"][0]) * 0.5
                );
                ctx.shadowColor = "black";
                ctx.shadowBlur = 10;
                ctx.shadowOffsetX = 5;
                ctx.shadowOffsetY = 5;
                ctx.drawImage(
                  img2,
                  Number(allWeddingCards[c]["data11"][2]),
                  Number(allWeddingCards[c]["data11"][1]),
                  Number(allWeddingCards[c]["data11"][0]) * 0.667,
                  Number(allWeddingCards[c]["data11"][0])
                );
                ctx.restore();
                ctx.save();
                img3.addEventListener(
                  "load",
                  function () {
                    ctx.drawImage(img3, 0, 0, 1000, 1000);
                    ctx.restore();
                    ctx.save();
                    loader.style.display = "none";
                    canvas_pd.style.display = "block";
                    paybutton1.style.display = "block";
                    paybutton2.style.display = "block";
                    downloadbutton2.style.display = "block";
                    downloadbutton3.style.display = "block";
                    if (flag == 0) {
                      load();
                    } else {
                      return;
                    }
                  },
                  false
                );
                img3.src = allWeddingCards[c]["url2"];
                //img3.src='./imgg/upper_image.png';
              },
              false
            );
            img2.src = "./imgg/front.jpg";
          },
          false
        );
        img1.src = "./imgg/back.jpg";
      },
      false
    );
    //img.src ="./imgg/lower_image1.jpg";
    img.src = allWeddingCards[c]["url1"];
  }

  fetchtrialmockup1 = async () => {
    setTimeout(() => {
      try {
        if (id == null) {
          db.doc(`weddingcards/extras/mockups/price`)
            .get()
            .then((snapshot) => {
              /* storing price data that we got from price field from firebase into price var in js*/
              price = snapshot.data();
              /* after retrieving price - now extracting data for all wedding cards - first page*/
              db.doc(`weddingcards/extras/mockups/trial`)
                .get()
                .then((snapshot_card) => {
                  let weddingCardData = snapshot_card.data();
                  var arr1 = weddingCardData["prop1"].split("=");

                  var arr2 = weddingCardData["prop2"].split("=");
                  allWeddingCards[0] = {
                    //
                    url1: weddingCardData["bottomLink"],
                    url2: weddingCardData["topLink"],
                    data11: arr1,
                    data12: arr2,
                  };
                  // $(`#wedding-loader`).css('display', 'none');
                  /* all wedding cards data captured -> now load the cards */
                })
                .then(() => {
                  load1();
                });
            });
        } else {
          db.doc(`weddingcards/extras/mockups/price`)
            .get()
            .then((snapshot) => {
              /* storing price data that we got from price field from firebase into price var in js*/
              price = snapshot.data();
              /* after retrieving price - now extracting data for all wedding cards - first page*/
              db.doc(`weddingcards/extras/mockups/mockupList`)
                .get()
                .then((snapshot_card) => {
                  let weddingCardData = snapshot_card.data();
                  var arr1 = weddingCardData[id][2].split("=");
                  var arr2 = weddingCardData[id][3].split("=");
                  allWeddingCards[0] = {
                    //
                    url1: weddingCardData[id][1],
                    url2: weddingCardData[id][0],
                    data11: arr1,
                    data12: arr2,
                  };
                })
                .then(() => {
                  load1();
                });
            });
        }
      } catch (err) {
        console.log(err);
      }
    }, 0);
  };
  fetchtrialmockup1();
}
function change_layout2() {
  document.getElementById("mainbox1").style.display = "block";
  document.getElementById("mainbox2").style.display = "none";
}
var animation = bodymovin.loadAnimation({
  container: document.getElementById("animation1"),
  renderer: "svg",
  loop: true,
  autoplay: true,
  path: "./animations/loading.json",
});
var animation = bodymovin.loadAnimation({
  container: document.getElementById("animation2"),
  renderer: "svg",
  loop: true,
  autoplay: true,
  path: "./animations/loading.json",
});
var animation = bodymovin.loadAnimation({
  container: document.getElementById("animation3"),
  renderer: "svg",
  loop: true,
  autoplay: true,
  path: "./animations/loading.json",
});

var canvas1,
  swimg1,
  dataUrlsw,
  swiperimg1,
  ctxsw,
  dataUrlsw2,
  dataUrlsw3,
  canvas2,
  canvas3,
  swimg3,
  swimg3,
  swiperimg2,
  swiperimg3,
  ctxsw2,
  ctxsw3;
var x = 0; //x=0 if both mockup and swiper needs to be downloaded and x=1 if only swiper needs to be downloaded
//for downloading with mockup
function downloadswiper() {
  const vm = localStorage.getItem("with_mockup");
  const mockwatermark = localStorage.getItem("mockwatermark");
  if (x == 0 || vm == 1) {
    if (mockwatermark == 0) {
      const dataUrl = localStorage.getItem("canvasimage");
      var link = document.createElement("a");
      link.download = "Image.jpeg";
      link.href = dataUrl;
      link.click();
    } else {
      const dataUrl = localStorage.getItem("mockimage");
      var link = document.createElement("a");
      link.download = "Image.jpeg";
      link.href = dataUrl;
      link.click();
    }
  }
  var doc = new jsPDF(); // Creating the jsPDF Instance
  var createPDF = function () {
    // creating function to add images to doc

    var img = new Image(); //importing image data
    img.src = localStorage.getItem("swimg1");
    img.onload = function () {
      //waiting till the image is loaded
      doc.addImage(img, "JPEG", 0, 0, 210, 297, "invite_1", undefined, 'FAST'); //adding image to the pdf page, stretching it to make it fit the whole page
      doc.addPage(); // adding another page
      var img2 = new Image(); // importing the 2nd image and repeating the same process
      img2.src = localStorage.getItem("swimg2");
      img2.onload = function () {
        doc.addImage(img2, "JPEG", 0, 0, 210, 297, "invite_2", undefined, 'FAST');
        doc.addPage();
        var img3 = new Image();
        img3.src = localStorage.getItem("swimg3");
        img3.onload = function () {
          doc.addImage(img3, "JPEG", 0, 0, 210, 297, "invite_3", undefined, 'FAST');
          doc.save("Invitation1.pdf");
        };
      };
    };
  };
  createPDF();
}
//for downloading without mockup
function downloadswiper2() {
  var doc = new jsPDF(); // Creating the jsPDF Instance
  var createPDF = function () {
    // creating function to add images to doc

    var img = new Image(); //importing image data
    img.src = localStorage.getItem("swimg1");
    img.onload = function () {
      //waiting till the image is loaded
      doc.addImage(img, "JPEG", 0, 0, 210, 297, "invite_1", undefined, 'FAST'); //adding image to the pdf page, stretching it to make it fit the whole page
      doc.addPage(); // adding another page
      var img2 = new Image(); // importing the 2nd image and repeating the same process
      img2.src = localStorage.getItem("swimg2");
      img2.onload = function () {
        doc.addImage(img2, "JPEG", 0, 0, 210, 297, "invite_2", undefined, 'FAST');
        doc.addPage();
        var img3 = new Image();
        img3.src = localStorage.getItem("swimg3");
        img3.onload = function () {
          doc.addImage(img3, "JPEG", 0, 0, 210, 297, "invite_3", undefined, 'FAST');
          doc.save("Invitation1.pdf");
        };
      };
    };
  };
  createPDF();
}

$("#download2").on("click", async function (event) {
  if (u == 0) {
    scrolling = 1;
    event.stopPropagation();
    $("#phone_div").css("display", "block");
    $(".login_main_display").css("display", "flex");
    $(".container").css("display", "block");
    $(".container2").css("display", "none");
    window.scrollTo({ top: 0, behavior: "smooth" });
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop == 0 && scrolling == 1) {
      document.body.classList.add("stop-scrolling");
    }
    window.onscroll = function () {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop == 0 && scrolling == 1) {
        document.body.classList.add("stop-scrolling");
      }
    };
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      { size: "invisible" }
    );
    recaptchaVerifier.render();
  } else {
    x = 1;
    var watemarks4 = document.getElementById("watermarkswiper4");
    watemarks4.style.display = "block";
    swiperimg1 = document.getElementById("swiper2-img1");
    dataUrlsw = await domtoimage.toSvg(swiperimg1);
    swimg1 = new Image();
    canvas1 = document.getElementById("canvas_download1");
    swimg1.src = dataUrlsw;
    swimg1.addEventListener("load", async function () {
      //alert("hi")
      var watemarks4 = document.getElementById("watermarkswiper4");
      watemarks4.style.display = "none";
      ctxsw = canvas1.getContext("2d");
      canvas1.height = 2000;
      canvas1.width = 2000;
      ctxsw.drawImage(swimg1, 0, 0, 2000, 2000);
      localStorage.setItem("swimg1", canvas1.toDataURL("image/jpeg"));
      console.log(localStorage.getItem("swimg1"));
      var watemarks5 = document.getElementById("watermarkswiper5");
      watemarks5.style.display = "block";
      swiperimg2 = document.getElementById("swiper2-img2");
      dataUrlsw2 = await domtoimage.toSvg(swiperimg2);
      swimg2 = new Image();
      canvas2 = document.getElementById("canvas_download2");
      swimg2.src = dataUrlsw2;

      swimg2.addEventListener("load", async function () {
        //alert("hi")
        var watemarks5 = document.getElementById("watermarkswiper5");
        watemarks5.style.display = "none";
        ctxsw2 = canvas2.getContext("2d");
        canvas2.height = 2000;
        canvas2.width = 2000;
        ctxsw2.drawImage(swimg2, 0, 0, 2000, 2000);
        localStorage.setItem("swimg2", canvas2.toDataURL("image/jpeg"));
        console.log(localStorage.getItem("swimg2"));
        var watemarks6 = document.getElementById("watermarkswiper6");
        watemarks6.style.display = "block";
        swiperimg3 = document.getElementById("swiper2-img3");
        dataUrlsw3 = await domtoimage.toSvg(swiperimg3);
        swimg3 = new Image();
        canvas3 = document.getElementById("canvas_download3");
        swimg3.src = dataUrlsw3;
        swimg3.addEventListener("load", async function () {
          //alert("hi")
          var watemarks6 = document.getElementById("watermarkswiper6");
          watemarks6.style.display = "none";
          ctxsw3 = canvas3.getContext("2d");
          canvas3.height = 2000;
          canvas3.width = 2000;
          ctxsw3.drawImage(swimg3, 0, 0, 2000, 2000);
          localStorage.setItem("swimg3", canvas3.toDataURL("image/jpeg"));
          console.log(localStorage.getItem("swimg3"));
          downloadswiper2();
        });
      });
    });
  }
});
$("#download3").on("click", async function (event) {
  if (u == 0) {
    scrolling = 1;
    event.stopPropagation();
    $("#phone_div").css("display", "block");
    $(".login_main_display").css("display", "flex");
    $(".container").css("display", "block");
    $(".container2").css("display", "none");
    window.scrollTo({ top: 0, behavior: "smooth" });
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop == 0 && scrolling == 1) {
      document.body.classList.add("stop-scrolling");
    }
    window.onscroll = function () {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop == 0 && scrolling == 1) {
        document.body.classList.add("stop-scrolling");
      }
    };
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      { size: "invisible" }
    );
    recaptchaVerifier.render();
  } else {
    x = 1;
    var watemarks4 = document.getElementById("watermarkswiper4");
    watemarks4.style.display = "block";
    swiperimg1 = document.getElementById("swiper2-img1");
    dataUrlsw = await domtoimage.toSvg(swiperimg1);
    swimg1 = new Image();
    canvas1 = document.getElementById("canvas_download1");
    swimg1.src = dataUrlsw;
    swimg1.addEventListener("load", async function () {
      //alert("hi")
      var watemarks4 = document.getElementById("watermarkswiper4");
      watemarks4.style.display = "none";
      ctxsw = canvas1.getContext("2d");
      canvas1.height = 2000;
      canvas1.width = 2000;
      ctxsw.drawImage(swimg1, 0, 0, 2000, 2000);
      localStorage.setItem("swimg1", canvas1.toDataURL("image/jpeg"));
      console.log(localStorage.getItem("swimg1"));
      var watemarks5 = document.getElementById("watermarkswiper5");
      watemarks5.style.display = "block";
      swiperimg2 = document.getElementById("swiper2-img2");
      dataUrlsw2 = await domtoimage.toSvg(swiperimg2);
      swimg2 = new Image();
      canvas2 = document.getElementById("canvas_download2");
      swimg2.src = dataUrlsw2;

      swimg2.addEventListener("load", async function () {
        //alert("hi")
        var watemarks5 = document.getElementById("watermarkswiper5");
        watemarks5.style.display = "none";
        ctxsw2 = canvas2.getContext("2d");
        canvas2.height = 2000;
        canvas2.width = 2000;
        ctxsw2.drawImage(swimg2, 0, 0, 2000, 2000);
        localStorage.setItem("swimg2", canvas2.toDataURL("image/jpeg"));
        console.log(localStorage.getItem("swimg2"));
        var watemarks6 = document.getElementById("watermarkswiper6");
        watemarks6.style.display = "block";
        swiperimg3 = document.getElementById("swiper2-img3");
        dataUrlsw3 = await domtoimage.toSvg(swiperimg3);
        swimg3 = new Image();
        canvas3 = document.getElementById("canvas_download3");
        swimg3.src = dataUrlsw3;
        swimg3.addEventListener("load", async function () {
          //alert("hi")
          var watemarks6 = document.getElementById("watermarkswiper6");
          watemarks6.style.display = "none";
          ctxsw3 = canvas3.getContext("2d");
          canvas3.height = 2000;
          canvas3.width = 2000;
          ctxsw3.drawImage(swimg3, 0, 0, 2000, 2000);
          localStorage.setItem("swimg3", canvas3.toDataURL("image/jpeg"));
          console.log(localStorage.getItem("swimg3"));
          downloadswiper2();
        });
      });
    });
  }
});

async function payment_login2() {
  if (u == 0) {
    scrolling = 1;
    event.stopPropagation();
    $("#phone_div").css("display", "block");
    $(".login_main_display").css("display", "flex");
    $(".container").css("display", "block");
    $(".container2").css("display", "none");
    window.scrollTo({ top: 0, behavior: "smooth" });
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop == 0 && scrolling == 1) {
      document.body.classList.add("stop-scrolling");
    }
    window.onscroll = function () {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop == 0 && scrolling == 1) {
        document.body.classList.add("stop-scrolling");
      }
    };
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      { size: "invisible" }
    );
    recaptchaVerifier.render();
  } else {
    rzp1.open();
    x = 1;
    var watemarks4 = document.getElementById("watermarkswiper4");
    watemarks4.style.display = "none";
    swiperimg1 = document.getElementById("swiper2-img1");
    dataUrlsw = await domtoimage.toSvg(swiperimg1);
    swimg1 = new Image();
    canvas1 = document.getElementById("canvas_download1");
    swimg1.src = dataUrlsw;
    swimg1.addEventListener("load", async function () {
      //alert("hi")
      var watemarks4 = document.getElementById("watermarkswiper4");
      watemarks4.style.display = "none";
      ctxsw = canvas1.getContext("2d");
      canvas1.height = 2000;
      canvas1.width = 2000;
      ctxsw.drawImage(swimg1, 0, 0, 2000, 2000);
      localStorage.setItem("swimg1", canvas1.toDataURL("image/jpeg"));
      console.log(localStorage.getItem("swimg1"));
      var watemarks5 = document.getElementById("watermarkswiper5");
      watemarks5.style.display = "none";
      swiperimg2 = document.getElementById("swiper2-img2");
      dataUrlsw2 = await domtoimage.toSvg(swiperimg2);
      swimg2 = new Image();
      canvas2 = document.getElementById("canvas_download2");
      swimg2.src = dataUrlsw2;

      swimg2.addEventListener("load", async function () {
        //alert("hi")
        var watemarks5 = document.getElementById("watermarkswiper5");
        watemarks5.style.display = "none";
        ctxsw2 = canvas2.getContext("2d");
        canvas2.height = 2000;
        canvas2.width = 2000;
        ctxsw2.drawImage(swimg2, 0, 0, 2000, 2000);
        localStorage.setItem("swimg2", canvas2.toDataURL("image/jpeg"));
        console.log(localStorage.getItem("swimg2"));
        var watemarks6 = document.getElementById("watermarkswiper6");
        watemarks6.style.display = "none";
        swiperimg3 = document.getElementById("swiper2-img3");
        dataUrlsw3 = await domtoimage.toSvg(swiperimg3);
        swimg3 = new Image();
        canvas3 = document.getElementById("canvas_download3");
        swimg3.src = dataUrlsw3;
        swimg3.addEventListener("load", async function () {
          //alert("hi")
          var watemarks6 = document.getElementById("watermarkswiper6");
          watemarks6.style.display = "none";
          ctxsw3 = canvas3.getContext("2d");
          canvas3.height = 2000;
          canvas3.width = 2000;
          ctxsw3.drawImage(swimg3, 0, 0, 2000, 2000);
          localStorage.setItem("swimg3", canvas3.toDataURL("image/jpeg"));
          console.log(localStorage.getItem("swimg3"));
        });
      });
    });
  }
}
async function payment_login() {
  if (u == 0) {
    scrolling = 1;
    event.stopPropagation();
    $("#phone_div").css("display", "block");
    $(".login_main_display").css("display", "flex");
    $(".container").css("display", "block");
    $(".container2").css("display", "none");
    window.scrollTo({ top: 0, behavior: "smooth" });
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop == 0 && scrolling == 1) {
      document.body.classList.add("stop-scrolling");
    }
    window.onscroll = function () {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop == 0 && scrolling == 1) {
        document.body.classList.add("stop-scrolling");
      }
    };
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      { size: "invisible" }
    );
    recaptchaVerifier.render();
  } else {
    rzp1.open();
    x = 0;
    var watemarks1 = document.getElementById("watermarkswiper1");
    watemarks1.style.display = "none";

    swiperimg1 = document.getElementById("swiper-img1");
    dataUrlsw = await domtoimage.toSvg(swiperimg1);
    swimg1 = new Image();
    canvas1 = document.getElementById("canvas_download1");
    swimg1.src = dataUrlsw;
    swimg1.addEventListener("load", async function () {
      var watemarks1 = document.getElementById("watermarkswiper1");
      watemarks1.style.display = "none";
      //alert("hi")

      ctxsw = canvas1.getContext("2d");
      canvas1.height = 2000;
      canvas1.width = 2000;
      ctxsw.drawImage(swimg1, 0, 0, 2000, 2000);
      localStorage.setItem("swimg1", canvas1.toDataURL("image/jpeg"));
      console.log(localStorage.getItem("swimg1"));
      var watemarks2 = document.getElementById("watermarkswiper2");
      watemarks2.style.display = "none";
      swiperimg2 = document.getElementById("swiper-img2");
      dataUrlsw2 = await domtoimage.toSvg(swiperimg2);
      swimg2 = new Image();
      canvas2 = document.getElementById("canvas_download2");
      swimg2.src = dataUrlsw2;

      swimg2.addEventListener("load", async function () {
        var watemarks2 = document.getElementById("watermarkswiper2");
        watemarks2.style.display = "none";
        //alert("hi")

        ctxsw2 = canvas2.getContext("2d");
        canvas2.height = 2000;
        canvas2.width = 2000;
        ctxsw2.drawImage(swimg2, 0, 0, 2000, 2000);
        localStorage.setItem("swimg2", canvas2.toDataURL("image/jpeg"));
        console.log(localStorage.getItem("swimg2"));
        var watemarks3 = document.getElementById("watermarkswiper3");
        watemarks3.style.display = "none";
        swiperimg3 = document.getElementById("swiper-img3");
        dataUrlsw3 = await domtoimage.toSvg(swiperimg3);
        swimg3 = new Image();
        canvas3 = document.getElementById("canvas_download3");
        swimg3.src = dataUrlsw3;
        swimg3.addEventListener("load", async function () {
          var watemarks3 = document.getElementById("watermarkswiper3");
          watemarks3.style.display = "none";
          //alert("hi")

          ctxsw3 = canvas3.getContext("2d");
          canvas3.height = 2000;
          canvas3.width = 2000;
          ctxsw3.drawImage(swimg3, 0, 0, 2000, 2000);
          localStorage.setItem("swimg3", canvas3.toDataURL("image/jpeg"));
          console.log(localStorage.getItem("swimg3"));
        });
      });
    });
  }
}

window.addEventListener("unload", (event) => {});
async function mockupdownload_with_watermark() {
  const dataurimock = localStorage.getItem("canvasimage");
  var mi = document.getElementById("mockupimage");
  mi.src = dataurimock;
  var wm = document.getElementById("wholemockup");
  const datauriwithwatermark = await domtoimage.toSvg(wm);
  //     console.log(dataUrl);
  var canvas5 = document.getElementById("canvas5");
  var img5 = new Image();
  img5.src = await datauriwithwatermark;
  img5.onload = () => {
    canvas5.width = 1000;
    canvas5.height = 1000;
    canvas5.getContext("2d").drawImage(img5, 0, 0, 1000, 1000);
    localStorage.setItem("mockimage", canvas5.toDataURL("image/jpeg"));
  };
}
window.addEventListener("load", (event) => {
  async function canvasdownload1() {
    c = 0;
    var ci = document.getElementById("canvasimage");
    ci.src = allWeddingCards[c]["url1"];
    var wc = document.getElementById("wholecanvas");
    const dataUrl = await domtoimage.toSvg(wc);
    // console.log(dataUrl);
    var canvas1 = document.getElementById("canvas");
    var img = new Image();
    img.src = await dataUrl;
    img.onload = () => {
      canvas1.width = 1000;
      canvas1.height = 1000;
      canvas1.getContext("2d").drawImage(img, 0, 0, 1000, 1000);
      localStorage.setItem("ecard-image", canvas1.toDataURL("image/jpeg"));
      canvasdownload2();
    };
  }
  async function canvasdownload2() {
    var ci4 = document.getElementById("canvasimage4");
    ci4.src = allWeddingCards[c]["url2"];
    var wc4 = document.getElementById("wholecanvas4");
    const dataUrl4 = await domtoimage.toSvg(wc4);
    var canvas4 = document.getElementById("canvas4");
    var img4 = new Image();
    img4.src = await dataUrl4;
    img4.onload = () => {
      canvas4.width = 1000;
      canvas4.height = 1000;
      canvas4.getContext("2d").drawImage(img4, 0, 0, 1000, 1000);
      localStorage.setItem("ecard-image4", canvas4.toDataURL("image/png"));

      loadWeddingCards();
    };
  }

  var id = localStorage.getItem("data-id");
  async function load() {
    canvasdownload1();
  }
  async function loadWeddingCards() {
    let offer_price = price[`price`].substr(1);
    if (offer_price == "ree") {
      offer_price = 0;
    }
    let ori_price = price[`strikePrice`].substr(1);
    let offer = ((ori_price - offer_price) * 100) / ori_price;
    offer = Math.round(offer);
    $("#mockup1").append(`
                <div style="display:none;" id="canvas_price_div">
                    <div class="wedding-card-image" id="canvas_div" style="position: relative; background-size: 100% 100%; display: flex; justify-content: center; align-items: center;">
                    <canvas id="canvas1" style="display: flex;height:100% ; width: 100%; border: 2px solid rgb(189, 186, 186);border-radius: 15px;"></canvas>
                    </div>
                    <div class="details" id="canvas_details" style=" width: 350px;">
                    <h5 style="padding-top:20px; display: none" id="pricing">Mockup price:-${price["price"]} <del>${price["strikePrice"]}</del>: <br>
                    <small>(Coming Soon, you are not being charged for this)</small></h3>
                    </div>
                    </div>`);
    $("#mob_price_div").append(`
                <h6 id="mob_pricing">Mockup price <br> ${price["price"]}/-</h6>
                `);
    canvas = document.getElementById("canvas1");
    var removebutton = document.getElementById("change_layout");
    var paybutton = document.getElementById("rzp-button1");
    var downloadbutton = document.getElementById("downloadsw");
    var loader = document.getElementById("loader1");
    canvas_pd = document.getElementById("canvas_price_div");
    ctx = canvas.getContext("2d");
    const dataUrl1 = localStorage.getItem("ecard-image");
    const dataUrl4 = localStorage.getItem("ecard-image4");
    img = new Image();
    img1 = new Image();
    img2 = new Image();
    img3 = new Image();

    //img.crossOrigin = 'Anonymous';
    c = 0;
    img.addEventListener(
      "load",
      function () {
        canvas.height = 1000;
        canvas.width = 1000;
        ctx.drawImage(img, 0, 0, 1000, 1000);
        ctx.save();
        img1.addEventListener(
          "load",
          function () {
            ctx.translate(
              Number(allWeddingCards[c]["data12"][2]) +
                Number(allWeddingCards[c]["data12"][0]) * 0.667 * 0.5,
              Number(allWeddingCards[c]["data12"][1]) +
                Number(allWeddingCards[c]["data12"][0]) * 0.5
            );
            ctx.rotate(allWeddingCards[c]["data12"][3] * 0.0175);
            ctx.translate(
              -Number(allWeddingCards[c]["data12"][2]) -
                Number(allWeddingCards[c]["data12"][0]) * 0.667 * 0.5,
              -Number(allWeddingCards[c]["data12"][1]) -
                Number(allWeddingCards[c]["data12"][0]) * 0.5
            );
            ctx.shadowColor = "black";
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
            ctx.drawImage(
              img1,
              Number(allWeddingCards[c]["data12"][2]),
              Number(allWeddingCards[c]["data12"][1]),
              Number(allWeddingCards[c]["data12"][0]) * 0.667,
              Number(allWeddingCards[c]["data12"][0])
            );
            ctx.restore();
            ctx.save();
            img2.addEventListener(
              "load",
              function () {
                ctx.translate(
                  Number(allWeddingCards[c]["data11"][2]) +
                    Number(allWeddingCards[c]["data11"][0]) * 0.667 * 0.5,
                  Number(allWeddingCards[c]["data11"][1]) +
                    Number(allWeddingCards[c]["data11"][0]) * 0.5
                );
                ctx.rotate(Number(allWeddingCards[c]["data11"][3]) * 0.0175);
                ctx.translate(
                  -Number(allWeddingCards[c]["data11"][2]) -
                    Number(allWeddingCards[c]["data11"][0]) * 0.667 * 0.5,
                  -Number(allWeddingCards[c]["data11"][1]) -
                    Number(allWeddingCards[c]["data11"][0]) * 0.5
                );
                ctx.shadowColor = "black";
                ctx.shadowBlur = 10;
                ctx.shadowOffsetX = 5;
                ctx.shadowOffsetY = 5;
                ctx.drawImage(
                  img2,
                  Number(allWeddingCards[c]["data11"][2]),
                  Number(allWeddingCards[c]["data11"][1]),
                  Number(allWeddingCards[c]["data11"][0]) * 0.667,
                  Number(allWeddingCards[c]["data11"][0])
                );
                ctx.restore();
                ctx.save();
                img3.addEventListener(
                  "load",
                  function () {
                    ctx.drawImage(img3, 0, 0, 1000, 1000);
                    ctx.restore();
                    ctx.save();
                    loader.style.display = "none";
                    canvas_pd.style.display = "block";
                    paybutton.style.display = "block";
                    paybutton.style.cursor = "pointer";
                    downloadbutton.style.display = "block";
                    removebutton.style.display = "block";
                    //canvasdownload1();
                    localStorage.setItem(
                      "canvasimage",
                      canvas.toDataURL("image/jpeg")
                    );
                    mockupdownload_with_watermark();
                  },
                  false
                );
                img3.src = dataUrl4;
                //img3.src=allWeddingCards[c]['url2'];
              },
              false
            );
            img2.src = "./imgg/front.jpg";
            //img2.src=allWeddingCards[c]['url1'] ;
          },
          false
        );
        img1.src = "./imgg/back.jpg";
        //img1.src=allWeddingCards[c]['url1'] ;
      },
      false
    );
    img.src = dataUrl1;
    //img.src=allWeddingCards[c]['url1'] ;
  }

  fetchtrialmockup = async () => {
    setTimeout(() => {
      try {
        if (id == null) {
          db.doc(`weddingcards/extras/mockups/price`)
            .get()
            .then((snapshot) => {
              /* storing price data that we got from price field from firebase into price var in js*/
              price = snapshot.data();
              /* after retrieving price - now extracting data for all wedding cards - first page*/
              db.doc(`weddingcards/extras/mockups/trial`)
                .get()
                .then((snapshot_card) => {
                  let weddingCardData = snapshot_card.data();
                  var arr1 = weddingCardData["prop1"].split("=");
                  var arr2 = weddingCardData["prop2"].split("=");
                  allWeddingCards[0] = {
                    url1: weddingCardData["bottomLink"],
                    url2: weddingCardData["topLink"],
                    data11: arr1,
                    data12: arr2,
                  };
                  // $(`#wedding-loader`).css('display', 'none');
                  /* all wedding cards data captured -> now load the cards */
                })
                .then(() => {
                  load();
                });
            });
        } else {
          db.doc(`weddingcards/extras/mockups/price`)
            .get()
            .then((snapshot) => {
              /* storing price data that we got from price field from firebase into price var in js*/
              price = snapshot.data();
              /* after retrieving price - now extracting data for all wedding cards - first page*/
              db.doc(`weddingcards/extras/mockups/mockupList`)
                .get()
                .then((snapshot_card) => {
                  let weddingCardData = snapshot_card.data();
                  var arr1 = weddingCardData[id][2].split("=");
                  var arr2 = weddingCardData[id][3].split("=");
                  allWeddingCards[0] = {
                    //
                    url1: weddingCardData[id][1],
                    url2: weddingCardData[id][0],
                    data11: arr1,
                    data12: arr2,
                  };
                })
                .then(() => {
                  load();
                });
            });
        }
      } catch (err) {
        console.log(err);
      }
    }, 0);
  };

  fetchtrialmockup();
});

// window.onload = fetchRazorpayOrder();

// (function () {
// // header('Access-Control-Allow-Origin: *');
// var data = JSON.stringify({"amount":500,"currency":"INR","receipt":"receipt_001"});

// var xhr = new XMLHttpRequest();
// xhr.withCredentials = true;

// xhr.addEventListener("readystatechange", function() {
//   if(this.readyState === 4) {
//     console.log(this.responseText);
//   }
// });

// xhr.open("POST", "https://api.razorpay.com/v1/orders");
// xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
// xhr.setRequestHeader("Authorization", "Basic cnpwX3No6411JCoFJ1YKbNx3XEfiSdAmVfGT1K8MnsmuYQby2wJibmeiHnQwVHVo");
// xhr.setRequestHeader("Content-Type", "application/json");

// xhr.send(data);})();

let balance = 0;
let partnerDocRef;
const partnersLogin = async () => {
  const email = document.getElementById("partners-email").value;
  const pass = document.getElementById("partners-password").value;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, pass)
    .then(async (user) => {
      document.getElementById("partner-loggedin").style.display = "flex";
      document.getElementById("partner-signin-modal").style.display = "none";
      const u_id = user.user.uid;
      partnerDocRef = db.collection("B2B").doc(u_id);
      let name = "";
      await partnerDocRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            balance = doc.data()["Wallet Balance"];
            name = doc.data()["Name"];
            $("#partner-loggedin__name").text(name);
            $("#partner-loggedin__balance").text(balance);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .catch((error) => {
      window.alert("Error:\n" + error.message);
    });

  $("#partners-login-modal").modal("hide");
};

const buyCardsAsPartner = async () => {
  const cardprice = JSON.parse(localStorage.getItem("card-price"));
  const e = confirm(
    `This will deduct ${cardprice} from your wallet.\nWish to continue?`
  );
  if (e) {
    if (balance < cardprice) {
      alert("insufficient balance in your wallet!");
      return;
    }
    // console.log(balance);
    // console.log(cardprice);

    await partnerDocRef.set(
      {
        "Wallet Balance": balance - cardprice,
      },
      { merge: true }
    );
    purchased_card = true;
    window.location.href = "paymentdone.html";
  }
};

// to download the card as a sample:

// following code converts the card div to base64 url
let received_Cards = JSON.parse(localStorage.getItem("final-card-images"));
let base64Array = [];
let base64ArrayNew = [];

const cardsReceived = document.getElementById("cards-received");
cardsReceived.style.height = 0;
cardsReceived.style.width = 0;
cardsReceived.style.overflow = "hidden";

for (let i = 0; i < received_Cards.length; ++i) {
  cardsReceived.innerHTML += received_Cards[i];
  let el = document.getElementById(`ec-${i + 1}`);
  el.style.width = "1000px";
  el.style.height = "1500px";
  el = document.getElementById(`ec-details-${i + 1}`);
  el.style.width = "1000px";
  el.style.height = "1500px";
  el.style.transform = "scale(1)";
}

const getBase64 = () => {
  base64Array = new Array();
  for (let i = 1; i <= received_Cards.length; ++i) {
    let canvasPromise = html2canvas(document.querySelector(`#ec-${i}`), {
      allowTaint: true,
      useCORS: true,
    });
    canvasPromise.then(function (canvas) {
      base64Array.push(`${i.toString()}${canvas.toDataURL("image/svg", 1.0)}`);
      base64Array.sort();
    });
  }
};

// add watermark to the pdf
function addWaterMark(doc) {
  analytics.logEvent("website_wedding_pdf_sample_called");
  const imgData =
    "data:image/jpeg;base64,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";

  var totalPages = doc.internal.getNumberOfPages();
  for (i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.addImage(imgData, "JPEG", 140, 255, 65, 30, undefined, 'FAST');
  }
  return doc;
}

// make pdf
const downloadInvitationCards = async () => {
  if (base64Array.length !== received_Cards.length)
    alert("Fetching cards. Please wait");
  else {
    console.log(getLocalStorage());
    const user = firebase.auth().currentUser;
    if (user) {
      let doc = new jsPDF("p", "mm", "a4");
      for (let i = 1; i <= base64Array.length; ++i) {
        const imgData = base64Array[i - 1].substr(1);
        doc.addImage(imgData, "JPEG", 0, 0, 210, 297, undefined, 'FAST');
        if (i !== base64Array.length) doc.addPage();
      }
      doc = addWaterMark(doc);
      doc.save("invite");
    } else $(".login-button").click();
  }
};

const downlaodSampleCards = () => {
  const btn = document.getElementById("downloadsw");
  const l = document.getElementById("final-loader");
  const b = document.querySelector("body");
  btn.innerHTML = "your download will begin shortly...";
  l.style.display = "grid";
  b.classList.add("stop-scroll");
  setTimeout(async () => {
    await downloadInvitationCards();
    btn.innerHTML = "Share sample <br> for free <br> (with watermark)";
    l.style.display = "none";
    b.classList.remove("stop-scroll");
  }, 100);
};

const displayFinalCards = () => {
  const dfc = document.querySelector("#display-final-cards");
  for (let i = 0; i < base64Array.length; ++i) {
    // console.log(base64Array[i]);
    dfc.innerHTML += `
    <img src = ${base64Array[i].substr(
      1
    )} style="width: 250px; margin: 10px; aspect-ratio: 2/3; padding: 10px; background-color: white; box-shadow: 0px 0px 10px rgb(0 0 0 / 50%); border-radius: 10px">
   `;
  }
};

// loading cards to swiper
const finalSwiperCardsHelper = () => {
  document.querySelector("#animation3").style.display = "none";
  displayFinalCards();
};

const loadFinalSwiperCards = () => {
  const finalSwiperCards = document.querySelector("#final-cards");
  finalSwiperCards.innerHTML = "";
  finalSwiperCards.style.display = "flex";

  document.querySelector("#final-card-paginator").style.display = "block";
  setTimeout(() => {
    if (base64Array.length === received_Cards.length) finalSwiperCardsHelper();
    else loadFinalSwiperCards();
  }, 2000);
};

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    partnerDocRef = db.collection("B2B").doc(user.uid);
    partnerDocRef.get().then((doc) => {
      if (doc.exists) {
        document.getElementById("partner-loggedin").style.display = "flex";
        document.getElementById("partner-signin-modal").style.display = "none";
        balance = doc.data()["Wallet Balance"];
        let name = doc.data()["Name"];
        $("#partner-loggedin__name").text(name);
        $("#partner-loggedin__balance").text(balance);
      }
    });
  }
});

function getLocalStorage() {
  let obj = {};
  if (typeof localStorage.userSessionData !== "undefined") {
    obj = JSON.parse(localStorage.userSessionData);
  }
  return obj;
}