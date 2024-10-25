// Mendapatkan elemen dari HTML
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("scoreValue");
const levelDisplay = document.getElementById("levelValue");
const gameOverDiv = document.getElementById("gameOver");
const finalScoreDisplay = document.getElementById("finalScore");
const restartGameBtn = document.getElementById("restartGame");

// Mengatur ukuran kanvas
canvas.width = 400; // Lebar kanvas
canvas.height = 400; // Tinggi kanvas

// Inisialisasi variabel permainan
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 15, y: 15 };
let score = 0;
let level = 1;
let speed = 200; // Waktu dalam ms
let gameInterval; // Interval game
const gridSize = 20; // Ukuran setiap segmen ular

// Fungsi untuk menggambar ular
function drawSnake() {
  ctx.fillStyle = "green";
  snake.forEach((segment) => {
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize,
      gridSize,
    );
  });
}

// Fungsi untuk menggambar makanan
function drawFood() {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(
    food.x * gridSize + gridSize / 2,
    food.y * gridSize + gridSize / 2,
    gridSize / 2,
    0,
    Math.PI * 2,
  );
  ctx.fill();
}

// Fungsi untuk memindahkan ular
function moveSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Teleportasi ular jika keluar dari batas
  if (head.x < 0) head.x = canvas.width / gridSize - 1;
  if (head.x >= canvas.width / gridSize) head.x = 0;
  if (head.y < 0) head.y = canvas.height / gridSize - 1;
  if (head.y >= canvas.height / gridSize) head.y = 0;

  snake.unshift(head);

  // Jika ular memakan makanan
  if (head.x === food.x && head.y === food.y) {
    score += level; // Poin bertambah sesuai level
    scoreDisplay.innerText = score;
    levelUp(); // Cek untuk level up
    placeFood();
  } else {
    snake.pop(); // Hapus ekor ular jika tidak memakan makanan
  }

  // Cek jika ular menabrak dirinya sendiri
  if (
    snake.slice(1).some((segment) =>
      segment.x === head.x && segment.y === head.y
    )
  ) {
    showGameOver();
  }
}

// Fungsi untuk menempatkan makanan secara acak
function placeFood() {
  food = {
    x: Math.floor(Math.random() * (canvas.width / gridSize)),
    y: Math.floor(Math.random() * (canvas.height / gridSize)),
  };
}

// Fungsi untuk level up
function levelUp() {
  if (score % 10 === 0) { // Naik level setiap 10 poin
    level++;
    levelDisplay.innerText = level;
    speed = Math.max(50, speed - 20); // Mengurangi waktu delay, tidak lebih cepat dari 50ms
    clearInterval(gameInterval);
    gameInterval = setInterval(update, speed); // Memperbarui interval berdasarkan kecepatan baru
  }
}

// Fungsi untuk memperbarui tampilan permainan
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFood();
  drawSnake();
  moveSnake();
}

// Fungsi untuk menampilkan Game Over
function showGameOver() {
  clearInterval(gameInterval); // Hentikan pembaruan game
  finalScoreDisplay.innerText = score; // Tampilkan skor akhir
  gameOverDiv.classList.remove("hidden");
}

// Fungsi untuk memulai ulang game
function restartGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  score = 0;
  level = 1;
  speed = 200; // Reset kecepatan
  scoreDisplay.innerText = score;
  levelDisplay.innerText = level;
  gameOverDiv.classList.add("hidden"); // Sembunyikan Game Over
  placeFood(); // Tempatkan makanan baru
  gameInterval = setInterval(update, speed); // Mulai ulang game
}

// Event Listener untuk kontrol keyboard
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
    case "w": // Kontrol dengan W
      if (direction.y === 0) direction = { x: 0, y: -1 }; // Up
      break;
    case "ArrowDown":
    case "s": // Kontrol dengan S
      if (direction.y === 0) direction = { x: 0, y: 1 }; // Down
      break;
    case "ArrowLeft":
    case "a": // Kontrol dengan A
      if (direction.x === 0) direction = { x: -1, y: 0 }; // Left
      break;
    case "ArrowRight":
    case "d": // Kontrol dengan D
      if (direction.x === 0) direction = { x: 1, y: 0 }; // Right
      break;
  }
});

// Event Listener untuk tombol kontrol sentuh
document.getElementById("upBtn").addEventListener("click", () => {
  if (direction.y === 0) direction = { x: 0, y: -1 }; // Up
});
document.getElementById("downBtn").addEventListener("click", () => {
  if (direction.y === 0) direction = { x: 0, y: 1 }; // Down
});
document.getElementById("leftBtn").addEventListener("click", () => {
  if (direction.x === 0) direction = { x: -1, y: 0 }; // Left
});
document.getElementById("rightBtn").addEventListener("click", () => {
  if (direction.x === 0) direction = { x: 1, y: 0 }; // Right
});

// Event Listener untuk tombol restart
restartGameBtn.addEventListener("click", restartGame);

// Memulai permainan pertama kali
placeFood();
gameInterval = setInterval(update, speed);
