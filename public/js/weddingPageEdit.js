//stack class for Undo/Redo
class Stack {
    constructor() {
        this.items = [];
    }
    push(element) {
        this.items.push(element);
    }
    pop() {
        if (this.items.length == 0)
            return "Underflow";
        return this.items.pop();
    }
    peek() {
        return this.items[this.items.length - 1];
    }
    isEmpty() {
        return this.items.length == 0;
    }
    length() {
        return this.items.length;
    }
    empty() {
        this.items = [];
    }
}





/*declaring stack for undo/redo*/
var undo = new Stack;
var redo = new Stack;
var my = new Array(1501).fill(0);
var mx = new Array(1001).fill(0);
/*This function will return the session Storage Variable object */
function getLocalEditStorage() {
    let obj = {};
    if (typeof localStorage.editCardData !== "undefined") {
        obj = JSON.parse(localStorage.editCardData);
    }
    return obj;
}
// console.log(getLocalEditStorage().cardDetails);






/*common loaderAnimation function*/
function LoaderAnimation(elem) {
    let animation = bodymovin.loadAnimation({
        container: elem,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: './animations/loading.json'
    });
}

let editPageData;
function loadEditPage() {
    editPageData = getLocalEditStorage();
    LoaderAnimation(document.getElementById('editPageLoader'))
    loadBgImage(editPageData['bgImage']);
    //console.log(editPageData)
}

let palette;
function loadBgImage(url) {
    let img = new Image();
    img.crossOrigin = "Anonymus";
    img.onload = function () {
        $('#editPageLoader').remove();
        document.getElementById('editPage').style.backgroundImage = `url("${img.src}")`
        //$('#editPage').append(`${editPageData['cardDetails']}`)
        document.getElementById('card_details').innerHTML = `${editPageData['cardDetails']}`

        const colorThief = new ColorThief();

        palette = colorThief.getPalette(img, 5)

        if (window.innerWidth >= 650) {



            document.getElementById('edit-options').innerHTML = `
            <div class="mobile-view-tool-color-text mobile-view-editor-tools" style="display: flex;height: 100%; align-content: center">
                <div style="cursor: pointer; display: flex; align-content: center; margin: auto; font-size: 32px; width: 120%; justify-content: center;" id="addText" onclick="addTextDiv()">
                    <div class="circle-icon" style="line-height: 40px; height: 47px; background-color: #d3d3d3; margin-right: 20px">
                        <img src="./img/addtextsvg.svg" style="height: 30px">
                    </div>
                    Add Text
                </div>
            </div>
            `;
        }
        else {
            document.getElementById('edit-options').innerHTML = `
            <div class="mobile-view-tool-box-2" style=" bottom: 0;"> 
                <div class="mobile-view-tool-color-text mobile-view-editor-tools" id="addText" onclick="addTextDivMob()">
                    <div class="circle-icon">
                        <img src="./img/addtextsvg.svg" style="height: 20px">
                    </div>
                    Add Text
                </div>
            </div>
            `;
        }

        editText();

        if (window.innerWidth > 374 && window.innerWidth <= 825) {
            document.getElementById(`ec-details-${editPageData['editId']}`).style.transform = ` scale(0.3, 0.3)`;
            undo.push(document.getElementById('editPage').innerHTML)
        }
        else if (window.innerWidth > 825) {
            document.getElementById(`ec-details-${editPageData['editId']}`).style.transform = ` scale(0.4, 0.4)`;
            undo.push(document.getElementById('editPage').innerHTML)
        }
        else {
            document.getElementById(`ec-details-${editPageData['editId']}`).style.transform = `scale(0.24, 0.24)`;
            undo.push(document.getElementById('editPage').innerHTML)
        }
    }
    img.src = url;
}
let editedCardData = JSON.parse(localStorage.editedCardData);
let curElem = 0;

function done_func() {
    if (editPageData['editId'] < 4) {
        let selectedItem = $('.card-details');
        for (let i = 0; i < selectedItem.length; i++) {
            selectedItem[i].style.border = 'none';
            selectedItem[i].contentEditable = 'false';
        }
        document.getElementById(`ec-details-${editPageData['editId']}`).style.transform = ` scale(0.3, 0.3)`
        editPageData['cardDetails'] = document.getElementById('card_details').innerHTML;
        localStorage.setItem('editCardData', JSON.stringify(editPageData));
    }
    else {
        let selectedItem = $('.card-details');
        for (let i = 0; i < selectedItem.length; i++) {
            selectedItem[i].style.border = 'none';
            selectedItem[i].contentEditable = 'false';
        }
        document.getElementById(`ec-details-${editPageData['editId']}`).style.transform = ` scale(0.3, 0.3)`
        document.getElementById('editPageLoader').remove();
        document.getElementById('editPage').style.position = 'relative';
        document.getElementById('editPage').style.display = 'flex';
        document.getElementById('editPage').style.justifyContent = 'center';
        document.getElementById('editPage').style.alignItems = 'center';
        document.getElementById('editPage').innerHTML = document.getElementById('card_details').innerHTML;
        document.getElementById('editPage').classList.add('card-images');
        let selected = document.getElementById('editPage').outerHTML;
        editedCardData[`${editPageData['editId']}`] = selected.replace('editPage', `ec-${editPageData['editId']}`);
        localStorage.setItem('editedCardData', JSON.stringify(editedCardData));
        localStorage.removeItem('editCardData');
        console.log(selected.replace('editPage', `ec-${editPageData['editId']}`))
    }
    window.history.back();
}


let editableElem = null;
let colorPallete = []
let prevFont = '';
function updateRange(id, elem) {
    if (elem.getAttribute('data-id') == 'line-height') { editableElem.style.lineHeight = `${elem.value}` }
    else if (elem.getAttribute('data-id') == 'letter-spacing') { editableElem.style.letterSpacing = `${elem.value}px` }
    else if (elem.getAttribute('data-id') == 'font-size') { editableElem.style.fontSize = `${elem.value}px` }

    document.getElementById(id).innerHTML = elem.value;

    //addToUndo();
}

function updateAlignment(alignment, elem) {
    if (document.getElementById("left").classList.contains('icon-active'))
        document.getElementById('left').classList.remove('icon-active')
    if (document.getElementById("center").classList.contains('icon-active'))
        document.getElementById('center').classList.remove('icon-active')
    if (document.getElementById("right").classList.contains('icon-active'))
        document.getElementById('right').classList.remove('icon-active')
    elem.classList.add("icon-active");

    editableElem.style.textAlign = `${alignment}`

    addToUndo();
}

/* Functions for Undo/Redo */
function addToUndo() {
    var str1 = undo.peek();
    var str2 = document.getElementById('editPage');
    if (undo.peek().localeCompare(document.getElementById('editPage')) != 0) {
        //console.log(str1 == str2);
        undo.push(document.getElementById('editPage').innerHTML);
        redo.empty();
    }
}

function undo_func() {
    if (undo.length() > 1) {
        redo.push(undo.peek());
        undo.pop();
        document.getElementById('editPage').innerHTML = undo.peek();
        let reqdElem = $('.card-details');
        if (window.innerWidth > 374 && window.innerWidth < 826) {
            document.getElementById(`ec-details-${editPageData['editId']}`).style.transform = ` scale(0.3, 0.3)`;
        }
        else if (window.innerWidth > 825) {
            document.getElementById(`ec-details-${editPageData['editId']}`).style.transform = ` scale(0.4, 0.4)`;
        }
        else {
            document.getElementById(`ec-details-${editPageData['editId']}`).style.transform = `scale(0.24, 0.24)`;
        }
        reqdElem[curElem].click();
    }
}

function redo_func() {
    if (redo.isEmpty() == false) {
        undo.push(redo.peek());
        document.getElementById('editPage').innerHTML = redo.peek();
        redo.pop();
        let reqdElem = $('.card-details');
        if (window.innerWidth > 374 && window.innerWidth < 826) {
            document.getElementById(`ec-details-${editPageData['editId']}`).style.transform = ` scale(0.3, 0.3)`;
        }
        else if (window.innerWidth > 825) {
            document.getElementById(`ec-details-${editPageData['editId']}`).style.transform = ` scale(0.4, 0.4)`;
        }
        else {
            document.getElementById(`ec-details-${editPageData['editId']}`).style.transform = `scale(0.24, 0.24)`;
        }
        reqdElem[curElem].click();
    }
}

let defaultFonts = JSON.parse(localStorage.defaultFonts);
let defaultColor = JSON.parse(localStorage.defaultColor);

