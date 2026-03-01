/**
 * This is an interactive applet created by River Way for the Light QM lesson.
 * It uses p5.js to interface with WEBGL and draw polarizer to a 3D environment.
 * There are also interactable sliders to change the angles.
 */

import React from "react";
import Sketch from "react-p5";

const BKGD_COLOR = "#000000";
const AXIS_COLOR = "#555555";
const PLZR_COLOR = "#888888";
const PLZR_HLGHT = "#777777";
const PLZR_BLOCK = "#ff0000";
const PLZR_PASST = "#00ff00";
const LGHT_COLOR = "#eaff00";
const LGHT_HLGHT = "#decc0b";
const ARRW_COLOR = "#FFFFFF";
const TEXT_COLOR = "#FFFFFF";

let RADIAL_SECTORS = 50;

let SCALE = 1;

let polarizerAngle = 270;
let lightAngle = 225;
let probability = 0;
let canDrag = true;

export default function Polarizer() {
  const WIDTH = 700;
  const THEIGHT = 350;
  const BHEIGHT = 150;

  const RADIUS = 100;
  const SENSITIVITY = 1.2;

  const POL_OFFSET = RADIUS * 0.7;

  const WAVE_SPEED = 3; // How fast the wave moves across the screen
  const WAVE_BOUND = RADIUS * 2.5; // How far the wave can move until it resets
  const WAVE_MAG = 30; // How big the amplitude for the wave is
  const WAVE_WIDTH = 8; // How many arrows (on each side)
  const WAVE_SPACING = 10; // How far the arrows are from each other
  let wave_pos = WAVE_BOUND;
  let wave_editable = true;
  let wave_pass = true;
  let wave_angle = 0;
  let wave_post_angle = 0;

  let p5Object;

  /**
   * Top Sketch (3D interactable)
   */

  function topSetup(sketch, canvasParentRef) {
    p5Object = sketch
      .createCanvas(WIDTH, THEIGHT, sketch.WEBGL)
      .parent(canvasParentRef);

    sketch.angleMode(sketch.DEGREES);

    // Change the original camera angle
    let moveX = (SENSITIVITY * -100) / THEIGHT;
    let moveY = (SENSITIVITY * 50) / THEIGHT;
    p5Object._curCamera._orbit(moveX, moveY, 0);
  }

  function topDraw(sketch) {
    sketch.background(sketch.color(BKGD_COLOR));
    updateCamera(sketch);

    drawAxes(sketch);
    drawWave(sketch, lightAngle);
    drawPolarizer(sketch, polarizerAngle);
  }

  function updateCamera(sketch) {
    const mouseInCanvas =
      sketch.mouseX / SCALE < sketch.width &&
      sketch.mouseX / SCALE > 0 &&
      sketch.mouseY / SCALE < sketch.height &&
      sketch.mouseY / SCALE > 0;

    if (sketch.contextMenuDisabled !== true) {
      sketch.canvas.oncontextmenu = () => false;
      sketch._setProperty("contextMenuDisabled", true);
    }

    const scaleFactor =
      sketch.height < sketch.width ? sketch.height : sketch.width;

    if (sketch.mouseIsPressed && mouseInCanvas && canDrag) {
      const moveX = (sketch.mouseX - sketch.pmouseX) / SCALE;
      const moveY = (sketch.mouseY - sketch.pmouseY) / SCALE;
      const deltaTheta = (-SENSITIVITY * moveX) / scaleFactor;
      const deltaPhi = (SENSITIVITY * moveY) / scaleFactor;
      sketch._renderer._curCamera._orbit(deltaTheta, deltaPhi, 0);
      sketch.cursor("grab");
    } else if (mouseInCanvas) {
      sketch.cursor(sketch.HAND);
    } else {
      sketch.cursor(sketch.ARROW);
    }
  }

  function drawAxes(sketch) {
    sketch.push();

    sketch.stroke(sketch.color(AXIS_COLOR));
    sketch.strokeWeight(1);
    sketch.line(0, 1.5 * RADIUS, 0, 0, -1.5 * RADIUS, 0);
    sketch.line(1.5 * RADIUS, 0, 0, -1.5 * RADIUS, 0, 0);
    sketch.line(0, 0, 1.5 * RADIUS, 0, 0, -1.5 * RADIUS);

    sketch.pop();
  }

  function drawPolarizer(sketch, angle) {
    sketch.push();

    sketch.noStroke();
    let c = sketch.color(PLZR_COLOR);
    if (!wave_editable && wave_pass) {
      c = sketch.color(PLZR_PASST);
    } else if (!wave_editable && !wave_pass) {
      c = sketch.color(PLZR_BLOCK);
    }

    c.setAlpha(130);
    sketch.fill(c);
    sketch.translate(POL_OFFSET, 0, 0);
    sketch.rotateY(90);
    sketch.circle(0, 0, RADIUS);

    sketch.rotateZ(90 - angle);
    let beginLine = RADIUS / 2;
    let endLine = RADIUS * 0.7;
    sketch.stroke(sketch.color(ARRW_COLOR));
    sketch.strokeWeight(1);
    sketch.line(0, beginLine, 0, endLine);

    let beginTriangle = RADIUS * 0.65;
    let height = endLine - beginTriangle;

    sketch.fill(sketch.color(ARRW_COLOR));
    sketch.triangle(
      0,
      endLine,
      -height / 2,
      beginTriangle,
      height / 2,
      beginTriangle
    );

    sketch.pop();
  }

  function drawWave(sketch, angle) {
    sketch.push();
    sketch.rotateY(-90);
    sketch.rotateX(90);

    wave_pos -= WAVE_SPEED;
    if (wave_pos < -WAVE_BOUND) {
      wave_pos = WAVE_BOUND;
      wave_editable = true;
      sketch.pop();
      return;
    }

    // We don't want the user editing the wave angle while it is interacting with the polarizer
    if (wave_pos - WAVE_WIDTH * WAVE_SPACING < -POL_OFFSET && wave_editable) {
      wave_editable = false;
      wave_post_angle = polarizerAngle;
      let random_threshold = Math.cos(
        ((polarizerAngle - wave_angle) * Math.PI) / 180
      );
      random_threshold = random_threshold * random_threshold;
      wave_pass = Math.random() < random_threshold;
    } else if (wave_editable) {
      wave_angle = angle;
    }

    for (let i = -WAVE_WIDTH; i <= WAVE_WIDTH; i++) {
      let arrow_pos = wave_pos + i * WAVE_SPACING;
      if (arrow_pos < -RADIUS * 1.5 || arrow_pos > RADIUS * 1.5) {
        // If this arrow is offscreen, don't show it
        continue;
      }

      let mag = Math.sin((i * Math.PI) / WAVE_WIDTH);
      let arrow_size = 8 * mag;

      if (arrow_pos < -POL_OFFSET) {
        // If this arrow is past the polarizer and the wave passes, show it on screen
        if (wave_pass) {
          let orientation = -Math.sign(Math.sin((wave_angle * Math.PI) / 180));
          drawArrow(
            sketch,
            arrow_pos,
            orientation * wave_post_angle,
            WAVE_MAG * mag,
            arrow_size,
            sketch.color(LGHT_COLOR)
          );
        }
      } else {
        // If its not past the polarizer, just show it
        drawArrow(
          sketch,
          arrow_pos,
          wave_angle,
          WAVE_MAG * mag,
          arrow_size,
          sketch.color(LGHT_COLOR)
        );
      }
    }

    sketch.pop();
  }

  function drawArrow(sketch, pos, angle, mag, size, color) {
    sketch.push();

    sketch.stroke(color);
    sketch.fill(color);
    sketch.translate(0, pos, 0);
    sketch.rotateY(angle);
    sketch.line(0, 0, 0, mag, 0, 0);
    sketch.translate(mag, 0, 0);
    sketch.triangle(0, size / 2, 0, -size / 2, size, 0);

    sketch.pop();
  }

  /**
   * Bottom Sketch (Sliders & text)
   */

  const TEXT_X = 210;
  const TEXT_Y = 50;

  let filterSlider;
  let lightSlider;

  function bottomSetup(sketch, canvasParentRef) {
    sketch.createCanvas(WIDTH, BHEIGHT).parent(canvasParentRef);

    extendMouseAPI(sketch);

    sketch.background(sketch.color(BKGD_COLOR));
    sketch.backgroundColor = sketch.color(BKGD_COLOR);
    sketch.textFont("cmunrm");

    filterSlider = new ArcSlider(sketch, 600, 70, 30, 0, 360, polarizerAngle);
    filterSlider.setColors(PLZR_COLOR, PLZR_HLGHT, AXIS_COLOR);
    filterSlider.onMove = () => {
      polarizerAngle = filterSlider.value;
      drawInfo(sketch);
    };

    lightSlider = new ArcSlider(sketch, 100, 70, 30, 0, 360, lightAngle);
    lightSlider.setColors(LGHT_COLOR, LGHT_HLGHT, AXIS_COLOR);
    lightSlider.onMove = () => {
      lightAngle = lightSlider.value;
      drawInfo(sketch);
    };

    drawInfo(sketch);
    addCameraEvents(filterSlider);
    addCameraEvents(lightSlider);
  }

  function addCameraEvents(slider) {
    // The top canvas's camera shouldn't move when these sliders are being moved
    slider.onGrab = () => {
      canDrag = false;
    };
    slider.onRelease = () => {
      canDrag = true;
    };
  }

  function drawInfo(sketch) {
    // Wipe clean
    sketch.fill(sketch.color(BKGD_COLOR));
    sketch.rect(TEXT_X, 0, 300, 150);

    drawKets(sketch);
    drawProbability(sketch, TEXT_X + 50, TEXT_Y + 50);
  }

  function drawProbability(sketch, x, y) {
    sketch.text("P (", x, y);
    let passColor = sketch.color("#00ff15");
    sketch.fill(passColor);
    sketch.text("pass", x + 30, y);
    sketch.fill(sketch.color(TEXT_COLOR));

    probability = Math.cos(sketch.radians(polarizerAngle - lightAngle));
    probability = probability * probability;
    sketch.text(") = " + (probability * 100).toFixed(1) + "%", x + 70, y);
  }

  function drawKets(sketch) {
    drawKet(sketch, TEXT_X, TEXT_Y, lightAngle, LGHT_COLOR);

    sketch.textSize(21);
    sketch.noStroke();
    sketch.fill(sketch.color(TEXT_COLOR));
    sketch.text("=", TEXT_X + 51, TEXT_Y + 1);

    drawCoefficent(sketch, TEXT_X + 70, TEXT_Y, polarizerAngle);
    sketch.text("+", TEXT_X + 170, TEXT_Y + 1);
    drawCoefficent(sketch, TEXT_X + 190, TEXT_Y, polarizerAngle + 90);
  }

  function drawCoefficent(sketch, x, y, angle) {
    sketch.push();

    sketch.textAlign(sketch.LEFT);
    let amp = Math.cos(sketch.radians(angle - lightAngle));
    let text = amp.toFixed(2);
    let offset = 8;
    if (text.includes("-")) {
      offset -= 7;
    }
    sketch.text(text, x + offset, y);
    drawKet(sketch, x + 50, y, angle, PLZR_COLOR);

    sketch.pop();
  }

  function drawKet(sketch, x, y, angle, color) {
    sketch.push();

    sketch.noStroke();
    sketch.fill(sketch.color(TEXT_COLOR));
    sketch.textSize(21);
    sketch.text("|", x, y);
    sketch.text("⟩", x + 36, y);

    let centerX = x + 21;
    let centerY = y - 5;
    const VEC_SIZE = 12;
    let dirX = Math.cos(sketch.radians(angle));
    let dirY = Math.sin(sketch.radians(angle));
    let base = sketch.createVector(
      centerX + VEC_SIZE * -dirX,
      centerY + VEC_SIZE * -dirY
    );
    let head = sketch.createVector(VEC_SIZE * 2 * dirX, VEC_SIZE * 2 * dirY);
    Drawing.arrow(sketch, base, head, sketch.color(color), 5);

    sketch.pop();
  }

  function bottomDraw(sketch) {
    // Nothing happens on the render function because all of the interactives
    // update on mouseAPI updates

    // Update scale when the window resizes
    updateScale(sketch);
  }

  function updateScale(sketch) {
    let transform = sketch.canvas.parentElement.parentElement.style.transform;
    let scaleString = transform.split("(")[1];
    SCALE = parseFloat(scaleString.substring(1, scaleString.length - 1));
  }

  return [
    <Sketch key="polarizerSketch1" setup={topSetup} draw={topDraw} />,
    <Sketch key="polarizerSketch2" setup={bottomSetup} draw={bottomDraw} />,
  ];
}

