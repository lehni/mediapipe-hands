let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

video.addEventListener('canplay', () => {
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
})

function onResults(results) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
        color: '#00FF00',
        lineWidth: 5
      });
      drawLandmarks(ctx, landmarks, {
        color: '#FF0000',
        lineWidth: 2
      });
    }
  }
}

let hands = new Hands({
  locateFile: file => `node_modules/@mediapipe/hands/${file}`
});
hands.setOptions({
  maxNumHands: 8,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.25
});
hands.onResults(onResults);

function sleep(delay) {
  return new Promise(resolve => setTimeout(resolve))
}

let run = false

async function start() {
  run = true
  while (run) {
    await hands.send({ image: video });
    await sleep(1)
  }
}

function stop() {
  run = false
}

start()
