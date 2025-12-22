body {
  background: #111;
  color: #eee;
  font-family: monospace;
  padding: 12px;
  margin: 0;
}

/* 제목 */
h1 {
  font-size: 28px;
  text-align: center;
  margin-bottom: 10px;
}

/* 로그 창 (텍스트 나오는 칸) */
#log {
  background: #000;
  border: 2px solid #555;
  padding: 15px;
  height: 45vh;              /* 화면 절반 가까이 */
  overflow-y: auto;
  font-size: 18px;
  white-space: pre-wrap;
  border-radius: 8px;
}

/* 상태창 */
#status {
  margin-top: 10px;
  font-size: 18px;
  padding: 10px;
  background: #1a1a1a;
  border-radius: 8px;
}

/* 버튼 영역 */
.buttons {
  margin-top: 15px;
  display: flex;
  flex-direction: column;    /* 모바일: 세로 정렬 */
  gap: 10px;
}

/* 버튼 */
button {
  font-size: 22px;
  padding: 16px;
  width: 100%;
  border-radius: 10px;
  border: none;
  background: #333;
  color: #fff;
  cursor: pointer;
}

/* 버튼 누를 때 */
button:active {
  background: #555;
}

/* ===== PC 화면에서는 버튼 가로 ===== */
@media (min-width: 768px) {
  .buttons {
    flex-direction: row;
  }

  button {
    width: auto;
    flex: 1;
  }

  #log {
    height: 300px;
  }
}
