/* eslint no-undef: 0 */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "setup|draw" }] */
function setup () {
  createCanvas(windowWidth, windowHeight);
}
function draw () {
  background(55);
  if (mouseIsPressed) {
    ellipse(mouseX, mouseY, 30, 30);
  }
}
