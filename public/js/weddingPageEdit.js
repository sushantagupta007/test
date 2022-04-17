var previousPercentage = 30
var selectedElement = null
var dragValue = null;
var dragvalueCenterX = 0
var dragvalueCenterY = 0
var fontSet = new Set()
var globalEcId = null





function done_func() {

    
    
    if (editPageData['editId'] < 4) {
        let selectedItem = $('.card-details');
        for (let i = 0; i < selectedItem.length; i++) {
            selectedItem[i].style.border = 'none';
            selectedItem[i].contentEditable = 'false';
        }
        // document.getElementById(`ec-details-${editPageData['editId']}`).style.transform = ` scale(0.3, 0.3)`
        editPageData['cardDetails'] = document.getElementById('card_details').innerHTML;
        localStorage.setItem('editCardData', JSON.stringify(editPageData));
    }
    else {
        let selectedItem = $('.card-details');
        for (let i = 0; i < selectedItem.length; i++) {
            selectedItem[i].style.border = 'none';
            selectedItem[i].contentEditable = 'false';
        }
        // document.getElementById(`ec-details-${editPageData['editId']}`).style.transform = ` scale(0.3, 0.3)`
        try{
            document.getElementById('editPageLoader').remove();
        }
        catch{
            // above loader does not exist !
        }
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



function property(property , resizeTo)
{
    property = parseInt(property.split("px")[0])
    return property*resizeTo/100;
}



function move(elem) {
    // let element = document.getElementById(elem);
    let element = elem;
    element.style.position = "absolute";
    element.onmousedown = function () {
        dragvalue = element;
        dragvalueCenterX = dragvalue.offsetLeft + (dragvalue.offsetWidth / 2)
        dragvalueCenterY = dragvalue.offsetTop + (dragvalue.offsetHeight / 2)
    }
}


var onceStoppedX = false;
var onceStoppedY = false;
function setupDragableCode()
{
    
    document.getElementById(globalEcId).onmouseup = function (e) {
        dragvalue = null
        document.getElementById("yaxis").style.display = "none"
        document.getElementById("xaxis").style.display = "none"
        $(".card-details").removeClass("activated-element")
        $(".card-details").css("border","none")
        // $(".card-details").css({"border" : "none"})
        // $(selectedElement).css({"border" : "none"})
        // $(".card-details").removeAttr('contenteditable')
        // selectedElement = null
    }
    
    document.getElementById(globalEcId).onmousemove = function (e) {
        let x = e.clientX - document.getElementById('cardContainer').getBoundingClientRect().left;
        let y = e.clientY - document.getElementById('cardContainer').getBoundingClientRect().top;

        try {
            
            dragvalue.style.left = (x - dragvalue.getBoundingClientRect().width/2 ) + "px";
			dragvalue.style.top =  (y - dragvalue.getBoundingClientRect().height/2) + "px";



            dragvalueCenterX = parseInt(dragvalue.getBoundingClientRect().left + dragvalue.getBoundingClientRect().width / 2)
            dragvalueCenterY = parseInt(dragvalue.getBoundingClientRect().top + dragvalue.getBoundingClientRect().height / 2)

            parentCenterX = parseInt(document.getElementById('cardContainer').getBoundingClientRect().left + document.getElementById('cardContainer').getBoundingClientRect().width / 2)
            parentCenterY = parseInt(document.getElementById('cardContainer').getBoundingClientRect().top + document.getElementById('cardContainer').getBoundingClientRect().height / 2)

            if(dragvalueCenterX+3>parentCenterX && dragvalueCenterX-3<parentCenterX)
            {
                document.getElementById("yaxis").style.display = "block"

                if(onceStoppedX == false)
                {
                    dragvalue.style.left = 
                        parseInt(document.getElementById('cardContainer').getBoundingClientRect().width/2)
                        -
                        parseInt(dragvalue.getBoundingClientRect().width/2) +"px";
                    
                    onceStoppedY = true;
                    dragvalue = null;
                }
            }
            else
            {
                document.getElementById("yaxis").style.display = "none"
            }
            if(dragvalueCenterY+3>parentCenterY && dragvalueCenterY-3<parentCenterY)
            {
                document.getElementById("xaxis").style.display = "block"
                if(onceStoppedY == false)
                {
                    dragvalue.style.top = 
                        parseInt(document.getElementById('cardContainer').getBoundingClientRect().height/2)
                        -
                        parseInt(dragvalue.getBoundingClientRect().height/2) +"px";
                    
                    onceStoppedY = true;
                    dragvalue = null;
                }
            }
            else
            {
                document.getElementById("xaxis").style.display = "none"
            }


            detectCenterY(dragvalue)
        }
        catch { }
    }
}




function resizeDataAccToWindow()
{


	let percentage = 24;
	if (window.innerWidth >= 600)  percentage = 30;

    if(previousPercentage == percentage) return 0;
    else previousPercentage = percentage;

    $(".card-details").css({"transform" : "none"})


    let allElements = $(".card-details");
    let leftCenter = document.getElementById('cardContainerImage').offsetWidth/ 2
    for(let i=0 ; i<allElements.length ; i++)
    {
        let width = allElements[i].offsetWidth*percentage/100
        $(allElements[i]).css({
            "left" : (leftCenter-width/2)+"px",
        });
    }
        
}


function resizeAllTheData()
{

	let percentage = 24;
	if (window.innerWidth >= 600)  percentage = 30;

    
    $(".card-details").css({"transform" : "none"})


    setTimeout(function(){
        
        let allElements = $(".card-details");
        let leftCenter = document.getElementById('cardContainerImage').offsetWidth/ 2
        for(let i=0 ; i<allElements.length ; i++)
        {
            let width = allElements[i].offsetWidth*percentage/100
            $(allElements[i]).css({

                "left" : (leftCenter-width/2)+"px",
                "font-size" : property(allElements[i].style.fontSize , percentage) + "px",
                "top" : property(allElements[i].style.top , percentage) + "px",
                "transform" : "none"
            });
        }
        $(".card-details").css({
            // "user-select" : "none",
            // "cursor" : "alias"
        })
        
    } , 1000);
    
    
    $(".ec-details").css({"display" : "block"})

    setTimeout(function(){
        setupDragableCode()
        updateDefaultFont()
    } , 1000)

    return 1;
}



function getCurrentCardData(id)
{
    let data = JSON.parse(localStorage.globalEditCardData);
    for(let i=0 ; i<data.length ; i++)
    {
        if(data[i]["id"] == "ec-details-"+id) return data[i];
    }
}


function createParentDiv(id , personalProperties)
{
    let div = document.createElement("div")
    div.id = id
    div.className = "editedByScreen"

    div.style.position = personalProperties["position"]
    div.style.width =  "100%"
    div.style.height = "100%"
    // div.style.width = personalProperties["width"]
    // div.style.height = personalProperties["height"]
    div.style.left = personalProperties["left"]
    div.style.top = personalProperties["top"]
    div.style.overflow = personalProperties["overflow"]
    div.style.zIndex = personalProperties["z-index"]


    return div;
}

function sortTextContent(textContent)
{
    let data = null;
    if(textContent.includes("<br>")) 
    {
        data = textContent.split("<br>")
        textContent = "";
        for(let i=0 ; i<data.length ; i++)
        {
            textContent += (data[i] + "\n")
        }
    }
    return textContent;
}

function addChildren(parent , children)
{

    for(let i=0 ; i<children.length ; i++)
    {
        let child = document.createElement("div")
        child.style.fontFamily = children[i]["font-family"]
        child.style.width = children[i]["width"]
        child.style.zIndex =  children[i]["z-index"]
        child.style.fontSize = children[i]["font-size"]
        child.style.color = children[i]["color"]
        child.style.left = children[i]["left"]
        child.style.textAlign = children[i]["text-align"]
        child.style.transform = children[i]["transform"]
        child.style.top = children[i]["top"]
        // child.innerText = children[i]["textContent"]
        child.innerText = sortTextContent(children[i]["textContent"])

        child.classList.add("card-details")

        parent.appendChild(child)

        fontSet.add(children[i]["font-family"])

    }

    return parent;

}

















function loadBgImage(url) {
    let img = new Image();
    img.crossOrigin = "Anonymus";
    img.onload = function () {
        $('#editPageLoader').remove();

        document.getElementById('cardContainerImage').setAttribute("src" ,`${img.src}` );
        
        let data = getCurrentCardData(getLocalEditStorage()["editId"])
        let myDiv = createParentDiv(data["id"] , data["personalProperties"])
        globalEcId = data["id"]
        myDiv = addChildren(myDiv , data["children"])

        document.getElementById('card_details').appendChild(myDiv);
        
        
        // document.getElementById('card_details').innerHTML = `${editPageData['cardDetails']}`
        if(resizeAllTheData() == 1)
        {
            document.onclick = function(elem){

                if(elem.target.classList.contains('card-details'))
                {
                    if(elem.target.classList.contains('activated-element'))
                    {
                        // elem.target.classList.remove('activated-element')
                        // $(elem.target).removeAttr('contenteditable')
                        // selectedElement = null
                    }
                    else
                    {
                        $('.card-details').removeClass("activated-element")
                        $('.card-details').removeAttr("contenteditable")

                        elem.target.classList.add("activated-element")
                        elem.target.setAttribute("contenteditable" , "true")
                        selectedElement = elem.target
                        
                        if(750 < window.innerWidth)  activateDesktopMode()
                        else activateMobileMode()

                        document.getElementsByClassName("range")[0].value = selectedElement.style.fontSize.split("px")[0]
                        document.getElementsByClassName("range")[1].value = selectedElement.style.fontSize.split("px")[0]

                        move(elem.target)
                    }

                }
                else if(elem.target.id == globalEcId)
                {
                    $('.card-details').removeClass("activated-element")
                    $('.card-details').removeAttr("contenteditable")
                    selectedElement = null;


                    document.getElementById("yaxis").style.display = "none"
                    document.getElementById("xaxis").style.display = "none"

                    if(750 < window.innerWidth) deactivateDesktopMode()
                    else deactivateMobileMode()
                }
            }
        }
       
    }

    img.src = url;
}


// let defaultFonts = JSON.parse(localStorage.defaultFonts);
// let defaultColor = JSON.parse(localStorage.defaultColor);




window.addEventListener('load', (event) => {
    loadEditPage();    

    if(750 < window.innerWidth) 
    {
        if(selectedElement == null)
        {
            $(".box").css("display" , "none")
            $("#initialAddText").css("display" , "flex")
            $("#secondContainer").css("justify-content" , "center")
        }
        else
        {
            $(".box").css("display" , "flex")
            $("#initialAddText").css("display" , "none")    
            $("#secondContainer").css("justify-content" , "flex-start")
        }
    }
    else
    {
        if(selectedElement == null)
        {
            if(window.innerWidth>530)
            {
                $("#secondContainerAlternate").css({"justify-content" : "space-evenly"});
                $(".mobileComponent").css({"display" : "none"})
            }
        }
        else
        {
            if(window.innerWidth>530)
            {
                document.getElementById("secondContainerAlternate").style.justifyContent = "space-evenly"
                $(".mobileComponent").css({"display" : "flex"})
            }
            else
            {
                $("#secondContainerAlternate").css({"justify-content" : "flex-start"});
                $(".mobileComponent").css({"display" : "flex"})
            }
        }
    }


});















// Updation Script

function updateDefaultFont()
{
    const iterator1 = fontSet.values();

    let font1 = iterator1.next().value
    $(".fontname1").css({"font-family" : font1})
    $(".fontname1").text(font1)
    
    
    let font2 = iterator1.next().value
    $(".fontname2").css({"font-family" : font2})
    $(".fontname2").text(font2)

}

function getListDiv(fontFamily , text)
{
    let div = document.createElement("div")
    div.classList.add('dropdown-item')
    div.onclick = "updateFont(this)"
    div.style.fontFamily = fontFamily
    div.innerText = text

    return div;
}
function updateFont(e)
{
    if(document.getElementById("recentFontsDiv").children.length != 0)
    {
        let children = document.getElementById("recentFontsDiv").children;
        let count = 0;
        for(let i=0 ; i<children.length ; i++) if(e == children[i]) {count++; break;}
        if(count == 0) 
        {
            document.getElementById("recentFontsDiv").appendChild(
                getListDiv(e.style.fontFamily , e.innerText)
            )
        }
    }
    else document.getElementById("recentFontsDiv").appendChild(
        getListDiv(e.style.fontFamily , e.innerText)
    )

    if(selectedElement != null) selectedElement.style.fontFamily = e.style.fontFamily

}




function insertNewColor(color)
{
    document.getElementsByClassName('colorContainer')[0].children[0].remove()
    document.getElementsByClassName('colorContainer')[1].children[0].remove()
    
    let div = document.createElement("div")
    div.style.backgroundColor = color;
    div.classList.add("previousColor")
    div.onclick = function(){setThisColor(this)}
    
    let div1 = document.createElement("div")
    div1.style.backgroundColor = color;
    div1.classList.add("previousColor")
    div1.onclick = function(){setThisColor(this)}
    
    document.getElementsByClassName('colorContainer')[0].appendChild(div);
    document.getElementsByClassName('colorContainer')[1].appendChild(div1);

}

function setColor(index)
{
    let newColor = document.getElementsByClassName('clr-field')[index].style.color
    insertNewColor(newColor)
    if(selectedElement != null) selectedElement.style.color = newColor
}

function setThisColor(e)
{
    if(selectedElement != null) selectedElement.style.color = e.style.backgroundColor
}








function deleteElement()
{
    if(selectedElement != null) selectedElement.remove()
}



function updateFontSize(elem)
{
    selectedElement.style.fontSize = elem.value+"px"
}



// Key bindings on selected element

function getMove(num , byNum)
{
    return parseInt(num.split("px")[0]) + byNum + "px"
}
document.onkeydown = function(e)
{
    if(selectedElement == null) return 0;

    if(e.key == "ArrowRight") selectedElement.style.left = getMove(selectedElement.style.left , 1);
    else if(e.key == "ArrowLeft") selectedElement.style.left = getMove(selectedElement.style.left , -1);
    else if(e.key == "ArrowDown") selectedElement.style.top = getMove(selectedElement.style.top , 1);
    else if(e.key == "ArrowUp") selectedElement.style.top = getMove(selectedElement.style.top , -1);
}

// Key bindings on selected element






function showAddTextDiv()
{
    document.getElementById('myModal').style.display = "flex"
    document.getElementById('addTextDiv').style.display = "flex"
}
function cancelAddText()
{
    document.getElementById('myModal').style.display = "none"
    document.getElementById('addTextDiv').style.display = "none"
}
function doneAddText()
{
    let data = document.getElementById('userText').value
    document.getElementById('userText').value = ""
    document.getElementById('myModal').style.display = "none"
    document.getElementById('addTextDiv').style.display = "none"
    addTextOnScreen(data);
}
function getHalfX()
{
    return document.getElementById(globalEcId).offsetWidth/2 + "px"
}
function getHalfY()
{
    return document.getElementById(globalEcId).offsetHeight/2 + "px"
}
function addTextOnScreen(data)
{
    if(data.trim() == "") return 0;
    // <div class="card-details" style="font-family: lobster_two; width: max-content; z-index: 1; font-size: 22.5px; color: rgb(188, 70, 96); left: 125.45px; text-align: center; transform: none; top: 82.2px;">asdasdfsdf</div>

    let div = document.createElement("div")
    div.classList.add("card-details")

    div.style.fontFamily = document.getElementsByClassName("card-details")[0].style.fontFamily
    div.style.widows = "max-content"

    div.style.zIndex = "1";
    div.style.fontSize = "20px";
    div.style.color = document.getElementsByClassName("previousColor")[0].style.backgroundColor;
    div.style.left = getHalfX();
    div.style.textAlign = "center";
    div.style.transform = "none";
    div.style.top = getHalfY();
    div.innerText = data;

    document.getElementById(globalEcId).appendChild(div);

}














function doneFontSize()
{
    document.getElementById('myModal').style.display = "none"
    document.getElementById('fontSizeDiv').style.display = "none"
}
function showFontSize()
{
    document.getElementById('myModal').style.display = "flex"
    document.getElementById('fontSizeDiv').style.display = "flex"
}












function showFontFamily()
{
    document.getElementById('myModal').style.display = "flex"
    document.getElementById('changeFontContainer').style.display = "flex"
}
function doneFontFamily()
{
    document.getElementById('myModal').style.display = "none"
    document.getElementById('changeFontContainer').style.display = "none"
}







function showEditTextDiv()
{
    if(selectedElement == null)
    {
        alert("Select text to edit !")
        return 0;
    }
    document.getElementById('myModal').style.display = "flex"
    document.getElementById('editTextDiv').style.display = "flex"

    document.getElementById("editedText").value = selectedElement.innerText
}

function cancelEditText()
{
    document.getElementById('myModal').style.display = "none"
    document.getElementById('editTextDiv').style.display = "none"
}

function doneEditText()
{
    selectedElement.innerText = document.getElementById('editedText').value
    document.getElementById('editedText').value = ""
    document.getElementById('myModal').style.display = "none"
    document.getElementById('editTextDiv').style.display = "none"
}





function openTransform()
{
    if(selectedElement==null) return 0;
    document.getElementById('myModal').style.display = "flex"
    document.getElementById('transformDiv').style.display = "flex"
}

function moveELement(key)
{

    if(key == "ArrowRight") selectedElement.style.left = getMove(selectedElement.style.left , 1);
    else if(key == "ArrowLeft") selectedElement.style.left = getMove(selectedElement.style.left , -1);
    else if(key == "ArrowDown") selectedElement.style.top = getMove(selectedElement.style.top , 1);
    else if(key == "ArrowUp") selectedElement.style.top = getMove(selectedElement.style.top , -1);
}

function closeTransform()
{
    document.getElementById('myModal').style.display = "none"
    document.getElementById('transformDiv').style.display = "none"
}










function openColorChangeDiv()
{
    document.getElementById('myModal').style.display = "flex"
    document.getElementById('changeColorDiv').style.display = "flex"
}
function doneColorChangeDiv()
{
    document.getElementById('myModal').style.display = "none"
    document.getElementById('changeColorDiv').style.display = "none"
}



function openVideoContainer()
{
    document.getElementById('myModal').style.display = "flex"
    document.getElementById('videoContainer').style.display = "flex"
    document.getElementById('videoContainer').style.width = "100%"
}
document.getElementById('videoContainer').onclick = () => {
    document.getElementById('myModal').style.display = "none"
    document.getElementById('videoContainer').style.display = "none"
}






// Updation Script End








function activateDesktopMode()
{
    $(".box").css("display" , "flex")
    $("#initialAddText").css("display" , "none")
    $("#secondContainer").css("justify-content" , "flex-start")
}
function deactivateDesktopMode()
{
    $(".box").css("display" , "none")
    $("#initialAddText").css("display" , "flex")
    $("#secondContainer").css("justify-content" , "center")
}


function activateMobileMode()
{
    $(".mobileComponent").css("display" , "flex")
    if(window.innerWidth<=530) $("#secondContainerAlternate").css("justify-content" , "flex-start")
    else $("#secondContainerAlternate").css("justify-content" , "space-evenly")
}
function deactivateMobileMode()
{
    $(".mobileComponent").css("display" , "none")
    $("#secondContainerAlternate").css("justify-content" , "space-evenly")
}




// Resizeing code !

window.onresize = ()=>{

    if(750 < window.innerWidth) 
    {
        if(selectedElement == null)
        {
            $(".box").css("display" , "none")
            $("#initialAddText").css("display" , "flex")
            $("#secondContainer").css("justify-content" , "center")
        }
        else
        {
            $(".box").css("display" , "flex")
            $("#initialAddText").css("display" , "none")    
            $("#secondContainer").css("justify-content" , "flex-start")
        }


        if(document.getElementById('myModal').style.display != "none")
        {
            $('.modalComponent').css("display" , "none")
            $('#myModal').css("display" , "none")
            $('#videoContainer').css("display" , "none")
        }
    }
    else
    {
        if(selectedElement == null)
        {
            if(window.innerWidth>530)
            {
                $("#secondContainerAlternate").css({"justify-content" : "space-evenly"});
                $(".mobileComponent").css({"display" : "none"})
            }
        }
        else
        {
            if(window.innerWidth>530)
            {
                document.getElementById("secondContainerAlternate").style.justifyContent = "space-evenly"
                $(".mobileComponent").css({"display" : "flex"})
            }
            else
            {
                $("#secondContainerAlternate").css({"justify-content" : "flex-start"});
                $(".mobileComponent").css({"display" : "flex"})
            }
        }
    }
}


// Resizeing code end!












































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
            ) { allCardElements[i].style.border = "1px solid black" 
                allCardElements[i].style.borderStyle = "dashed" }
                
            else if (
                targetCordinates[1].x >= currentCordinates[0].x &&
                targetCordinates[1].x < currentCordinates[1].x &&
                targetCordinates[1].y >= currentCordinates[0].y &&
                targetCordinates[1].y < currentCordinates[3].y
            ) { allCardElements[i].style.border = "1px solid black" 
                allCardElements[i].style.borderStyle = "dashed" }
                
            else if (
                targetCordinates[2].x >= currentCordinates[0].x &&
                targetCordinates[2].x < currentCordinates[1].x &&
                targetCordinates[2].y >= currentCordinates[0].y &&
                targetCordinates[2].y < currentCordinates[3].y
            ) { allCardElements[i].style.border = "1px solid black" 
                allCardElements[i].style.borderStyle = "dashed" }
                
            else if (
                targetCordinates[3].x >= currentCordinates[0].x &&
                targetCordinates[3].x < currentCordinates[1].x &&
                targetCordinates[3].y >= currentCordinates[0].y &&
                targetCordinates[3].y < currentCordinates[3].y
            ) { allCardElements[i].style.border = "1px solid black" 
                allCardElements[i].style.borderStyle = "dashed" }
                


            else if (
                currentCordinates[0].x >= targetCordinates[0].x &&
                currentCordinates[0].x < targetCordinates[1].x &&
                currentCordinates[0].y >= targetCordinates[0].y &&
                currentCordinates[0].y < targetCordinates[3].y
            ) { allCardElements[i].style.border = "1px solid black" 
                allCardElements[i].style.borderStyle = "dashed" }
                
            else if (
                currentCordinates[1].x >= targetCordinates[0].x &&
                currentCordinates[1].x < targetCordinates[1].x &&
                currentCordinates[1].y >= targetCordinates[0].y &&
                currentCordinates[1].y < targetCordinates[3].y
            ) { allCardElements[i].style.border = "1px solid black" 
                allCardElements[i].style.borderStyle = "dashed" }
                
            else if (
                currentCordinates[2].x >= targetCordinates[0].x &&
                currentCordinates[2].x < targetCordinates[1].x &&
                currentCordinates[2].y >= targetCordinates[0].y &&
                currentCordinates[2].y < targetCordinates[3].y
            ) { allCardElements[i].style.border = "1px solid black" 
                allCardElements[i].style.borderStyle = "dashed" }
                
            else if (
                currentCordinates[3].x >= targetCordinates[0].x &&
                currentCordinates[3].x < targetCordinates[1].x &&
                currentCordinates[3].y >= targetCordinates[0].y &&
                currentCordinates[3].y < targetCordinates[3].y
            ) { allCardElements[i].style.border = "1px solid black" 
                allCardElements[i].style.borderStyle = "dashed" }
                

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
    // console.log(centerOfParent,previousOfX);
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