/**
 * Relevant code from p5.api.js, drawing.js, and ui.js
 * The irrelevant functions/classes have been removed to
 * make this js file smaller
 */

let eventArray = [[], [], [], [], [], [], []];

function extendMouseAPI(sketch) {
  function eventCall(thunkArray) {
    for (let i = 0; i < thunkArray.length; i++) {
      let [instance, thunk] = thunkArray[i];
      if (instance == undefined) thunk();
      else thunk.call(instance);
    }
  }

  sketch.mousePressed = () => eventCall(eventArray[0]);
  sketch.mouseReleased = () => eventCall(eventArray[1]);
  sketch.mouseMoved = () => eventCall(eventArray[2]);
  sketch.mouseDragged = () => eventCall(eventArray[3]);
  sketch.mouseClicked = () => eventCall(eventArray[4]);
  sketch.doubleClicked = () => eventCall(eventArray[5]);
  sketch.mouseWheel = () => eventCall(eventArray[6]);
}

const ThunkType = {
  MousePressed: 0,
  MouseReleased: 1,
  MouseMoved: 2,
  MouseDragged: 3,
  MouseClicked: 4,
  DoubleClicked: 5,
  MouseWheel: 6,
};

function registerThunk(thunkType, thunk, instance) {
  if (instance == undefined) eventArray[thunkType].push([undefined, thunk]);
  else eventArray[thunkType].push([instance, thunk]);
}

