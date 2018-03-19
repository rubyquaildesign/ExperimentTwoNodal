/* eslint no-undef: 0 */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "setup|draw" }] */
let barry;
let wanderAngle;
let someSprites = [];
function setup () {
  createCanvas(500, 400);

  for (let index = 0; index < 5; index++) {
    someSprites[index] = createSprite(
      random(width - 100) + 50,
      random(height - 100) + 50,
      30,
      30
    );
    someSprites[index].mouseActive = true;
    someSprites[index].maxSpeed = 0.6;
    someSprites[index].velocity = createVector(random(-1, 1), random(-1, 1));
    someSprites[index].wanderAngle = 0;
  }
}
function draw () {
  background(55);
  for (let i = 0; i < someSprites.length; i++) {
    const spr = someSprites[i];
    if (spr.mouseIsPressed) {
      spr.position.x = mouseX;
      spr.position.y = mouseY;
      spr.maxSpeed = 0;
    } else {
      wander(spr);
    }
  }
  drawSprites();
}
function wander (_sprite) {
  _sprite.maxSpeed = 0.8;
  let vW = _sprite.velocity.copy();
  vW.normalize();
  vW.mult(30);
  let vW2 = vW.copy();
  vW2.add(_sprite.position);
  // ellipse(vW2.x, vW2.y, 10, 10);
  let displacement = createVector(0, -1);
  displacement.mult(3);
  displacement.rotate(_sprite.wanderAngle);
  _sprite.wanderAngle += random() * 1.5 - 1.5 * 0.5;
  wanderForce = vW.add(displacement);
  // line(vW2.x, vW2.y, vW2.x + displacement.x * 10, vW2.y + displacement.y * 10);
  _sprite.velocity.add(wanderForce);
}
