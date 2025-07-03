//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//basket
let basketWidth = 60;
let basketHeight = 90;
let basketX = boardWidth/2.2;
let basketY = boardHeight/8*7;
let basketMove = 0;

//recycling
let recyclingArray = []
let recyclingWidth = 40;
let recyclingHeight = 40;
let recyclingX = 30;
let recyclingY = 0;

//type of recycling
let randomizedrecyclabletype = Math.floor(Math.random() * 3) + 1;
const recytype = ["Plastic", "Metal", "Paper"];
// plastic = 1 metal = 2 paper = 3
const plastic = "blue";
const metal = "grey";
const paper = "brown";

//positive affirmation 
let quips = ["Awesome!", "Nice job!", "Great!", "Well done!", "You're a recycling star!", "Keep it up!", "You have no equal!", "What would recycling be without you!"];
let currentQuip = null;
let quipTimer = 0;

//lives
let lives = 3;

//physics
gravity = 2;

//score
let score = 0;

//game over
let gameOver = false;

//colors
const colors = ['green', 'black', 'grey', 'red'];
const Rcolors = [ 'blue', 'grey' , 'green'];


//recycle place interval
let recycleInterval = 1500;
let speedUp = 10;
let gravityUp = 10;

//images
//baskets
let plBasketImg = new Image();
plBasketImg.src = "images/Blue_Bin.png";
let mBasketImg = new Image();
mBasketImg.src = "images/Grey_Bin.png";
let pBasketImg = new Image();
pBasketImg.src = "images/Green_Bin.png";
//background
let backgroundImg = new Image();
backgroundImg.src = "images/background-03.png";
//plastic items
let plasticitem1 = new Image();
plasticitem1.src = "images/plastic_cup.png"
let plasticitem2 = new Image();
plasticitem2.src = "images/shampoo_bottle.png"
let plasticitem3 = new Image();
plasticitem3.src = "images/yogurt_plastic.png"
//metal items
let metalitem1 = new Image();
metalitem1.src = "images/coffe_metal_tin.png"
let metalitem2 = new Image();
metalitem2.src = "images/soda_can.png"
let metalitem3 = new Image();
metalitem3.src = "images/tomato_can.png"
//paper items
let paperitem1 = new Image();
paperitem1.src = "images/carboardd_box.png";
let paperitem2 = new Image();
paperitem2.src = "images/envelope.png";
let paperitem3  = new Image();
paperitem3.src = "images/carboard_egg_carton.png";
//trash
let trash1 = new Image();
trash1.src = "images/apple_core_garbage.png"
let trash2 = new Image();
trash2.src = "images/pizza_slice_garbage.png"
let trash3 = new Image();
trash3.src = "images/chips_garbage.png";

let basketArray = [plBasketImg, mBasketImg, pBasketImg];
let plasticArray = [plasticitem1,plasticitem2,plasticitem3];
let metalArray = [metalitem1, metalitem2, metalitem3];
let paperArray = [paperitem1,paperitem2,paperitem3];

let trashArray = [trash1, trash2, trash3];

let basket = {
    x : basketX,
    y : basketY,
    width : basketWidth,
    height : basketHeight
}

//item types
const itemTypes = [
    
    { type: 'recyclable', color: 'green' },
    { type: 'non-recyclable', color: 'red' }
];

const leftbtn = document.getElementById("leftbtn");
const rightbtn = document.getElementById("rightbtn");

window.onload = function() {
    
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //draw basket
    context.fillStyle = colors[2];
    context.drawImage(plBasketImg, basket.x, basket.y, basket.width, basket.height);
    requestAnimationFrame(update);
    IntervalID = setInterval(placeRecycling, recycleInterval);
    document.addEventListener("keydown", moveBasket);
    document.addEventListener("keyup", stopBasket);
    leftbtn.addEventListener("mousedown",function(event){
        moveBasket({code:"ArrowLeft"});
    });
    leftbtn.addEventListener("mouseup",function(event){
        stopBasket({code:"ArrowLeft"});

    });
    rightbtn.addEventListener("mousedown",function(event){
        moveBasket({code:"ArrowRight"});
    });
    rightbtn.addEventListener("mouseup",function(event){
        stopBasket({code:"ArrowRight"});

    });

    //mobile
    leftbtn.addEventListener("touchstart",function(event){
        moveBasket({code:"ArrowLeft"});
    });
    leftbtn.addEventListener("touchend",function(event){
        stopBasket({code:"ArrowLeft"});

    });
    rightbtn.addEventListener("touchstart",function(event){
        moveBasket({code:"ArrowRight"});
    });
    rightbtn.addEventListener("touchend",function(event){
        stopBasket({code:"ArrowRight"});

    });
}

