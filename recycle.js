
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


//physics
velocityY = 2;

let basket = {
    x : basketX,
    y : basketY,
    width : basketWidth,
    height : basketHeight

}
window.onload = function() {

    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //draw basket
    context.fillStyle = "green";
    context.fillRect(basket.x, basket.y, basket.width, basket.height);
    requestAnimationFrame(update);
    setInterval(placeTrash, 1500);
    document.addEventListener("keydown", moveBasket);
}

function update(){
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    //basket
    basket.x += basketMove;
    //check if basket is out of bounds
    if(basket.x < 0){
        basket.x = 0;
    }else if(basket.x > boardWidth - basketWidth){
        basket.x = boardWidth - basketWidth;
    }
    context.fillRect(basket.x, basket.y, basket.width, basket.height);

    //recycling
    for(let i = 0; i < recyclingArray.length; i++){

        let recycle = recyclingArray[i];
        recycle.y += velocityY;
        context.fillRect(recycle.x,recycle.y,recycle.width,recycle.height);
    }
}

function placeTrash(){
    let randomRecycleX = recyclingX + Math.random()*(boardWidth-60);


    let recycling = {
    x : randomRecycleX,
    y : recyclingY,
    width : recyclingWidth,
    height : recyclingHeight,
    collected : false
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
    }



}