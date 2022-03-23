let cardDoc = "9GvWQyv2W3RIOfOMZul9RPdCzk52/adkd weds abkfa";
let cards = [];
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
    setData();
  }, 10100); //10100
}

var width = 175, height = 100;
var front = new Image(width,height);
front.src = '../img/new_envelope/front.png';
front.id = 'front';
document.getElementById('card-container').appendChild(front);

var back = new Image(width,height);
back.src = '../img/new_envelope/full back.png';
back.id = 'back';
back.style.position = 'absolute';
document.getElementById('card-container').appendChild(back);

var back_in = new Image(width - 2,height);
back_in.src = '../img/new_envelope/Back  inner.png';
back_in.id = 'back_in';
back_in.style.position = 'absolute';

var back_lower = new Image(width,height);
back_lower.src = '../img/new_envelope/Back lower flap.png';
back_lower.id = 'back_lower';
back_lower.style.position = 'absolute';

var back_upper = new Image(width,height * 0.70);
back_upper.src = '../img/new_envelope/upper flapfront.png';
back_upper.id = 'back_upper';
back_upper.style.position = 'absolute';

var back_upper_in = new Image(width,height * 0.70);
back_upper_in.src = '../img/new_envelope/upper flap back.png';
back_upper_in.id = 'back_upper_in';
back_upper_in.style.position = 'absolute';

var flag = true;
function setData() {
  cards = [];
  db.doc(`users/weddingcards/${cardDoc}`).get().then((snapshot)=> {
    let cardDetails = snapshot.data();
    let images = cardDetails.imageList;
    let text = cardDetails.arrayTextList;
    let prop = cardDetails.textList;
    var ratio = height/1000;
    for(var i=0; i<text.length; i++) {
      var cur_card = document.createElement('div');
      cur_card.id = 'card-'+i;
      if(i>0) {
        cur_card.style.visibility = 'hidden';
        cur_card.style.position = 'absolute';
      }
      else cur_card.style.visibility = 'visible';
      var img = new Image();
      img.src = images[i];
      img.width = height;
      img.height = height*1.5;
      img.style.position = 'absolute';
      cur_card.appendChild(img);
      var tempt = text[i].split('='), tempp = prop[i].split('=');
      for(var j=0; j<tempt.length; j++) {
        var dprop = tempp[j].split(',');
        dprop[1] = parseFloat(dprop[1]);
        dprop[3] = parseFloat(dprop[3]);
        dprop[4] = parseFloat(dprop[4]);
        var textbox = document.createElement('div');
        textbox.class = 'card-text-'+i;
        textbox.innerHTML = tempt[j];
        textbox.style.position = 'absolute';
        textbox.style.fontFamily = dprop[0];
        textbox.style.fontSize = (dprop[1]*ratio) + 'px';
        textbox.style.color = dprop[2];
        textbox.style.top = (dprop[3]*ratio) + 'px';
        textbox.style.left = (dprop[4]*ratio) + 'px';
        cur_card.appendChild(textbox);
      }
      cards.push(cur_card);
    }
    // main envelope animation
    var container = document.getElementById('card-container');
    container.style.visibility = 'visible';
    var env = document.getElementById('front');
    var env_back = document.getElementById('back');
    env.style.zIndex = '11';
    env_back.classList.add('env');
    env_back.style.zIndex = '10';
    container.addEventListener('click', ()=> {    
      if(!flag) return;
      flag = false;
      env.classList.add('rotate');
      env_back.classList.add('rotate');
      setTimeout(()=> {
        env.style.zIndex = '0';
        env_back.style.zIndex = '12';
        setTimeout(()=>{
          env_back.style.visibility = 'hidden';
          container.appendChild(back_in);
          container.appendChild(back_lower);
          container.appendChild(back_upper);
          var back_up = document.getElementById('back_upper');
          var back_low = document.getElementById('back_lower');
          var top_corner = (window.innerHeight*0.9 - height)/2;
          back_up.style.transform = 'rotateY(180deg)';
          back_low.style.transform = 'rotateY(180deg)';
          back_low.classList.add('env');
          back_up.style.top = top_corner+'px';
          container.appendChild(back_upper_in);
          var back_up_in = document.getElementById('back_upper_in');
          back_up_in.style.transform = 'rotateX(-180deg)';
          back_up_in.style.top = (top_corner - height*0.70)+'px';
          back_up_in.style.visibility = 'hidden';

          back_up.classList.add('open-env');
          back_up_in.classList.add('open-env1');
          back_up.style.zIndex = '10';
          back_low.style.zIndex = '10';
          var holder = document.createElement('div');
          holder.id = 'card-holder';
          holder.style.position = 'absolute';
          holder.style.width = height + 'px';
          holder.style.height = (height*1.5) + 'px';
          holder.style.transform = 'rotateZ(90deg) scale(1)';
          for(var i=0; i<cards.length; i++)
            holder.appendChild(cards[i]);

          container.append(holder);
          setTimeout(()=> {
            back_up.style.visibility = 'hidden';
            back_up_in.style.visibility = 'visible';
            setTimeout(()=> {
              holder.classList.add('show-card');
              setTimeout(()=> {
                document.getElementById('btn-holder').style.visibility = 'visible';
                finalShow();
              }, 5000);
            }, 1000);
          }, 1000);
        }, 1500);
      }, 1500);
    });
  })
  .catch((err)=> {
    console.log(err);
  });
}

