let particles = [];

function setup() {
    createCanvas(windowWidth - 20, windowHeight - 20);
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

function windowResized() {
    resizeCanvas(windowWidth - 20, windowHeight - 20);
}