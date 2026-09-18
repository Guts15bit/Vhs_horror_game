const game = document.getElementById("game");
const startScreen = document.getElementById("startScreen");
const gameOver = document.getElementById("gameOver");
const message = document.getElementById("message");
const timeDisplay = document.getElementById("time");

let playing = false;
let flashlight = true;
let battery = 100;

const keys = {};

let player = {
  x: 0,
  y: 0,
  speed: 3
};

let entity = {
  active: false,
  x: 0,
  y: 0
};

/* =========================
   START GAME
========================= */

document.getElementById("startButton").onclick = () => {
  playing = true;
  startScreen.style.display = "none";

  document.body.requestPointerLock?.();

  showMessage("THE TAPE STARTS HERE.", 3000);

  setTimeout(() => {
    showMessage("Find the front door.", 3000);
  }, 4000);

  setTimeout(() => {
    strangeEvent();
  }, 9000);
};

/* =========================
   KEYBOARD
========================= */

document.addEventListener("keydown", e => {
  keys[e.key.toLowerCase()] = true;

  if (e.key.toLowerCase() === "f") {
    flashlight = !flashlight;

    if (flashlight) {
      showMessage("FLASHLIGHT ON", 1000);
    } else {
      showMessage("FLASHLIGHT OFF", 1000);
    }
  }
});

document.addEventListener("keyup", e => {
  keys[e.key.toLowerCase()] = false;
});

/* =========================
   MOVEMENT
========================= */

function movePlayer() {
  if (!playing) return;

  if (keys["w"]) player.y += player.speed;
  if (keys["s"]) player.y -= player.speed;
  if (keys["a"]) player.x -= player.speed;
  if (keys["d"]) player.x += player.speed;

  player.x = Math.max(-500, Math.min(500, player.x));
  player.y = Math.max(-500, Math.min(500, player.y));
}

/* =========================
   FLASHLIGHT
========================= */

function updateFlashlight() {
  if (!flashlight) {
    game.style.background =
      "radial-gradient(circle, #020202 0%, #000 100%)";
    return;
  }

  const darkness = 0.7 + battery / 500;

  game.style.background = `
    radial-gradient(
      circle at 50% 50%,
      rgba(100,100,100,${darkness}) 0%,
      rgba(25,25,25,0.6) 18%,
      #000 65%
    )
  `;

  battery -= 0.003;

  if (battery <= 0) {
    battery = 0;
    flashlight = false;
    showMessage("THE BATTERY IS DEAD.", 4000);
  }
}

/* =========================
   VHS CLOCK
========================= */

let seconds = 0;

function updateClock() {
  seconds++;

  const baseHour = 2;
  const baseMinute = 13;

  let total = baseHour * 3600 + baseMinute * 60 + seconds;

  let h = Math.floor(total / 3600) % 24;
  let m = Math.floor((total % 3600) / 60);
  let s = total % 60;

  timeDisplay.textContent =
    `${String(h).padStart(2, "0")}:` +
    `${String(m).padStart(2, "0")}:` +
    `${String(s).padStart(2, "0")} AM`;
}

/* =========================
   MESSAGE SYSTEM
========================= */

function showMessage(text, duration = 2500) {
  message.textContent = text;

  setTimeout(() => {
    if (message.textContent === text) {
      message.textContent = "";
    }
  }, duration);
}

/* =========================
   RANDOM HORROR EVENTS
========================= */

function strangeEvent() {

  const events = [

    () => {
      showMessage("Did you hear that?", 3000);

      game.classList.add("distort");

      setTimeout(() => {
        game.classList.remove("distort");
      }, 500);
    },

    () => {
      showMessage("Something moved upstairs.", 3500);

      setTimeout(() => {
        showMessage("...", 1500);
      }, 4000);
    },

    () => {
      flashlight = false;

      showMessage("THE LIGHTS WENT OUT.", 3000);

      setTimeout(() => {
        flashlight = true;
        showMessage("THE LIGHT CAME BACK.", 2000);
      }, 3000);
    },

    () => {
      showMessage("DON'T LOOK BEHIND YOU.", 4000);

      setTimeout(() => {
        entityAppears();
      }, 2500);
    }

  ];

  const event =
    events[Math.floor(Math.random() * events.length)];

  event();

  setTimeout(strangeEvent, 15000 + Math.random() * 15000);
}

/* =========================
   ENTITY
========================= */

function entityAppears() {

  entity.active = true;

  showMessage("RUN.", 2000);

  game.style.filter = "contrast(1.5) brightness(0.5)";

  setTimeout(() => {

    if (Math.random() < 0.35) {
      gameOverScreen();
    } else {
      entity.active = false;

      game.style.filter = "none";

      showMessage(
        "It disappeared.",
        2500
      );
    }

  }, 3500);
}

/* =========================
   GAME OVER
========================= */

function gameOverScreen() {

  playing = false;

  game.style.filter = "none";

  gameOver.style.display = "flex";
}

/* =========================
   MAIN LOOP
========================= */

function loop() {

  movePlayer();

  updateFlashlight();

  requestAnimationFrame(loop);
}

setInterval(updateClock, 1000);

loop();

/* =========================
   RANDOM VHS GLITCHES
========================= */

setInterval(() => {

  if (!playing) return;

  if (Math.random() < 0.35) {

    game.classList.add("distort");

    setTimeout(() => {
      game.classList.remove("distort");
    }, 100 + Math.random() * 250);
  }

}, 3000);