class Interactable {
  /* Abstract function _doDraw()   should be implemented by children classes */
  /* Abstract function clean()     should be implemented by children classes */
  /* Abstract function doesHover() should be implemented by children classes */
  /* Abstract function hover()     should be implemented by children classes */
  /* Abstract function unHover()   should be implemented by children classes */
  /* Abstract function grab()      should be implemented by children classes */
  /* Abstract function release()   should be implemented by children classes */
  /* Abstract function move()      should be implemented by children classes */

  /* Interface function onPreDraw()  may be implemented by calling function */
  /* Interface function onPostDraw() may be implemented by calling function */
  /* Interface function onHover()    may be implemented by calling function */
  /* Interface function onUnHover()  may be implemented by calling function */
  /* Interface function onRelease()  may be implemented by calling function */
  /* Interface function onGrab()     may be implemented by calling function */
  /* Interface function onMove()     may be implemented by calling function */
  /* Interface function onPress()    may be implemented by calling function */

  constructor(sketch) {
    this.sketch = sketch;
    this.isHover = false;
    this.isGrab = false;

    registerThunk(ThunkType.MouseDragged, this.checkMove, this);
    registerThunk(ThunkType.MousePressed, this.checkGrab, this);
    registerThunk(ThunkType.MouseReleased, this.checkRelease, this);
    registerThunk(ThunkType.MouseMoved, this.checkHover, this);
  }

