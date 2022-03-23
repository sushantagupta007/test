window.addEventListener('load', (event) => {

    function card(cards){
       
        // console.log(cards);
        Object.keys(cards).map(function(items, index) {
            // console.log(cards[items][0]);
            $('.slider_container').append(`<div class="item" onclick="togglePreview()" style="cursor: pointer;">
            <img src="${cards[items][0]}" class="rounded img-thumbnail img1" alt="">
          </div>`)  
        })
       
    }


    function Allcard(cards){
       
        let i=0
        // console.log(cards);
        Object.keys(cards).map(function(items, index) {
            // console.log(cards[items][0]);
            $('.all_cards').append(`  
            <div class="col-6 col-sm-6 col-md-4 col-lg-4 px-5 py-3 justify-content-center">
            <div class="p-2 rounded"  style="box-shadow: 0px 5px 30px rgba(0, 0, 0, 0.3);cursor: pointer;">
              <img class="rounded img-fluid" onclick="togglePreview()" src="${cards[items][0]}">
                <div class="imageDetail" style="display: flex;justify-content: space-around;align-items: center;">
                  <h5 class="pt-1">$ <span class="h6">35.00</span>&nbsp;&nbsp;<span class="text-muted"><del>$ <span class="h6">49.95</span></del></span></h5>
                  <i onclick="Toggle(${i})" class="far fa-heart like" style="font-size: 2rem;"></i>
                </div>
            </div>
          </div>`)  
          i++;
        })
       
    }


    fetchData = async ()=>{
        const docRef =  firestore().doc(`weddingcards/royal`)
        try{
            const snapShot = await docRef.get()
            // const obj=Object.entries(snapShot.data());
            card(snapShot.data());
            // console.log(typeof(obj));
        }
        catch(err)
        {
            console.log(err);
        }
    }

    fetchAllData = async ()=>{
        const docRef =  firestore().doc(`weddingcards/allcards/cards/first`)
        try{
            const snapShot = await docRef.get()
            Allcard(snapShot.data());
        }
        catch(err)
        {
            console.log(err);
        }
    }


    fetchData();
    fetchAllData();
  

});

const btn = document.getElementsByClassName('like');

function Toggle(id){
  if(btn[id].classList.contains("far")){
  btn[id].classList.remove("far");
  btn[id].classList.add("fas");
}
else{
  btn[id].classList.remove("fas");
  btn[id].classList.add("far");
}
}

function togglePreview(){
  const blur = document.getElementById('blur');
  blur.classList.toggle('active');
  const popup = document.getElementById('popup');
  popup.classList.toggle('active');
}







