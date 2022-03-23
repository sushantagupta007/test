var cards = [], store = [];
var break_points = [1200, 992, 480, 420, 360, 325, 300, 0];
var scaling_factor = {
  1200: 0.8,
  992: 0.7,
  480: 0.6,
  420: 0.55,
  360: 0.5,
  325: 0.45,
  300: 0.4,
  0: 0.35,
};
var price;

// User authentication
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    $('.user-details-container').css('display','flex');
    $('.user-name').text(user.displayName);
    $('.user-profile-image-container img').attr('src',user.photoURL);
    $('.logout-button').css('display','block');
    $('.login-button').css('display','none');
    $("#nothing-text").css('visibility','hidden');
    $("#nothing-text").css('position','absolute');
    $("#nothing-text").text('No Orders to Show');
    // Fetching user orders
    fetchData();
  }
  else{
    $("#nothing-text").css('visibility','visible');
    $("#nothing-text").css('position','static');
    $("#nothing-text").text('Please login to see your orders');
    $('.logout-button').css('display','none');
    $('.login-button').css('display','flex');
  }
});

$('.logout-button').on('click',function(){
  firebase.auth().signOut();
  $("#nothing-text").css('visibility','visible');
  $("#nothing-text").css('position','static');
  $("#nothing-text").text('Please login to see your orders');
  $('.user-details-container').css('display','none');
  $('.user-name').text(' ');
  $(this).css('display','none');
  window.location.reload();
});

function loadAnimation(id) {
  let animation1 = bodymovin.loadAnimation({
    container: document.getElementById(id),
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "./animations/loading.json",
  });
}

// Fetching orders
fetchData = async () => {
  setTimeout(() => {
    try {
      db.doc(`weddingcards/price`).get().then((snapshot) => {
        /* storing price data that we got from price field from firebase into price var in js*/
        price = snapshot.data();
        var set_none_maintext = true;
        db.collection(`users/weddingcards/${firebase.auth().currentUser.uid}`).get()
        .then((querySnapshot) => {
          $("#nothing-text").css('visibility','visible');
          $("#nothing-text").css('position','static');
          querySnapshot.forEach((doc) => {
            if(set_none_maintext) {
              set_none_maintext = false;
              $("#nothing-text").css('visibility','hidden');
              $("#nothing-text").css('position','absolute');
            }
            let rec_data = doc.data();
            // console.log(rec_data);
            cards.push([
              rec_data['imageList'],
              rec_data['textList'],
              rec_data['arrayTextList'],
              rec_data['correctionDone'],
              rec_data['fileName']
            ]);
          });
          console.log(cards);
        })
        .then(() => {
          loadCards();
        });
      });
    } catch (err) {
      console.log(err);
    }
  }, 0);
};

function loadCards() {
  // loading the structure
  $("#section-card-loader").css("display", "none");
  var width = 'min-width: 45%';
  if(window.innerWidth<400) width = 'min-width: 80%';
  for (let card_no = 0; card_no < cards.length; card_no++) {
    let card = cards[card_no];
    var id = card_no;
    $("#card-container").append(`
      <div class="wedding-card" style="margin: 0 10px 20px 10px; ${width}">
        <div class="wedding-card-image" id="wc-${id}" data-id="${id}" style="position: relative; background-size: 100% 100%; display: flex; justify-content: center; align-items: center; margin-top: 10px; margin-left:10px; margin-right: 10px; ">
          <div id="wc-${id}-loader"></div>
        </div>
        <button class="button btn1" id="btn-${id}-1" onclick="go_to_edit(${card_no})">Edit</button>
        <button class="button btn2" id="btn-${id}-2" onclick="download(${card_no})">Download</button>
      </div>`
    );
    for(var i=0; i<card[1].length; i++) {
      card[1][i] = card[1][i].split('=');
      card[2][i] = card[2][i].split('=');
    }
    loadSectionBgImage(id,card[0][0],card[1][0],card[2][0]);
    loadAnimation(`wc-${id}-loader`);
  }
}

// loading card
loadSectionBgImage = async (id, url, property, text) => {
  let img = new Image();
  img.onload = function () {
    $(`#wc-${id}-loader`).css("display", "none");
    document.getElementById(`wc-${id}`).style.backgroundImage = `url("${img.src}")`;
    var scale = 0.38;
    if(window.innerWidth<1201) scale = 0.316;
    if(window.innerWidth<992) scale = 0.23;
    var height = 1500 * scale;
    var width = 1000 * scale;
    document.getElementById(`wc-${id}`).style.width = width+'px';
    document.getElementById(`wc-${id}`).style.height = height+'px';
    addSectionText(id, text, property);
  };
  img.src = url;
};

