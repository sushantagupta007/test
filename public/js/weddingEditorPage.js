let thumbnails = document.getElementsByClassName('clsimg');

let activeImages = document.getElementsByClassName('active');

for(let i=0;i < thumbnails.length; i++){
    thumbnails[i].addEventListener('mouseover',function(){
        if(activeImages.length > 0){
            activeImages[0].classList.remove('active')
        }
        this.classList.add('active');
        document.getElementById('featured').src = this.src;
    })
}

let j=0;
function showNext(){
    activeImages[j].classList.remove('active');
    thumbnails[j++].classList.add('active');
    document.getElementById('featured').src = thumbnails[j++].src;
}

function showPrev(){
    activeImages[j].classList.remove('active');
    thumbnails[j--].classList.add('active');
    document.getElementById('featured').src = thumbnails[j--].src;
}