/* ===== 기본 상태 ===== */
let day = 1;
let hp = 150;
let sp = 150;
let sta = 100;
let food = 30;

let skill = ["연속찌르기"];
let goalFood = 20;
let gameStarted = false;

/* ===== 무기 ===== */
let weapon = "없음";
let weaponBonus = 0;
let weaponLevel = 0;

/* ===== 전투 ===== */
let inBattle = false;
let enemies = [];
let enemyTimer = null;
let attackCooldown = false;

/* ===== 보스 ===== */
let isBossBattle = false;
let bossHp = 1000;

/* ===== DOM ===== */
const logEl = document.getElementById("log");
const statusEl = document.getElementById("status");
const buttonsEl = document.querySelector(".buttons");

/* ===== 로그 ===== */
function log(msg) {
  logEl.textContent += msg + "\n";
  logEl.scrollTop = logEl.scrollHeight;
}

/* ===== 상태 ===== */
function updateStatus() {
  statusEl.textContent =
    `Day ${day} | HP ${hp}/150 | SP ${sp}/150 | STA ${sta}/300 | FOOD ${food} | SKILL ${skill[0]} | WEAPON ${weapon} +${weaponLevel} | 목표 ${goalFood}`;
}

/* ===== 스토리 ===== */
function startStory() {
  const story = [
    "비행기를 탔다",
    "비행기는 언제 타도 설렌다",
    '"오랜만에 여행이라니"',
    '"아 좀 오래 걸리네 뭐 그냥 자야겠다"',
    "그것이 비행기 안에서의 마지막 말이 될 줄은 몰랐다",
    "무인도에 갇혔다",
    "90일을 버티면 구조대가 온다",
    "이제 시작이다"
  ];

  story.forEach((s, i) => {
    setTimeout(() => log(s), i * 2000);
  });

  setTimeout(() => {
    gameStarted = true;
    updateStatus();
    startDayTimer();
  }, story.length * 2000);
}

/* ===== 하루 타이머 (1분) ===== */
function startDayTimer() {
  setInterval(nextDay, 60000);
}

/* ===== 하루 넘김 ===== */
function nextDay() {
  if (!gameStarted || inBattle) return;

  log(`🌙 Day ${day} 종료`);

  if (food < 20) {
    alert("밤을 넘길 음식이 부족해 굶어 죽었다");
    location.reload();
    return;
  }

  food -= 20;
  day++;

  if (day === 90) {
    startBossBattle();
    return;
  }

  goalFood += 5;
  log(`☀️ Day ${day} 시작`);
  log(`🎯 목표: 음식 ${goalFood}개`);

  if (day % 5 === 0 && day <= 85) {
    startEnemyAttack();
  }

  updateStatus();
}

/* ===== 음식 구하기 ===== */
function getFood() {
  if (!gameStarted || inBattle) return;
  if (sta < 8) {
    log("스태미나 부족");
    return;
  }
  sta -= 8;
  const gain = Math.floor(Math.random() * 3) + 1;
  food += gain;
  log(`스태미나 8 소모, 음식 ${gain}개 획득`);
  updateStatus();
}

/* ===== 낚시 ===== */
function fishing() {
  if (!gameStarted || inBattle) return;
  food += 3;
  log("낚시로 음식 3개 획득");
  updateStatus();
}

/* ===== 음식 먹기 / 강화 ===== */
function eatFood() {
  const choice = confirm(
    "확인: 음식 먹기 (허기 회복)\n취소: 무기 강화"
  );

  if (choice) {
    if (food < 5) {
      log("음식이 부족하다");
      return;
    }
    food -= 5;
    sp = Math.min(sp + 20, 150);
    log("음식 5개를 먹고 허기를 회복했다");
  } else {
    enhanceWeapon();
  }

  updateStatus();
}

