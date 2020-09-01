document.addEventListener('DOMContentLoaded', ()=>{
const grid = document.querySelector('.grid');
let squares = Array.from(document.querySelectorAll('.grid div'));
const scoreDisplay = document.querySelector("#score");
const startBtn = document.querySelector("#start-button");
startBtn.classList.add("fa-play");
startBtn.classList.add("fourth-play");
const width = 10;
let nextRandom = 0;
let timerId;
let score = 0;
const colors = [
  '#fab1a0',
  '#fab1a0',
  '#a29bfe',
  '#55efc4',
  '#6c5ce7'
]

const lTetromino = [
   [1, width+1, width*2+1, 2],
   [width, width+1, width+2, width*2+2],
   [1, width+1, width*2+1, width*2],
   [width, width*2, width*2+1, width*2+2]
 ]

 const zTetromino = [
   [0,width,width+1,width*2+1],
   [width+1, width+2,width*2,width*2+1],
   [0,width,width+1,width*2+1],
   [width+1, width+2,width*2,width*2+1]
 ]

 const tTetromino = [
   [1,width,width+1,width+2],
   [1,width+1,width+2,width*2+1],
   [width,width+1,width+2,width*2+1],
   [1,width,width+1,width*2+1]
 ]

 const oTetromino = [
   [0,1,width,width+1],
   [0,1,width,width+1],
   [0,1,width,width+1],
   [0,1,width,width+1]
 ]

 const iTetromino = [
   [1,width+1,width*2+1,width*3+1],
   [width,width+1,width+2,width+3],
   [1,width+1,width*2+1,width*3+1],
   [width,width+1,width+2,width+3]
 ]

const theTetrominos = [lTetromino,zTetromino,tTetromino,oTetromino,iTetromino]
let currentPosition = 4;
let currentRotation = 0;
let random = Math.floor(Math.random() * theTetrominos.length)

let current = theTetrominos[random][currentRotation]

function draw(){
  current.forEach(index =>{
    squares[currentPosition + index].classList.add("tetromino")
    squares[currentPosition + index].style.backgroundColor = colors[random]
  })
}

function undraw(){
  current.forEach(index =>{
    squares[currentPosition + index].classList.remove("tetromino")
    squares[currentPosition + index].style.backgroundColor = ''
  })
}

//timerId = setInterval(moveDown,1000)

// assign functions to keycode
function control(e){
  console.log(e)
  if(e.keyCode === 37 && e.type === 'keyup'){
    moveLeft()
  }else if(e.keyCode === 39 && e.type === 'keyup'){
    moveRight()
  }else if(e.keyCode === 38 && e.type === 'keyup'){
    rotate()
  }else if(e.keyCode === 40){
    moveDown()
  }
}

document.addEventListener('keyup',control)


function moveDown(){
  
  if(scoreDisplay.innerHTML != 'end'){
    undraw();
    currentPosition += width;
    draw();
    freeze()
  }
  
}

// freeze Function
function freeze(){
  if(current.some(index => squares[currentPosition + index + width].classList.contains("taken"))){
    current.forEach(index =>{
      squares[currentPosition + index].classList.add("taken")
    })
    if(scoreDisplay.innerHTML != 'end'){
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominos.length)
      current = theTetrominos[random][currentRotation]
      currentPosition = 4;
      draw();
      displayShape()
    }
      addSore()
      gameOver();
  }
}

function moveLeft(){
  undraw()
  const isAtLeftEdge = current.some(index => (currentPosition + index )% width == 0)
  if(!isAtLeftEdge){
    currentPosition -= 1;
  }
  if(current.some(index =>squares[currentPosition + index].classList.contains("taken"))){
    currentPosition += 1;
  }
  draw()
}

function moveRight(){
  undraw()
  const isAtRightEdge = current.some(index => (currentPosition + index )% width === width-1)
  if(!isAtRightEdge){
    currentPosition += 1;
  }
  if(current.some(index =>squares[currentPosition + index].classList.contains("taken"))){
    currentPosition -= 1;
  }
  draw()
}

// Function to Rotate the tertromio
function rotate(){
  undraw()
  currentRotation++;
  if(currentRotation == current.length){
    currentRotation = 0;
  }
  current = theTetrominos[random][currentRotation]
  draw()
}

// for mini-grid
const displaySquares = document.querySelectorAll('.mini-grid div');
const displayWidth = 4;
const displayIndex = 0;


const upNextTetromino = [
  [1, displayWidth+1, displayWidth*2+1,2],//lTetromino
  [0,displayWidth,displayWidth+1,displayWidth*2+1],//zTetromino
  [1,displayWidth,displayWidth+1,displayWidth+2],//tTetromino
  [0,1,displayWidth,displayWidth+1],//oTetromino
  [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]//iTetromino
]

function displayShape(){
  displaySquares.forEach(sq => {
    sq.classList.remove("tetromino")
    sq.style.backgroundColor = ''
  })
  upNextTetromino[nextRandom].forEach(index => {
    displaySquares[displayIndex + index].classList.add("tetromino")
    displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
  })
  }

startBtn.addEventListener('click',()=>{
  if(timerId){
    clearInterval(timerId);
    timerId = null;
    startBtn.classList.remove("fourth-pause");
    startBtn.classList.add("fourth-play");
    startBtn.classList.remove("fa-pause");
    startBtn.classList.add("fa-play");
  }else{
    startBtn.classList.remove("fourth-play");
    startBtn.classList.add("fourth-pause");
    startBtn.classList.remove("fa-play");
    startBtn.classList.add("fa-pause");
    draw()
    timerId = setInterval(moveDown,1000)
    nextRandom = Math.floor(Math.random() * theTetrominos.length)
    displayShape()
  }
})

function addSore(){
  for(let i = 0; i < 199 ; i +=width){
    const row = [i, i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9];
    if(row.every(index => squares[index].classList.contains("taken"))){
      score += 10;
      scoreDisplay.innerHTML = score;
      row.forEach((index) => {
      squares[index].classList.remove("taken")
      squares[index].classList.remove("tetromino")
      squares[index].style.backgroundColor = ''
      });
      const squaresRemoved = squares.splice(i, width);
      squares = squaresRemoved.concat(squares)
      squares.forEach((cell) => {
        grid.appendChild(cell)
      });

    }
  }

}

// game over fucntion

function gameOver(){
    if(current.some(index => squares[currentPosition + index].classList.contains("taken"))){
      scoreDisplay.innerHTML = 'end';
      clearInterval(timerId)
    }
}

})
