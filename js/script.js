let video = document.getElementById('video');
let canvas = document.getElementById('canvas');

////////////////////////////////////////////////////////////////////////////////
// Drawing

let paths = [];
for (let i = 0; i <= 5; i++) {
  paths[i] = new Path({
    strokeColor: {
      hue: 360 * i / 5,
      saturation: 1,
      brightness: 1
    }
  })
}

function onResults(results) {
  if (results.multiHandedness) {
    let hands = {};
    let i = 0;
    for (let { label } of results.multiHandedness) {
      hands[label.toLowerCase()] = results.multiHandLandmarks[i++];
    }

    let hand = hands.left || hands.right;
    if (hand) {
      let scale = view.size;
      let tips = [hand[4], hand[8], hand[12], hand[16], hand[20]];
      for (let i = 0; i <= 5; i++) {
        let path = paths[i];
        let point = new Point(tips[i]);
        path.add(point * scale);
      }
    }
  }
  /*
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
  */
}

////////////////////////////////////////////////////////////////////////////////
// Video

video.addEventListener('canplay', () => {
  view.setViewSize({
    width: video.videoWidth,
    height: video.videoHeight
  })
})

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