function addTextDiv() {
    console.log('adding element');
    let requiredElem = $('.card-details');
    var newtext;
    if (requiredElem.length == 0) {
        newtext = document.createElement('div');
        let font = fonts[`${defaultFonts[0]}`];
        newtext.style = `width: max-content; z-index: 1; font-size: 30px; ${font}`
        newtext.style.color = defaultColor[0];
        newtext.spellcheck = false;
        newtext.classList.add('card-details');
    }
    else {
        newtext = requiredElem[0].cloneNode();
    }
    newtext.innerHTML = 'Add Text';
    newtext.style.top = '48%';
    newtext.style.left = '49%';
    newtext.style.lineHeight = '1';
    newtext.style.transform = 'translate3d( 0%,0px,0px)';
    newtext.setAttribute("data-x", '0');
    newtext.setAttribute("data-y", '0');
    document.getElementById(`ec-details-${editPageData['editId']}`).append(newtext);
}

function addTextDivMob() {
    addTextDiv();
    let requiredElem = $('.card-details');
    requiredElem[requiredElem.length - 1].click();
    $('.mobile-view-tool-edit-text').click();
}

// var shift = true;
function editText() {
    $('#ec-card').on('click', function (event) {
        let clickedElem = event.target;
        let requiredElem = $('.card-details');
        let flag = false;
        for (let i = 0; i < requiredElem.length; i++) {
            if (clickedElem == requiredElem[i]) {
                if (editableElem) {
                    editableElem.style.border = 'none';
                    editableElem.style.contentEditable = 'false';
                }
                flag = true;
                editableElem = requiredElem[i];
                // requiredElem[i].style.border = "1px solid rgba(0,0,0,1)"
                requiredElem[i].contentEditable = 'true';
                curElem = i;
                requiredElem[i].classList;
                colorPallete = [];
                if (colorPallete.length < 1) {
                    colorPallete.push(requiredElem[i].style.color);
                }

                let chosenColor = [], format_color;
                if (window.innerWidth >= 650) {
                    document.getElementById('edit-options').innerHTML = `
                        <div>
                        <!--<div class="edit-labels"> TypeFace : </div> -->
                        <!--<br>-->
                        <div class="Font-box" style="margin-bottom:10px; margin-top: 10px">
                        <div class="Font-box-container">
                            <!--<div class="default" style="border-bottom:2px groove rgba(0,0,0,0.4); margin:5px 0px ; padding-bottom:15px; ">
                                <div class="edit-labels" > Selected Font </div>
                                <div class="Font-box" id="selected-Font">Pacifico</div>
                            </div>-->
                            <div class="default" style=" padding-bottom:10px; ">
                                <div class="edit-labels" > Default Fonts </div>
                                <!-- Here the default fonts will come -->
                                <div class="Font-box-default font-option" id="defaultFont1" style="font-family : 'Lora', serif;  font-weight : 400; margin-left: 10px">Lora</div>
                                <div class="Font-box-default font-option" id="defaultFont2" style="font-family : 'Satisfy', cursive; font-weight:400;">Satisfy</div>
                                    
                            </div>
                            <div class="default" style=" margin:0px 0px ; padding-bottom:10px; ">
                                <div class="edit-labels" > All Fonts </div>
                                <div class="dropdown " id="style-2">
                                <button class="btn Font-box" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    <div class="dropdown-toggle" id="selected-Font">Pacifico</div>
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <div class="Font-box font-option" id="lora_bold" style="font-family : 'Lora', serif;  font-weight : 700;">Lora Bold</div>
                                    <div class="Font-box font-option" id="lora_bold_italic" style="font-family : 'Lora', serif;  font-weight : 700; font-style:italic;">Lora Bold Italic</div>
                                    <div class="Font-box font-option" id="lora_italic" style="font-family : 'Lora', serif;  font-weight : 400; font-style:italic;">Lora Italic</div>
                                    <div class="Font-box font-option" id="lora_medium_italic" style="font-family : 'Lora', serif;  font-weight : 500; font-style:italic;">Lora Medium Italic</div>
                                    <div class="Font-box font-option" id="lora" style="font-family : 'Lora', serif;  font-weight : 400;">Lora</div>
                                    <div class="Font-box font-option" id="cinzel" style="font-family : 'Cinzel', serif;  font-weight : 400;">Cinzel</div>
                                    <div class="Font-box font-option" id="cinzel_bold" style="font-family : 'Cinzel', serif;  font-weight : 700;">Cinzel Bold</div>
                                    <div class="Font-box font-option" id="spectral_sc" style="font-family : 'Spectral SC', serif; font-weight:400;">Spectral SC</div>
                                    <div class="Font-box font-option" id="petit_formal_script" style="font-family : 'Petit Formal Script', cursive; font-weight:400;">Petit Formal Script</div>
                                    <div class="Font-box font-option" id="pacifico" style="font-family : 'Pacifico', cursive; font-weight:300;">Pacifico</div>
                                    <div class="Font-box font-option" style="font-family : 'Cookie', cursive; font-weight:400;">Cookie</div>
                                    <div class="Font-box font-option" style="font-family : 'Merienda One', cursive; font-weight:400;">Merienda One</div>
                                    <div class="Font-box font-option" style="font-family : 'Kaushan Script', cursive; font-weight:400;">Kaushan Script</div>
                                    <div class="Font-box font-option" style="font-family : 'Marcellus SC', serif; font-weight:400;">Marcellus SC</div>
                                    <div class="Font-box font-option" style="font-family : 'Playfair Display SC', serif; font-weight:400;">Playfair Display SC</div>
                                    <div class="Font-box font-option" style="font-family : 'Bebas Neue', cursive; font-weight:400;">Bebas Neue</div>
                                    <div class="Font-box font-option" style="font-family : 'Lato', sans-serif;  font-weight:400;">Lato</div>
                                    <div class="Font-box font-option" style="font-family : 'Lato', sans-serif;  font-weight:400; font-style:italic;">Lato Italic</div>
                                    <div class="Font-box font-option" style="font-family : 'Open Sans', sans-serif; font-weight:400;">Open Sans</div>
                                    <div class="Font-box font-option" style="font-family : 'Open Sans', sans-serif; font-weight:600;">Open Sans Semibold</div>
                                    <div class="Font-box font-option" style="font-family : 'Spectral SC', serif; font-weight:700;">Spectral SC Bold</div>        
                                    <div class="Font-box font-option" style="font-family : 'Spectral SC', serif; font-weight:300;">Spectral SC Light</div>
                                    <div class="Font-box font-option" style="font-family : 'Satisfy', cursive; font-weight:400;">Satisfy</div>
                                    <div class="Font-box font-option" style="font-family : 'Dancing Script', cursive; font-weight:400;">Dancing Script</div>
                                    <div class="Font-box font-option" style="font-family : 'Charm', cursive; font-weight:400;">Charm</div>
                                    <div class="Font-box font-option" style="font-family: 'Italianno', cursive;">Italianno</div>
                                    <div class="Font-box font-option" style="font-family : 'Poppins', sans-serif; font-weight:300;">Poppins Light</div>
                                    <div class="Font-box font-option" style="font-family : 'Seaweed Script', cursive; font-weight:400;">Seaweed Script</div>
                                    <div class="Font-box font-option" style="font-family : 'Caveat', cursive; font-weight:400;">Caveat</div>
                                    <div class="Font-box font-option" style="font-family : 'Redressed', cursive; font-weight:400;">Redressed</div>
                                    <div class="Font-box font-option" style="font-family : 'Fondamento', cursive; font-weight:400;">Fondamento</div>
                                    <div class="Font-box font-option" style="font-family : 'Lobster Two', cursive; font-weight:400;">LobsterTwo</div>
                                    <div class="Font-box font-option" style="font-family : 'Rouge Script', cursive; font-weight:400;;">Rouge Script</div>
                                    <div class="Font-box font-option" style="font-family : 'Fjalla One', sans-serif; font-weight:400;">Fjalla One</div>
                                    <div class="Font-box font-option" style="font-family : 'Handlee', cursive; font-weight:400;">Handlee</div>
                                    <div class="Font-box font-option" >Droid Sans</div>
                                    <div class="Font-box font-option" style="font-family : 'Indie Flower', cursive; font-weight:400;">Indie Flower</div>
                                    <div class="Font-box font-option" style="font-family : 'Kalam', cursive; font-weight:300;">Kalam Light</div>
                                    <div class="Font-box font-option" style="font-family : 'Lato', sans-serif; font-weight:100;">Lato Thin</div>
                                    <div class="Font-box font-option" style="font-family : 'Roboto', sans-serif; font-weight:100;">Roboto Thin</div>
                                    <div class="Font-box font-option" style="font-family : 'Sacramento', cursive; font-weight:400;">Sacramento</div>
                                    <div class="Font-box font-option" style="font-family : 'Slabo 13px', serif; font-weight:400;">Slabo</div>
                                </ul>
                                </div>
                            </div> 
                            
                        </div>  
                        </div>

                        <!--<div class="edit-labels"> Font-color : </div>-->
                        <div class="Font-box" style="margin-bottom:10px;">
                                <div style="display: flex; justify-content: center ;align-items: center ; ;">
                                    <div class="edit-labels">Selected Color &nbsp; &nbsp;</div>
                                    <div id="selected-color" class="Font-box" style="width:30px; height: 30px; border-radius: 5px; background-color: pink;"></div>
                                </div>
                                
                                <div id="Palette-color" style="display: flex; justify-content: center ;align-items: center ;margin-top: 8px ;">
                                    <div class="edit-labels" style="padding-top: 4px; padding-right: 6px;">Colors </div>
                                    <div id="Palette-colors" class="Font-box palette-color-div" style="width:30px; height: 30px; border-radius: 5px; background-color: pink;"></div>
                                    <div class="color-item" title="rgb(245, 200, 170)" data-index="0" data-color="rgb(245, 200, 170)">
                                        <div class="empty"></div>
                                        <div class="color-view" style="background-color: rgb(245, 200, 170)"></div>
                                    </div>
                                </div>
                                <button type="button" class="btn btn-outline-secondary" style="margin-top: 15px" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    Colour Picker
                                </button>
                                    
                                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-body">
                                            <div class="colorpicker-style" id='color_picker' style="margin:10px 0px;" ></div>
                                            <div class="text-center" style="margin-top: 20px;" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                                <button type="button" id="set-color-btn" class="btn btn-danger" style="background-color: tomato;">OK</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div>
                        </div>

                        <!--<div class="edit-labels"> More Options : </div>-->
                        <div class="Font-box" style="margin-bottom:10px;display: block;" >

                            <!--<div class="Font-box" style="margin:10px 0px;">
                                <div class="edit-labels" style="text-align: left; font-size:15px;">Line Height :</div>
                                <div class="range-container" style="display: flex; justify-content: center; align-items: center; margin:0px 0px;">
                                    <input class="range" type="range" min="0" max="100" value="10" step="1"  onchange="updateRange('rangevalue1', this)" data-id="line-height" oninput="updateRange('rangevalue1', this)" />
                                    <div class="Font-box" id="rangevalue1" style="width:45px; padding:0px; margin:0px 15px; border-radius:3px; font-size:15px; height:25px;color:rgba(0,0,0,0.6);"></div>
                                </div>
                            </div>    
                            <div class="Font-box" style="margin:10px 0px;">
                                <div class="edit-labels" style="text-align: left; font-size:15px;">Letter Spacing :</div>
                                <div class="range-container" style="display: flex; justify-content: center; align-items: center; margin:0px 0px;">
                                    <input class="range" type="range" min="0" max="100" value="10" step="1" onchange="updateRange('rangevalue2', this)" data-id="letter-spacing" oninput="updateRange('rangevalue2', this)" />
                                    <div class="Font-box" id="rangevalue2" style="width:45px; padding:0px; margin:0px 15px; border-radius:3px; font-size:15px;height:25px;color:rgba(0,0,0,0.6);"></div>
                                </div>
                            </div>-->
                            <div class="Font-box" style="margin:10px 0px;">
                                <div class="edit-labels" style="text-align: left; font-size:15px;">Font Size :</div>
                                <div class="range-container" style="display: flex; justify-content: center; align-items: center; margin:0px 0px;">
                                    <input class="range" id="fontSizeSlider" type="range" min="20" max="250" value="10" step="1"  onchange="updateRange('rangevalue3', this)" data-id="font-size" oninput="updateRange('rangevalue3', this)" />
                                    <div class="Font-box" id="rangevalue3" style="width:45px; padding:0px; margin:0px 15px; border-radius:3px; font-size:15px;height:25px; color:rgba(0,0,0,0.6);"></div>
                                </div>
                            </div>  
                            
                            <div class="Font-box" style=" display: none;">
                                <div class="edit-labels" style="text-align: left; font-size:15px;">Alignment :</div>
                                <div id="alignment" style="display:flex; justify-content: space-evenly; align-items:center;">
                                    <i class="fa fa-align-left icon" id="left" onclick="updateAlignment('left', this)" ></i>     
                                    <i class="fa fa-align-center icon" id="center" onclick="updateAlignment('center', this)"></i>
                                    <i class="fa fa-align-right icon" id="right" onclick="updateAlignment('right', this)"></i>
                                </div>
                            </div>
                            <button class="Font-box-default btn" id="deleteBtn"><i class="far fa-trash-alt delete-ecard-text"></i> Delete </button>
                            <!--<button class="Font-box-default btn" style="margin-top: 9px; margin-left: 12px; border: none;"onclick="undo_func()"><i class="fa fa-undo"></i></button>
                            <button class="Font-box-default btn"style="margin-top: 10px; border: none;" onclick="redo_func()" ><i class="fa fa-redo"></i></button>
                            -->
                        </div>
                    </div>`;
                    format_color = `
                        <div class="edit-labels" style="padding-top: 4px; padding-right: 6px;">Colors </div>
                        <div id="Palette-colors" class="Font-box palette-color-div" style="width:30px; height: 30px; border-radius: 5px; background-color: pink;"></div>
                        <div class="color-item" title="rgb(245, 200, 170)" data-index="0" data-color="rgb(245, 200, 170)">
                            <div class="empty"></div>
                            <div class="color-view" style="background-color: rgb(245, 200, 170)"></div>
                        </div>
                    `;
                }
                else {
                    requiredElem[i].contentEditable = 'false';
                    document.getElementById('edit-options').innerHTML = `
                        <div>
                        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog" style=" display: flex; z-index: 9999;  align-content: center; justify-content: center;">
                                    <div class="modal-content" style="width:fit-content;">
                                        <div class="modal-body">
                                            <div class="colorpicker-style" id='color_picker' style="margin:10px 0px;" ></div>
                                            <div class="text-center" style="margin-top: 20px;" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                                <button type="button" id="set-color-btn" class="btn btn-danger" style="background-color: tomato;">OK</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div>
                        <!--<div class="edit-labels"> TypeFace : </div> -->
                        <!--<br>-->
                        <div class="Font-box" style="display: none; position: fixed; bottom: 10vh;" id="font_box">
                        <div class="Font-box-container">
                            <!--<div class="default" style="border-bottom:2px groove rgba(0,0,0,0.4); margin:5px 0px ; padding-bottom:15px; ">
                                <div class="edit-labels" > Selected Font </div>
                                <div class="Font-box" id="selected-Font">Pacifico</div>
                            </div>-->
                            <div class="default" style=" padding-bottom:10px; ">
                                <div class="edit-labels" > Default Fonts </div>
                                <!-- Here the default fonts will come -->
                                <div class="Font-box-default font-option" id="defaultFont1" style="font-family : 'Lora', serif;  font-weight : 400; margin-left: 10px">Lora</div>
                                <div class="Font-box-default font-option" id="defaultFont2" style="font-family : 'Satisfy', cursive; font-weight:400;">Satisfy</div>
                                    
                            </div>
                            <div class="default" style=" margin:0px 0px ; padding-bottom:10px; ">
                                <div class="edit-labels" > All Fonts </div>
                                <div class="dropdown " id="style-2">
                                <button class="btn Font-box" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    <div class="dropdown-toggle" id="selected-Font">Pacifico</div>
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <div class="Font-box font-option" id="lora_bold" style="font-family : 'Lora', serif;  font-weight : 700;">Lora Bold</div>
                                    <div class="Font-box font-option" id="lora_bold_italic" style="font-family : 'Lora', serif;  font-weight : 700; font-style:italic;">Lora Bold Italic</div>
                                    <div class="Font-box font-option" id="lora_italic" style="font-family : 'Lora', serif;  font-weight : 400; font-style:italic;">Lora Italic</div>
                                    <div class="Font-box font-option" id="lora_medium_italic" style="font-family : 'Lora', serif;  font-weight : 500; font-style:italic;">Lora Medium Italic</div>
                                    <div class="Font-box font-option" id="lora" style="font-family : 'Lora', serif;  font-weight : 400;">Lora</div>
                                    <div class="Font-box font-option" id="cinzel" style="font-family : 'Cinzel', serif;  font-weight : 400;">Cinzel</div>
                                    <div class="Font-box font-option" id="cinzel_bold" style="font-family : 'Cinzel', serif;  font-weight : 700;">Cinzel Bold</div>
                                    <div class="Font-box font-option" id="spectral_sc" style="font-family : 'Spectral SC', serif; font-weight:400;">Spectral SC</div>
                                    <div class="Font-box font-option" id="petit_formal_script" style="font-family : 'Petit Formal Script', cursive; font-weight:400;">Petit Formal Script</div>
                                    <div class="Font-box font-option" id="pacifico" style="font-family : 'Pacifico', cursive; font-weight:300;">Pacifico</div>
                                    <div class="Font-box font-option" style="font-family : 'Cookie', cursive; font-weight:400;">Cookie</div>
                                    <div class="Font-box font-option" style="font-family : 'Merienda One', cursive; font-weight:400;">Merienda One</div>
                                    <div class="Font-box font-option" style="font-family : 'Kaushan Script', cursive; font-weight:400;">Kaushan Script</div>
                                    <div class="Font-box font-option" style="font-family : 'Marcellus SC', serif; font-weight:400;">Marcellus SC</div>
                                    <div class="Font-box font-option" style="font-family : 'Playfair Display SC', serif; font-weight:400;">Playfair Display SC</div>
                                    <div class="Font-box font-option" style="font-family : 'Bebas Neue', cursive; font-weight:400;">Bebas Neue</div>
                                    <div class="Font-box font-option" style="font-family : 'Lato', sans-serif;  font-weight:400;">Lato</div>
                                    <div class="Font-box font-option" style="font-family : 'Lato', sans-serif;  font-weight:400; font-style:italic;">Lato Italic</div>
                                    <div class="Font-box font-option" style="font-family : 'Open Sans', sans-serif; font-weight:400;">Open Sans</div>
                                    <div class="Font-box font-option" style="font-family : 'Open Sans', sans-serif; font-weight:600;">Open Sans Semibold</div>
                                    <div class="Font-box font-option" style="font-family : 'Spectral SC', serif; font-weight:700;">Spectral SC Bold</div>        
                                    <div class="Font-box font-option" style="font-family : 'Spectral SC', serif; font-weight:300;">Spectral SC Light</div>
                                    <div class="Font-box font-option" style="font-family : 'Satisfy', cursive; font-weight:400;">Satisfy</div>
                                    <div class="Font-box font-option" style="font-family : 'Dancing Script', cursive; font-weight:400;">Dancing Script</div>
                                    <div class="Font-box font-option" style="font-family : 'Charm', cursive; font-weight:400;">Charm</div>
                                    <div class="Font-box font-option" style="font-family: 'Italianno', cursive;">Italianno</div>
                                    <div class="Font-box font-option" style="font-family : 'Poppins', sans-serif; font-weight:300;">Poppins Light</div>
                                    <div class="Font-box font-option" style="font-family : 'Seaweed Script', cursive; font-weight:400;">Seaweed Script</div>
                                    <div class="Font-box font-option" style="font-family : 'Caveat', cursive; font-weight:400;">Caveat</div>
                                    <div class="Font-box font-option" style="font-family : 'Redressed', cursive; font-weight:400;">Redressed</div>
                                    <div class="Font-box font-option" style="font-family : 'Fondamento', cursive; font-weight:400;">Fondamento</div>
                                    <div class="Font-box font-option" style="font-family : 'Lobster Two', cursive; font-weight:400;">LobsterTwo</div>
                                    <div class="Font-box font-option" style="font-family : 'Rouge Script', cursive; font-weight:400;;">Rouge Script</div>
                                    <div class="Font-box font-option" style="font-family : 'Fjalla One', sans-serif; font-weight:400;">Fjalla One</div>
                                    <div class="Font-box font-option" style="font-family : 'Handlee', cursive; font-weight:400;">Handlee</div>
                                    <div class="Font-box font-option" >Droid Sans</div>
                                    <div class="Font-box font-option" style="font-family : 'Indie Flower', cursive; font-weight:400;">Indie Flower</div>
                                    <div class="Font-box font-option" style="font-family : 'Kalam', cursive; font-weight:300;">Kalam Light</div>
                                    <div class="Font-box font-option" style="font-family : 'Lato', sans-serif; font-weight:100;">Lato Thin</div>
                                    <div class="Font-box font-option" style="font-family : 'Roboto', sans-serif; font-weight:100;">Roboto Thin</div>
                                    <div class="Font-box font-option" style="font-family : 'Sacramento', cursive; font-weight:400;">Sacramento</div>
                                    <div class="Font-box font-option" style="font-family : 'Slabo 13px', serif; font-weight:400;">Slabo</div>
                                </ul>
                                </div>
                            </div> 
                            
                        </div>  
                        </div>

                        <!--<div class="edit-labels"> Font-color : </div>-->
                        <div class="Font-box" style="display: none; position: fixed; bottom: 10vh;" id="font_colour">
                                <div class="font_colour_div" style="display: flex; justify-content: center ;align-items: center ;">
                                    <div class="edit-labels">Selected Color &nbsp; &nbsp;</div>
                                    <div id="selected-color" class="Font-box" style="width:30px; height: 30px; border-radius: 5px; background-color: pink;"></div>
                                </div>
                                
                                <div id="Palette-color" style="display: flex; justify-content: center ;align-items: center ;margin-top: 8px ;">
                                    <div class="edit-labels" style="padding-top: 4px; padding-right: 6px;">Colors </div>
                                    <div id="Palette-colors" class="Font-box palette-color-div" style="width:30px; height: 30px; border-radius: 5px; background-color: pink;"></div>
                                    <div class="color-item" title="rgb(245, 200, 170)" data-index="0" data-color="rgb(245, 200, 170)">
                                        <div class="empty"></div>
                                        <div class="color-view" style="background-color: rgb(245, 200, 170)"></div>
                                    </div>
                                </div>
                                <button type="button" class="btn btn-outline-secondary" style="margin-top: 15px" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    Colour Picker
                                </button>
                                    
                                
                        </div>
                        <div class="Font-box" style="display: none; position: fixed; top: 35vh;" id="addTextInput">
                            <div class="input-field" contentEditable = 'true' id="inputField">
                            </div>
                            <div class="text-center" style="margin-top: 20px;" id="editTextBtn">
                                <button type="button" class="btn btn-danger" style="background-color: tomato;">Done</button>
                            </div>
                        </div>
                        
                            <div class="Font-box" style="display: none; position: fixed; bottom: 10vh;" id="font_size">
                                <div class="edit-labels" style="text-align: left; font-size:15px;">Font Size :</div>
                                <div class="range-container" style="display: flex; justify-content: center; align-items: center; margin:0px 0px;">
                                    <input class="range" id="fontSizeSlider" type="range" min="20" max="250" value="10" step="1"  onchange="updateRange('rangevalue3', this)" data-id="font-size" oninput="updateRange('rangevalue3', this)" />
                                    <div class="Font-box" id="rangevalue3" style="width:45px; padding:0px; margin:0px 15px; border-radius:3px; font-size:15px;height:25px; color:rgba(0,0,0,0.6);"></div>
                                </div>
                                <div class="edit-labels" style="text-align: left; font-size:15px;">Move :</div>
                                <div id="transformButtonContainer" style="display: flex;">
                                    <div class="Font-box-default move-left-text">
                                        <i class="fas fa-arrow-left"></i>
                                    </div>
                                    <div class="Font-box-default move-up-text">
                                        <i class="fas fa-arrow-up"></i>
                                    </div>
                                    <div class="Font-box-default move-down-text">
                                        <i class="fas fa-arrow-down"></i>
                                    </div>
                                    <div class="Font-box-default move-right-text">
                                        <i class="fas fa-arrow-right"></i>
                                    </div>   
                                </div>
                            </div>  
                            
                            <div class="Font-box" style="display: none; position: fixed; bottom: 10vh;" id="font_align">
                                <div class="edit-labels" style="text-align: left; font-size:15px;">Alignment :</div>
                                <div id="alignment" style="display:flex; justify-content: space-evenly; align-items:center;">
                                    <i class="fa fa-align-left icon" id="left" onclick="updateAlignment('left', this)" ></i>     
                                    <i class="fa fa-align-center icon" id="center" onclick="updateAlignment('center', this)"></i>
                                    <i class="fa fa-align-right icon" id="right" onclick="updateAlignment('right', this)"></i>
                                </div>
                            </div>
                            <!--<button class="Font-box-default btn" style="margin-top: 9px; margin-left: 12px; border: none;"onclick="undo_func()"><i class="fa fa-undo"></i></button>
                            <button class="Font-box-default btn"style="margin-top: 10px; border: none;" onclick="redo_func()" ><i class="fa fa-redo"></i></button>
                            -->  
                        </div>

                        <div class="mobile-view-tool-box-2" style=" bottom: 0;">
                            <div class="mobile-view-tool-resize-text mobile-view-editor-tools">
                                <div class="circle-icon">
                                    <img src="./img/textsize.svg" style="height: 30px">
                                </div>
                                Size
                            </div>
                            <div class="mobile-view-tool-edit-text mobile-view-editor-tools">
                                <div class="circle-icon">
                                    <img src="./img/edit.png" style="height: 20px">
                                </div>
                                Edit
                            </div>
                            <div class="mobile-view-tool-font-text mobile-view-editor-tools">
                                <div class="circle-icon">
                                    <img src="./img/changefont.svg" style="height: 30px">
                                </div>
                                Font
                            </div>
                            <div class="mobile-view-tool-color-text mobile-view-editor-tools">
                                <div class="circle-icon">
                                    <img src="./img/color icon.png" style="height: 20px">
                                </div>
                                Colour
                            </div>
                            <!--<div class="mobile-view-tool-align-text mobile-view-editor-tools">
                                <i class="fas fa-align-center circle-icon" ></i>
                                Align
                            </div>-->
                            <div class="mobile-view-tool-delete-text mobile-view-editor-tools">
                                <div class="circle-icon">
                                    <i class="far fa-trash-alt delete-ecard-text"></i>
                                </div>
                                Delete
                            </div>
                            
                        </div>
                    </div>`;
                    format_color = `
                        <div class="edit-labels" style="padding-top: 4px; padding-right: 6px;">Colors </div>
                        <div id="Palette-colors" class="Font-box palette-color-div" style="width:30px; height: 30px; border-radius: 5px; background-color: pink;"></div>
                        <div class="color-item" title="rgb(245, 200, 170)" data-index="0" data-color="rgb(245, 200, 170)">
                            <div class="empty"></div>
                            <div class="color-view" style="background-color: rgb(245, 200, 170)"></div>
                        </div>
                    `;
                }

                document.getElementById('set-color-btn').addEventListener('click', () => {
                    palette.pop();
                    palette.unshift(chosenColor);
                    const paletteColor = document.getElementById('Palette-color');
                    paletteColor.innerHTML = format_color;
                    for (var itt = 0; itt < 5; itt++) {
                        paletteColor.innerHTML += `<div id="Palette-color` + itt + `" class="Font-box palette-color-div" style="width:30px; height: 30px; border-radius: 5px; background-color: rgb(` + palette[itt][0] + `, ` + palette[itt][1] + `, ` + palette[itt][2] + `);"></div>`;
                        var pal = document.getElementById('Palette-color' + itt);
                        colorPallete.push(pal.style.backgroundColor);
                    };
                });

                $('.font-option').on('click touchstart', function (elem) {
                    requiredElem[i].style.fontFamily = this.style.fontFamily;
                    requiredElem[i].style.fontStyle = this.style.fontStyle;
                    requiredElem[i].style.fontWeight = this.style.fontWeight;
                    let selectedFont = document.getElementById("selected-Font");
                    selectedFont.style.fontFamily = this.style.fontFamily;
                    selectedFont.style.fontStyle = this.style.fontStyle;
                    selectedFont.style.fontWeight = this.style.fontWeight;
                    selectedFont.innerHTML = this.innerHTML;
                    if (prevFont) { prevFont.style.color = 'rgba(0,0,0,0.6)' }
                    prevFont = elem.target;
                    this.style.color = 'rgba(0,255,74,1)';

                    addToUndo();
                });

                let prevInner = requiredElem[i].innerHTML;

                let type = 'sketch';
                let picker = new CodeMirrorColorPicker.create({
                    position: 'inline',
                    container: document.getElementById('color_picker'),
                    //type: type,
                    color: requiredElem[i].style.color,
                    outputFormat: 'rgb',
                    hideDelay: 0,
                    onHide: function (c) {
                        console.log('hide', c);
                    },
                    onChange: function (c) {
                        document.getElementById('selected-color').style.backgroundColor = c;
                        requiredElem[i].style.color = c;
                        addToUndo();

                        chosenColor = c.substring(4, c.length - 1).split(',');
                        chosenColor[0] = parseInt(chosenColor[0]);
                        chosenColor[1] = parseInt(chosenColor[1]);
                        chosenColor[2] = parseInt(chosenColor[2]);
                        console.log(chosenColor);
                    }
                });

                const paletteColor = document.getElementById('Palette-color');
                for (var itt = 0; itt < 5; itt++) {
                    paletteColor.innerHTML += `<div id="Palette-color` + itt + `" class="Font-box palette-color-div" style="width:30px; height: 30px; border-radius: 5px; background-color: rgb(` + palette[itt][0] + `, ` + palette[itt][1] + `, ` + palette[itt][2] + `);"></div>`;
                    var pal = document.getElementById('Palette-color' + itt);
                    colorPallete.push(pal.style.backgroundColor);
                };

                picker.setUserPalette([{
                    name: "Colors",
                    colors: colorPallete
                }]);

                document.getElementById('selected-Font').style.fontFamily = requiredElem[i].style.fontFamily;
                document.getElementById('selected-Font').style.fontWeight = requiredElem[i].style.fontWeight;
                document.getElementById('selected-Font').style.fontStyle = requiredElem[i].style.fontStyle;
                document.getElementById('selected-Font').innerHTML = (requiredElem[i].style.fontFamily).slice(0, requiredElem[i].style.fontFamily.indexOf(','))

                document.getElementById('defaultFont1').style = fonts[`${defaultFonts[0]}`];
                document.getElementById('defaultFont1').innerHTML = (document.getElementById('defaultFont1').style.fontFamily).slice(0, document.getElementById('defaultFont1').style.fontFamily.indexOf(','));

                document.getElementById('defaultFont2').style = fonts[`${defaultFonts[1]}`];
                document.getElementById('defaultFont2').innerHTML = (document.getElementById('defaultFont2').style.fontFamily).slice(0, document.getElementById('defaultFont2').style.fontFamily.indexOf(','));

                document.getElementById('lora_italic').style.width = document.getElementById('dropdownMenuButton1').style.width;

                document.getElementById('fontSizeSlider').value = parseInt((requiredElem[i].style.fontSize).slice(0, -2));
                document.getElementById('rangevalue3').innerHTML = parseInt((requiredElem[i].style.fontSize).slice(0, -2));









                document.getElementById('Palette-colors').style.backgroundColor = requiredElem[i].style.color;
                document.getElementById('selected-color').style.backgroundColor = requiredElem[i].style.color;





                // Script written by aman !
                // this code is a replacable solution for the below comented 42 lines of code !
                // this piece of code helps to change the color in seleced color box !

                // this variable is reference to the selected color box div !
                var selectedColor = document.getElementById('selected-color')

                // whenever ther is a click action perform on any palette-color-div
                // this piece of code will take the respective color and apply that to selected text !!
                $(".palette-color-div").click(function (e) {
                    requiredElem[i].style.color = e.style.backgroundColor;
                    selectedColor.style.backgroundColor = e.style.backgroundColor;
                    picker.color = e.style.backgroundColor;
                    addToUndo();
                })

                // in case of errors, you can simply uncomment below given code, to reverse the previous version !
                // Script written by aman !




                // document.getElementById('Palette-colors').onclick = function () {
                //     requiredElem[i].style.color = document.getElementById('Palette-colors').style.backgroundColor;
                //     document.getElementById('selected-color').style.backgroundColor = document.getElementById('Palette-colors').style.backgroundColor;
                //     picker.color = document.getElementById('Palette-colors').style.backgroundColor;

                //     addToUndo();
                // }
                // document.getElementById('Palette-color0').onclick = function () {
                //     requiredElem[i].style.color = document.getElementById('Palette-color0').style.backgroundColor;
                //     document.getElementById('selected-color').style.backgroundColor = document.getElementById('Palette-color0').style.backgroundColor;
                //     picker.color = document.getElementById('Palette-color0').style.backgroundColor;

                //     addToUndo();
                // }
                // document.getElementById('Palette-color1').onclick = function () {
                //     requiredElem[i].style.color = document.getElementById('Palette-color1').style.backgroundColor;
                //     document.getElementById('selected-color').style.backgroundColor = document.getElementById('Palette-color1').style.backgroundColor;
                //     picker.color = document.getElementById('Palette-color1').style.backgroundColor;

                //     addToUndo();
                // }
                // document.getElementById('Palette-color2').onclick = function () {
                //     requiredElem[i].style.color = document.getElementById('Palette-color2').style.backgroundColor;
                //     document.getElementById('selected-color').style.backgroundColor = document.getElementById('Palette-color2').style.backgroundColor;
                //     picker.color = document.getElementById('Palette-color2').style.backgroundColor;

                //     addToUndo();
                // }
                // document.getElementById('Palette-color3').onclick = function () {
                //     requiredElem[i].style.color = document.getElementById('Palette-color3').style.backgroundColor;
                //     document.getElementById('selected-color').style.backgroundColor = document.getElementById('Palette-color3').style.backgroundColor;
                //     picker.color = document.getElementById('Palette-color3').style.backgroundColor;

                //     addToUndo();
                // }
                // document.getElementById('Palette-color4').onclick = function () {
                //     requiredElem[i].style.color = document.getElementById('Palette-color4').style.backgroundColor;
                //     document.getElementById('selected-color').style.backgroundColor = document.getElementById('Palette-color4').style.backgroundColor;
                //     picker.color = document.getElementById('Palette-color4').style.backgroundColor;

                //     addToUndo();
                // }








                //document.getElementById('undoBtn').onclick = undo_func(i);
                //document.getElementById('redoBtn').onclick = redo_func(i);


                $('div[contenteditable="true"]').keypress(function (event) {
                    if (event.which != 13)
                        return true;
                    var docFragment = document.createDocumentFragment();
                    //add a new line
                    var newEle = document.createTextNode('\n');
                    docFragment.appendChild(newEle);

                    //add the br, or p, or something else
                    var newEle2 = document.createElement('br');
                    docFragment.appendChild(newEle2);

                    //make the br replace selection
                    var range = window.getSelection().getRangeAt(0);
                    if (window.getSelection().rangeCount > 1)
                        range = window.getSelection().getRangeAt(0);
                    range.deleteContents();
                    //range.insertNode(newEle);
                    range.insertNode(newEle2);
                    console.log(newEle2);

                    //create a new range
                    range = document.createRange();
                    range.setStartAfter(newEle);
                    range.collapse(true);

                    //make the cursor there
                    var sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);

                    return false;
                });













                // script written by aman !
                // this is the function which toggles the current active element and
                // hides all the rest of element !
                function hideAll(id) {
                    let allELements = [
                        'font_size', 'addTextInput', 'font_colour', 'font_box'
                    ]
                    for (let i = 0; i < allELements.length; i++) {
                        if (allELements[i] == id) {
                            document.getElementById(id).style.display = document.getElementById(id).style.display == "none" ? "block" : "none";
                        }
                        else {
                            document.getElementById(allELements[i]).style.display = 'none';
                        }
                    }

                }


                function initializeCodinates()
                {
                    let cordinates = getXandYcordinate(requiredElem[i].style.transform)
                    requiredElem[i].setAttribute('data-x', cordinates.x);
                    requiredElem[i].setAttribute('data-y', cordinates.y);
                }

                function setCordinates(condition)
                {
                    if(requiredElem[i].getAttribute('data-x') == null) initializeCodinates();

                    let x = parseInt(requiredElem[i].getAttribute('data-x'))
                    let y = parseInt(requiredElem[i].getAttribute('data-y'))
                    
                    if(condition == "incrementX")      x += 10
                    else if(condition == "decrementX") x -= 10
                    else if(condition == "incrementY") y += 10
                    else if(condition == "decrementY") y -= 10

                    requiredElem[i].style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0px)';
                    requiredElem[i].setAttribute('data-x', x);
                    requiredElem[i].setAttribute('data-y', y);
                }

                // when somone will click on the buttons in the bottom to edit the card
                //  these lines will execute !
                $('.mobile-view-tool-resize-text').on('click', function () { hideAll('font_size');})

                $('.mobile-view-tool-font-text').on('click', function () { hideAll('font_box') })

                $('.mobile-view-tool-color-text').on('click', function () { hideAll('font_colour') })

                $('.mobile-view-tool-align-text').on('click', function () { hideAll('font_align') })

                $('.mobile-view-tool-edit-text').on('click', function () {
                    document.getElementById('inputField').innerHTML = requiredElem[i].innerHTML;
                    hideAll('addTextInput')
                })

                // script written by aman end!














                $('#editTextBtn').on('click', function () {
                    requiredElem[i].innerHTML = document.getElementById('inputField').innerHTML;
                    document.getElementById('addTextInput').style.display = 'none';
                })

                $('.mobile-view-tool-delete-text').on('click', function () {
                    requiredElem[i].remove();
                    document.getElementById('card_details').click();
                })

                $('#deleteBtn').on('click', function () {
                    requiredElem[i].remove();
                    document.getElementById('card_details').click();
                })

                interact(requiredElem[i])

                    .resizable({
                        // resize from all edges and corners
                        edges: {
                            bottom: false,
                            right: false
                        },

                        listeners: {
                            move(event) {
                                event.preventDefault();
                                var target = event.target
                                var x = (parseFloat(target.getAttribute('data-x')) || 0)
                                var y = (parseFloat(target.getAttribute('data-y')) || 0)

                                // update the element's style
                                target.style.width = event.rect.width + 'px'
                                target.style.height = event.rect.height + 'px'

                                // translate when resizing from top or left edges
                                x += event.deltaRect.left
                                y += event.deltaRect.top
                                target.css("transhorm-origin", "center center");
                                target.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0px)'

                                target.setAttribute('data-x', x)
                                target.setAttribute('data-y', y)

                            }
                        },
                        modifiers: [
                            // keep the edges inside the parent
                            interact.modifiers.restrictEdges({
                                outer: 'parent'
                            }),


                        ],

                    })
                    .draggable({
                        // enable inertial throwing
                        inertia: true,
                        // keep the element within the area of it's parent
                        modifiers: [
                            interact.modifiers.restrictRect({
                                restriction: 'parent',
                                endOnly: true
                            })
                        ],
                        // enable autoScroll
                        autoScroll: true,

                        listeners: {
                            // call this function on every dragmove event
                            move: dragMoveListener,

                            // call this function on every dragend event
                            end(event) {
                                event.stopPropagation();
                                line = null;
                                $(".card-details").css("border", "none")
                                $(".line").remove();

                                // $('.liney1').remove();
                                // $('.liney2').remove();
                                $('.linex').remove();
                                var textEl = event.target.querySelector('p')
                                // linePoints.x = null, linePoints.y = null;
                                textEl && (textEl.textContent =
                                    'moved a distance of ' +
                                    (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                                        Math.pow(event.pageY - event.y0, 2) | 0))
                                        .toFixed(2) + 'px')
                            }
                        }
                    })
                var last = null;
                function dragMoveListener(event) {
                    event.preventDefault();
                    var target = event.target;
                    target.style.border = "2px solid red";

                    if (detectCenterY(target) == 0)
                        return 0;
                    // console.log(
                    //     target.getBoundingClientRect().top
                    //     ,target.getBoundingClientRect().left
                    //     );
                    // console.log(requiredElem);

                    var temp = target.style.transform, shiftx, shifty;
                    temp = temp.substring(12, temp.length - 1);
                    temp = temp.split(', ');
                    if (temp[0][temp[0].length - 1] == '%') {
                        var a = parseFloat(temp[0].substring(0, temp[0].length - 1));
                        shiftx = (a / 100) * target.clientWidth;
                    }
                    else shiftx = parseFloat(temp[0].substring(0, temp[0].length - 2));
                    if (temp[1][temp[1].length - 1] == '%') {
                        var a = parseFloat(temp[1].substring(0, temp[1].length - 1));
                        shifty = (a / 100) * target.clientHeight;
                    }
                    else shifty = parseFloat(temp[1].substring(0, temp[1].length - 2));
                    var scale = 0.4;
                    if (window.innerWidth < 826) scale = 0.3;
                    if (window.innerWidth < 375) scale = 0.24;
                    var y1 = parseInt(parseInt(target.style.top.slice(0, -2)) + shifty), y2 = parseInt(y1 + event.rect.height / scale);
                    $('#liney1').remove();
                    $('#liney2').remove();
                    // liney(y2*scale);
                    // var x1 = parseFloat(target.style.left.slice(0,-2)), x2 = x1 + event.rect.width;
                    // console.log(shiftx,shifty);
                    // keep the dragged position in the data-x/data-y attributes
                    // var x = (parseFloat(target.getAttribute('data-x')) || 0) + (event.dx * 3);
                    // var y = (parseFloat(target.getAttribute('data-y')) || 0) + (event.dy * 3);
                    // translate the element 
                    // y1+=event.dy*3; 
                    // // y2+=event.dy*3;
                    // y1 = parseInt(y1);
                    // // y2 = parseInt(y2);
                    // var flag = false;
                    // my[y1]++;
                    // last = y1;
                    // for(var i=-10; i<=10; i++) {
                    //     if(my[y1]>1) {
                    //         flag = true;
                    //         break;
                    //     }
                    // }
                    // if(flag) liney(y1*scale,'y1');
                    // if(my[y2]>1) liney(y2*scale,'y2');
                    // console.log(requiredElem.length);
                    for (var j = 0; j < requiredElem.length; j++) {
                        if (j != i) {
                            var top = requiredElem[j].getAttribute('style').split(';')[6],
                                left = requiredElem[j].getAttribute('style').split(';')[7];
                            top = parseFloat(top.substring(6, top.length - 2));
                            left = parseFloat(left.substring(6, left.length - 2));
                            if (top == y1 || top == y2)
                                console.log(top, left);
                        }
                    }
                    target.style.transform = 'translate3d(' + (shiftx + (event.dx * 3)) + 'px, ' + (shifty + (event.dy * 3)) + 'px, 0px)'

                    // update the posiion attributes
                    // target.setAttribute('data-x', x)
                    // target.setAttribute('data-y', y)
                    line = event;
                };

                $('.move-left-text').on('click', function () {
                    setCordinates('decrementX')
                })
                $('.move-up-text').on('click', function () {
                    setCordinates('decrementY')
                })

                $('.move-down-text').on('click', function () {
                    setCordinates('incrementY')
                })
                
                
                $('.move-right-text').on('click', function () {
                    setCordinates('incrementX')
                })

                // this function is used later in the resizing and gesture demos
                window.dragMoveListener = dragMoveListener

            }
        }
        if (!flag) {
            if (editableElem) {
                editableElem.style.border = 'none';
                editableElem.style.contentEditable = 'false'
                if (window.innerWidth >= 650) {
                    document.getElementById('edit-options').innerHTML = `
                    <div class="mobile-view-tool-color-text mobile-view-editor-tools" style="display: flex;height: 100%; align-content: center">
                        <div style="cursor: pointer; display: flex; align-content: center; margin: auto; font-size: 32px;  width: 100%; justify-content: center;" id="addText" onclick="addTextDiv()">
                            <div class="circle-icon" style="line-height: 40px; height: 47px; background-color: #d3d3d3; margin-right: 20px">
                                <img src="./img/addtextsvg.svg" style="height: 30px">
                            </div>
                            Add Text
                        </div>
                    </div>
                    `;
                }
                else {
                    document.getElementById('edit-options').innerHTML = `
                    <div class="mobile-view-tool-box-2" style=" bottom: 0;"> 
                        <div class="mobile-view-tool-color-text mobile-view-editor-tools" id="addText" onclick="addTextDivMob()">
                            <div class="circle-icon">
                                <img src="./img/addtextsvg.svg" style="height: 20px">
                            </div>
                            Add Text
                        </div>
                    </div>
                    `;
                }
            }
        }
    });

}



