/**
 * This is an interactive applet created by River Way for the Hyperdarts lesson.
 * It uses p5.js to interface with WEBGL and draw a pyramid & cube to a 3D environment.
 */

import React from "react";
import Sketch from "react-p5";

const WIDTH = 880;
const HEIGHT = 500;
const SCALE = 200;
let mouseScale = 1;

const LINE_COLOR = "#FFFFFF";
const PYMD_COLOR = "#27ed15";

export default function PyramidPlot() {
  const SENSITIVITY = 1.2;

  let p5Object;
  let camera;

  function setup(sketch, canvasParentRef) {
    p5Object = sketch
      .createCanvas(WIDTH, HEIGHT, sketch.WEBGL)
      .parent(canvasParentRef);
    sketch.angleMode(sketch.DEGREES);

    // Change the original camera angle
    let moveX = (SENSITIVITY * -880) / HEIGHT;
    let moveY = (SENSITIVITY * 200) / HEIGHT;
    camera = p5Object._curCamera;
    camera._orbit(moveX, moveY, 0);
  }

  function drawSprayLines(sketch, v1, v2) {
    // Number of lines to draw
    const N = 10;

    let vCopy = v1.copy();

    for (let i = 0; i <= N; i++) {
      let progress = i / N;
      let point = vCopy.lerp(v2, progress);
      sketch.line(0, 0, 0, point.x, point.y, point.z);
    }
  }

  function drawPyramid(sketch) {
    sketch.push();

    let color = sketch.color(PYMD_COLOR);
    color.setAlpha(0.5 * 255);

    sketch.noFill();
    sketch.stroke(color);

    const v1 = sketch.createVector(1, 0, 0);
    const v2 = sketch.createVector(0, 1, 0);
    const v3 = sketch.createVector(0, 0, 1);

    drawSprayLines(sketch, v1, v2);
    drawSprayLines(sketch, v2, v3);
    drawSprayLines(sketch, v1, v3);

    sketch.fill(color);
    sketch.noStroke();

    sketch.beginShape(sketch.TRIANGLES);
    sketch.vertex(v1.x, v1.y, v1.z);
    sketch.vertex(v2.x, v2.y, v2.z);
    sketch.vertex(v3.x, v3.y, v3.z);
    sketch.endShape();

    sketch.pop();
  }

  function drawCube(sketch) {
    sketch.push();

    sketch.noFill();
    sketch.strokeWeight(2);
    sketch.stroke(sketch.color(LINE_COLOR));
    sketch.box(1, 1, 1);

    sketch.pop();
  }

  function updateScale(sketch) {
    // Get CSS scale transform information from parent of parent element
    let transform = sketch.canvas.parentElement.parentElement.style.transform;
    let scaleString = transform.split("(")[1];
    scaleString = scaleString.substring(0, scaleString.length - 1);
    if (!scaleString.includes(".")) {
      scaleString += ".0";
    }
    mouseScale = parseFloat(scaleString);
  }

  function draw(sketch) {
    sketch.background(0);
    updateScale(sketch);

    const mouseInCanvas =
      sketch.mouseX / mouseScale < sketch.width &&
      sketch.mouseX > 0 &&
      sketch.mouseY / mouseScale < sketch.height &&
      sketch.mouseY > 0;

    if (mouseInCanvas) {
      sketch.cursor("grab");
    } else {
      sketch.cursor(sketch.ARROW);
    }

    if (sketch.contextMenuDisabled !== true) {
      sketch.canvas.oncontextmenu = () => false;
      sketch._setProperty("contextMenuDisabled", true);
    }

    const scaleFactor =
      sketch.height < sketch.width ? sketch.height : sketch.width;

    if (sketch.mouseIsPressed && mouseInCanvas) {
      const deltaTheta =
        (-SENSITIVITY * (sketch.mouseX - sketch.pmouseX)) / scaleFactor;
      const deltaPhi =
        (SENSITIVITY * (sketch.mouseY - sketch.pmouseY)) / scaleFactor;
      sketch._renderer._curCamera._orbit(deltaTheta, deltaPhi, 0);
    }

    // By default p5 has the axis pointing out of the screen as Z and left is X and up is Y
    // I prefer standard math notation which is out of screen is X, left is Y, and up is Z
    sketch.rotateY(-90);
    sketch.rotateX(90);
    sketch.scale(SCALE, SCALE, SCALE);

    drawCube(sketch);
    sketch.translate(-0.5, -0.5, -0.5);
    drawPyramid(sketch);
  }

  return (
    <Sketch
      setup={setup}
      draw={draw}
      style={{ width: WIDTH, height: HEIGHT }}
    />
  );
}
