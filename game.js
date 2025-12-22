let y = 0;
let sta = 100;
let sp = 100;
let hp = 100;
let skill = [];
let food = 0;
let day = 1;
let isFishing = false;

const logEl = document.getElementById("log");
const statusEl = document.getElementById("status");

function log(msg = "") {
  logEl.textContent += msg + "\n";
  logEl.scrollTop = logEl.scrollHeight;
}

function updateStatus() {
  statusEl.textContent =
    `day ${day} | hp ${hp} | sp ${sp} | sta ${sta} | food ${food}`;
}

setInterval(() => {
  sp -= 2;
  hp += 4;
  sta = Math.min(sta + 3, 300);
  updateStatus();
}, 5000);

setInterval(() => {
  day++;
  log(`day ${day}`);
}, 60000);

function getFood() {
  const f = Math.floor(Math.random() * 2) + 1;
  const b = Math.floor(Math.random() * 3) + 1;

  if (food < 20) {
    log(`목표 음식 20개 구하기 현재:${food}`);
    log("");
  }

  if (f === 1) {
    food += b;
    log(`음식 ${b}개를 구했다`);
  } else {
    log("음식을 구하지 못했다");
  }
  log("");
  updateStatus();
}

function useSkill() {
  if (skill.length === 0) {
    log("보유한 스킬 없음");
    return;
  }

  y++;

  if (skill[0] === "연속찌르기") {
    food += 7; sta -= 30;
    log("스태미나 30을 소모하고 음식 7개를 얻었다");
  } else if (skill[0] === "선시 슬래쉬") {
    food += 16; sta -= 40;
    log("스태미나 40을 소모하고 음식 16개를 얻었다");
  } else if (skill[0] === "낙화참") {
    food += 38; sta -= 50;
    log("스태미나 50을 소모하고 음식 38개를 얻었다");
  } else if (skill[0] === "일전팔기") {
    food += 80; sta -= 65;
    log("스태미나 65을 소모하고 음식 80개를 얻었다");
  }

  skillCheck();
  updateStatus();
}

function fishing() {
  if (isFishing) {
    log("이미 낚시를 하고 있다");
    return;
  }

  isFishing = true;
  log("낚시 하는중...");

  setTimeout(() => {
    const g = Math.floor(Math.random() * 3) + 3;
    food += g;
    log(`음식 ${g}개를 얻었다`);
    isFishing = false;
    updateStatus();
  }, 1500);
}

function skillCheck() {
  if (y === 0 && skill.length === 0) {
    skill.push("연속찌르기");
    log("당신은 연속찌르기를 얻었다");
  }
  if (y === 65) {
    skill = ["선시 슬래쉬"];
    log("연속찌르기가 각성해, 선시 슬래쉬로 바뀌었다");
  }
  if (y === 120) {
    skill = ["낙화참"];
    log("선시 슬래쉬가 각성해, 낙화참으로 바뀌었다");
  }
  if (y === 240) {
    skill = ["일전팔기"];
    log("낙화참이 각성해, 일전팔기로 바뀌었다");
  }
}

log("비행기를 탔다");
log("비행기는 언제 타도 설렌다");
log('"오랜만에 여행이라니"');
log('"아 좀 오래 걸리네 뭐 그냥 자야겠다"');
log("그것이 비행기 안에서의 마지막 말이 될 줄은 몰랐다");
log("무인도에 갖혔다");
log("하.. 나 말곤 아무것도 할 줄 모른다");
log("그렇기에 내가 모든걸 책임져야 한다");
log("여기가 좀 험해서 90일은 생존 해야지 구조대가 올 것 같다");
log("이제 시작이다");
log("");

updateStatus();