addSectionText = (id, text, property) => {
  // calculating the breakpoint;
  let current_width = window.innerWidth;
  let break_point;
  let ratio = 450 / 1500;
  ratio *= 1.5;
  if(window.innerWidth<992) ratio *=0.8;
  if(window.innerWidth<400) ratio /=0.8;

  for (let i = 0; i < break_points.length; i++) {
    if (current_width >= break_points[i]) {
      break_point = break_points[i];
      break;
    }
  }
  let val = ratio * scaling_factor[break_point];
  // declaring div details
  let created_elem_string = `<div id="wc-${id}-details"style="position:absolute; width:1000px; height:1500px; transform-origin: 0% 0%; left:0px; top:0px; transform:scale(${val}, ${val}); overflow:hidden">`;
  for (let i = 0; i < text.length; i++) {
    // splitting text properties for splitted text lines
    let properties = property[i].split(",");
    // extracting properties ;
    let font_family = properties[0];
    let font_size = properties[1];  
    let color = properties[2];
    let top_margin = properties[3];
    let left_margin = properties[4];
    let extra = "";
    if (left_margin < 0) extra = "right:" + Math.abs(left_margin) + "px; text-align:right; ";
    else if (left_margin > 0) extra = "left:" + left_margin + "px; text-align:left; ";
    else extra = "text-align: center;";
    // console.log(text[i],extra);
    text[i].replace(/\n/g,'<br>').replace(/&/g,'&amp;');
    created_elem_string += `<span class="card-details" style="font-size: ${font_size}px; font-family: ${font_family}; color: ${color}; top: ${top_margin}px; ${extra}">${text[i]}</span>`;
  }

  created_elem_string += `</div>`;
  $(`#wc-${id}`).append(created_elem_string);
};

// getting the session Storage Variables
function getLocalStorage() {
  let obj = {};
  if (typeof localStorage.userSessionData !== "undefined") {
    obj = JSON.parse(localStorage.userSessionData);
  }
  return obj;
}

// Sending the user to the edit wedding card page 
function go_to_edit(id) {
  console.log(cards[id][3]);
  if(!cards['correctionDone']) {
    alert('You can edit the card only once');
    localStorage.setItem('order_edit_title',cards[id][4]);
    window.location.href = "./my_orders_edit.html";
  }
  else {
    alert('You have already edited the card');
  }
}

function download(id) {
  var cont = document.getElementById('for-download');
  cont.innerHTML = '';
  console.log(cards[id]);
  var imagel = cards[id][0];
  var propertyl = cards[id][1];
  var textl = cards[id][2];
  for(var i=0; i<imagel.length; i++) {
    var page = document.createElement('div');
    page.style.width = '800px';
    page.style.height = '1200px';
    page.className = ('ec-'+i+' pdf-card');
    page.id = 'page'+i;
    page.style.backgroundImage = 'url('+imagel[i]+')';
    // page.position = 'absolute';  
    var text = textl[i];
    var property = propertyl[i];
    for(var j=0; j<text.length; j++) {
      var temp = property[j].split(',');
      var fontFamily = temp[0], fontSize = temp[1]*0.8, color = temp[2], top = temp[3]*0.8, left = temp[4]*0.8;
      temp = document.createElement('div');
      temp.className = 'ec-details';
      temp.style.position = 'absolute';
      temp.style.fontFamily = fontFamily;
      temp.style.color = color;
      temp.style.fontSize = fontSize + 'px';
      temp.style.top = top + 'px';
      temp.style.left = left + 'px';
      // if (left < 0) {
      //   left*=-1;
      //   temp.style.right = left + 'px';
      //   temp.style.textAlign = 'right';
      //   temp.style.transform = 'translate3d(0,0,0)';
      // }
      // else if (left > 0) {
      //   temp.style.left = left + 'px';
      //   temp.style.textAlign = 'left';
      //   temp.style.transform = 'translate3d(0,0,0)';
      // }
      // else {
      //   temp.style.left = '50%';
      //   temp.style.textAlign = 'center';
      //   temp.style.transform = 'translate3d(-50%,0,0)';
      // }
      temp.innerHTML = text[j];
      page.append(temp);
    }
    page.style.transform = 'scale(1.2)';
    cont.append(page);
  }
  var base64Array = [];
  console.log(cards[id][0]);
  for(var i=0; i<cards[id][0].length; i++) {
    console.log(document.querySelector('#page'+i));
    let canvasPromise = html2canvas(document.querySelector('#page'+i), {
      // allowTaint: true,
      useCORS: true,
    });
    canvasPromise.then(function (canvas) {
      base64Array.push(`${i.toString()}${canvas.toDataURL("image/svg", 1.0)}`);
      console.log(base64Array);
    });
  }
  let doc = new jsPDF("p", "mm", "a4", true);
  for (let i = 1; i <= base64Array.length; ++i) {
    console.log(base64Array[i-1]);
    const imgData = base64Array[i - 1].substr(1);
    doc.addImage(imgData, "JPEG", 0, 0, 1000, 1500, '', 'FAST');
    if (i !== base64Array.length) doc.addPage();
  }
  doc.save("invite");
}