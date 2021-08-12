/**
 * This is an interactive applet created by River Way for the Linear Algebra 2 lesson.
 * It uses p5.js to interface with WEBGL and draw a pair of vectors to a 3D environment.
 */

import React from "react";
import Sketch from "react-p5";

const WIDTH = 800;
const HEIGHT = 500;
const SCALE = 200;
let mouseScale = 1;

const AXIS_COLOR = "#d6d6d6";
const VEC1_COLOR = "#ff4242";
const VEC2_COLOR = "#dd2ded";

export default function PyramidPlot() {
  const SENSITIVITY = 1.2;

  let p5Object;
  let camera;

  let VEC1;
  let VEC2;
  let VEC3;

  let VEC1_mag = 0.3;
  let VEC2_mag = 0.3;

  function setup(sketch, canvasParentRef) {
    p5Object = sketch
      .createCanvas(WIDTH, HEIGHT, sketch.WEBGL)
      .parent(canvasParentRef);
    sketch.angleMode(sketch.DEGREES);

    // Change the original camera angle
    let moveX = (SENSITIVITY * 80) / HEIGHT;
    let moveY = (SENSITIVITY * 200) / HEIGHT;
    camera = p5Object._curCamera;
    camera._orbit(moveX, moveY, 0);

    VEC1 = sketch.createVector(2, 1, -0.5);
    VEC2 = sketch.createVector(1.4, 2, -1);
    VEC3 = VEC1.cross(VEC2);
    console.log(VEC1, VEC2, VEC3);
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

  function drawAxes(sketch) {
    const DIST = 3;
    sketch.push();
    sketch.stroke(sketch.color(AXIS_COLOR));
    sketch.strokeWeight(0.5);

    sketch.line(-DIST, 0, 0, DIST, 0, 0);
    sketch.line(0, -DIST, 0, 0, DIST, 0);
    sketch.line(-0, 0, -DIST, 0, 0, DIST);

    sketch.pop();
  }

  function drawVectors(sketch) {
    sketch.push();
    sketch.strokeWeight(0.5);

    let first = sketch.createVector(VEC1_mag, 0, 0);
    drawArrow(sketch, first, 0.05, 0, sketch.color(VEC1_COLOR));

    let second = sketch.createVector(0, VEC2_mag, 0);
    drawArrow(sketch, second, 0.05, 90, sketch.color(VEC2_COLOR));

    sketch.pop();
  }

  function drawArrow(sketch, pos, size, angle, color) {
    sketch.push();

    sketch.stroke(color);
    sketch.strokeWeight(2);
    sketch.fill(color);
    sketch.line(0, 0, 0, pos.x, pos.y, pos.z);
    sketch.translate(pos.x, pos.y, pos.z);
    sketch.rotateZ(angle);
    sketch.triangle(0, size / 2, 0, -size / 2, size, 0);

    sketch.pop();
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
        (-SENSITIVITY * (sketch.mouseX - sketch.pmouseX)) /
        scaleFactor /
        mouseScale;
      const deltaPhi =
        (SENSITIVITY * (sketch.mouseY - sketch.pmouseY)) /
        scaleFactor /
        mouseScale;
      sketch._renderer._curCamera._orbit(deltaTheta, deltaPhi, 0);
    }

    // By default p5 has the axis pointing out of the screen as Z and left is X and up is Y
    // I prefer standard math notation which is out of screen is X, left is Y, and up is Z
    sketch.rotateY(-90);
    sketch.rotateX(90);
    sketch.scale(SCALE, SCALE, SCALE);

    sketch.push();
    drawAxes(sketch);
    sketch.applyMatrix(
      VEC1.x,
      VEC2.x,
      VEC3.x,
      0,
      VEC1.y,
      VEC2.y,
      VEC3.y,
      0,
      VEC1.z,
      VEC2.z,
      VEC3.z,
      0,
      0,
      0,
      0,
      1
    );
    drawVectors(sketch);
    sketch.pop();
  }

  return (
    <Sketch
      setup={setup}
      draw={draw}
      style={{ width: WIDTH, height: HEIGHT }}
    />
  );
}
