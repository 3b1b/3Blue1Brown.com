/**
 * This is a helper library full of auxillary functions to draw winding machines
 * for multiple different applets
 */

const BKGD_COLOR = "#000000";
const AXIS_COLOR = "#b8b8b8";
const WAVE_COLOR = "#eaff00";
const MASS_COLOR = "#ff6363";

function evaluateEquation(frequencies, x) {
  // Returns cos(2pi f1) + cos(2pi f2) + ...
  // The result will be normalized between 0 and 1
  let sum = 0;
  for (let i = 0; i < frequencies.length; i++) {
    sum += (Math.cos(2 * Math.PI * frequencies[i] * x));
  }
  // Normalize outputs
  return sum / frequencies.length;
}

function drawArrow(sketch, base, vector, color, size) {
  // Base and vector need to be p5 vectors
  sketch.push();
  sketch.stroke(color);
  sketch.fill(color);
  sketch.translate(base.x, base.y);
  sketch.line(0, 0, vector.x, vector.y);
  sketch.rotate(vector.heading());
  sketch.translate(vector.mag() - size, 0);
  sketch.triangle(0, size / 2, 0, -size / 2, size, 0);
  sketch.pop();
}

function drawJustifiedAxes(sketch, origin, size, tick, vertical_offset) {
  // Draws the axes left justified (for drawGraph)
  vertical_offset = vertical_offset == undefined ? 0 : vertical_offset;
  sketch.push();

  let beginX = sketch.createVector(origin.x - GRAPH_EDGE, origin.y);
  let endX = sketch.createVector(size.x + GRAPH_EDGE * 3, 0);
  drawArrow(sketch, beginX, endX, AXIS_COLOR, GRAPH_EDGE);

  let beginY = sketch.createVector(
    origin.x,
    origin.y + GRAPH_EDGE + vertical_offset
  );
  let endY = sketch.createVector(
    0,
    -(size.y + GRAPH_EDGE * 3 + vertical_offset)
  );
  drawArrow(sketch, beginY, endY, AXIS_COLOR, GRAPH_EDGE);

  // Draw horizontal ticks
  sketch.stroke(sketch.color(AXIS_COLOR));
  for (let i = 0; i < GRAPH_LENGTH; i += tick) {
    let x = (i / GRAPH_LENGTH) * size.x + origin.x;
    sketch.line(x, origin.y - 5, x, origin.y + 5);
  }

  sketch.pop();
}

const GRAPH_EDGE = 10;
const STEP = 3;
const GRAPH_LENGTH = 4.4; // How many seconds to have on screen

export const drawGraph = (sketch, frequencies, origin, size) => {
  // Takes in an array of frequencies and draws a superposition sine wave
  // Origin is an (x,y) pair of the origin in the canvas
  // Size is an (x,y) pair of the dimensions of the graph

  sketch.push();

  // Wipe clean
  sketch.fill(sketch.color(BKGD_COLOR));
  sketch.rect(
    origin.x - GRAPH_EDGE - 1,
    origin.y + size.y + GRAPH_EDGE - 1,
    size.x + GRAPH_EDGE * 3 + 1,
    -(2 * size.y + GRAPH_EDGE * 3 + 1)
  );

  sketch.strokeWeight(2);

  drawJustifiedAxes(
    sketch,
    origin,
    {x: size.x, y: 0.6 * size.y},
    0.25,
    size.y / 2
  );

  sketch.stroke(sketch.color(WAVE_COLOR));

  let py = origin.y + evaluateEquation(frequencies, 0) * (-size.y / 2 - GRAPH_EDGE);

  // Draw equation
  for (let x = origin.x + STEP; x < origin.x + size.x; x += STEP) {
    let fx = evaluateEquation(
      frequencies,
      ((x - origin.x) / size.x) * GRAPH_LENGTH
    );

    let y = origin.y + fx * (-size.y / 2 - GRAPH_EDGE);
    sketch.line(x, y, x - STEP, py);
    py = y;
  }

  sketch.pop();
};

const MINOR_COLOR = "#166263";
const MAJOR_COLOR = "#18c5c7";

const WINDER_WIDTH = 2.1; // How many units this winder graph is in size
const MINOR_GRIDLINE = 0.5;
const MAJOR_GRIDLINE = 1;

