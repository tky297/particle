// パーティクルのテスト

let particles = []; // パーティクルの配列
let margin = 25; // 余白

function setup() {
    createCanvas(windowWidth - margin, windowHeight - margin);
    colorMode(HSB, 360, 100, 100, 100)
    for (let i = 0; i < 2000; i++) {
        let c = color(200, 100, random(200));
        particles.push(new Particle(random(width), random(height), random(5, 10), c));
    }
}

function draw() {
    background(0);
    for (let i = 0; i < particles.length; i++) {
        particles[i].move();
        particles[i].avoid(mouseX, mouseY);
        particles[i].draw();
    }
}

// ウインドウサイズが変更されたら位置をリセット
function windowResized() {
    resizeCanvas(windowWidth - margin, windowHeight - margin);
    for (let i = 0; i < particles.length; i++) {
        particles[i].setTarget(random(width), random(height));
    }
}