window.addEventListener('load', (event) => {
    loadEditPage();
});

window.addEventListener('resize', function () {
    if (window.innerWidth > 374 && window.innerWidth <= 825) {
        document.getElementById(`ec-details-${editPageData['editId']}`).style.transform = `scale(0.3, 0.3)`;
        let reqdElem = $('.card-details');
        reqdElem[curElem].click();
    }
    else if (window.innerWidth > 825) {
        document.getElementById(`ec-details-${editPageData['editId']}`).style.transform = `scale(0.4, 0.4)`;
        let reqdElem = $('.card-details');
        reqdElem[curElem].click();
    }
    else {
        document.getElementById(`ec-details-${editPageData['editId']}`).style.transform = `scale(0.24, 0.24)`;
        let reqdElem = $('.card-details');
        reqdElem[curElem].click();
    }
    if (window.innerWidth >= 650) {
        document.getElementById('edit-options').innerHTML = `
        <div class="mobile-view-tool-color-text mobile-view-editor-tools" style="display: flex;height: 100%; align-content: center">
            <div style="display: flex; align-content: center; margin: auto; font-size: 32px;  width: 100%; justify-content: center;" id="addText" onclick="addTextDiv()">
                <div class="circle-icon" style="line-height: 40px; height: 47px; background-color: #d3d3d3; margin-right: 20px">
                    <img src="./img/addtextsvg.svg" style="height: 30px">
                </div>
                Add Text
            </div>
        </div>`;
    }
    else {
        document.getElementById('edit-options').innerHTML = `
        <div class="mobile-view-tool-box-2" style=" bottom: 0;"> 
            <div class="mobile-view-tool-color-text mobile-view-editor-tools" id="addText" onclick="addTextDivMob()">
                <div class="circle-icon">
                    <img src="./img/addtextsvg.svg" style="height: 20px">
                </div>
                Add Text
            </div>
        </div>`;
    }
})



