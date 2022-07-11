/* variables */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

/* build out function */
function togglePlay() {
  // if (video.paused) {
  //   video.play();
  // } else {
  //   video.pause();
  // }
  // 等同以上寫法
  const method = video.paused ? 'play' : 'pause';
  video[method]();
}

function updateButton() {
  const icon = this.paused ? '►' : '❚ ❚';
  toggle.textContent = icon;
  // MediaElement.paused 是布林，檢查影片是否有暫停
  // MediaElement.pause() / play() 是方法，用來暫停或撥放影片，同狀態下各自方法無效
}

function skip() {
  console.log(this.dataset.skip);
  video.currentTime += parseFloat(this.dataset.skip); // 將字串轉為數字
}

function handleChange() {
  video[this.name] = this.value;
}

function handleProgress() {
  // 進度調是使用 flex-basis 做的
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  // 點擊時的位置所在的寬度 / 整個進度條的寬度 * 整個影片的片長
  video.currentTime = scrubTime;
}

/*hook up the event listeners */
video.addEventListener('click', togglePlay);
// 點影片就會暫停撥放
toggle.addEventListener('click', togglePlay);
// 播放暫停按鈕的圖示變化不直接依靠點擊事件，因為不確定使用者是否透過點擊按鈕來暫停撥放的
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
// 透過監聽影片的暫停或撥放來改變按鈕的圖示
skipButtons.forEach((button) => button.addEventListener('click', skip));
// 快轉
ranges.forEach((range) => range.addEventListener('change', handleChange));
ranges.forEach((range) => range.addEventListener('mousemove', handleChange));
// 音量與快慢
video.addEventListener('timeupdate', handleProgress);
// video.addEventListener('progress', handleProgress); // 一樣的效果
// 監聽影片撥放的進度
let mousedown = false;
progress.addEventListener('click', scrub);
// 點擊進度條時跳至該進度
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
// 這裡指的是當mousedown為真時，才會觸發call back
progress.addEventListener('mousedown', () => (mousedown = true));
progress.addEventListener('mouseup', () => (mousedown = false));
// 點擊並拖曳進度條時跳至該進度
