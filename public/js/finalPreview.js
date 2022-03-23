let docId = ' ';
let uId = ' ';
let cardDetails;
let cardType = localStorage.getItem('cardType');
let musicLink;

const url = $(location).attr("href");

// checking if url is dynamic link
if (url.includes('?')) {
    const urlParts = url.split("?")
    const subParts = urlParts[1].split("&")
    docId = subParts[0].split("=")[1]
    uId = subParts[1].split("=")[1]
    cardType = subParts[2].split("=")[1]
}

console.log(cardType + "lol");
// fetching data from database
const fetchData = async() => {
    const docRef = firestore().doc(`usercards/${uId}/${cardType}/${docId}`)
    try {
        const snapshot = await docRef.get()
        if (!snapshot.exists) {
            console.log("Document not exist");
        } else {
            const data = snapshot.data()
            cardDetails = data
            console.log(cardDetails);
        }
    } catch (err) {
        console.error(err);
    }
}

fetchData()


//animation handler
var animation1 = bodymovin.loadAnimation({
    container: document.getElementById("letter-packed"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "../animations/letter-packed.json",
});

var animation2 = bodymovin.loadAnimation({
    container: document.getElementById("message-send"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "../animations/message-send.json",
});

var animation3 = bodymovin.loadAnimation({
    container: document.getElementById("plane-fly"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "../animations/paper-plane.json",
});

var animation4 = bodymovin.loadAnimation({
    container: document.getElementById("message-received"),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "../animations/message-received.json",
});

function showClickAnimation() {
    setTimeout(function() {
        var clickAnimation = bodymovin.loadAnimation({
            container: document.getElementById("click-animation"),
            renderer: "svg",
            loop: true,
            autoplay: true,
            path: "../animations/53969-click.json",
        });
    }, 4500);
}

hideAnimation1();
hideAnimation2();
hideAnimation3();
hideAnimation4();


function hideAnimation1() {
    setTimeout(function() {
        $(".animation-container-1").css("display", "none");
        $(".animation-container-2").css("display", "flex");
    }, 2000); //2000
}

function hideAnimation2() {
    setTimeout(function() {
        $(".animation-container-2").css("display", "none");
        $(".animation-container-3").css("display", "flex");
    }, 4000); // 4000
}

function hideAnimation3() {
    setTimeout(function() {
        $(".animation-container-3").css("display", "none");
        $(".animation-container-4").css("display", "flex");
    }, 6000); //6000
}

function hideAnimation4() {
    setTimeout(function() {
        $(".animation-container-4").css("display", "none");
        setData(cardDetails);
    }, 10100); //10100
}

//animation handler


function setData(data) {
    if (docId === " ") {
        cardType = localStorage.getItem("card-type");
    } else {
        cardType = data.type + '-' + data.orientation;
    }
    if (docId === " ") {
        musicLink = localStorage.getItem("music-link") ?
            localStorage.getItem("music-link") :
            " ";
    } else {
        musicLink = cardDetails.music;
    }

    if (musicLink === " " || musicLink === "") {
        $("#audio-control-button-container").css("display", "none");
    }

    $("#music-player").attr("src", musicLink);
    $(".header-container").css("display", "flex");
    $(".main-display").css("display", "flex");


    // console.log(localStorage);
    console.log(cardType);
    // if(cardType==="gcard-s") {
    //   console.log("true");
    // }
    // else {
    //   console.log("false");
    // }

    //Loading the Card Category
    // const Category = localStorage.getItem("cardCategory");
    const Category = ' ';
    let Overlay_text = $(".overlay__text");
    // let Overlay_text = "";

    if (Category === "birthday") {
        Overlay_text = "A special something for your special day";
    } else if (Category === "anniversary") {
        Overlay_text = "A special something for a Special Person";
    } else if (Category === "feelings") {
        const Feeling = localStorage.getItem("cardSubCategory");
        if (Feeling === "love" || Feeling === "thankyou" || Feeling === "sorry") {
            Overlay_text = "From the bottom of my heart";
        } else if (Feeling === "congrats") {
            Overlay_text = "For the amazing You";
        } else if (Feeling === "weddingwishes") {
            Overlay_text = "Best wishes on this wonderful journey";
        } else if (Feeling === "missyou") {
            Overlay_text = "Hey there my special someone";
        } else if (Feeling === "getwellsoon") {
            Overlay_text = "I pray you return to full health soon";
        } else {
            Overlay_text = "A Card for You";
        }
    }
    //   else {
    //     Overlay_text="A Card for You";
    // }

    console.log(Overlay_text);

    if (cardType === " ") {
        window.location.replace("../404.html");
    }
    let rootMaxWidth = $(window).width();
    console.log(rootMaxWidth);
    let rootMaxHeight = $(window).height();
    console.log(rootMaxHeight);
    let orientation;
    let imageRatio;
    let finalImageHeight;
    let finalImageWidth;

    if (cardType === "ecard-l" || cardType === "gcard-l") {
        orientation = "l";
    } else if (cardType === "ecard-p" || cardType === "gcard-p") {
        orientation = "p";
    } else {
        orientation = "s";
    }

    //finding image dimensions on the basis of ratio

    if (orientation === "p") {
        imageRatio = parseFloat(900 / 600);
    } else if (orientation === "l") {
        imageRatio = parseFloat(900 / 600);
    } else {
        imageRatio = 1;
    }

    if (rootMaxWidth * imageRatio <= rootMaxHeight) {
        console.log("working");
        finalImageHeight = parseInt(rootMaxWidth * imageRatio);
        finalImageWidth = rootMaxWidth;
        console.log("h", finalImageHeight, "w", finalImageWidth);
    } else {
        console.log("working");
        finalImageHeight = rootMaxHeight;
        finalImageWidth = parseInt(rootMaxHeight / imageRatio);
        console.log("h", finalImageHeight, "w", finalImageWidth);
    }
    // var myHeight=finalImageHeight/1.5;
    // var myWidth=finalImageWidth/1.5;

    //finding image dimensions on the basis of ratio

    let CardID = null;

    // if (cardType === "ecard-l") {
    //   $("#ecard-screen-wrapper").css("display", "flex");
    //   const dataUrl = localStorage.getItem("ecard-image");
    //   var img = new Image();
    //   img.src = dataUrl;
    //   img.id = `ecard-landscape-image`;
    //   CardID = "ecard-landscape-image";
    //   $("#preview-ecard-image").append(img);
    // } else if (cardType === "ecard-p") {
    //   $("#ecard-screen-wrapper").css("display", "flex");
    //   const dataUrl = localStorage.getItem("ecard-image");
    //   var img = new Image();
    //   img.src = dataUrl;
    //   img.id = `ecard-portrait-image`;
    //   CardID = "ecard-portrait-image";
    //   $("#preview-ecard-image").append(img);
    // }
    // else if(cardType === 'gcard-l'){
    //     $('#flipbook-screen-wrapper').css('display','flex')
    //     $('#flipbook-l').css('display','flex')
    //     $('#flipbook-front-page-l > img').attr('src',localStorage.getItem('gcard-image-link-0'))
    //     $('#flipbook-middle-left-page-l > img').attr('src',localStorage.getItem('gcard-image-link-1'))
    //     $('#flipbook-middle-right-page-l > img').attr('src',localStorage.getItem('gcard-image-link-2'))
    //     $('#flipbook-back-page-l > img').attr('src',localStorage.getItem('gcard-image-link-3'))
    //     $('#flipbook-l').css('display','flex')
    // }else if(cardType === 'gcard-p'){
    //     $('#flipbook-screen-wrapper').css('display','flex')
    //     $('#flipbook-front-page > img').attr('src',localStorage.getItem('gcard-image-link-0'))
    //     $('#flipbook-middle-left-page > img').attr('src',localStorage.getItem('gcard-image-link-1'))
    //     $('#flipbook-middle-right-page > img').attr('src',localStorage.getItem('gcard-image-link-2'))
    //     $('#flipbook-back-page > img').attr('src',localStorage.getItem('gcard-image-link-3'))
    //     $('#flipbook').css('display','flex')
    // }

    //Loading card data

    if (cardType === "gcard-l" || cardType === "ecard-l") {


        $(".card__wrapper").addClass("Portrait"); // important!! for flip animation in flipbook.css
        // $(".card").addClass("landscape-gcard");
        // var myHeight=finalImageWidth/0.9;
        // var myWidth=finalImageHeight/0.9;
        // console.log(myHeight+ " " + myWidth);
        // //Ipad and Ipad Pro
        // if(rootMaxHeight/rootMaxWidth<1.5 && rootMaxHeight>=rootMaxWidth) {
        //   myWidth=myWidth/1.6;
        //   myHeight=myHeight/1.6;
        //   console.log("executed");
        // }
        // $(".card-side").height(myHeight);
        // $(".card-side").width(myWidth);

        // For Surface Duo Device
        if (rootMaxHeight == 720 && rootMaxWidth == 540) {
            $(".card-side").height(660);
            $(".card-side").width(990);
            $(".card").css("margin-top", "40%");
            $(".card").css("margin-left", "-30%");
        } else {
            $(".card-side").addClass("card-side-landscape");
            $(".card").addClass("landscape-gcard");
        }

    }
    if (cardType === "gcard-p" || cardType === "ecard-p") {

        // $(".card").css("margin-left", "140%");
        $(".card__wrapper").addClass("Portrait");
        // if(rootMaxHeight/rootMaxWidth<1.5  && rootMaxHeight>=rootMaxWidth) {
        //   finalImageHeight=finalImageHeight/1.2;
        //   finalImageWidth=finalImageWidth/1.2;
        //   console.log("executed");
        // }
        // $(".card-side").height(finalImageHeight);
        // $(".card-side").width(finalImageWidth);
        // For Surface Duo Device
        if (rootMaxHeight == 720 && rootMaxWidth == 540) {
            $(".card-side").height(900);
            $(".card-side").width(600);
            $(".card").css("margin-top", "-10%");
            $(".card").css("margin-left", "60%");
        } else {
            $(".card-side").addClass("card-side-portrait");
            $(".card").addClass("portrait-gcard");
        }


    }
    if (cardType === "gcard-s" || cardType === "ecard-s") {
        // $(".card").css("margin-left", "130%");
        // $(".card").css("margin-top", "15%");
        // if(finalImageHeight>=rootMaxWidth) {
        //   finalImageHeight=finalImageHeight/1.5;
        //   finalImageWidth=finalImageWidth/1.5;
        // }

        // $(".card").addClass("square-gcard");
        $(".card__wrapper").addClass("Portrait");
        // if(rootMaxHeight/rootMaxWidth<1.5  && rootMaxHeight>=rootMaxWidth) {
        //   finalImageHeight=finalImageHeight/1.5;
        //   finalImageWidth=finalImageWidth/1.5;
        //   console.log("executed");
        // }
        // if(rootMaxHeight>rootMaxWidth) {
        //   $(".card-side").height(finalImageHeight/0.8);
        //   $(".card-side").width(finalImageWidth/0.8);
        // }
        // else {
        // $(".card-side").height(finalImageHeight/1.2);
        // $(".card-side").width(finalImageWidth/1.2);
        // }
        // For Surface Duo Device
        if (rootMaxHeight == 720 && rootMaxWidth == 540) {
            $(".card-side").height(800);
            $(".card-side").width(800);
            $(".card").css("margin-top", "20%");
            $(".card").css("margin-left", "30%");
        } else {
            $(".card-side").addClass("card-side-square");
            $(".card").addClass("square-gcard");
        }

    }
    if (cardType === "gcard-l" || cardType === "gcard-p" || cardType === "gcard-s") {
        let cf
        let cil
        let cir
        let cb;
        $("#flipbook-screen-wrapper").css("display", "flex");
        if (docId === " ") {
            cf = localStorage.getItem("gcard-image-link-0");
            cil = localStorage.getItem("gcard-image-link-1");
            cir = localStorage.getItem("gcard-image-link-2");
            cb = localStorage.getItem("gcard-image-link-3");
        } else {
            cf = cardDetails.imagelink[0];
            cil = cardDetails.imagelink[1];
            cir = cardDetails.imagelink[2];
            cb = cardDetails.imagelink[3];
        }

        if (cf === " ") {
            cf = "../img/blank_portrait.png";
        }
        if (cil === " ") {
            cil = "../img/blank_portrait.png";
        }
        if (cir === " ") {
            cir = "../img/blank_portrait.png";
        }
        if (cb === " ") {
            cb = "../img/blank_portrait.png";
        }

        var node = document.getElementById("card_front");

        function filter(node) {
            return node.tagName !== "i";
        }

        var img1 = new Image();
        img1.src = cf;
        img1.height = $(".card-side").height();
        img1.width = $(".card-side").width();
        $("#card_front").append(img1);

        var img2 = new Image();
        img2.src = cil;
        img2.height = $(".card-side").height();
        img2.width = $(".card-side").width();
        $("#card_middle_left").append(img2);

        var img3 = new Image();
        img3.src = cir;
        img3.height = $(".card-side").height();
        img3.width = $(".card-side").width();
        $("#card_middle_right").append(img3);

        var img4 = new Image();
        img4.src = cb;
        img4.height = $(".card-side").height();
        img4.width = $(".card-side").width();
        $("#card_back").append(img4);

        // document.getElementById("card_front").style.backgroundImage =
        //   "url('" + cf + "')";

        // if (cil !== " ") {
        //   document.getElementById("card_middle_left").style.backgroundImage =
        //     "url('" + cil + "')";
        // } else {
        //   document.getElementById("card_middle_left").style.backgroundImage =
        //     "url('../img/blank_portrait.png')";
        // }
        // if (cir !== " ") {
        //   document.getElementById("card_middle_right").style.backgroundImage =
        //     "url('" + cir + "')";
        // } else {
        //   document.getElementById("card_middle_right").style.backgroundColor =
        //     "white";
        // }
        // if(cb !== " ") {
        //   document.getElementById("card_back").style.backgroundImage =
        //   "url('" + cb + "')";
        // }
        // else {
        //   document.getElementById("card_back").style.backgroundColor =
        //   "white";
        // }




        // $(".card-side").css("backgroundSize", "100% 100%"); //very important





        // document.getElementsByClassName("img1")[0].src="url('" + cf + "')";
        // if (cil !== " ") {
        //   document.getElementsByClassName("img2")[0].src="url('" + cil + "')";
        // } else {
        //   document.getElementsByClassName("img2")[0].src=
        //     "url('../img/blank_portrait.png')";
        // }
        // if (cir !== " ") {
        //   document.getElementsByClassName("img3")[0].src="url('" + cir + "')";
        // } else {
        //   document.getElementsByClassName("img3")[0].src=
        //     "white";
        // }
        // document.getElementsByClassName("img4")[0].src="url('" + cb + "')";

        // $(document).getElementsByTagName("img").css("visibility", "visible");

        // $("img").css("visibility", "visible");
        // $(document).getElementsByClassName("img2")[0].css("visibility", "visible");
        // $(document).getElementsByClassName("img3")[0].css("visibility", "visible");
        // $(document).getElementsByClassName("img4")[0].css("visibility", "visible");





        // document.onclick(function() {
        // var image1=new image();
        // image1.src="url('" + cf + "')";
        // image1.onload=function() {
        //   image1.width=myWidth;
        //   image1.height=myHeight;
        //   document.getElementById("card_front").style.backgroundImage = image1;
        // };

        //   // image2.onload=function() {
        //     if(cil !== " ") {
        //       var image2=new image();
        //       image2.src="url('" + cil + "')";
        //       image2.width=myWidth;
        //       image2.height=myHeight;
        //       document.getElementById("card_front").style.backgroundImage = image2;
        //     }
        //     else {
        //         document.getElementById("card_middle_left").style.backgroundImage =
        //           "url('../img/blank_portrait.png')";
        //     }
        //   // };

        //   // image3.onload=function() {
        //     if(cir !== " ") {
        //       var image3=new image();
        //       image3.src="url('" + cir + "')";
        //       image3.width=myWidth;
        //       image3.height=myHeight;
        //       document.getElementById("card_front").style.backgroundImage = image3;
        //     }
        //     else {
        //         document.getElementById("card_middle_left").style.backgroundImage =
        //           "white";
        //     }
        //   // };

        //   // image4.onload=function() {
        //     var image4=new image();
        //   image4.src="url('" + cb + "')";
        //   image4.width=myWidth;
        //   image4.height=myHeight;
        //   document.getElementById("card_front").style.backgroundImage = image4;
        //   // };




        // });






        // $(".card").height(myHeight);
        // $(".card").width(myWidth);
        // var elem = document.createElement("img");
        // elem.src= "url(" + cf + ")";
        // elem.setAttribute("height", myHeight);
        // elem.setAttribute("width", myWidth);
        // document.getElementById("card_front").appendChild(elem);
        // if(cil !== " ") {
        //   elem.src="url(" + cil + ")";
        // }
        // else {
        //   elem.src= '../img/blank_portrait.png';
        // }
        // elem.setAttribute("height", myHeight);
        // elem.setAttribute("width", myWidth);
        // document.getElementById("card_middle_left").appendChild(elem);
        // if(cir !== " ") {
        //   elem.src= "url(" + cir + ")";
        // }
        // else {
        //   elem.src= '../img/blank_portrait.png';
        // }
        // elem.setAttribute("height", myHeight);
        // elem.setAttribute("width", myWidth);
        // document.getElementById("card_middle_right").appendChild(elem);
        // elem.src= "url(" + cb + ")";
        // elem.setAttribute("height", myHeight);
        // elem.setAttribute("width", myWidth);
        // document.getElementById("card_back").appendChild(elem);



    }

    if (cardType === "ecard-l" || cardType === "ecard-p" || cardType === "ecard-s") {
        let cf, cil, cir, cb;
        $("#flipbook-screen-wrapper").css("display", "flex");
        if (docId === " ") {
            cf = localStorage.getItem("ecard-image");
            cil = localStorage.getItem("ecard-image");
            cir = localStorage.getItem("ecard-image");
            cb = localStorage.getItem("ecard-image");
        } else {
            cf = cardDetails.imagelink[0];
            cil = cardDetails.imagelink[0];
            cir = cardDetails.imagelink[0];
            cb = cardDetails.imagelink[0];
        }

        if (cf === " ") {
            cf = "../img/blank_portrait.png";
        }
        if (cil === " ") {
            cil = "../img/blank_portrait.png";
        }
        if (cir === " ") {
            cir = "../img/blank_portrait.png";
        }
        if (cb === " ") {
            cb = "../img/blank_portrait.png";
        }

        var node = document.getElementById("card_front");

        function filter(node) {
            return node.tagName !== "i";
        }

        var img1 = new Image();
        img1.src = cf;
        img1.height = $(".card-side").height();
        img1.width = $(".card-side").width();
        $("#card_front").append(img1);

        var img2 = new Image();
        img2.src = cil;
        img2.height = $(".card-side").height();
        img2.width = $(".card-side").width();
        $("#card_middle_left").append(img2);

        var img3 = new Image();
        img3.src = cir;
        img3.height = $(".card-side").height();
        img3.width = $(".card-side").width();
        $("#card_middle_right").append(img3);

        var img4 = new Image();
        img4.src = cb;
        img4.height = $(".card-side").height();
        img4.width = $(".card-side").width();
        $("#card_back").append(img4);

    }


    function hideClickAnimation() {
        $("#click-animation").css("display", "none");
        $("#music-player").trigger("play");
        $(this).css("display", "none");
        $("#pause-button").css("display", "flex");
    }

    //Ecard Animation
    // State = false;
    // $("#preview-ecard-image").on("click", () => {
    //   let Card = document.getElementById(CardID);
    //   let Overlay = document.getElementById("overlay");
    //   if (State) {
    //     Overlay.classList.remove("back");
    //     Card.classList.remove("front");

    //     Overlay.classList.add("front");
    //     Card.classList.add("back");
    //     // console.log(State);
    //     State = false;
    //   } else {
    //     try {
    //       Overlay.classList.remove("front");
    //       Card.classList.remove("back");
    //     } finally {
    //       Overlay.classList.add("back");
    //       Card.classList.add("front");
    //       State = true;
    //     }
    //   }
    // });
    //- Ecard Animation

    // if (cardType === "ecard-l" || cardType === "ecard-p") {

    //   var envelope = document.getElementById("section--cards--envelope--gcard");
    //   envelope.style.display = "none";

    //   document.getElementById("overlay_text--ecard").append(Overlay_text);

    //   const dataurl = localStorage.getItem("ecard-image");
    //   var img = new Image();
    //   img.src = dataurl;
    //   document.getElementById("front-image").src = img.src;

    //   (function () {
    //     var flip_card, open_env;

    //     $(".js-first-flip, .flip-btn").on("click", function () {
    //       flip_card();
    //       return $(".cards-btn").css({
    //         opacity: 1,
    //       });
    //     });

    //     $(".js-open-env").on("click", function () {
    //       return open_env();
    //     });

    //     flip_card = function () {
    //       return $(".env-card--inner").toggleClass("is-flipped");
    //     };

    //     open_env = function () {
    //       $(".section--cards").addClass("is-opened");
    //       return $(".js-open-env").css('display','none');
    //     };
    //   }.call(this));
    // }

    /// G-card Animation ///

    if (cardType === "gcard-l" || cardType === "gcard-p" || cardType === "gcard-s" || cardType === "ecard-l" || cardType === "ecard-p" || cardType === "ecard-s") {
        var envelope = document.getElementById("section--cards--envelope--ecard");
        envelope.style.display = "none";


        console.log(Overlay_text);
        // document.getElementById("overlay_text--gcard").append(Overlay_text);

        $("#flipbook-screen-wrapper").css("transform-origin", "100% 0%");
        $("#flipbook-screen-wrapper").css("transform", "rotateY(180deg)");

        setTimeout(function() {
            $(".env-wrapper-gcard").mouseover(function() {
                $(".env-wrapper-gcard").css("transform-style", "preserve-3d");
                $("#section--cards--envelope--gcard").css("perspective", "4000px");
                $(".env-wrapper-gcard").css("transition", "transform 3s");
                $(".env-wrapper-gcard").css("transform-origin", "right center");
                $(".env-wrapper-gcard").css("transform", "translate3d(-100%, 0, 0) rotateY(180deg)");
                setTimeout(function() {
                    $("#overlay_text--gcard").css("transform", "rotateY(180deg)");
                    $(".env-btn").css("visibility", "visible");
                    $(".env-front").css("visibility", "visible");
                    $(".env-top").css("visibility", "visible");
                }, 900); // 900
            });
        }, 1000); //12000




        var is_flipped = false; // to check if the envelope flap is flipped or not



        (function() {
            var flip_card, open_env;

            $(".js-first-flip, .flip-btn").on("click", function() {
                is_flipped = true;
                flip_card();
                return $(".cards-btn").css({
                    opacity: 1,
                });
            });

            $(".js-open-env").on("click", function() {
                is_flipped = true;
                return open_env();
            });

            flip_card = function() {
                return $(".env-card--inner").toggleClass("is-flipped");
            };

            open_env = function() {
                if (cardType === "ecard-l" || cardType === "ecard-p" || cardType === "ecard-s") {
                    setTimeout(function() {
                        hideClickAnimation();
                    }, 4000);
                } else {
                    showClickAnimation();
                }
                $(".section--cards").addClass("is-opened-gcard");
                $("#hiding-card").css({
                    opacity: 1,
                });
                document.getElementById('hiding-card').style.transition = "all 1.5s";
                document.getElementById('hiding-card').style.transitionDelay = "1.2s";
                return $(".env-btn").css('display', 'none');
            };
        }.call(this));
    }
    //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiPGFub255bW91cz4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLFNBQUEsRUFBQTs7RUFBQSxDQUFBLENBQUUsMkJBQUYsQ0FBOEIsQ0FBQyxFQUEvQixDQUFrQyxPQUFsQyxFQUEyQyxRQUFBLENBQUEsQ0FBQTtJQUN2QztXQUNILENBQUEsQ0FBRSxZQUFGLENBQWUsQ0FBQyxHQUFoQixDQUFvQjtNQUFDLE9BQUEsRUFBUztJQUFWLENBQXBCO0VBRjBDLENBQTNDOztFQUlBLENBQUEsQ0FBRSxjQUFGLENBQWlCLENBQUMsRUFBbEIsQ0FBcUIsT0FBckIsRUFBOEIsUUFBQSxDQUFBLENBQUE7V0FDMUI7RUFEMEIsQ0FBOUI7O0VBR0EsU0FBQSxHQUFZLFFBQUEsQ0FBQSxDQUFBO1dBQ1gsQ0FBQSxDQUFFLGtCQUFGLENBQXFCLENBQUMsV0FBdEIsQ0FBa0MsWUFBbEM7RUFEVzs7RUFHWixRQUFBLEdBQVcsUUFBQSxDQUFBLENBQUE7SUFDVixDQUFBLENBQUUsaUJBQUYsQ0FBb0IsQ0FBQyxRQUFyQixDQUE4QixXQUE5QjtXQUNBLENBQUEsQ0FBRSxVQUFGLENBQWEsQ0FBQyxPQUFkLENBQUE7RUFGVTtBQVZYIiwic291cmNlc0NvbnRlbnQiOlsiJChcIi5qcy1maXJzdC1mbGlwLCAuZmxpcC1idG5cIikub24gXCJjbGlja1wiLCAtPlxuXHRkbyBmbGlwX2NhcmRcblx0JCgnLmNhcmRzLWJ0bicpLmNzcyh7b3BhY2l0eTogMX0pXG5cbiQoXCIuanMtb3Blbi1lbnZcIikub24gXCJjbGlja1wiLCAtPlxuXHRkbyBvcGVuX2VudlxuXHRcdFx0XG5mbGlwX2NhcmQgPSAoKS0+IFxuXHQkKFwiLmVudi1jYXJkLS1pbm5lclwiKS50b2dnbGVDbGFzcyBcImlzLWZsaXBwZWRcIlxuXG5vcGVuX2VudiA9ICgpLT5cblx0JChcIi5zZWN0aW9uLS1jYXJkc1wiKS5hZGRDbGFzcyBcImlzLW9wZW5lZFwiXG5cdCQoXCIuZW52LWJ0blwiKS5mYWRlT3V0KClcblx0XHRcbiJdfQ==
    //# sourceURL=coffeescript

    // flip
    let cardBody = document.getElementsByClassName("card_container");

    var Cardbody = new Hammer(cardBody[0]);
    // nds=newdeltastep,old DeltaStep,move, totalframes, current frame, initial frame , previous frame
    let base = 0,
        nt = 5 / 3,
        tf = 550,
        cf = 1,
        initf = 1,
        exf = 0,
        interval,
        flag = !1;


    function removeAllFrameClasses() {
        return this.className
            .split(" ")
            .filter(function(n) {
                return n.match(/frame-\d{1,3}/);
            })
            .join(" ");
    }

    function d() {
        clearInterval(interval);
        flag = !1;
    }

    Cardbody.add(
        new Hammer.Pan({
            direction: Hammer.DIRECTION_ALL,
            threshold: 0,
        })
    );
    var flag_open = false; // to check if the card is fully opened once.
    var doubleClickAbled = false;
    var gcard_open = false;

    Cardbody.add(new Hammer.Tap({}));
    // var singleTap = new Hammer.Tap({ event: 'singletap' });
    // var doubleTap = new Hammer.Tap({event: 'doubletap', taps: 2 });

    // Cardbody.add([singleTap, doubleTap]);
    // doubleTap.recognizeWith(singleTap);
    // singleTap.requireFailure(doubleTap);
    // Cardbody.get("doubleTap").set({enable:false});
    5;

    function toFrame(edf) {
        let fps = Math.max(Math.floor(cf - edf / 60), 1),
            state = edf > cf ? "up" : "down";
        console.log("FPS:", fps, "state", state);

        interval = setInterval(() => {
            flag = !0;
            (state === "up" && cf >= edf) || (state === "down" && cf <= edf) ?
            d(): ((state === "up" && cf >= edf - fps) ||
                    (state === "down" && cf <= edf + fps)) &&
                (fps = 1);
            window.requestAnimationFrame(() => {
                if (cf > 550) {
                    cf = 550;
                }
                $(".card")
                    .removeClass(removeAllFrameClasses)
                    .addClass("frame-" + cf);
                if (cf == 200) {
                    doubleClickAbled = true;
                }
                ef = cf;
                state === "up" ? (cf += fps) : (cf -= fps);
            });
        }, 7);
    }

    if (cardType === "gcard-l" || cardType === "gcard-p" || cardType === "gcard-s") {
        // if(is_flipped) {
        // if(!flag_open) {
        Cardbody.on("tap", (e) => { // use on to enable automatic animation
            if (is_flipped) {
                if (!gcard_open) {
                    hideClickAnimation();
                    gcard_open = true;
                }

                if ($(".card__wrapper").hasClass("Portrait")) {
                    var pad = cardBody[0].clientWidth;
                } else if ($(".card__wrapper").hasClass("Landscape")) {
                    var pad = cardBody[0].clientHeight;
                }
                let dx = e.center.x,
                    mid = Math.floor(pad / 2),
                    base = 1,
                    fs1 = 200,
                    fs2 = 350,
                    fs3 = 550;
                // if(!flag_open) {
                if (dx >= mid) {
                    if (flag) {
                        console.log(flag);
                        return;
                    }
                    if (cf >= fs3 - 15) {
                        //backto base
                        console.log("basecall");
                        flag_open = true;
                        toFrame(base);

                        return;
                    }
                    if (cf >= fs2 && cf < fs3 - 15) {
                        toFrame(fs3);
                        return;
                    }
                    if (cf >= fs1 && cf < fs2 - 15) {
                        // fs2
                        toFrame(fs2);
                        return;
                    }
                    // f
                    toFrame(fs1);
                    return;
                } else {
                    // <f1(base) >f1 <f2 (f1) >f2 <f3 (f2) >f3!= base? then f3
                    if (flag) {
                        console.log(flag);
                        return;
                    }
                    if (cf >= base + 5 && cf < fs1) {
                        console.log("fs3-5");
                        toFrame(base);
                        return;
                    }
                    if (cf >= fs1 - 5 && cf < fs2) {
                        // fs1
                        console.log("fs2-5");

                        toFrame(fs1);
                        return;
                    }
                    if (cf >= fs2 - 5 && cf < fs3) {
                        // base
                        console.log("fs1-5");

                        toFrame(fs2);
                        return;
                    }
                    console.log("default");

                    // fs3
                    toFrame(fs3);
                    return;
                }
                // }
            }
        });
    }
    // }
    // }



    // if(flag_open) {
    Cardbody.on("panstart panmove", (i) => {
        let pad, fpm, m, nds;
        if (doubleClickAbled) {
            if (
                (d(),
                    i.type === "panstart" ?
                    ((initf = cf), (exf = 0), (base = 0)) :
                    (initf = 0),
                    $(".card__wrapper").hasClass("Portrait"))
            )
                (pad = cardBody[0].clientWidth - 10),
                (fpm = Math.max(Math.floor(pad / tf), 1)),
                (m = i.deltaX);
            else if ($(".card__wrapper").hasClass("Landscape"))
                (pad = cardBody[0].clientHeight - 50),
                (fpm = Math.max(Math.floor(pad / tf), 1)),
                (m = i.deltaY);
            if (((nds = Math.floor((m / -fpm) * nt)), base !== nds)) {
                if (
                    ((cf = initf + exf + nds - base),
                        (cf = cf < 1 ? 1 : cf),
                        (cf = cf > tf ? tf : cf),
                        exf !== cf)
                )
                    (exf = cf), (base = nds);

                window.requestAnimationFrame(() => {
                    $(".card")
                        .removeClass(removeAllFrameClasses)
                        .addClass("frame-" + cf);
                });
            }
        }
    });
    // 



    // if(flag_open) {
    //   Cardbody.one("tap", (e) => {    // use on to enable automatic animation
    //     if ($(".card__wrapper").hasClass("Portrait")) {
    //       var pad = cardBody[0].clientWidth;
    //     } else if ($(".card__wrapper").hasClass("Landscape")) {
    //       var pad = cardBody[0].clientHeight;
    //     }
    //     let dx = e.center.x,
    //       mid = Math.floor(pad / 2),
    //       base = 1,
    //       fs1 = 200,
    //       fs2 = 350,
    //       fs3 = 550;
    //     if (dx >= mid) {
    //       if (flag) {
    //         console.log(flag);
    //         return;
    //       }
    //       if (cf >= fs3 - 15) {
    //         //backto base
    //         console.log("basecall");
    //         toFrame(base);
    //         return;
    //       }
    //       if (cf >= fs2 && cf < fs3 - 15) {
    //         toFrame(fs3);
    //         return;
    //       }
    //       if (cf >= fs1 && cf < fs2 - 15) {
    //         // fs2
    //         toFrame(fs2);
    //         return;
    //       }
    //       // f
    //       toFrame(fs1);
    //       return;
    //     } else {
    //       // <f1(base) >f1 <f2 (f1) >f2 <f3 (f2) >f3!= base? then f3
    //       if (flag) {
    //         console.log(flag);
    //         return;
    //       }
    //       if (cf >= base + 5 && cf < fs1) {
    //         console.log("fs3-5");
    //         toFrame(base);
    //         return;
    //       }
    //       if (cf >= fs1 - 5 && cf < fs2) {
    //         // fs1
    //         console.log("fs2-5");

    //         toFrame(fs1);
    //         return;
    //       }
    //       if (cf >= fs2 - 5 && cf < fs3) {
    //         // base
    //         console.log("fs1-5");

    //         toFrame(fs2);
    //         return;
    //       }
    //       console.log("default");

    //       // fs3
    //       toFrame(fs3);
    //       return;
    //     }
    //   });

    // }



    // - Flipbook HAndler
    //animation handler

    // function setData() {

    // }

    $("#play-button").on("click", function() {
        $("#music-player").trigger("play");
        $(this).css("display", "none");
        $("#pause-button").css("display", "flex");
    });

    $("#pause-button").on("click", function() {
        $("#music-player").trigger("pause");
        $(this).css("display", "none");
        $("#play-button").css("display", "flex");
    });

    $("#music-player").on("pause", function() {
        $("#play-button").css("display", "flex");
        $("#pause-button").css("display", "none");
    });

    $(window).on("resize", function() {
        if ($(window).width() <= 590 && cardType === "ecard-l") {
            $("#preview-ecard-image").css("justify-content", "flex-start");
        } else {
            $("#preview-ecard-image").css("justify-content", "center");
        }
    });

    if ($(window).width() <= 590 && cardType === "ecard-l") {
        $("#preview-ecard-image").css("justify-content", "flex-start");
    }
}