var line = null;
setInterval(() => {
    if (line !== null) {
        $('.line').remove();
        var epage = $('#editPage');
        // $('.line2').remove();
        var x = $("#ec-card")[0].clientWidth / 2;
        var y = $('#ec-card')[0].clientHeight / 2 + $('nav')[0].offsetHeight;
        if (line.client.x - 20 <= x && line.client.x + 20 >= x) {
            var x1 = epage[0].clientWidth / 2, y1 = 0, x2 = x1, y2 = $('#editPage')[0].clientHeight;
            if (x2 < x1) {
                var tmp;
                tmp = x2; x2 = x1; x1 = tmp;
                tmp = y2; y2 = y1; y1 = tmp;
            }

            var lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            var m = (y2 - y1) / (x2 - x1);

            var degree = Math.atan(m) * 180 / Math.PI;

            //  this line adds the vertical line
            $('#editPage').append("<div class='line' style='transform-origin: top left; transform: rotate(" + degree + "deg); width: " + lineLength + "px; height: 1px; background: black; position: absolute; top: " + y1 + "px; left: " + x1 + "px;z-index: 10;'></div>");
        }
        // console.log($('nav'));
        if (line.client.y - 20 <= y && line.client.y + 20 >= y) {
            var x1 = 0, y1 = $('#editPage')[0].clientHeight / 2, x2 = epage[0].clientWidth, y2 = y1;
            if (x2 < x1) {
                var tmp;
                tmp = x2; x2 = x1; x1 = tmp;
                tmp = y2; y2 = y1; y1 = tmp;
            }

            var lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            var m = (y2 - y1) / (x2 - x1);

            var degree = Math.atan(m) * 180 / Math.PI;

            //  this line adds the horizontal line
            $('#editPage').append("<div class='line' style='transform-origin: top left; transform: rotate(" + degree + "deg); width: " + lineLength + "px; height: 1px; background: black; position: absolute; top: " + y1 + "px; left: " + x1 + "px;z-index: 10;'></div>");
        }
        // if(abs(line.clien))
    }
}, 10);

