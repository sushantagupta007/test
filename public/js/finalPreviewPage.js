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

function showClickAnimation(cont) {
    bodymovin.loadAnimation({
        container: cont,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "../animations/53969-click.json",
    });
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
var cnt = true;
function setData(data) {
    // Setting the card type
    cardType = (docId === " " ? localStorage.getItem("card-type") : data.type + '-' + data.orientation);

    // Setting the music link
    musicLink = (docId === " " ? (localStorage.getItem("music-link") ? localStorage.getItem("music-link") : " ") 
        : cardDetails.music);

    // If no music is selected then removing the play button from the preview
    if (musicLink === " " || musicLink === "") {
        $("#audio-control-button-container").css("display", "none");
    }
    // setting up the music files to play music
    $("#music-player").attr("src", musicLink);
    $(".header-container").css("display", "flex");
    $(".main-display").css("display", "flex");

    const Category = ' ';
    let Overlay_text = $(".overlay__text");

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

    // console.log(Overlay_text);

    if (cardType === " ") {
        window.location.replace("../404.html");
    }
    let rootMaxWidth = $(window).width();
    // console.log(rootMaxWidth);
    let rootMaxHeight = $(window).height();
    // console.log(rootMaxHeight);
    let orientation;
    let imageRatio;
    let finalImageHeight;
    let finalImageWidth;
    
    // Setting up image ratio and orientation on the basis of card type 
    if (cardType === "ecard-l" || cardType === "gcard-l") {
        imageRatio = parseFloat(900 / 600);
        orientation = "l";
    } else if (cardType === "ecard-p" || cardType === "gcard-p") {
        imageRatio = parseFloat(900 / 600);
        orientation = "p";
    } else {
        imageRatio = 1;
        orientation = "s";
    }

    if (rootMaxWidth * imageRatio <= rootMaxHeight) {
        // console.log("working");
        finalImageHeight = parseInt(rootMaxWidth * imageRatio);
        finalImageWidth = rootMaxWidth;
        // console.log("h", finalImageHeight, "w", finalImageWidth);
    } else {
        // console.log("working");
        finalImageHeight = rootMaxHeight;
        finalImageWidth = parseInt(rootMaxHeight / imageRatio);
        // console.log("h", finalImageHeight, "w", finalImageWidth);
    }

    let CardID = null;

    //Loading card data
    $(".card__wrapper").addClass("Portrait"); // important!! for flip animation in flipbook.css
    if (cardType === "gcard-l" || cardType === "ecard-l") {
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
    let cf, cil, cir, cb;
    if (cardType === "gcard-l" || cardType === "gcard-p" || cardType === "gcard-s") {
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
    }
    if (cardType === "ecard-l" || cardType === "ecard-p" || cardType === "ecard-s") {
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

    // To change the card size as the envelope is too small to take the original
    var cw = $(".card-side").width(), ch = $(".card-side").height();
    if(window.innerWidth<500) {
        cw*=0.6;
        ch*=0.6;
    }
    $(".card-side").width(cw);
    $(".card-side").height(ch);
    var img1 = new Image();
    img1.src = cf;
    img1.height = ch;
    img1.width = cw;
    $("#card_front").css("transform-style", "preserve-3d");
    // Adding shadow to the card_front
    $("#card_front").css("box-shadow", "-4px 175px 127px 0px rgba(0,0,0,0.2)");
    $("#card_front").css("-webkit-box-shadow", "-4px 175px 127px 0px rgba(0,0,0,0.2)");
    $("#card_front").css("-moz-box-shadow", "-4px 175px 127px 0px rgba(0,0,0,0.2)");
    $("#card_front").append(img1);

    var img2 = new Image();
    img2.src = cil;
    img2.height = ch;
    img2.width = cw;
    $("#card_middle_left").css("transform-style", "preserve-3d");
    // Adding shadow to the card_middle_left
    $("#card_middle_left").css("box-shadow", "-4px 175px 127px 0px rgba(0,0,0,0.2)");
    $("#card_middle_left").css("-webkit-box-shadow", "-4px 175px 127px 0px rgba(0,0,0,0.2)");
    $("#card_middle_left").css("-moz-box-shadow", "-4px 175px 127px 0px rgba(0,0,0,0.2)");
    $("#card_middle_left").append(img2);

    var img3 = new Image();
    img3.src = cir;
    img3.height = ch;
    img3.width = cw;
    $("#card_middle_right").css("transform-style", "preserve-3d");
    // Adding shadow to the card_middle_right
    $("#card_middle_right").css("box-shadow", "-4px 175px 127px 0px rgba(0,0,0,0.2)");
    $("#card_middle_right").css("-webkit-box-shadow", "-4px 175px 127px 0px rgba(0,0,0,0.2)");
    $("#card_middle_right").css("-moz-box-shadow", "-4px 175px 127px 0px rgba(0,0,0,0.2)");
    $("#card_middle_right").append(img3);

    var img4 = new Image();
    img4.src = cb;
    img4.height = ch;
    img4.width = cw;
    $("#card_back").css("transform-style", "preserve-3d");
    // Adding shadow to the card_back
    $("#card_back").css("box-shadow", "-4px 175px 127px 0px rgba(0,0,0,0.2)");
    $("#card_back").css("-webkir-box-shadow", "-4px 175px 127px 0px rgba(0,0,0,0.2)");
    $("#card_back").css("-moz-box-shadow", "-4px 175px 127px 0px rgba(0,0,0,0.2)");
    $("#card_back").append(img4);

    function hideClickAnimation() {
        $("#click-animation").css("display", "none");
        $("#music-player").trigger("play");
        $(this).css("display", "none");
        $("#pause-button").css("display", "flex");
    }

    var is_flipped = false; // to check if the envelope flap is flipped or not
    if (cardType === "gcard-l" || cardType === "gcard-p" || cardType === "gcard-s" || cardType === "ecard-l" || cardType === "ecard-p" || cardType === "ecard-s") {
        var envelope = document.getElementById("section--cards--envelope--ecard");
        envelope.style.display = "none";


        // console.log(Overlay_text);
        // document.getElementById("overlay_text--gcard").append(Overlay_text);

        $("#flipbook-screen-wrapper").css("transform-origin", "100% 0%");
        $("#flipbook-screen-wrapper").css("transform", "rotateY(180deg)");
        setTimeout(function() {
            if(window.innerWidth<500) {
                showClickAnimation(document.getElementById('test'));
            }
            $(document).mouseover(function() {
                if(window.innerWidth<500) {
                    $('#test').css('visibility','hidden');
                }
                // $(".env-wrapper-gcard").addClass("env-shadow");
                $(".env-wrapper-gcard").css("transform-style", "preserve-3d");
                // $(".env-wrapper-gcard").css("", "preserve-3d");
                $("#section--cards--envelope--gcard").css("perspective", "4000px");
                $(".env-wrapper-gcard").css("transition", "transform 3s");
                $(".env-wrapper-gcard").css("transform-origin", "right center");
                $(".env-wrapper-gcard").css("transform", "translate3d(-100%, 0, 0) rotateY(180deg)");
                setTimeout(function() {
                    $("#overlay_text--gcard").css("transform", "rotateY(180deg)");
                    $(".env-front").css("visibility", "visible");
                    $(".env-top").css("visibility", "visible");
                    $(".env-top--backside").css("visibility", "visible");
                    $(".env-wrapper-gcard").css("visibility", "hidden");

                    is_flipped = true;
                    // Rotating the card within the envelope 
                    $("#hiding-card").css("transform","rotateZ(90deg)");
                    if(window.innerWidth<500) {
                        $("#hiding-card").css("left","-30%");
                        $("#hiding-card").css("top","50px");
                    }
                    else {
                        $("#hiding-card").css("left","-15%");
                        $("#hiding-card").css("top","-100px");
                    }
                    
                    // $("#hiding-card").css("transform-origin", ($(".card-side").width()-300)+" "+($(".card-side").height()-300));

                    // flip_card = .call(this);
                    setTimeout(function() {
                        setTimeout(()=>{
                            if (cardType === "ecard-l" || cardType === "ecard-p" || cardType === "ecard-s") {
                                setTimeout(function() {
                                    hideClickAnimation();
                                }, 4000);
                            } else if(cnt==true) {
                                cnt = false;
                                showClickAnimation(document.getElementById("click-animation"));
                            }
                        },6000);  
                        $(".section--cards").addClass("is-opened-gcard");
                        $("#hiding-card").css("opacity", "1");
                        $(".card").css("transform-style","preserve-3d");
                        $(".card").css("perspective","4000px");
                        // console.log(1);
                        // $(".env-wrapper-gcard").css("transform","rotateX(20deg)");
                        // $(".env-wrapper-gcard").addClass("env-fall");
                        // $('#hiding-card').style.transition = "all 1.5s";
                        // $('#hiding-card').style.transitionDelay = "1.2s";
                        // return $(".env-btn").css('display', 'none');
                    },2000);
                }, 900); // 900
            });
        }, 1000); //12000

        (function () {
            $(".js-first-flip, .flip-btn").on("click", function() {
                is_flipped = true;
                flip_card();
                return $(".cards-btn").css({ opacity: 1, });
            });
            
            var flip_card = function() {
                return $(".env-card--inner").toggleClass("is-flipped");
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
        initf = 1,
        exf = 0,
        interval,
        flag = !1;
    cf = 1;

    function removeAllFrameClasses() {
        return this.className.split(" ").filter(function(n) {
                return n.match(/frame-\d{1,3}/);
            }).join(" ");
    };

    function d() {
        clearInterval(interval);
        flag = !1;
    };

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

    function toFrame(edf) {
        let fps = Math.max(Math.floor(cf - edf / 60), 1), state = edf > cf ? "up" : "down";
        console.log("FPS:", fps, "state", state);

        interval = setInterval(() => {
            flag = !0;
            (state === "up" && cf >= edf) || (state === "down" && cf <= edf) ?
            d(): ((state === "up" && cf >= edf - fps) || (state === "down" && cf <= edf + fps)) 
                && (fps = 1);
            window.requestAnimationFrame(() => {
                cf = Math.min(cf,550);
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

    // if(flag_open) {
    Cardbody.on("panstart panmove", (i) => {
        let pad, fpm, m, nds;
        if (doubleClickAbled) {
            if ((d(), i.type === "panstart"?((initf = cf),(exf = 0),(base = 0)):(initf = 0),$(".card__wrapper").hasClass("Portrait"))) {
                (pad = cardBody[0].clientWidth - 10), (fpm = Math.max(Math.floor(pad / tf), 1)), (m = i.deltaX);
            }
            else if ($(".card__wrapper").hasClass("Landscape")) {
                (pad = cardBody[0].clientHeight - 50), (fpm = Math.max(Math.floor(pad / tf), 1)), (m = i.deltaY);
            }
            if (((nds = Math.floor((m / -fpm) * nt)), base !== nds)) {
                if (((cf = initf + exf + nds - base),(cf = cf < 1 ? 1 : cf),(cf = cf > tf ? tf : cf),exf !== cf)) {
                    (exf = cf), (base = nds);
                }
                window.requestAnimationFrame(() => {
                    $(".card")
                        .removeClass(removeAllFrameClasses)
                        .addClass("frame-" + cf);
                });
            }
        }
    });

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