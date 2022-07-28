let countdown;

function timer(seconds) {
  // 這裡不用setInterval直接呼叫某個函式使用，在長時間下瀏覽器可能會莫名停止運作這個函式。在IOS系統中，如果滾動頁面也會造成函式停止運作
  // 1) set the time we want
  const now = Date.now();
  const then = now + seconds * 1000;
  // 在這裡先執行一次就可以避免等一秒後這個沒數到
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

// 2) setInterval不會馬上執行，他會等待一秒後才執行
function displayTimeLeft(seconds) {
  console.log(seconds);
}

0750;