/* ===== 무기 제작 ===== */
function craftWeapon(type) {
  const data = {
    "나무검": { cost: 10, bonus: 0.1 },
    "돌검": { cost: 20, bonus: 0.2 },
    "철검": { cost: 30, bonus: 0.3 },
    "선혈 검": { cost: 50, bonus: 0.5 }
  };

  if (food < data[type].cost) {
    log("음식이 부족하다");
    return;
  }

  food -= data[type].cost;
  weapon = type;
  weaponBonus = data[type].bonus;
  weaponLevel = 0;

  log(`${type} 제작 완료`);
  updateStatus();
}

/* ===== 무기 강화 ===== */
function enhanceWeapon() {
  if (weapon === "없음") {
    log("강화할 무기가 없다");
    return;
  }

  if (weaponLevel >= 100) {
    log("이미 최대 강화다");
    return;
  }

  const next = weaponLevel + 1;
  if (food < next) {
    log(`강화 실패: 음식 ${next}개 필요`);
    return;
  }

  food -= next;

  let rate = next === 100 ? 0.001 : (101 - next) / 100;

  if (Math.random() < rate) {
    weaponLevel++;
    log(`✨ 강화 성공! +${weaponLevel}`);
  } else {
    log(`💥 강화 실패 (${next}강)`);
  }
}

/* ===== 스킬 ===== */
function useSkill() {
  if (!inBattle) return;

  let base = { "연속찌르기":10, "선시 슬래쉬":20, "낙화참":35, "일전팔기":60 }[skill[0]];
  let dmg = Math.floor(base * (1 + weaponBonus + weaponLevel * 0.01));

  enemies.forEach(e => e.hp -= dmg);
  log(`${skill[0]} 사용! 전체 ${dmg} 데미지`);

  enemies = enemies.filter(e => e.hp > 0);
  if (enemies.length === 0) endBattle();
}

/* ===== 일반 공격 ===== */
function attackEnemy() {
  if (attackCooldown || !inBattle) return;

  attackCooldown = true;
  setTimeout(() => attackCooldown = false, 500);

  let dmg = Math.floor(food * (1 + weaponBonus + weaponLevel * 0.01));
  enemies[0].hp -= dmg;
  log(`공격! ${dmg} 데미지`);

  if (enemies[0].hp <= 0) {
    enemies.shift();
    log("적 1명 처치");
  }

  if (enemies.length === 0) endBattle();
}

/* ===== 적 습격 ===== */
function startEnemyAttack() {
  inBattle = true;
  enemies = [];

  let count = day === 5 ? 3 : day === 10 ? 9 : 12;
  for (let i = 0; i < count; i++) enemies.push({ hp: 50 });

  log(`⚠️ 적 ${enemies.length}명 습격!`);
  switchToBattleUI();

  enemyTimer = setTimeout(() => {
    alert("시간 초과! 게임 오버");
    location.reload();
  }, 60000);
}

/* ===== 보스 ===== */
function startBossBattle() {
  inBattle = true;
  log("보스가 공격을 시작합니다");
  ["3","2","1"].forEach((n,i)=>setTimeout(()=>log(n),i*1000));
  switchToBattleUI();
}

/* ===== 전투 종료 ===== */
function endBattle() {
  clearTimeout(enemyTimer);
  inBattle = false;
  switchToNormalUI();
  log("전투 종료");
}

/* ===== UI ===== */
function switchToBattleUI() {
  buttonsEl.innerHTML = `
    <button onclick="attackEnemy()">⚔️ 공격</button>
    <button onclick="useSkill()">🔥 스킬</button>
  `;
}

function switchToNormalUI() {
  buttonsEl.innerHTML = `
    <button onclick="getFood()">🍖 음식 구하기</button>
    <button onclick="fishing()">🎣 낚시</button>
    <button onclick="eatFood()">🍴 음식 먹기 / 강화</button>
    <button onclick="craftWeapon('나무검')">🪵 나무검</button>
    <button onclick="craftWeapon('돌검')">🪨 돌검</button>
    <button onclick="craftWeapon('철검')">⚙️ 철검</button>
    <button onclick="craftWeapon('선혈 검')">🩸 선혈 검</button>
  `;
}

/* ===== 시작 ===== */
startStory();
