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
    // 5) 給影像增加特效
    // 取得影像的每一個像素的RGBA值
    let pixels = ctx.getImageData(0, 0, width, height);
    // 結果是一個array，像這樣['200', '180', '150', '255', ...]
    // 這好對應每一個像素的RGBA
    console.log(pixels);
    debugger;
    // mess with them
    pixels.redEffect(pixels);
    // 把加玩效果的像素放回去
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    // 藉由對每個像素增加或減少0-255的值去改變顏色
    pixels.data[i + 0] = pixels.data[i + 0] + 100; // R
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // G
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // B
  }
  return pixels;
}

function rgbSplit(pixels) {
  // 藉由選取不同的像素互換位置來造成影像剝離的效果
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 150] = pixels.data[i + 0]; // R
    pixels.data[i - 100] = pixels.data[i + 1]; // G
    pixels.data[i + 150] = pixels.data[i + 2]; // B
  }
  return pixels;
}

function greenScreen(pixels) {
  // 綠幕效果，藉由判讀每個像素點的RGB都在rmin與rmax之間的話，就讓這些點的alpha變為0隱藏起來
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }
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