linex(300);
// this will create a line at the provided x coordinate
function linex(x) {
    var x1 = x, y1 = 0, x2 = x1, y2 = $('#editPage')[0].clientHeight;
    if (x2 < x1) {
        var tmp;
        tmp = x2; x2 = x1; x1 = tmp;
        tmp = y2; y2 = y1; y1 = tmp;
    }

    var lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    var m = (y2 - y1) / (x2 - x1);

    var degree = Math.atan(m) * 180 / Math.PI;

    $('#editPage').append("<div class='linex' style='transform-origin: top left; transform: rotate(" + degree + "deg); width: " + lineLength + "px; height: 1px; background: black; position: absolute; top: " + y1 + "px; left: " + x1 + "px;z-index: 10;'></div>");
}

// this will create a line at the provided y coordinate
function liney(y, cls) {
    console.log('y is = ', y)
    console.log('cls is = ', cls)
    var x1 = 0, y1 = y, x2 = $('#editPage')[0].clientWidth, y2 = y1;
    if (x2 < x1) {
        var tmp;
        tmp = x2; x2 = x1; x1 = tmp;
        tmp = y2; y2 = y1; y1 = tmp;
    }

    var lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    var m = (y2 - y1) / (x2 - x1);

    var degree = Math.atan(m) * 180 / Math.PI;

    $('#editPage').append(`<div class='line${cls}' style='transform-origin: top left; transform: rotate(${degree}deg); width: ${lineLength}px; height: 1px; background: black; position: absolute; top: ${y1}px; left: ${x1}px;z-index: 10;'></div>`);
}