function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0, 0, board.width, board.height);
    

    //basket
    basket.x += basketMove;
    //check if basket is out of bounds
    if(basket.x < 0){
        basket.x = 0;
    }else if(basket.x > boardWidth - basketWidth){
        basket.x = boardWidth - basketWidth;
    }
    context.fillStyle = Rcolors[randomizedrecyclabletype-1];
    context.drawImage(basketArray[randomizedrecyclabletype-1], basket.x, basket.y, basket.width, basket.height);

    //recycling
    for(let i = 0; i < recyclingArray.length; i++){
        let recycle = recyclingArray[i];
        recycle.y += gravity;

        recycle.rotation += recycle.spinSpeed;
        context.save();
        context.translate(recycle.x + recycle.width / 2, recycle.y + recycle.height / 2);
        context.rotate(recycle.rotation);
        context.drawImage(recycle.image, -recycle.width / 2, -recycle.height / 2, recycle.width, recycle.height);
        context.restore();

        if(detectCollision(basket, recycle)){
            if(recycle.type === 'recyclable') {
                score += 1;
                currentQuip = quips[Math.floor(Math.random() * quips.length)];
                quipTimer = 60;
            } else {
                lives -= 1;
                if(lives <= 0) {
                    gameOver = true;
                }
            }
            recycle.x = 500;
        }
        if(recycle.x < boardWidth && recycle.y > boardHeight){
            if(recycle.type === 'recyclable') {
                lives -= 1;
                if(lives <= 0) {
                    gameOver = true;
                }
            }
        }
    }
    //clear caught recycling
    while(recyclingArray.length > 0 && recyclingArray[0].x == 500){
        recyclingArray.shift();
    }
    
    //score 
    context.textAlign = 'start';
    context.fillStyle = colors[1];
    context.font = "20px 'Press Start 2P', sans-serif";
    context.fillText(score, 5, 45);

    
    //lives
    context.fillStyle = colors[3];
    context.font = "10px 'Press Start 2P', sans-serif";
    context.fillText("Lives : " + lives, 5, 80);

    //if recycle plastic, metal, or paper
    context.fillStyle = Rcolors[randomizedrecyclabletype-1];
    context.font = "20px 'Press Start 2P', sans-serif";
    context.textAlign = "center"
    context.fillText(recytype[randomizedrecyclabletype - 1], boardWidth / 2, 40);

    //player positive affirmation 
    if (currentQuip && quipTimer > 0) {
    context.font = "10px 'Press Start 2P', sans-serif";
    context.fillStyle = "#00AA00";
    context.textAlign = "center";
    context.fillText(currentQuip, basket.x + basket.width / 2, basket.y - 10);
    quipTimer--;
}


    if(score > speedUp){
        clearInterval(IntervalID);
        recycleInterval += -50;
        speedUp += 10;
         if(recycleInterval < 500){

            recycleInterval = 500;
            gravity += .5;
        }
        IntervalID = setInterval(placeRecycling, recycleInterval);
       
    }

    if(score > gravityUp){
        gravity += 1;
        gravityUp += 10;
    }

    

    if(gameOver){
    
    // tint
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, boardWidth, boardHeight);

    // Gameover message
    context.fillStyle = 'red';
    context.font = "30px 'Press Start 2P', sans-serif";
    context.textAlign = 'center';
    context.fillText("GAME OVER", boardWidth / 2, boardHeight / 2 - 20);

    context.font = "10px 'Press Start 2P', sans-serif";
    context.fillText("You failed to recycle!", boardWidth / 2, boardHeight / 2 );
    
    // Final Score
    context.fillStyle = 'white';
    context.font = "20px 'Press Start 2P', sans-serif";
    context.fillText("Score : " + score, boardWidth / 2, boardHeight / 2 + 45);

    // Restart
    context.font = "10px 'Press Start 2P', sans-serif";
    context.fillText("Press 'R' KEY to restart", boardWidth / 2, boardHeight / 2 + 80);
    
}
    
}