  checkMove() {
    if (this.isGrab) {
      let previousAngleMode = this.sketch._angleMode;
      this.sketch.push();

      if (this.child.onPreDraw != undefined) this.child.onPreDraw();
      if (this.child.clean != undefined) this.child.clean();

      if (this.child.move != undefined) this.child.move();
      if (this.child.onMove != undefined) this.child.onMove();

      if (this.child._doDraw != undefined) this.child._doDraw();
      if (this.child.onPostDraw != undefined) this.child.onPostDraw();

      this.sketch.pop();
      this.sketch.angleMode(previousAngleMode);
    }
  }

  checkGrab() {
    if (this.isHover) {
      this.isGrab = true;
      if (this.child.grab != undefined) this.child.grab();
      if (this.child.onGrab != undefined) this.child.onGrab();
      if (this.child.onPress != undefined) this.child.onPress();
    }
  }

  checkRelease() {
    if (this.isGrab) {
      this.isGrab = false;
      this.checkHover();
      if (this.child.release != undefined) this.child.release();
      if (this.child.onRelease != undefined) this.child.onRelease();
    }
  }

  checkHover(debug) {
    if (this.sketch.mouseIsPressed) return;

    let pHover = this.isHover;
    if (this.child.doesHover != undefined)
      this.isHover = this.child.doesHover();
    if (debug != undefined) console.log(pHover, this.isHover);
    if (pHover != this.isHover) {
      if (this.isHover) {
        if (this.child.hover != undefined) this.child.hover();
        if (this.child.onHover != undefined) this.child.onHover();
      } else {
        if (this.child.unHover != undefined) this.child.unHover();
        if (this.child.onUnHover != undefined) this.child.onUnHover();
      }
    }
  }

