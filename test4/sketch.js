// 手の動きに合わせてパーティクルが動く

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
let particles = [];
let margin = 25;

function setup() {
    const canvas = createCanvas(windowWidth - margin, windowHeight - margin);
    videoImage = createGraphics(320, 180);
    colorMode(HSB, 360, 100, 100, 100)
    for (let i = 0; i < 500; i++) {
        particles.push(new Particle(random(width), random(height), random(5, 10)));
    }
}

function draw() {
    background(0);
    for (let i = 0; i < particles.length; i++) {
        particles[i].move();
        particles[i].draw();
    }

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
    // image(videoImage, imgX, imgY, imgWidth, imgHeight);
    pop();

    // 手の位置を表示
    drawHands(keypointsHand, imgX, imgY, imgWidth, imgHeight);
}

function mousePressed() {
    for (let i = 0; i < particles.length; i++) {
        particles[i].setTarget(random(width), random(height));
    }
}

// ウインドウサイズが変更されたら位置をリセット
function windowResized() {
    resizeCanvas(windowWidth - margin, windowHeight - margin);
    for (let i = 0; i < particles.length; i++) {
        particles[i].setTarget(random(width), random(height));
    }
}

// 手の位置を表示
function drawHands(hands, _x, _y, _w, _h) {
    let linePosList = [];
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
                linePosList.push([x1, y1, x2, y2]);
            }
        }
    }
    // 手の位置に合わせてパーティクルを動かす
    if (linePosList.length > 0) {
        for (let i = 0; i < particles.length; i++) {
            let id = int(random(linePosList.length));
            let x0 = linePosList[id][0];
            let y0 = linePosList[id][1];
            let x1 = linePosList[id][2];
            let y1 = linePosList[id][3];
            let x = random(x0, x1);
            let y = random(y0, y1);
            particles[i].setTarget(x, y);
        }
    }
}