function placeRecycling(){
    if(gameOver){
        return;
    }
    let randomRecycleX = recyclingX + Math.random()*(boardWidth-60);
    let randomType = Math.random() < 0.7 ? itemTypes[0] : itemTypes[1]; // 70% recyclable, 30% non-recyclable
    let recycling;
    if(randomType.type === 'recyclable'){
     
    
      let Rcolor;
      let ItemIMAGE;
      let randomnum = Math.floor(Math.random() * 3) + 1;
        if(randomizedrecyclabletype === 1){
            Rcolor = 'blue';
            
            ItemIMAGE = plasticArray[randomnum-1];
        }else if(randomizedrecyclabletype === 2){
            Rcolor = 'grey';
            ItemIMAGE = metalArray[randomnum-1];
        }
        else{
            Rcolor ='green';
            ItemIMAGE = paperArray[randomnum-1];
        }

        recycling = {
        x: randomRecycleX,
        y: recyclingY,
        width: recyclingWidth,
        height: recyclingHeight,
        collected: false,
        type: randomType.type,
        color: Rcolor,
        image: ItemIMAGE,
        rotation: 0,
        spinSpeed: Math.random() * 0.1 + 0.01
        };
    }      
    else{
        let randomnum = Math.floor(Math.random() * 3) + 1;
        let ItemIMAGE = trashArray[randomnum-1];

        recycling = {
        x: randomRecycleX,
        y: recyclingY,
        width: recyclingWidth,
        height: recyclingHeight,
        collected: false,
        type: randomType.type,
        color: randomType.color,
        image: ItemIMAGE,
        rotation: 0,
        spinSpeed: Math.random() * 0.1 + 0.01
        };

        
    }
    
    
    recyclingArray.push(recycling);
}

function moveBasket(e){
    if(e.code == "ArrowLeft" || e.code == 'KeyA'){
        //move left
        basketMove = -3;
    }else if(e.code == "ArrowRight" || e.code == "KeyD"){
        //move right
        basketMove = 3;
    }else if(e.code == "KeyR"){
        if(gameOver){
            randomizedrecyclabletype = Math.floor(Math.random() * 3) + 1;
            basket.y = basketY;
            basket.x = basketX;
            score = 0;
            lives = 3;
            recyclingArray = [];
            speedUp = 10;
            recycleInterval = 1500;
            gameOver = false;
        }
    }
}

function stopBasket(e){
    basketMove = 0;
}

function detectCollision(a, b){
    return  a.x < b.x + b.width && 
            a.x + a.width > b.x && 
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}

const input = document.getElementById("input");
const sortedcontainer = document.getElementById("sorted_container");


function classifyItem(item) {
    const plastic = [
  "bottle", "container", "plastic bag", "jug", "plastic",
  "tupperware", "clamshell", "wrapper", "packaging", "film",
  "polyethylene", "shrink wrap", "ziplock",
  "grocery bag", "saran wrap", "six-pack ring", "plastic lid"];

    const metal = ["can", "foil", "tin", "aluminum", "metal", 
    "aerosol can", "steel", "bottle cap", "soda can", "food can",
    "metal lid", "scrap metal", "copper wire", "brass", "chrome"];

    const paper = [ "newspaper", "magazine", "cardboard", "paper", "box", "carton",
  "envelope", "flyer", "paper bag", "junk mail", "notebook",
  "post-it", "copy paper", "printer paper", "tissue box", "folder",
  "paperboard", "cereal box", "wrapping paper", "toilet paper roll"];
    
    const lowerItem = item.toLowerCase();

    if (plastic.some(p => lowerItem.includes(p))) {
        return "Plastic";
    } else if (metal.some(m => lowerItem.includes(m))) {
        return "Metal";
    } else if (paper.some(p => lowerItem.includes(p))) {
        return "Paper";
    } else {
        return "Trash";
    }
}

function addItem(){
    if(input.value.trim() === ''){
        alert("Please add an item for recycling");
    } else {
        const itemName = input.value.trim();
        const category = classifyItem(itemName);
        
        let li = document.createElement("li");
        li.innerHTML = `${itemName} <em class="category-label">(${category})</em>`;
        sortedcontainer.appendChild(li);
        
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
    }

    input.value = "";
}

sortedcontainer.addEventListener("click", function(e){
    if(e.target.tagName === "LI"){
        e.target.classList.toggle("checked");
    }
    else if(e.target.tagName === "SPAN"){
        e.target.parentElement.remove();
    }
}, false);