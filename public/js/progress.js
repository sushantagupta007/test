
var page = 0;  //index value
var limit = 3;
var progressImg = document.getElementById('progressImgBar');

function next(){
    page++;
    if(page<=limit){ progressImg.children[page].classList.add('active');  }
    else           { page = 3; }
}

function prev(){
    if(page<=limit && page>0){  progressImg.children[page].classList.remove('active'); }
    page--;
    if(page<0){page = 0;}
}