function drawCenteredAxes(sketch, origin, size) {
  function gridline(offset) {
    let x = origin.x + (offset / WINDER_WIDTH) * size;
    sketch.line(x, origin.y + size, x, origin.y - size);
    let y = origin.y + (offset / WINDER_WIDTH) * size;
    sketch.line(origin.x + size, y, origin.x - size, y);
  }

  sketch.push();

  // Draw minor gridlines
  sketch.stroke(sketch.color(MINOR_COLOR));
  let offset = MINOR_GRIDLINE;
  while (offset < WINDER_WIDTH) {
    gridline(offset);
    gridline(-offset);
    offset += MINOR_GRIDLINE;
  }

  // Draw major gridlines
  sketch.stroke(sketch.color(MAJOR_COLOR));
  offset = MAJOR_GRIDLINE;
  while (offset < WINDER_WIDTH) {
    gridline(offset);
    gridline(-offset);
    offset += MAJOR_GRIDLINE;
  }

  // Draw axes
  sketch.stroke(sketch.color("white"));
  gridline(0);

  sketch.pop();
}

const ANGLE_DELTA = 10;
function drawUnitCircle(sketch, origin, size) {
  function drawDash(length, radius) {
    let x = origin.x + (radius / WINDER_WIDTH) * size;
    sketch.line(x, origin.y + length, x, origin.y - length);
  }

  sketch.push();

  sketch.stroke(sketch.color("white"));

  for (let angle = 0; angle < 360; angle += ANGLE_DELTA) {
    drawDash(2, 1);
    sketch.translate(origin.x, origin.y);
    sketch.rotate(ANGLE_DELTA);
    sketch.translate(-origin.x, -origin.y);
  }

  sketch.pop();
}

function evaluateWinder(frequencies, winding_freq, x) {
  let g = evaluateEquation(frequencies, x);
  let gx = g * Math.cos(-2 * Math.PI * winding_freq * x);
  let gy = g * Math.sin(-2 * Math.PI * winding_freq * x);
  return { gx, gy };
}

const WINDER_STEP = 0.005;
function drawWire(sketch, frequencies, winding_freq, origin, size) {
  let { gx, gy } = evaluateWinder(frequencies, winding_freq, 0);
  let px = gx;
  let py = gy;
  size *= 0.95;

  // Draw equation
  for (let x = WINDER_STEP; x < GRAPH_LENGTH; x += WINDER_STEP) {
    let { gx, gy } = evaluateWinder(frequencies, winding_freq, x);

    sketch.line(
      px * size + origin.x,
      py * size + origin.y,
      gx * size + origin.x,
      gy * size + origin.y
    );

    px = gx;
    py = gy;
  }
}

function centerMass(frequencies, winding_freq) {
  const N = 100;
  let centerX = 0;
  let centerY = 0;

  for (let i = 0; i < N; i++) {
    let x = (i / N) * GRAPH_LENGTH;
    let { gx, gy } = evaluateWinder(frequencies, winding_freq, x);
    centerX += gx;
    centerY += gy;
  }

  centerX /= N;
  centerY /= N;
  return { centerX, centerY };
}

function drawCenterMass(sketch, frequencies, winding_freq, origin, size) {
  let { centerX, centerY } = centerMass(frequencies, winding_freq);
  sketch.noStroke();
  sketch.fill(sketch.color(MASS_COLOR));
  sketch.circle(
    origin.x + centerX * size * 0.95,
    origin.y + centerY * size * 0.95,
    10
  );
}

let SCALE = 1;
function updateScale(sketch) {
  let transform = sketch.canvas.parentElement.parentElement.style.transform;
  let scaleString = transform.split("(")[1];
  SCALE = parseFloat(scaleString.substring(1, scaleString.length - 1));
}

function getOpacity(sketch, frequencies) {
  function sum(frequencies) {
    let sum = 0;
    for (let i = 0; i < frequencies.length; i++) {
      sum += frequencies[i];
    }
    return sum;
  }

  let mergedFreq = sum(frequencies);
  mergedFreq = (mergedFreq > 0.1) ? 0.1 : mergedFreq;
  return sketch.lerp(0.3, 1, mergedFreq / 0.1);
}