  draw() {
    let previousAngleMode = this.sketch._angleMode;
    this.sketch.push();

    if (this.child.onPreDraw != undefined) this.child.onPreDraw();
    if (this.child.clean != undefined) this.child.clean();
    if (this.child._doDraw != undefined) this.child._doDraw();
    if (this.child.onPostDraw != undefined) this.child.onPostDraw();

    this.sketch.pop();
    this.sketch.angleMode(previousAngleMode);
  }

  setChild(child) {
    this.child = child;
    this.draw();
  }
}

class Bobble extends Interactable {
  constructor(sketch, x, y, radius) {
    super(sketch);
    this.sketch = sketch;
    this.x = x;
    this.y = y;
    this.radius = radius;

    this.normalColor = this.sketch.color(0, 230, 226);
    this.hoverColor = this.sketch.color(0, 176, 173);
    this.strokeColor = this.sketch.color(0);

    super.setChild(this);
  }

  doesHover() {
    let mx = this.sketch.mouseX / SCALE;
    let my = this.sketch.mouseY / SCALE;
    return this.radius > Math.hypot(this.x - mx, this.y - my) - 3;
  }

  hover() {
    this.sketch.cursor(this.sketch.HAND);
    this.draw();
  }

  unHover() {
    this.sketch.cursor(this.sketch.ARROW);
    this.draw();
  }

  clean() {
    this.sketch.noStroke();
    this.sketch.fill(this.sketch.backgroundColor);
    this.sketch.ellipseMode(this.sketch.CENTER);
    this.sketch.circle(this.x, this.y, 2 * this.radius + 10);
  }

  _doDraw() {
    this.sketch.stroke(this.strokeColor);
    this.sketch.strokeWeight(1);
    this.sketch.fill(this.getColor());
    this.sketch.circle(this.x, this.y, 2 * this.radius);
  }

  grab() {
    this.sketch.cursor("grab");
  }

  move() {
    this.x = this.sketch.mouseX;
    this.y = this.sketch.mouseY;
  }

  release() {
    this.sketch.cursor(this.sketch.ARROW);
    this.draw();
  }

  getColor() {
    if (this.isHover) {
      return this.hoverColor;
    }
    return this.normalColor;
  }

  setColors(normalColor, hoverColor, outlineColor) {
    if (normalColor != undefined) this.normalColor = normalColor;
    if (hoverColor != undefined) this.hoverColor = hoverColor;
    if (outlineColor != undefined) this.strokeColor = outlineColor;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }
}

class ArcSlider {
  /* Interface function onMove()      may be implemented by calling function */
  /* Interface function onPreDraw()   may be implemented by calling function */
  /* Interface function onPostDraw()  may be implemented by calling function */
  /* Interface function onHover()     may be implemented by calling function */
  /* Interface function onUnHover()   may be implemented by calling function */
  /* Interface function onRelease()   may be implemented by calling function */

  constructor(sketch, x, y, radius, beginAngle, endAngle, startAngle) {
    this.beginAngle = beginAngle == undefined ? 0 : beginAngle;
    this.endAngle = endAngle == undefined ? 360 : endAngle;
    this.value = startAngle == undefined ? beginAngle : startAngle;
    this.sketch = sketch;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.bobbleRadius = 8;
    this.lineColor = "#000000";

    let [bobbleX, bobbleY] = this.getBobblePos();
    this.bobble = new Bobble(sketch, bobbleX, bobbleY, this.bobbleRadius);

    // Override bobble methods. We will do cleaning ourselves
    this.bobble.clean = undefined;
    this.bobble.move = () => this.move();
    this.bobble.onPreDraw = () => this.draw();

    // Pass triggers to calling function
    this.bobble.onHover = () => {
      if (this.onHover != undefined) this.onHover();
    };
    this.bobble.onUnHover = () => {
      if (this.onUnHover != undefined) this.onUnHover();
    };
    this.bobble.onRelease = () => {
      if (this.onRelease != undefined) this.onRelease();
    };
    this.bobble.onGrab = () => {
      if (this.onRelease != undefined) this.onGrab();
    };

    // Re-draw everything now that the plumbing is correct
    this.draw();
    this.bobble.draw();
  }