function lineyaman() {

    let parent = document.getElementById('ec-details-1')

    let parentHalf = parent.style.height.split('px')[0] / 2
    // let parentLeft = parseInt(parent.getBoundingClientRect().left)
    let parentWidth = parent.style.width.split('px')[0]

    $('#ec-details-1').append(`<div class='amanline' style='transform-origin: top left; 
                                                           width: ${parentWidth}px; height: 3px; 
                                                           background: black; position: absolute; 
                                                           top: ${parentHalf}px; left: 0px;
                                                           z-index: 10;'></div>`);
}









































// Script written by aman
var initCalled = false;
var allCardElements = {}
var codinatesOfAllElements = []
var currentMovingElement = null


function init() {
    // this is the init function
    // it assigns all the elements present in card to allCardElements valriable
    // as well as it updates all the cordinates of all those elements in codinatesOfAllElements variable
    // it will call only once when someone will drag some element

    allCardElements = {}
    codinatesOfAllElements = []
    allCardElements = document.getElementsByClassName("card-details");
    for (let i = 0; i < allCardElements.length; i++) {
        codinatesOfAllElements.push(getCordinates(allCardElements[i]))
        allCardElements[i].onmouseup = () => {init();}
    }
}



// this is the function which returns the cordinates of the element
//  which we pass as argument in it !
// basically, we pass the elements present on editing page !
function getCordinates(target) {

    let codinate1 = {
        x: target.getBoundingClientRect().left,
        y: target.getBoundingClientRect().top
    }
    let codinate2 = {
        x: target.getBoundingClientRect().left + target.getBoundingClientRect().width,
        y: target.getBoundingClientRect().top
    }
    let codinate3 = {
        x: target.getBoundingClientRect().left + target.getBoundingClientRect().width,
        y: target.getBoundingClientRect().top + target.getBoundingClientRect().height
    }
    let codinate4 = {
        x: target.getBoundingClientRect().left,
        y: target.getBoundingClientRect().top + target.getBoundingClientRect().height
    }

    return [codinate1, codinate2, codinate3, codinate4];

}