export const drawWinder = (sketch, frequencies, winding_freq, origin, size) => {
  // Takes in an array of frequencies and draws the winded up graph
  // Origin is an (x,y) pair of the origin in the canvas
  // Size is the number of pixels for how large the graph is
  //    the distance in pixels from origin to edge
  sketch.push();

  // Wipe clean
  sketch.fill(sketch.color(BKGD_COLOR));
  sketch.rectMode(sketch.RADIUS);
  sketch.rect(origin.x, origin.y, size, size);

  sketch.strokeWeight(1);
  drawCenteredAxes(sketch, origin, size);
  drawUnitCircle(sketch, origin, size);

  sketch.strokeWeight(2);
  let wireColor = sketch.color(WAVE_COLOR);
  // We would like the opacity to be 0.3 when winding frequency is near 0
  // But the opacity should be 1 when winding frequency is >= 0.1
  let opacity = getOpacity(sketch, frequencies);
  wireColor.setAlpha(255 * opacity);
  sketch.stroke(wireColor);
  drawWire(sketch, frequencies, winding_freq, origin, size);

  drawCenterMass(sketch, frequencies, winding_freq, origin, size);

  sketch.pop();
};

// Since there are multiple applets storing their data here,
// We need to have a key to access the proper transform
let fourierTransforms = [];
let fourierFrequencies = [];
export const calculateFourier = (key, frequencies) => {
  let index = 0;
  let fourierTransform = [];
  for (let x = 0; x < GRAPH_LENGTH; x += WINDER_STEP) {
    let { centerX, centerY } = centerMass(frequencies, x);
    fourierTransform[index] = centerX;
    index++;
  }

  fourierTransforms[key] = fourierTransform;
  fourierFrequencies = frequencies;
};

function drawFourierGraph(sketch, origin, size, key) {
  let fourierTransform = fourierTransforms[key];
  let py = -fourierTransform[0] * size.y * 2 + origin.y;

  for (let i = 1; i < fourierTransform.length; i++) {
    let x = (i / fourierTransform.length) * size.x + origin.x;
    let px = ((i - 1) / fourierTransform.length) * size.x + origin.x;
    let y = -fourierTransform[i] * size.y * 2 + origin.y;

    if (
      y > origin.y - size.y &&
      py > origin.y - size.y &&
      y < origin.y + size.y &&
      py < origin.y + size.y
    ) {
      // Only draw inside of the boundary
      sketch.line(x, y, px, py);
    }

    py = y;
  }
}

function drawFourierBobble(sketch, origin, size, frequencies) {
  sketch.fill(sketch.color("white"));
  sketch.noStroke();

  let winding_freq = ((previousMouse - origin.x) / size.x) * GRAPH_LENGTH;
  winding_freq = Math.min(Math.max(winding_freq, 0), GRAPH_LENGTH);
  let { centerX, centerY } = centerMass(frequencies, winding_freq);

  let drawingX = (winding_freq / GRAPH_LENGTH) * size.x + origin.x;
  let drawingY = -centerX * size.y * 2 + origin.y;
  drawingY = Math.min(Math.max(drawingY, origin.y - size.y), origin.y + size.y);

  sketch.circle(drawingX, drawingY, 10);

  return winding_freq;
}

let previousMouse = 563.6;
const LAG_FACTOR = 150;
export const drawFourier = (
  sketch,
  origin,
  size,
  frequencies,
  key,
  deltaTime
) => {
  // Draws the fourier graph from the calculated fourier transform earlier
  // Origin is an (x,y) pair of the origin in the canvas
  // Size is an (x,y) pair of the dimensions of the graph
  // Returns the winding frequency that the mouse is over
  sketch.push();
  updateScale(sketch);

  let mouseX = sketch.mouseX / SCALE;
  let mouseY = sketch.mouseY / SCALE;
  if (deltaTime > 1000) deltaTime = 1000;

  // Wipe clean
  sketch.fill(sketch.color(BKGD_COLOR));
  let upperCorner = {
    x: origin.x - GRAPH_EDGE - 1,
    y: origin.y - size.y - GRAPH_EDGE * 2 - 1,
  };
  let boxSize = {
    x: size.x + GRAPH_EDGE * 3 + 3,
    y: size.y * 2 + GRAPH_EDGE * 3 + 3,
  };
  sketch.rect(upperCorner.x, upperCorner.y, boxSize.x, boxSize.y);

  if (
    mouseX > upperCorner.x &&
    mouseX < upperCorner.x + boxSize.x &&
    mouseY > upperCorner.y &&
    mouseY < upperCorner.y + boxSize.y
  ) {
    // Smooth the movement of the bobble
    previousMouse += ((mouseX - previousMouse) * deltaTime) / LAG_FACTOR;
  }

  sketch.strokeWeight(2);
  drawJustifiedAxes(sketch, origin, size, 1, size.y);

  sketch.stroke(sketch.color(MASS_COLOR));
  drawFourierGraph(sketch, origin, size, key);

  let winding_freq = drawFourierBobble(sketch, origin, size, frequencies);

  sketch.pop();

  return winding_freq;
};