  move() {
    let distance = Math.hypot(
      this.x - this.sketch.mouseX / SCALE,
      this.y - this.sketch.mouseY / SCALE
    );
    this.value = this.sketch.degrees(
      Math.acos((this.x - this.sketch.mouseX / SCALE) / distance)
    );
    if (this.y - this.sketch.mouseY / SCALE < 0) this.value *= -1;
    this.value += 180;

    let range = Math.abs(this.beginAngle - this.endAngle);
    if (range < 360) {
      if (this.beginAngle > this.endAngle) {
        if (this.value < this.beginAngle && this.value > this.endAngle) {
          let middleAngle = (this.beginAngle + this.endAngle) / 2;
          this.value =
            this.value < middleAngle ? this.endAngle : this.beginAngle;
        }
      } else {
        if (this.value < this.beginAngle || this.value > this.endAngle) {
          let middleAngle = (this.beginAngle + this.endAngle) / 2 + 180;
          if (middleAngle < 0) middleAngle += 360;
          else if (middleAngle >= 360) middleAngle -= 360;

          // This will be broken for other angles, but Ian is to blame
          if (this.value > this.endAngle) this.value -= 360;

          this.value =
            this.value + 360 - this.endAngle > middleAngle + 360 - this.endAngle
              ? this.beginAngle
              : this.endAngle;
        }
      }
    }

    this.updateBobblePosition();

    if (this.onMove != undefined) this.onMove();
  }

  clean() {
    this.sketch.noStroke();
    this.sketch.fill(this.sketch.backgroundColor);
    this.sketch.ellipseMode(this.sketch.CENTER);
    this.sketch.circle(
      this.x,
      this.y,
      2 * (this.radius + this.bobbleRadius + 2)
    );
  }

  draw() {
    if (this.onPreDraw != undefined) this.onPreDraw();

    this.sketch.angleMode(this.sketch.DEGREES);
    this.sketch.push();

    if (this.clean != undefined) this.clean();

    // Draw arc
    this.sketch.stroke(this.sketch.color(this.lineColor));
    this.sketch.strokeWeight(1);
    this.sketch.noFill();
    this.sketch.arc(
      this.x,
      this.y,
      2 * this.radius,
      2 * this.radius,
      this.beginAngle,
      this.endAngle
    );

    this.sketch.pop();

    if (this.onPostDraw != undefined) this.onPostDraw();
  }

  updateBobblePosition() {
    this.bobbleX =
      this.radius * Math.cos(this.sketch.radians(this.value)) + this.x;
    this.bobbleY =
      this.radius * Math.sin(this.sketch.radians(this.value)) + this.y;
    this.bobble.setPosition(this.bobbleX, this.bobbleY);
  }

  getBobblePos() {
    let x = this.radius * Math.cos(this.sketch.radians(this.value)) + this.x;
    let y = this.radius * Math.sin(this.sketch.radians(this.value)) + this.y;
    return [x, y];
  }

  update() {
    // Simply refreshes the coordinates and re-draws the slider and bobble
    this.updateBobblePosition();
    this.bobble.draw();
  }

  setColors(normalColor, hoverColor, lineColor) {
    this.bobble.strokeColor = this.sketch.color(lineColor);
    this.bobble.setColors(normalColor, hoverColor);
    this.lineColor = lineColor;
    this.update();
  }

  getValue() {
    return this.value;
  }

  setValue(val) {
    if (val < this.beginAngle) val = this.beginAngle;
    else if (val > this.endAngle) val = this.endAngle;
    this.value = val;
    this.update();
  }
}

class Drawing {
  static arrow(sketch, base, vector, color, size) {
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
}
