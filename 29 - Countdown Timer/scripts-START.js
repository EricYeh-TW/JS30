let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

function timer(seconds) {
  // 5) 初始化計時器，避免重複點擊計時器時殘留上一次的計時導致出錯
  clearInterval(countdown);

  // 這裡不用setInterval直接呼叫某個函式使用，在長時間下瀏覽器可能會莫名停止運作這個函式。在IOS系統中，如果滾動頁面也會造成函式停止運作
  // 1) 設定我們要倒數多久
  const now = Date.now();
  const then = now + seconds * 1000;
  // setInterval不會馬上執行，他會等待一秒後才執行
  // 在這裡先執行一次就可以避免第一秒沒數到
  displayTimeLeft(seconds);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    // stop it
    if (secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }
    // console.log(secondsLeft);
    displayTimeLeft(secondsLeft);
  }, 1000);
}

// 2) 顯示我們設定的倒數時間
function displayTimeLeft(seconds) {
  console.log(seconds);
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  // 2m:4s => 2m:04s
  display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
  timerDisplay.textContent = display;
  // 直接選取<title>
  document.title = display;
}

// 3) 顯示結束時的確切時間
function displayEndTime(timestamp) {
  // timestamp = Date.now()會回傳從西元元年開始的秒數
  // new Date(timestamp)會將它轉換為標準時間單位
  const end = new Date(timestamp);
  const hours = end.getHours();
  const minutes = end.getMinutes();
  // 24小時制 => 12小時制
  endTime.textContent = `Be back at ${hours > 12 ? hours - 12 : hours} : ${minutes < 10 ? '0' : ''}${minutes}`;
}

function startTimer() {
  // 將字串轉變成數字
  const seconds = parseInt(this.dataset.time);
  timer(seconds);
}

// 4) 將設定時間與按鈕做連結
buttons.forEach((button) => button.addEventListener('click'), startTimer);

// 6) 輸入並設定特定的時間
// 對於有name屬性的tag，可以直接在document後面選取它，不用再特定用querySelector
// 如果子物件也有name屬性則也可以選取，像是document.customForm.minutes
document.customForm.addEventListener('submit', function (e) {
  // 防止submit刷新頁面
  e.preventDefault();
  const mins = this.minutes.value;
  timer(mins * 60);
  // submit完後清空
  this.reset();
});
