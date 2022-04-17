require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const nocache = require('nocache');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

// server setup
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({ origin: '*' })); 

// Security
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
app.use(nocache());

app.use(function (req, res, next) {
  res.setHeader('X-Powered-By', 'PHP 7.4.3');
  next();
});

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  }); 

// For FCC testing purposes
fccTestingRoutes(app);
    
// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
server.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});


// class constructors
let Player = require('./public/Player.mjs').default;
let Collectible = require('./public/Collectible.mjs').default;
let Platform = require('./public/Platform.mjs').default;

// Game server logic
const ctxW = 800;
const ctxH = 480;
const stageW = ctxW - 160;
const stageH = 160;
const collectibleW = 20;
const collectibleH = 20;

let numPlayers = 0;
let count = 0;
let playerList = [];

let stage = new Platform({
  x: 80,
  y: ctxH - stageH,
  w: stageW,
  h: stageH + 120,
  color: '#0f380f'
});
let entityList = [stage];

let frameInterval;
let collectibleTimer;
let platformTimer;

io.on('connection', (socket) => {
  numPlayers++;
  console.log('A user just connected.');
  console.log(`${numPlayers} player(s) online.`);
  
  socket.on('joining', (playerData) => {
    if (!frameInterval) {
      frameInterval = setInterval(update, 20);
    }
    
    collectibleTimer = setTimeout(generateCollectible, 1000);
    if (!platformTimer) {
      platformTimer = setTimeout(generatePlatform, 3000 + Math.random() * 5000);
    }

    playerData.id = count;
    playerList.push(new Player(playerData));
    updateRanks();
    
    io.emit('joined', [count, playerList, entityList]);
    count++;
  });

  socket.on('keysPressed', (keysPressed) => {
    let playerToUpdate = playerList.find(player => player.id == keysPressed.id);
    if (playerToUpdate) {
      if (keysPressed['w'] || keysPressed['ArrowUp'] || keysPressed[' ']) playerToUpdate.jump();
      if (keysPressed['a'] || keysPressed['ArrowLeft']) playerToUpdate.dx += -8;
      if (keysPressed['s'] || keysPressed['ArrowDown']) playerToUpdate.dy += 8;
      if (keysPressed['d'] || keysPressed['ArrowRight']) playerToUpdate.dx += 8;
    }
  });
  
  socket.on('disconnect', () => {
    numPlayers--;
    console.log('A user has disconnected.');
    console.log(`${numPlayers} player(s) online.`);
    if (numPlayers == 0) {
      clearInterval(frameInterval);
      frameInterval = null;
    }
  });
});

function update() {
  for (let i = 0; i < playerList.length; i++) {
    playerList[i].update([...entityList, ...playerList]);
  }

  for (let i = entityList.length; i > 0; i--) {
    if (entityList[i] && entityList[i].timer !== null) {
      if (entityList[i].timer > 0) entityList[i].timer--;
      if (entityList[i].timer <= 0) {
        entityList.splice(i, 1);
        platformTimer = setTimeout(generatePlatform, 3000 + Math.random() * 5000);
      }
    }
    if (entityList[i] instanceof Collectible && entityList[i].collected) {
      entityList.splice(i, 1);
      collectibleTimer = setTimeout(generateCollectible, 1000 + Math.random() * 3000);
    }
  }

  updateRanks();
  
  io.emit('update', [playerList, entityList]);
}

function updateRanks() {
  for (let i = 0; i < playerList.length; i++) {
    playerList[i].calculateRank(playerList);
  }
}

let smallCoin = () => {
  return {
    x: collectibleW + Math.random() * (ctxW - collectibleW * 2),
    y: collectibleH + Math.random() * (ctxH - stageH - collectibleH),
    w: collectibleW,
    h: collectibleH,
    color: '#3e843e',
    value: 5
  }  
};

let bigCoin = () => {
  return {
    x: collectibleW * 1.5 + Math.random() * (ctxW - collectibleW * 1.5 * 2),
    y: collectibleH * 1.5 + Math.random() * (ctxH - stageH - collectibleH * 2),
    w: collectibleW * 1.5,
    h: collectibleH * 1.5,
    color: '#8bac0f',
    value: 10
  }
};

function generateCollectible() {
  let collectible = new Collectible(Math.random() > 0.2 ? smallCoin() : bigCoin());
  entityList.push(collectible);
}

function generatePlatform() {
  let platform = new Platform({
    x: 40 + Math.random() * (ctxW - 200),
    y: 80 + Math.random() * (ctxH - stageH - 160),
    w: 160,
    h: 8,
    color: '#0f380f',
    timer: 250 + Math.random() * 250
  });
  entityList.push(platform);
}

module.exports = app; // For testing
