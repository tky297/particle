// パーティクルのクラス 

class Particle {
    constructor(_x, _y, _r, _c) {
        this.pos = createVector(width / 2, height / 2);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.maxForce = random(5, 7);
        this.target = createVector(_x, _y);
        this.r = _r;
        this.c = _c;
    }

    setTarget(_x, _y) {
        this.target.x = _x;
        this.target.y = _y;
    }

    goToTarget() {
        let steer = this.target.copy();
        let distance = dist(this.pos.x, this.pos.y, this.target.x, this.target.y);
        if (distance > 0.5) {
            let distThreshold = 20;
            steer.sub(this.pos);
            steer.normalize();
            steer.mult(map(min(distance, distThreshold), 0, distThreshold, 0, this.maxForce));
            this.acc.add(steer);
        }
    }

    avoid(mx, my) {
        let distance = dist(this.pos.x, this.pos.y, mx, my);
        if (distance < 100) {
            let repulse = this.pos.copy();
            repulse.sub(mx, my);
            repulse.mult(map(distance, 100, 0, 0, 0.25));
            this.acc.add(repulse);
        }
    }

    move() {
        this.goToTarget();
        this.vel.mult(0.95);
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    draw() {
        noStroke();
        fill(this.c);
        ellipse(this.pos.x, this.pos.y, this.r, this.r);
    }
}