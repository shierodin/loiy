/* ===== 기본 상태 ===== */
let day = 1;
let food = 30;
let dailyGoal = 20;
let dayTime = 60; // 하루 = 1분

let weapon = null;
let weaponLevel = 0;

/* ===== 무기 데이터 ===== */
const weapons = {
  "나무검": { cost:10, bonus:0.1 },
  "돌검": { cost:20, bonus:0.2 },
  "철검": { cost:30, bonus:0.3 },
  "선혈검": { cost:50, bonus:0.5 }
};

/* ===== 낚시 쿨타임 ===== */
let fishingCooldown = false;
const FISH_COOLDOWN = 3000;

/* ===== 유틸 ===== */
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function log(msg) {
  const logBox = document.getElementById("log");
  logBox.innerHTML += msg + "<br>";
  logBox.scrollTop = logBox.scrollHeight;
}

function update() {
  document.getElementById("day").innerText = day;
  document.getElementById("food").innerText = food;
  document.getElementById("goal").innerText = dailyGoal;
  document.getElementById("weapon").innerText =
    weapon ? `${weapon} +${weaponLevel}` : "없음";
}

/* ===== 하루 진행 ===== */
function nextDay() {
  log(`🌙 Day ${day} 종료`);

  if (food < dailyGoal) {
    alert(`게임 오버!\n필요 음식: ${dailyGoal}\n보유 음식: ${food}`);
    location.reload();
    return;
  }

  food -= dailyGoal;
  day++;
  dailyGoal += 5;

  log(`☀️ Day ${day} 시작 (목표 음식 ${dailyGoal})`);
  update();
}

setInterval(nextDay, dayTime * 1000);

/* ===== 행동 ===== */
function fish() {
  if (fishingCooldown) {
    log("🎣 낚시 쿨타임 중 (3초)");
    return;
  }

  fishingCooldown = true;
  log("🎣 낚시 중...");

  setTimeout(() => {
    let gain = rand(3, 5);
    food += gain;
    log(`🐟 음식 ${gain}개 획득`);
    update();
  }, 1500);

  setTimeout(() => {
    fishingCooldown = false;
    log("🎣 다시 낚시 가능");
  }, FISH_COOLDOWN);
}

function gatherFood() {
  let gain = rand(5, 8);
  food += gain;
  log(`🌿 음식 ${gain}개를 구했다`);
  update();
}

/* ===== 음식 사용 메뉴 ===== */
function toggleUseFood() {
  const menu = document.getElementById("subButtons");
  menu.style.display =
    menu.style.display === "none" ? "flex" : "none";
}

function eatFood() {
  if (food < 5) {
    log("❌ 음식이 부족하다");
    return;
  }
  food -= 5;
  log("🍽 음식을 먹었다");
  update();
}

function craftWeapon() {
  for (const w in weapons) {
    if (food >= weapons[w].cost) {
      food -= weapons[w].cost;
      weapon = w;
      weaponLevel = 0;
      log(`🗡 ${w} 제작 완료`);
      update();
      return;
    }
  }
  log("❌ 검을 만들 음식이 부족하다");
}

function upgradeWeapon() {
  if (!weapon) {
    log("❌ 강화할 무기가 없다");
    return;
  }

  const cost = weaponLevel + 1;
  if (food < cost) {
    log("❌ 강화할 음식이 부족하다");
    return;
  }

  food -= cost;
  weaponLevel++;
  log(`⚒ 무기 강화 +${weaponLevel}`);
  update();
}

/* ===== 시작 ===== */
window.onload = () => {
  log("90일까지 생존하면 구조대가 온다");
  log("걍 니가 알아서 하셈 ㅅㄱ");
  update();
};