var flag1 = false;
var active = 0;
function finalShow() {
  document.getElementById('btn1').addEventListener('click',()=> {
    document.getElementById('cover').classList.add('cover');
    document.getElementById('cover').style.visibility = 'visible';
    flag1 = true;
  });
  document.getElementById('in').addEventListener('click', ()=> {
    if(flag1) {
      var id = 'card-'+active;
      var cur = document.getElementById(id).style.transform;
      console.log(cur);
      if(cur=="") cur = "scale(1.1,1.1)";
      else {
        cur = parseFloat(cur.split('(')[1].split(')')[0].split(',')[0]) + 0.1;
        cur = 'scale('+cur+','+cur+')';
      }
      console.log(cur);
      document.getElementById(id).style.transform = cur;
    }
  });
  document.getElementById('out').addEventListener('click', ()=> {
    if(flag1) {
      var id = 'card-'+active;
      var cur = document.getElementById(id).style.transform;
      console.log(cur);
      if(cur=="") cur = "scale(0.9,0.9)";
      else {
        cur = parseFloat(cur.split('(')[1].split(')')[0].split(',')[0]) - 0.1;
        if(cur<0.5) cur = 0.5;
        cur = 'scale('+cur+','+cur+')';
      }
      console.log(cur);
      document.getElementById(id).style.transform = cur;
    }
  });
  document.getElementById('cross').addEventListener('click', ()=> {
    if(flag1) {
      flag1 = false;
      document.getElementById('cover').classList.remove('cover');
      document.getElementById('cover').style.visibility = 'hidden';
      document.getElementById('card-'+active).style.transform = 'scale(1,1)';
    }
  });
  document.getElementById('btn0').addEventListener('click', ()=> {
    if(active>0) {
      document.getElementById('card-'+active).style.position = 'absolute';
      document.getElementById('card-'+active).style.visibility = 'hidden';
      active--;
      document.getElementById('card-'+active).style.position = 'static';
      document.getElementById('card-'+active).style.visibility = 'visible';
    }
  });
  document.getElementById('btn2').addEventListener('click', ()=> {
    if(active<cards.length - 1) {
      document.getElementById('card-'+active).style.position = 'absolute';
      document.getElementById('card-'+active).style.visibility = 'hidden';
      active++;
      document.getElementById('card-'+active).style.position = 'static';
      document.getElementById('card-'+active).style.visibility = 'visible';
    }
  });
}