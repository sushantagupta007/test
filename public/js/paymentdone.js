var purchased_card = JSON.parse(localStorage.getItem('paymentDone'));
let received_Cards = JSON.parse(localStorage.getItem("final-card-images"));
let base64Array = [];
let base64ArrayNew = [];

// getting the session Storage Variables
function getLocalStorage() {
  let obj = {};
  if (typeof localStorage.userSessionData !== "undefined") {
    obj = JSON.parse(localStorage.userSessionData);
  }
  return obj;
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // db.collection('users').doc('weddingcards').collection(firebase.auth().currentUser.uid)
    // .doc('adkgsdfgs weds abkfasdgdf').delete().then(()=>{
    //   console.log('deleted!');
    // })
    // .catch((err)=> {
    //   console.log(err);
    // });
    // if(purchased_card) {
      var obj = JSON.parse(localStorage.getItem('WeddingDataObjectForBackend'));
      db.collection('users').doc('weddingcards').collection(firebase.auth().currentUser.uid)
        .doc(obj.fileName).set({
          'imageList': obj.imageList,
          'textList': obj.textList,
          'arrayTextList': obj.arrayTextList,
          'correctionDone': obj.correctionDone,
          'fileName': obj.fileName
        })
        .then(()=>{
          console.log(firebase.auth().currentUser.uid);
          console.log("Data Saved!");
        })
        .catch((err)=>{
          console.log(err);
        });
    // }
    // else {
    //   console.log("Purchase the card first");
    //   window.location = 'share.html';
    // }
  }
});


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

const downloadInvitationCards = async () => {
  if (base64Array.length !== received_Cards.length)
    alert("Fetching cards. Please wait");
  else {
    console.log(received_Cards);
    let doc = new jsPDF("p", "mm", "a4", true);
    for (let i = 1; i <= base64Array.length; ++i) {
      console.log(base64Array[i-1]);
      const imgData = base64Array[i - 1].substr(1);
      doc.addImage(imgData, "JPEG", 0, 0, 210, 297, undefined, 'FAST');
      if (i !== base64Array.length) doc.addPage();
    }
    doc.save("invite");
  }
};

const downlaodSampleCards = () => {
  // if(purchased_card) {
    const el = document.getElementById("sharePDF");
    el.innerHTML = "preparing cards...";
    const l = document.getElementById("final-loader");
    const b = document.querySelector("body");
    l.style.display = "grid";
    b.classList.add("stop-scroll");
    setTimeout(async () => {
      await downloadInvitationCards();
      el.innerHTML = "Share Card PDF";
      l.style.display = "none";
      b.classList.remove("stop-scroll");
    }, 100);
  // }
};