function detectCollision() {

    let targetCordinates = getCordinates(currentMovingElement)

    for (let i = 0; i < codinatesOfAllElements.length; i++) {
        if (allCardElements[i] != currentMovingElement) {
            let currentCordinates = codinatesOfAllElements[i]

            if (
                targetCordinates[0].x >= currentCordinates[0].x &&
                targetCordinates[0].x < currentCordinates[1].x &&
                targetCordinates[0].y >= currentCordinates[0].y &&
                targetCordinates[0].y < currentCordinates[3].y
            ) { allCardElements[i].style.border = "2px solid red" }
            else if (
                targetCordinates[1].x >= currentCordinates[0].x &&
                targetCordinates[1].x < currentCordinates[1].x &&
                targetCordinates[1].y >= currentCordinates[0].y &&
                targetCordinates[1].y < currentCordinates[3].y
            ) { allCardElements[i].style.border = "2px solid red" }
            else if (
                targetCordinates[2].x >= currentCordinates[0].x &&
                targetCordinates[2].x < currentCordinates[1].x &&
                targetCordinates[2].y >= currentCordinates[0].y &&
                targetCordinates[2].y < currentCordinates[3].y
            ) { allCardElements[i].style.border = "2px solid red" }
            else if (
                targetCordinates[3].x >= currentCordinates[0].x &&
                targetCordinates[3].x < currentCordinates[1].x &&
                targetCordinates[3].y >= currentCordinates[0].y &&
                targetCordinates[3].y < currentCordinates[3].y
            ) { allCardElements[i].style.border = "2px solid red" }


            else if (
                currentCordinates[0].x >= targetCordinates[0].x &&
                currentCordinates[0].x < targetCordinates[1].x &&
                currentCordinates[0].y >= targetCordinates[0].y &&
                currentCordinates[0].y < targetCordinates[3].y
            ) { allCardElements[i].style.border = "2px solid red" }
            else if (
                currentCordinates[1].x >= targetCordinates[0].x &&
                currentCordinates[1].x < targetCordinates[1].x &&
                currentCordinates[1].y >= targetCordinates[0].y &&
                currentCordinates[1].y < targetCordinates[3].y
            ) { allCardElements[i].style.border = "2px solid red" }
            else if (
                currentCordinates[2].x >= targetCordinates[0].x &&
                currentCordinates[2].x < targetCordinates[1].x &&
                currentCordinates[2].y >= targetCordinates[0].y &&
                currentCordinates[2].y < targetCordinates[3].y
            ) { allCardElements[i].style.border = "2px solid red" }
            else if (
                currentCordinates[3].x >= targetCordinates[0].x &&
                currentCordinates[3].x < targetCordinates[1].x &&
                currentCordinates[3].y >= targetCordinates[0].y &&
                currentCordinates[3].y < targetCordinates[3].y
            ) { allCardElements[i].style.border = "2px solid red" }

            else {
                allCardElements[i].style.border = "none"
            }
        }
    }

}













