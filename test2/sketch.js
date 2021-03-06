// 手認識のテスト

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
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
});
hands.onResults(onHandsResults);

// どことどこをつなぐか
let lineNumMap = new Map(
    [
        [0, [1, 5, 17]],
        [1, [2]],
        [2, [3]],
        [3, [4]],
        [4, []],
        [5, [6, 9]],
        [6, [7]],
        [7, [8]],
        [8, []],
        [9, [10, 13]],
        [10, [11]],
        [11, [12]],
        [12, []],
        [13, [14, 17]],
        [14, [15]],
        [15, [16]],
        [16, []],
        [17, [18]],
        [18, [19]],
        [19, [20]],
        [20, []],
    ]);

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
    background(0);

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
    for (let i = 0; i < hands.length; i++) {
        for (let j = 0; j < hands[i].length; j++) {
            const indexTip1 = hands[i][j];
            let x1 = indexTip1.x * _w + _x;
            let y1 = indexTip1.y * _h + _y;
            for (let k = 0; k < lineNumMap.get(j).length; k++) {
                const indexTip2 = hands[i][lineNumMap.get(j)[k]];
                let x2 = indexTip2.x * _w + _x;
                let y2 = indexTip2.y * _h + _y;
                stroke(255);
                strokeWeight(3);
                line(x1, y1, x2, y2);
            }
        }
    }
}