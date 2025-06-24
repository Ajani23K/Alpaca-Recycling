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
let recyclingWidth = 30;
let recyclingHeight = 30;
let recyclingX = 30;
let recyclingY = 0;

//type of recycling
let randomizedrecyclabletype = Math.floor(Math.random() * 3) + 1;
const recytype = ["Plastic", "Metal", "Paper"];
// plastic = 1 metal = 2 paper = 3
const plastic = "blue";
const metal = "grey";
const paper = "brown";

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
const Rcolors = [ 'blue', 'grey' , 'white'];


//recycle place interval
let recycleInterval = 1500;
let speedUp = 10;
let gravityUp = 20;

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

window.onload = function() {
    
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //draw basket
    context.fillStyle = colors[2];
    context.fillRect(basket.x, basket.y, basket.width, basket.height);
    requestAnimationFrame(update);
    IntervalID = setInterval(placeRecycling, recycleInterval);
    document.addEventListener("keydown", moveBasket);
    document.addEventListener("keyup", stopBasket);
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
    context.fillRect(basket.x, basket.y, basket.width, basket.height);

    //recycling
    for(let i = 0; i < recyclingArray.length; i++){
        let recycle = recyclingArray[i];
        recycle.y += gravity;
        context.fillStyle = recycle.color;
        context.fillRect(recycle.x, recycle.y, recycle.width, recycle.height);

        if(detectCollision(basket, recycle)){
            if(recycle.type === 'recyclable') {
                score += 1;
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
    context.font = "30px sans-serif";
    context.fillText(score, 5, 45);

    
    //lives
    context.fillStyle = colors[3];
    context.font = "20px sans-serif";
    context.fillText("Lives : " + lives, 5, 80);

    //if recycle plastic, metal, or paper
    context.fillStyle = Rcolors[randomizedrecyclabletype-1];
    context.font = "30px sans-serif";
    context.textAlign = "center"
    context.fillText(recytype[randomizedrecyclabletype - 1], boardWidth / 2, 40);



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
    context.font = "40px sans-serif";
    context.textAlign = 'center';
    context.fillText("GAME OVER", boardWidth / 2, boardHeight / 2 - 20);

    context.font = "15px sans-serif";
    context.fillText("You failed to recycle!", boardWidth / 2, boardHeight / 2 );
    
    // Final Score
    context.fillStyle = 'white';
    context.font = "30px sans-serif";
    context.fillText("Score : " + score, boardWidth / 2, boardHeight / 2 + 45);

    // Restart
    context.font = "20px sans-serif";
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
        if(randomizedrecyclabletype === 1){
            Rcolor = 'blue';
        }else if(randomizedrecyclabletype === 2){
            Rcolor = 'grey';
        }
        else{
            Rcolor ='white';
        }

        recycling = {
        x: randomRecycleX,
        y: recyclingY,
        width: recyclingWidth,
        height: recyclingHeight,
        collected: false,
        type: randomType.type,
        color: Rcolor
        };
    }      
    else{
        recycling = {
        x: randomRecycleX,
        y: recyclingY,
        width: recyclingWidth,
        height: recyclingHeight,
        collected: false,
        type: randomType.type,
        color: randomType.color
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