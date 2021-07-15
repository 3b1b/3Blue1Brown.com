/**
 * This is an interactive applet created by River Way for the light QM lesson.
 * It uses p5.js to interface with JS canvas and create sliders for interacting with a wave.
 */

import React from "react";
import Sketch from "react-p5";

const WIDTH = 700;
const HEIGHT = 500;

const BKGD_COLOR = "#000000";
const GRID_COLOR = "#282828";
const AXIS_COLOR = "#555555";
const LINE_COLOR = "#F0F0F0";
const NMBR_COLOR = "#FFFFFF";
const AMPL_COLOR = "#1bab46";
const FRQY_COLOR = "#d9572b";
const PHSE_COLOR = "#ff8ad4";
const BOBL_COLOR = "#46c797";

let SCALE = 1;

export default function SphericalPlot() {
  const pos1 = crd(100, 50);
  const pos2 = crd(600, 350);

  let sliders = [];
  let activeSlider = -1;
  let hoveredSlider = -1;

  function setup(sketch, canvasParentRef) {
    sketch.createCanvas(WIDTH, HEIGHT).parent(canvasParentRef);
    sketch.angleMode(sketch.DEGREES);

    sketch.textSize(20);
    sketch.textFont("cmunrm");
    setupMouseEvents(sketch);

    sketch.background(sketch.color(BKGD_COLOR));

    const SLIDER_X = 200;
    const SLIDER_LEN = 400;
    const SLIDER_Y = 380;
    const SLIDER_OFFSET = 40;

    sliders[0] = new Slider(
      sketch,
      crd(SLIDER_X, SLIDER_Y),
      crd(SLIDER_X + SLIDER_LEN, SLIDER_Y),
      -4,
      4,
      2,
      20
    );
    sliders[1] = new Slider(
      sketch,
      crd(SLIDER_X, SLIDER_Y + SLIDER_OFFSET),
      crd(SLIDER_X + SLIDER_LEN, SLIDER_Y + SLIDER_OFFSET),
      0,
      1,
      0.2,
      20
    );
    sliders[2] = new Slider(
      sketch,
      crd(SLIDER_X, SLIDER_Y + SLIDER_OFFSET * 2),
      crd(SLIDER_X + SLIDER_LEN, SLIDER_Y + SLIDER_OFFSET * 2),
      -10,
      10,
      0,
      20
    );

    drawSinWave(sketch);

    for (let i = 0; i < sliders.length; i++) {
      sliders[i].drawSlider();
      sliders[i].drawValue(sliders[i].pos2.x + 20, sliders[i].pos2.y);
    }

    const TEXT_X = 50;
    const TEXT_Y = 385;
    const LABEL_X = 90;
    const TEXT_OFFSET = 40;

    sketch.noStroke();
    sketch.fill(sketch.color(AMPL_COLOR));
    sketch.text("A", TEXT_X, TEXT_Y);
    subtext(sketch, "x", TEXT_X + 15, TEXT_Y + 4);
    sketch.text("Amplitude", LABEL_X, TEXT_Y);
    sketch.fill(sketch.color(FRQY_COLOR));
    sketch.text("f", TEXT_X, TEXT_Y + TEXT_OFFSET);
    subtext(sketch, "x", TEXT_X + 7, TEXT_Y + TEXT_OFFSET + 2);
    sketch.text("Frequency", LABEL_X, TEXT_Y + TEXT_OFFSET);
    sketch.fill(sketch.color(PHSE_COLOR));
    sketch.text("ϕ", TEXT_X, TEXT_Y + TEXT_OFFSET * 2);
    subtext(sketch, "x", TEXT_X + 11, TEXT_Y + TEXT_OFFSET * 2 + 4);
    sketch.text("Phase", LABEL_X, TEXT_Y + TEXT_OFFSET * 2);

    sketch.fill(sketch.color(NMBR_COLOR));
    sketch.text("t", 715, 165);
  }

  function subtext(sketch, message, x, y) {
    sketch.push();

    sketch.textSize(13);
    sketch.text(message, x, y);

    sketch.pop();
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
        sketch.rect(
          pos1.x - 1,
          pos1.y - 1,
          pos2.x - pos1.x + 2,
          pos2.y - pos1.y + 2
        );

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
        drawSinWave(sketch);
      }
    };
  }

  function updateScale(sketch) {
    let transform = sketch.canvas.parentElement.parentElement.style.transform;
    let scaleString = transform.split("(")[1];
    SCALE = parseFloat(scaleString.substring(1, scaleString.length - 1));
  }

  function wave(x) {
    return (
      -sliders[0].getValue() *
      Math.cos(2 * Math.PI * sliders[1].getValue() * x + sliders[2].getValue())
    );
  }

  function drawSinWave(sketch) {
    drawGraph(
      sketch,
      pos1,
      pos2,
      crd(WIDTH / 2, (pos2.y - pos1.y) / 2 + pos1.y),
      crd(50, 50)
    );

    sketch.strokeWeight(2);
    drawEquation(
      sketch,
      pos1,
      pos2,
      wave,
      crd(-10, 10),
      50,
      crd(WIDTH / 2 - pos1.x, 150),
      Math.min(0.1, 0.02 / sliders[1].getValue())
    );
  }

  function drawGraph(sketch, pos1, pos2, origin, scale) {
    // This function will draw a graph bounded by the rectangle
    // pos1 and pos2 are coordinate pairs which define the bounding box for the graph
    // origin is a coordinate pair defining where the major axises are
    // scale is a coordinate pair defining how close the minor axises are

    sketch.strokeWeight(1);
    sketch.stroke(sketch.color(GRID_COLOR));
    for (let i = origin.x; i <= pos2.x; i += scale.x) {
      sketch.line(i, pos1.y, i, pos2.y);
    }
    for (let i = origin.x; i >= pos1.x; i -= scale.x) {
      sketch.line(i, pos1.y, i, pos2.y);
    }
    for (let i = origin.y; i <= pos2.y; i += scale.y) {
      sketch.line(pos1.x, i, pos2.x, i);
    }
    for (let i = origin.y; i >= pos1.y; i -= scale.y) {
      sketch.line(pos1.x, i, pos2.x, i);
    }

    sketch.stroke(sketch.color(AXIS_COLOR));
    sketch.line(origin.x, pos1.y, origin.x, pos2.y);
    sketch.line(pos1.x, origin.y, pos2.x, origin.y);
  }

  function drawEquation(
    sketch,
    pos1,
    pos2,
    equation,
    xBounds,
    yScale,
    offset,
    step
  ) {
    // This function will draw a smooth, continous equation on the screen bounded by the rectangle
    // The pos1 and pos2 are coordinate pairs which define the bounding box for this equation to be drawn on screen
    // The equation needs to be a function which takes a number as a parameter and returns a number f(x) = y
    // The xBounds is a coordinate pair which defines from which x point it should begin and end evaulating
    // The yScale is a number which defines how much it should stretch the y value by
    // The offset is a coordinate pair defining how far the origin gets moved and in what direction
    // The step is a number which defines how many points are evaluated: lower numbers = more points

    sketch.stroke(sketch.color(LINE_COLOR));

    let min;
    let max;
    if (xBounds.x < xBounds.y) {
      min = xBounds.x;
      max = xBounds.y;
    } else {
      min = xBounds.y;
      max = xBounds.x;
    }
    let domain = max - min;
    let drawDomain = pos2.x - pos1.x;
    let drawScale = drawDomain / domain;

    let prevX = 0;
    let prevY = 0;
    let didPrevious = false;

    for (let i = min; i <= max; i += step) {
      let y = equation(i) * yScale + offset.y + pos1.y;
      let x = i * drawScale + offset.x + pos1.x;

      if (y > pos1.y && y < pos2.y) {
        if (didPrevious) {
          // General case: draws the line normally
          sketch.line(x, y, prevX, prevY);
        } else {
          // Bound -> general case: draws the line from the y bound
          let boundedY = prevY < pos1.y ? pos1.y : pos2.y;
          let slope = (prevY - y) / (prevX - x);
          if (slope != 0 && i != min) {
            let boundedX = (boundedY - prevY) / slope + prevX;
            sketch.line(x, y, boundedX, boundedY);
          }
          didPrevious = true;
        }
      } else {
        if (didPrevious) {
          // General -> bound case: draws the line up to the y bound
          let boundedY = y < pos1.y ? pos1.y : pos2.y;
          let slope = (prevY - y) / (prevX - x);
          if (slope != 0) {
            let boundedX = (boundedY - prevY) / slope + prevX;
            sketch.line(prevX, prevY, boundedX, boundedY);
          }
        }
        didPrevious = false;
      }

      prevX = x;
      prevY = y;
    }
  }

  function draw(sketch) {
    // The render function is empty because it only gets drawn on mouse updates

    // Update scale when window resizes
    updateScale(sketch);
  }

  return <Sketch setup={setup} draw={draw} />;
}

function crd(xCoord, yCoord) {
  return { x: xCoord, y: yCoord };
}

function dist(x0, y0, x1, y1) {
  let xDiff = x1 - x0;
  let yDiff = y1 - y0;
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}

/**
 * Only the necessary interactable classes are taken to keep this file small
 */

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

    this.xScale = (pos2.x - pos1.x) / (higherBound - lowerBound);
    this.yScale = (pos2.y - pos1.y) / (higherBound - lowerBound);
  }

  isOver(x, y) {
    // isOver(x, y):boolean returns true if the x & y coordinates is inside the circle
    // x is a number defining the x coordinate to check
    // y is a number defining the y coordinate to check

    x /= SCALE;
    y /= SCALE;

    let xValue = (this.value - this.lowerBound) * this.xScale + this.pos1.x;
    let yValue = (this.value - this.lowerBound) * this.yScale + this.pos1.y;

    let d = dist(x, y, xValue, yValue);

    return d < this.radius;
  }

  update(x, y) {
    // update(x, y):void updates the value of the slider based off the coordinate provided
    // x is a number defining the x coordinate of the new location
    // y is a number defining the y coordinate of the new location

    x /= SCALE;
    y /= SCALE;

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
    this.sketch.fill(BOBL_COLOR);
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
}
