import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

// canvas setup
const socket = io();
const cnv = document.getElementsByClassName('game-window')[0];
const ctx = cnv.getContext('2d');
const ctxW = 800;
const ctxH = 480;

// player setup
let playerList = [];
let localPlayerData = {
  x: 80 + Math.random() * (ctxW - 160),
  y: Math.random() * ctxH - 240,
  color: '#306230'
};

// stage setup
let entityList = [];

// start screen
ctx.clearRect(0, 0, ctxW, ctxH);
ctx.fillStyle = '#9bbc0f';
ctx.fillRect(0, 0, ctxW, ctxH);

ctx.font = '32px "Press Start 2P"';
ctx.fillStyle = '#0f380f';
ctx.textAlign = 'center';
ctx.fillText('PRESS START', 400, 240);

// game start
let joining = false;
let joined = false;
function join() {
  if (!joined) {
    socket.emit('joining', localPlayerData);
    joining = true;
    startBtn.removeEventListener('click', startBtnListener);
    document.removeEventListener('keydown', startKeyListener);

    let upBtn = document.getElementsByClassName('dpad__up')[0];
    let leftBtn = document.getElementsByClassName('dpad__left')[0];
    let downBtn = document.getElementsByClassName('dpad__down')[0];
    let rightBtn = document.getElementsByClassName('dpad__right')[0];

    upBtn.addEventListener('mousedown', () => keysPressed['w'] = true);
    upBtn.addEventListener('mouseup', () => delete keysPressed['w']);
    leftBtn.addEventListener('mousedown', () => keysPressed['a'] = true);
    leftBtn.addEventListener('mouseup', () => delete keysPressed['a']);
    downBtn.addEventListener('mousedown', () => keysPressed['s'] = true);
    downBtn.addEventListener('mouseup', () => delete keysPressed['s']);
    rightBtn.addEventListener('mousedown', () => keysPressed['d'] = true);
    rightBtn.addEventListener('mouseup', () => delete keysPressed['d']);
  }
}

let startBtn = document.getElementsByClassName('buttons__start')[0];
let startBtnListener = startBtn.addEventListener('click', join);
let startKeyListener = document.addEventListener('keydown', (e) => {
  if (e.key == 'Enter') join();
});

// handle input
let keysPressed = {};
document.addEventListener('keydown', (e) => keysPressed[e.key] = true);
document.addEventListener('keyup', (e) => delete keysPressed[e.key]);

// connection and game logic
socket.on('joined', (data) => {
  // only set client id if the client's start button was pushed
  if (joining) {
    let count, playerDataList, entities;
    [count, playerDataList, entities] = data;
  
    if (!localPlayerData.id) {
      localPlayerData.id = count;
      keysPressed.id = count; 
    }
    
    joining = false;
    joined = true;
  }

  // only start updating after joining
  if (joined) {
    socket.on('update', (data) => {
      let playerDataList, entityDataList;
      [playerDataList, entityDataList] = data;
      clearScreen();

      for (let i = 0; i < entityDataList.length; i++) {
        draw(entityDataList[i]);
      }
      
      for (let i = 0; i < playerDataList.length; i++) {
        draw(playerDataList[i]);
      }
  
      socket.emit('keysPressed', keysPressed);
    });
  }
});

// drawing
function clearScreen() {
  ctx.fillStyle = '#9bbc0f';
  ctx.fillRect(0, 0, ctxW, ctxH);
}

function draw(entity) {
  ctx.fillStyle = entity.color;
  ctx.fillRect(entity.x, entity.y, entity.w, entity.h);

  if (entity?.id == localPlayerData.id) {
    drawText(entity);
  }
}

function drawText(player) {
  ctx.font = '20px "Press Start 2P"';
  ctx.fillStyle = '#8bac0f';
  ctx.textAlign = 'left';
  ctx.fillText(`Score: ${player.score}`, 100, ctxH - 120);
  ctx.fillText(player.rank, 100, ctxH - 92);
}
