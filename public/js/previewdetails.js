let countCard=0
let cards
let docLength

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        $('.user-details-container').css('display','flex')
        $('.user-name').text(user.displayName)
        $('.user-profile-image-container img').attr('src',user.photoURL)
      $('.logout-button').css('display','block')
      $('.login-button').css('display','none')
    }
    else{
      $('.logout-button').css('display','none')
      $('.login-button').css('display','flex')
    }
  });

  document.getElementById('closeButton').style.display="none";//close button disappear

  
$('.logout-button').on('click',function(){
    firebase.auth().signOut()
    $('.user-details-container').css('display','none')
    $('.user-name').text(' ')
    $(this).css('display','none')
    window.location.reload()
})

// window.addEventListener('load', (event) => {
//     console.log('page is fully loaded');
//   });

document.getElementById('thankButton').addEventListener('click',()=>{
document.getElementById('thank_you').style.display='block';
document.getElementById('closeButton').style.display="block";//close button appear
document.getElementById('thankButton').style.display="none";//thank button disappear
})

document.getElementById('closeButton').addEventListener('click',()=>{
document.getElementById('thank_you').style.display='none';
document.getElementById('closeButton').style.display="none";//close button disappear
document.getElementById('thankButton').style.display="block";//thank button appear
    })
    window.addEventListener('load',(e)=>{

    // $('#loader-container').css('display','none')

    const categoryMap = {
        "congrats" :["../img/feelings-congrats-svg.svg","Congrats Cards"],
        "getwellsoon" : ["../img/feelings-getwellsoon-svg.svg","Get Well Soon Cards"],
        "love" : ["../img/feelings-love-svg.svg","Love Cards"],
        "missyou" : ["../img/feelings-missyou-svg.svg","Miss You"],
        "sorry" : ["../img/feelings-sorry-svg.svg","Sorry Cards"],
        "thankyou" : ["../img/feelings-thankyou-svg.svg","Thank You Cards"],
        "weddingwishes" : ["../img/feelings-weddingwishes-svg.svg","Wedding Wishes Cards"],
    }
    
    const url = `../cardCategories/Feelings.html?cardCategory=feelings&cardSubCategory=thankyou`;//$(location).attr('href');
    const parts = url.split("?")
    const subParts = parts[1].split("&")
    const cardCategory = subParts[0].split("=")[1]
    const cardSubCategory = subParts[1].split("=")[1]
    
    
    // const url = $(location).attr('href')
    // const parts = url.split("?")
    // const subParts = parts[1].split("&")
    // const cardCategory = 'feelings';//subParts[0].split("=")[1]
    // const cardSubCategory = 'thankyou';//subParts[1].split("=")[1]
    
    
    firebase.analytics().logEvent("Category", { "Category": "Feelings"});
    firebase.analytics().logEvent("Sub category", { "Sub category" :  cardSubCategory});
    
    for(let key in categoryMap){
        if(cardSubCategory === key){
            $('#category-svg').attr('src',categoryMap[key][0])
            $('#card-title').text(categoryMap[key][1])
        }
    }
    
    
    //state persistence
    // firestore().enablePersistence({synchronizeTabs:true})
    //   .catch(function(err) {
    //     if(err.code == 'failed-precondition') {
    //     console.log("Can't persist data because multiple tabs are open");
    //     }
    //     else if (err.code == 'unimplemented') {
    //     console.log("Browser doesn't support persistence");
    //     }
    // });
    
     // <div id=img-loader-container-${countCard} style="width: 100%;height: fit-content;padding:20px 0;display: flex;justify-content: center;align-items: center;border-radius: 5px;box-shadow: 0 2px 5px #666;">
                        //     <div id=loader-${countCard} style="width: 100px;height: 100px"></div>
                        // </div>
    function addCards(Cards,pagenumber){
        $('.page-number').removeClass('active-page')
        $(`#page-${pagenumber}`).addClass('active-page')
        const begin = (pagenumber-1)*20 + 1
        const end = (begin + 19) < docLength ? (begin + 19) : docLength
        for(let key = begin;key<=end;key++)
        {
            $('#card-container').append(
                `<div class="col-6 col-md-4 col-lg-3 d-flex justify-content-center align-items-center">
                    <div class="card-wrapper" >
                       
                            <img
                               
                                style="transform:scale(0.8)"

                                src=${Cards[key][0]} 
                                alt=""
                                onload=onImgLoaded(${countCard})
                                id=image-${countCard} 
                                data-card-id=${Cards[key][1]}
                                data-card-subcategory=${cardSubCategory}
                                 data-card-preview=${Cards[key][3]}
                                data-card-position=${key-1}
                            />
                    </div>
                </div>`)
                var animation = bodymovin.loadAnimation({
                    container : document.getElementById(`loader-${countCard}`),
                    renderer : 'svg',
                    loop : true,
                    autoplay : true,
                    path : '../animations/loading.json'
                })
                countCard++;
        }
    }
    
    function addButtons(){
        const numberOfButtons = Math.ceil(docLength / 20)
    
        if(numberOfButtons>1){
            $('#page-buttons-container').css('display','block')
            for(let i=1;i<=numberOfButtons;i++){
                $('#pagination-button-container').append(`
                    <span class="page-number" id=page-${i}>${i}</span>
                `)
            }
        }
    }
    
    //fetch Data
    
    fetchingData = async ()=>{
        const docRef =  firestore().doc(`celebrare/sectioncards/${cardCategory}/${cardSubCategory}`)
        try{
            const snapShot = await docRef.get()
            docLength = Object.keys(snapShot.data()).length 
            addButtons()
    
            if(!snapShot.exists)
            {
                console.log('Documents not exist');
            }
            else{
                cards = snapShot.data()
                addCards(cards,1)
                // $('#loader').css('display','none')
            }  
        }
        catch(err)
        {
            console.log(err);
        }
    }
    
    fetchingData();
    
    $('#pagination-button-container').on('click','span',function(event){
        event.stopPropagation()
        const pageNumber = $(this).text()
        $('#card-container').empty()
        $(window).scrollTop(200);
        addCards(cards,pageNumber)
    })
    
    function onImgLoaded(element){
        $(`#img-loader-container-${element}`).css('display','none')
        $(`#image-${element}`).css('display','flex')
    }
    
    const year = new Date().getFullYear()
    $('#current-year').text(`${year}.`)

});

