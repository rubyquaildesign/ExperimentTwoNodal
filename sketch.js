// @ts-check
/* eslint no-undef: 0 */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "setup|draw|preload|recordFrame|recordSetup" }] */

// #region Recording
// For Recording

var recorder;
var canvasObject;
var lastFrame = 60;
/**
 * Adds A frame to the recording and saves if at end
 *
 */
function recordFrame () {
  if (frameCount <= lastFrame) {
    recorder.capture(canvasObject);
    if (frameCount === lastFrame) {
      recorder.stop();
      recorder.save();
    }
  }
}
/**
 * Set's up Recording
 *
 */
function recordSetup () {
  recorder = new CCapture({
    format: 'webm',
    framerate: 60
  });
  canvasObject = document.getElementById('defaultCanvas0');
  recorder.start();
}
// #endregion
function preload () {}
let canvas;
function setup () {
  canvas = createCanvas(300, 500);
  // recordSetup();
}
function draw () {
  background(getC(hues.neutrals, 1).hex);
  if (mouseIsPressed) {
    ellipse(mouseX, mouseY, 30, 30);
  }

  // recordFrame();
}
