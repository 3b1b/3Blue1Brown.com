/**
 * This is an interactive applet created by River Way for the Linear Algebra 2 lesson.
 * It uses p5.js to interface with WEBGL and draw a linear span to a 3D environment.
 */

import React from "react";
import Sketch from "react-p5";

const WIDTH = 800;
const HEIGHT = 500;
const SCALE = 200;
let mouseScale = 1;

const MINR_COLOR = "#1b8694";
const MAJR_COLOR = "#2dd5eb";
const AXIS_COLOR = "#d6d6d6";
const VEC1_COLOR = "#ff4242";
const VEC2_COLOR = "#dd2ded";
const VEC3_COLOR = "#532dfc";
const VSUM_COLOR = "#1fab2d";

const BKGD_COLOR = "#000000";
const NMBR_COLOR = "#FFFFFF";

export default function PyramidPlot() {
  const SENSITIVITY = 1.2;

  let p5Object;
  let camera;

  let VEC1;
  let VEC2;
  let VEC3;

  let VEC1_mag = 0.3;
  let VEC2_mag = 0.3;
  let VEC3_mag = -0.15;

  /**
   * Top Sketch (3D interactable)
   */

  function topSetup(sketch, canvasParentRef) {
    p5Object = sketch
      .createCanvas(WIDTH, HEIGHT, sketch.WEBGL)
      .parent(canvasParentRef);
    sketch.angleMode(sketch.DEGREES);

    // Change the original camera angle
    let moveX = (SENSITIVITY * 180) / HEIGHT;
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
    let angle = (VEC1_mag > 0) ? 0 : 180;
    drawArrow(sketch, first, 0.05, angle, sketch.color(VEC1_COLOR));

    let second = sketch.createVector(0, VEC2_mag, 0);
    angle = (VEC2_mag > 0) ? 90 : 270;
    drawArrow(sketch, second, 0.05, angle, sketch.color(VEC2_COLOR));

    let fourth = sketch.createVector(-VEC3_mag + 0.05 * Math.sign(VEC3_mag), 0, 0);
    if (Math.abs(VEC3_mag) > 0.01) {
      sketch.push();
      sketch.rotateY(90);
      angle = (VEC3_mag < 0) ? 0 : 180;
      drawArrow(sketch, fourth, 0.05, angle, sketch.color(VEC3_COLOR));
      sketch.pop();
    }

    let third = sketch.createVector(VEC1_mag, VEC2_mag, VEC3_mag);
    angle = sketch.degrees(Math.atan2(VEC2_mag, VEC1_mag));
    drawArrow(sketch, third, 0.05, angle, sketch.color(VSUM_COLOR));
    
    sketch.pop();
  }

  function drawArrow(sketch, pos, size, angle, color, vangle) {
    sketch.push();

    sketch.stroke(color);
    sketch.strokeWeight(2);
    sketch.fill(color);
    sketch.line(0, 0, 0, pos.x, pos.y, pos.z);
    sketch.translate(pos.x, pos.y, pos.z);
    if (vangle != undefined) {
      sketch.rotateY(vangle);
    }
    sketch.rotateZ(angle);
    sketch.triangle(0, size / 2, 0, -size / 2, size, 0);

    sketch.pop();
  }

  function drawPlane(sketch) {
    const STEPS = 8;
    const MAJOR_STEP = 2;
    const planeScale = 0.1;

    sketch.push();

    for (let step = 0; step <= STEPS; step++) {
      if (step % MAJOR_STEP == 0) {
        sketch.stroke(sketch.color(MAJR_COLOR));
      } else {
        sketch.stroke(sketch.color(MINR_COLOR));
      }

      let s = step * planeScale;
      let S = STEPS * planeScale
      sketch.line(s, -S, VEC3_mag, s, S, VEC3_mag);
      sketch.line(-s, -S, VEC3_mag, -s, S, VEC3_mag);
      sketch.line(-S, s, VEC3_mag, S, s, VEC3_mag);
      sketch.line(-S, -s, VEC3_mag, S, -s, VEC3_mag);
    }

    sketch.pop();
  }

  function topDraw(sketch) {
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
    drawPlane(sketch);
    drawVectors(sketch);
    sketch.pop();
  }

  /**
   * Bottom Sketch (Sliders & text)
   */

  let sliders = [];
  let activeSlider = -1;
  let hoveredSlider = -1;

  function bottomSetup(sketch, canvasParentRef) {
    sketch.createCanvas(WIDTH, 150).parent(canvasParentRef);
    sketch.angleMode(sketch.DEGREES);

    sketch.textSize(20);
    setupMouseEvents(sketch);

    sketch.background(sketch.color(BKGD_COLOR));

    const SLIDER_X = 200;
    const SLIDER_LEN = 400;
    const SLIDER_Y = 40;
    const SLIDER_OFFSET = 40;

    sliders[0] = new Slider(
      sketch,
      crd(SLIDER_X, SLIDER_Y),
      crd(SLIDER_X + SLIDER_LEN, SLIDER_Y),
      -1,
      1,
      -0.5,
      20
    );
    sliders[1] = new Slider(
      sketch,
      crd(SLIDER_X, SLIDER_Y + SLIDER_OFFSET),
      crd(SLIDER_X + SLIDER_LEN, SLIDER_Y + SLIDER_OFFSET),
      -1,
      1,
      0.5,
      20
    );
    sliders[2] = new Slider(
      sketch,
      crd(SLIDER_X, SLIDER_Y + SLIDER_OFFSET * 2),
      crd(SLIDER_X + SLIDER_LEN, SLIDER_Y + SLIDER_OFFSET * 2),
      -1,
      1,
      -0.15,
      20
    );

    sliders[0].setColor(VEC1_COLOR);
    sliders[1].setColor(VEC2_COLOR);
    sliders[2].setColor(VEC3_COLOR);

    for (let i = 0; i < sliders.length; i++) {
      sliders[i].drawSlider();
      sliders[i].drawValue(sliders[i].pos2.x + 20, sliders[i].pos2.y);
    }

    const TEXT_X = 170;
    const TEXT_Y = 45;
    const TEXT_OFFSET = 40;

    sketch.noStroke();
    sketch.fill(sketch.color(VEC1_COLOR));
    sketch.text("a", TEXT_X, TEXT_Y);
    sketch.fill(sketch.color(VEC2_COLOR));
    sketch.text("b", TEXT_X, TEXT_Y + TEXT_OFFSET);
    sketch.fill(sketch.color(VEC3_COLOR));
    sketch.text("c", TEXT_X, TEXT_Y + TEXT_OFFSET * 2);

    sketch.fill(sketch.color(NMBR_COLOR));
  }

  function setupMouseEvents(sketch) {
    sketch.mousePressed = () => {
      activeSlider = hoveredSlider;
      if (activeSlider != -1) sketch.cursor("grab");
    };

    sketch.mouseReleased = () => {
      activeSlider = -1;
      sketch.mouseMoved();
    };

    sketch.mouseMoved = () => {
      if (activeSlider == -1) {
        for (let i = 0; i < sliders.length; i++) {
          if (sliders[i].isOver(sketch.mouseX, sketch.mouseY)) {
            sketch.cursor(sketch.HAND);
            hoveredSlider = i;
            return;
          }
        }
        hoveredSlider = -1;
        sketch.cursor(sketch.ARROW);
      }
    };

    sketch.mouseDragged = () => {
      if (activeSlider != -1) {
        // Overwrite the items to be updated with the background color
        sketch.fill(sketch.color(BKGD_COLOR));
        sketch.noStroke();

        // Redraw the updated items
        let current = sliders[activeSlider];
        sketch.rect(
          current.pos1.x - current.radius,
          current.pos1.y - current.radius,
          current.pos2.x - current.pos1.x + current.radius * 5,
          current.radius * 2
        );
        current.update(sketch.mouseX, sketch.mouseY);
        current.drawSlider();
        current.drawValue(current.pos2.x + 20, current.pos2.y);
        updateValues();
      }
    };
  }

  function updateValues() {
    if (activeSlider == 0) {
      VEC1_mag = -sliders[activeSlider].getValue() * 0.75;
    } else if (activeSlider == 1) {
      VEC2_mag = sliders[activeSlider].getValue() * 0.75;
    } else if (activeSlider == 2) {
      VEC3_mag = sliders[activeSlider].getValue() * 0.75;
    }
  }

  function bottomDraw(sketch) {
    // The render function is empty because it only gets drawn on mouse updates
  }

  return [
    <Sketch
      key="spanSketch1"
      setup={topSetup}
      draw={topDraw}
      style={{ width: WIDTH, height: HEIGHT }}
    />,
    <Sketch
      key="spanSketch2"
      setup={bottomSetup}
      draw={bottomDraw}
      style={{ width: WIDTH, height: 150 }}
    />,
  ];
}

