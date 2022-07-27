const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

// 1) init the web camera and play it on the corner
function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((localMediaStream) => {
      console.log(localMediaStream);
      video.src = window.URL.createObjectURL(localMediaStream);
      // 讓攝影機持續更新
      video.play();
    })
    .catch((err) => console.error(err));
}

// 2) set the video width & height to canvas and play on it
function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  // 每16禎擷取一次畫面
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
  }, 16);
}

// 4) click the take photo button then it capture our screen
function takePhoto() {
  // play the print screen sound
  snap.currentTime = 0;
  snap.play();

  // 輸出擷取的圖片
  // 回傳的是base64數值
  const data = canvas.toDataURL('image/jpeg');
  // 秀出擷取的圖片在下面並且點擊他可以下載
  const link = document.createElement('a');
  // 將數值作為超連結他能夠辨識出這是一張圖片
  link.href = data;
  // download設定他是一個可以下載的超連結，並且下載後預設的檔名是handsome
  link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src="${data}" alt="image" />`;
  strip.insertBefore(link, strip.firstChild);
}

// 3) 監聽video.play()，當影片開始時執行函式
video.addEventListener('canplay', paintToCanvas);

1820;