// this part will update the cursor position on the html document
//  just to detect the center of the page !!
var cursorPosition = null
document.onmousemove = function (e) {
    cursorPosition = e.pageY;
}



//  this function detects the the movement of an element
//  if it reaches to the center of the page !
var movingIn = false;
var previousOfX = null;
var centerOfParent = null
var previous_distance = null

function manageValues(target)
{
    centerOfParent = parseInt(target.parentElement.getBoundingClientRect().left + (target.parentElement.getBoundingClientRect().width/2));
    previousOfX =    parseInt(target.getBoundingClientRect().left + (target.getBoundingClientRect().width/2));
    console.log(centerOfParent,previousOfX);
    if(Math.abs(centerOfParent - previousOfX) < previous_distance)
    {
        movingIn = true;
        // console.log("moving closer")
        
    }
    else if(Math.abs(centerOfParent - previousOfX) == previous_distance)
    {
        // console.log("no change")
    }
    else
    {
        movingIn = false;
        // console.log('Moving far')
    }
    
    previous_distance = Math.abs(centerOfParent - previousOfX);

}

function detectCenterY(target) {

    // this is the part where currentMovingElement will updated !
    currentMovingElement = target;


    // if init is not called (only once), then it will be called here
    if (!initCalled) {
        init();
        initCalled = !initCalled
    }

    // this is the function which will detect the collision of elements
    //  on editing screen !
    detectCollision()

    if(centerOfParent == null) centerOfParent = target.parentElement.getBoundingClientRect().left + (target.parentElement.getBoundingClientRect().width/2);
    if(previousOfX == null) previousOfX = target.getBoundingClientRect().left + (target.getBoundingClientRect().width/2);
    if(previous_distance == null) previous_distance = Math.abs(centerOfParent - previousOfX);


    manageValues(target);
    // parent element the the editing - page
    // let parent = target.parentElement

    // it assigns the half of dragable element
    // let targetHalf = parseInt(target.getBoundingClientRect().width / 2 + target.getBoundingClientRect().left)

    // it assigns the half of editing page !
    // let parentHalf = parseInt(parent.getBoundingClientRect().width / 2 + parent.getBoundingClientRect().left)

    // previous_distance = Math.abs(parentHalf - targetHalf);


    return 1;
}





function getXandYcordinate(property)
{
    // this function simply takes the transform property of an element
    //  and returns the x and y points of the property

    // "translate3d(-107.5px, -12px, 0px)"
    //  this is the sample of property we are ging to get as an argument !
    
    
    let a = property;
    a = a.slice(12 , a.length);
    a = a.slice(0 , a.length-1);
    a = a.split(',').join('');
    a = a.split('px').join('');
    a = a.split(' ');

    let x = parseInt(a[0])
    let y = parseInt(a[1])

    return {x,y};

    // this complete function will return the x and y cordinate of the 
    // transform property of specific html element as an object
    // example = {10,20};

}