function crd(xCoord, yCoord) {
  return { x: xCoord, y: yCoord };
}

function dist(x0, y0, x1, y1) {
  let xDiff = x1 - x0;
  let yDiff = y1 - y0;
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}

class Slider {
  constructor(
    sketch,
    pos1,
    pos2,
    lowerBound,
    higherBound,
    initialValue,
    radius
  ) {
    // Slider class creates a line between pos1 & pos2 and allows for an adjustable circle to slide between those points
    // The pos1 & pos2 are coordinate pairs define the points for the edges of the line segment
    // lowerBound is a number defining the lowest value
    // higherBound is a number defining the highest value
    // initialValue is a number defining where the value should start at
    // radius is a number defining how big the circle should be

    this.sketch = sketch;
    this.pos1 = pos1;
    this.pos2 = pos2;
    this.lowerBound = lowerBound;
    this.higherBound = higherBound;
    this.value = initialValue;
    this.radius = radius;
    this.color = NMBR_COLOR

    this.xScale = (pos2.x - pos1.x) / (higherBound - lowerBound);
    this.yScale = (pos2.y - pos1.y) / (higherBound - lowerBound);
  }

  isOver(x, y) {
    // isOver(x, y):boolean returns true if the x & y coordinates is inside the circle
    // x is a number defining the x coordinate to check
    // y is a number defining the y coordinate to check

    x /= mouseScale;
    y /= mouseScale;

    let xValue = (this.value - this.lowerBound) * this.xScale + this.pos1.x;
    let yValue = (this.value - this.lowerBound) * this.yScale + this.pos1.y;

    let d = dist(x, y, xValue, yValue);

    return d < this.radius;
  }

