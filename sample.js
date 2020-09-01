'use strict';

// 制限時間(秒)
const TIME_LIMIT = 15;
// 経過時間
let timePassed = 0;
// 残り時間
let timeLeft = TIME_LIMIT;
// 時間間隔
let timeInterval = null;

// Remaining time label (残り時間の設定)
function formatTimeLeft(time) {
  const minutes = Math.floor(time / 60);
  // 再代入するためletを使用
  let seconds = time % 60;
  // 10秒未満の場合、「05」という表記を seconds に再代入する
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  // 以下の文字列を返す
  return `${minutes}:${seconds}`;
}

// カウントダウン設定
function startTimer() {
  timeInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    // 右辺の関数の結果を左辺のinnerHTMLに代入する  <-- これを書く理由が不明(コメントアウトすると数字が変化しなかった)
    document.getElementById("base-timer-label").innerHTML = formatTimeLeft(timeLeft);

    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft <= 0) {
      // タイマー解除
      clearInterval(timeInterval);
    } 
  }, 1000);
}

// 初期時間の残りの割合を計算する、カウントダウン中にリングの長さを徐々に短くする？
function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

// 残り時間の更新
function setCircleDasharray() {
  const setCircleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", setCircleDasharray);
}

const FULL_DASH_ARRAY = 283;

// 警告状態に変化するしきい値(秒)
const WARNING_THRESHOLD = 10;
// アラート状態に変化するしきい値(秒)
const ALERT_THRESHOLD = 5;

// リングの色の設定
const COLOR_CODES = {
  // 初期
  info: {
    color: "green"
  },
  // 警告
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  // アラート
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

// 残りの色
let remainingPathColor = COLOR_CODES.info.color;

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info} = COLOR_CODES;

  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

const reset = function() {
  document.getElementById('button').innerHTML = "スタート";
  document.getElementById('button').disabled = "null";
}

const sound = function(reset) {
  console.log("sound");
  const audio = document.getElementById('sound');
  audio.currentTime = 0;
  audio.play();
  reset();
}



document.getElementById("app").innerHTML = `
<div class="base-timer">
  <!-- viewBox: SVG の描画領域 -->
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <!-- 円の描画: cx & cy は円の中心の位置 r は半径 -->
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <!-- M:始点 m:始点からの相対位置 a:円弧 stroke-dasharray=緑色の線の長さ 次の緑の線が描画されるまでの長さ(円の長さMax283に指定してるのでそこに達したら描画終了)-->
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
          "
        ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">
    <!-- 以下の関数の結果を表示する -->
    ${formatTimeLeft(timeLeft)}
  </span>
  <div id="button-wrapper" class="button-wrapper">
    <button id="button" name="start">
      スタート
    </button>
  </div>
</div>
`;

document.getElementById('button').onclick = function changeContent() {
  // 以下の関数を実行する
  startTimer();
  document.getElementById('button').innerHTML = "実行中";
  document.getElementById('button').disabled = "disabled";
  setTimeout(sound, timeLeft * 1000, reset);
}


