const isFlipped = true;
let keypointsHand = [];

const videoElement = document.getElementsByClassName("input_video")[0];
videoElement.style.display = "none";

function onHandsResults(results) {
    keypointsHand = results.multiHandLandmarks;
}

const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    },
});

hands.setOptions({
    selfieMode: isFlipped,
    maxNumHands: 2, // 今回、簡単化のため検出数の最大1つまでに制限
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
});
hands.onResults(onHandsResults);

const camera = new Camera(videoElement, {
    onFrame: async() => {
        await hands.send({ image: videoElement });
    },
    width: 1280,
    height: 720,
});
camera.start();

let videoImage;
let margin = 25;

function setup() {
    const canvas = createCanvas(windowWidth - margin, windowHeight - margin);
    videoImage = createGraphics(320, 180);
}

function draw() {
    background(200, 200, 255);

    videoImage.drawingContext.drawImage(
        videoElement,
        0,
        0,
        videoImage.width,
        videoImage.height
    );

    // キャプチャした画像を表示
    push();
    if (isFlipped) {
        translate(width, 0);
        scale(-1, 1);
    }
    imgWidth = width;
    imgHeight = imgWidth * videoImage.height / videoImage.width;
    imgX = 0;
    imgY = (height - imgHeight) / 2;
    image(videoImage, imgX, imgY, imgWidth, imgHeight);
    pop();

    // 手の位置を表示
    drawHands(keypointsHand, imgX, imgY, imgWidth, imgHeight);
}

function windowResized() {
    resizeCanvas(windowWidth - margin, windowHeight - margin);
}

// 手の位置を表示
function drawHands(hands, _x, _y, _w, _h) {
    let lineMap = new Map();
    lineMap.set(0, [1, 5, 17]);
    lineMap.set(1, [2]);
    lineMap.set(2, [3]);
    lineMap.set(3, [4]);
    lineMap.set(4, []);
    lineMap.set(5, [6, 9]);
    lineMap.set(6, [7]);
    lineMap.set(7, [8]);
    lineMap.set(8, []);
    lineMap.set(9, [10, 13]);
    lineMap.set(10, [11]);
    lineMap.set(11, [12]);
    lineMap.set(12, []);
    lineMap.set(13, [14, 17]);
    lineMap.set(14, [15]);
    lineMap.set(15, [16]);
    lineMap.set(16, []);
    lineMap.set(17, [18]);
    lineMap.set(18, [19]);
    lineMap.set(19, [20]);
    lineMap.set(20, []);

    for (let i = 0; i < hands.length; i++) {
        for (let j = 0; j < hands[i].length; j++) {
            const indexTip1 = hands[i][j];
            let x1 = indexTip1.x * _w + _x;
            let y1 = indexTip1.y * _h + _y;
            for (let k = 0; k < lineMap.get(j).length; k++) {
                const indexTip2 = hands[i][lineMap.get(j)[k]];
                let x2 = indexTip2.x * _w + _x;
                let y2 = indexTip2.y * _h + _y;
                stroke(255);
                strokeWeight(3);
                line(x1, y1, x2, y2);
            }
        }
    }
}