  update(x, y) {
    // update(x, y):void updates the value of the slider based off the coordinate provided
    // x is a number defining the x coordinate of the new location
    // y is a number defining the y coordinate of the new location

    x /= mouseScale;
    y /= mouseScale;

    if (x < this.pos1.x) x = this.pos1.x;
    else if (x > this.pos2.x) x = this.pos2.x;
    if (y < this.pos1.y) y = this.pos1.y;
    else if (y > this.pos2.y) y = this.pos2.y;

    x -= this.pos1.x;
    y -= this.pos1.y;

    if (this.xScale > this.yScale) {
      this.value = x / this.xScale + this.lowerBound;
    } else {
      this.value = y / this.yScale + this.lowerBound;
    }
  }

  drawSlider() {
    // drawSlider():void draws the slider

    let x = (this.value - this.lowerBound) * this.xScale + this.pos1.x;
    let y = (this.value - this.lowerBound) * this.yScale + this.pos1.y;

    this.sketch.strokeWeight(1);
    this.sketch.stroke(AXIS_COLOR);
    this.sketch.line(this.pos1.x, this.pos1.y, this.pos2.x, this.pos2.y);
    this.sketch.fill(this.color);
    this.sketch.ellipse(x, y, this.radius, this.radius);
  }

  drawValue(x, y) {
    // drawValue(x, y):void draws the value on screen at the specified location
    this.sketch.noStroke();
    this.sketch.fill(NMBR_COLOR);
    this.sketch.text(this.value.toFixed(2), x, y + 5);
  }

  getValue() {
    // getValue(): number returns the value bounded between the lower and higher bounds
    return this.value;
  }

  setColor(color) {
    this.color = color;
  }
}
