/**
 * This is an interactive applet created by River Way for the Hyperdarts lesson.
 * It uses p5.js to interface with a canvas to animate the game of darts
 */

import React from "react";
import Sketch from "react-p5";

const WIDTH = 700;
const HEIGHT = 700;
const EDGE = 0.9;
const ANIM_TIME = 15;  // 60ths of a second
const WAIT_TIME = 5;

export default function PyramidPlot() {
  const LINE_COLOR = "#FFFFFF";
  const BULL_COLOR = "#db523d";
  const BACK_COLOR = "#1c5978";
  const MISS_COLOR = "#990000";

  let canThrow = true;
  let dartX = 0;
  let dartY = 0;
  let gameRadius = 1;
  let nextGameRadius = 1;
  let circleAlpha = 1;
  let gameScore = 0;
  let scoreColor;
  let scoreSize = 0;

  let dartThrowAnimation;

  let GLOBAL_ALPHA = 1;

  // This scale is used for the transform between the mouse movements
  let SCALE = 1;

  function setup(sketch, canvasParentRef) {
    sketch.createCanvas(WIDTH, HEIGHT).parent(canvasParentRef);
    sketch.angleMode(sketch.DEGREES);
    scoreColor = sketch.color(LINE_COLOR);

    sketch.mouseReleased = () => {
      if (sketch.mouseButton == sketch.LEFT) {
        throwDart(sketch);
      }
    };

    dartThrowAnimation = new AnimationSequence(false, finishThrow);
  }

  function updateScale(sketch) {
    // Get CSS scale transform information from parent of parent element
    let transform = sketch.canvas.parentElement.parentElement.style.transform;
    let scaleString = transform.split("(")[1];
    scaleString = scaleString.substring(0, scaleString.length - 1);
    if (!scaleString.includes(".")) {
      scaleString += ".0";
    }
    SCALE = parseFloat(scaleString);
  }

  function throwDart(sketch) {
    if (
      sketch.mouseX < 0 ||
      sketch.mouseY < 0 ||
      sketch.mouseX / SCALE > WIDTH ||
      sketch.mouseY / SCALE > HEIGHT
    ) {
      // Outside of the applet
      return;
    }

    if (canThrow) {
      let { cx, cy } = transformMouseCoords(sketch.mouseX, sketch.mouseY);
      dartX = cx;
      dartY = cy;
      gameScore++;
      canThrow = false;
      dartThrowAnimation.removeAllClips();

      if (Math.hypot(dartX, dartY) > gameRadius) {
        // Lost the game
        createLostGameAnimation();
      } else {
        createDartAnimation();
      }

      dartThrowAnimation.restart();
    }
  }

  function createDartAnimation() {
    let lineFormatting = (sketch) => {
      sketch.strokeWeight(0.01);
      let lineColor = sketch.color(LINE_COLOR);
      lineColor.setAlpha(GLOBAL_ALPHA * 255);
      sketch.stroke(lineColor);
    };

    // Line to dart throw
    let hlineAnimation = Animations.lineAnimation(
      0,
      0,
      dartX,
      dartY,
      lineFormatting
    );
    dartThrowAnimation.registerAnimation(ANIM_TIME, hlineAnimation, "cubic");
    dartThrowAnimation.registerFreezeFrame(WAIT_TIME);

    // Chord
    let hDistance = Math.hypot(dartX, dartY);
    let halfChordDistance = Math.sqrt(
      gameRadius * gameRadius - hDistance * hDistance
    );
    let chordX = (dartX / hDistance) * halfChordDistance;
    let chordY = (dartY / hDistance) * halfChordDistance;
    let halfChordAnimation = Animations.lineAnimation(
      dartX,
      dartY,
      -chordY + dartX,
      chordX + dartY,
      lineFormatting
    );
    let chordAnimation = Animations.lineAnimation(
      dartX,
      dartY,
      chordY + dartX,
      -chordX + dartY,
      lineFormatting
    );

    // Right angle
    let angleDistance = Math.min(halfChordDistance / 2, 0.05);
    let startPoint = crd(
      dartX - (dartX / hDistance) * angleDistance,
      dartY - (dartY / hDistance) * angleDistance
    );
    let midPoint = crd(
      startPoint.x + (chordY / halfChordDistance) * angleDistance,
      startPoint.y - (chordX / halfChordDistance) * angleDistance
    );
    let endPoint = crd(
      dartX + (chordY / halfChordDistance) * angleDistance,
      dartY - (chordX / halfChordDistance) * angleDistance
    );
    let rightAngleAnimation = Animations.zigzagAnimation(
      [startPoint, midPoint, endPoint],
      lineFormatting
    );

    // Merge chord + right angle
    let hlineFreeze = Animations.freeze(hlineAnimation, 1);
    chordAnimation = Animations.overlap([
      hlineFreeze,
      halfChordAnimation,
      chordAnimation,
      rightAngleAnimation,
    ]);
    dartThrowAnimation.registerAnimation(ANIM_TIME, chordAnimation, "cubic");
    dartThrowAnimation.registerFreezeFrame(WAIT_TIME);

    // Fade chord + right angle
    let fadeChordAnimation = Animations.freeze(chordAnimation, 1);
    fadeChordAnimation = Animations.fadeAnimation(fadeChordAnimation);

    // Translate chord to center
    let translateChordAnimation = Animations.lineAnimation(
      -chordY + dartX,
      chordX + dartY,
      chordY + dartX,
      -chordX + dartY,
      lineFormatting
    );
    translateChordAnimation = Animations.freeze(translateChordAnimation, 1);
    translateChordAnimation = Animations.translateAnimation(
      translateChordAnimation,
      -dartX,
      -dartY
    );

    // Merge fade + translate
    let chordToCenterAnimation = Animations.overlap([
      fadeChordAnimation,
      translateChordAnimation,
    ]);
    dartThrowAnimation.registerAnimation(ANIM_TIME, chordToCenterAnimation, "cubic");
    dartThrowAnimation.registerFreezeFrame(WAIT_TIME);

    // Shrink circle
    translateChordAnimation = Animations.freeze(translateChordAnimation, 1);
    let circleFormatting = (sketch) => {
      sketch.noStroke();
      sketch.fill(sketch.color(BULL_COLOR));
      circleAlpha = 0.5;
    };
    nextGameRadius = halfChordDistance;
    let shrinkCircleAnimation = Animations.circleRadiusAnimation(
      gameRadius,
      halfChordDistance,
      circleFormatting
    );
    let newCircleAnimation = Animations.overlap([
      shrinkCircleAnimation,
      translateChordAnimation,
    ]);
    dartThrowAnimation.registerAnimation(ANIM_TIME, newCircleAnimation, "cubic");
    dartThrowAnimation.registerFreezeFrame(WAIT_TIME);

    // Fade old circle
    translateChordAnimation = Animations.fadeAnimation(translateChordAnimation);
    shrinkCircleAnimation = Animations.freeze(shrinkCircleAnimation, 1);
    let updateAlpha = (sketch, progress) => {
      circleAlpha = (1 - progress) * 0.5;
      if (progress == 1) {
        gameRadius = nextGameRadius;
        circleAlpha = 1;
      }
    };
    let completeCircleAnimation = Animations.overlap([
      shrinkCircleAnimation,
      translateChordAnimation,
      updateAlpha,
    ]);
    dartThrowAnimation.registerAnimation(ANIM_TIME, completeCircleAnimation, "cubic");
    dartThrowAnimation.registerFreezeFrame(WAIT_TIME);
  }

  function createLostGameAnimation() {
    let crossFormatting = (sketch) => {
      sketch.strokeWeight(0.01);
      let crossColor = sketch.color(MISS_COLOR);
      crossColor.setAlpha(GLOBAL_ALPHA * 255);
      sketch.stroke(crossColor);
      sketch.noFill();
    };
    let arcFormatting = (sketch) => {
      crossFormatting(sketch);
      sketch.translate(dartX, dartY);
    };

    // Cross
    let crossRadius = 0.04;
    let arcAnimation = Animations.arcAnimation(
      90,
      360 + 90,
      0,
      crossRadius * Math.sqrt(2),
      arcFormatting
    );
    let firstLineAnimation = Animations.lineAnimation(
      crossRadius,
      crossRadius,
      -crossRadius,
      -crossRadius,
      arcFormatting
    );
    let secondLineAnimation = Animations.lineAnimation(
      -crossRadius,
      crossRadius,
      crossRadius,
      -crossRadius,
      arcFormatting
    );
    let crossAnimation = Animations.overlap([
      arcAnimation,
      firstLineAnimation,
      secondLineAnimation,
    ]);
    dartThrowAnimation.registerAnimation(ANIM_TIME, crossAnimation, "cubic");
    dartThrowAnimation.registerFreezeFrame(WAIT_TIME);

    // Highlight Score
    let makeScoreYellow = (sketch, progress) => {
      scoreColor.setBlue((1 - progress) * 255);
      scoreSize = 0.2 * progress;
    };
    let makeScoreWhite = (sketch, progress) => {
      scoreColor.setBlue(progress * 255);
      scoreSize = 0.2 * (1 - progress);
    };
    let fadeCross = Animations.freeze(crossAnimation, 1);
    fadeCross = Animations.fadeAnimation(fadeCross);
    makeScoreYellow = Animations.overlap([fadeCross, makeScoreYellow]);

    let circleFormatting = (sketch) => {
      sketch.noStroke();
      sketch.fill(sketch.color(BULL_COLOR));
    };
    let resetRadius = Animations.circleRadiusAnimation(
      gameRadius,
      1,
      circleFormatting
    );
    makeScoreWhite = Animations.overlap([resetRadius, makeScoreWhite]);

    dartThrowAnimation.registerAnimation(25, makeScoreYellow, "cubic");
    dartThrowAnimation.registerFreezeFrame(10);
    dartThrowAnimation.registerAnimation(25, makeScoreWhite, "cubic");
    dartThrowAnimation.registerFreezeFrame(20);

    let resetScore = () => {
      gameScore = 0;
      gameRadius = 1;
    };
    dartThrowAnimation.registerTrigger(resetScore);
  }

  function finishThrow(sketch) {
    // Called by the animation sequence when the animation is done
    canThrow = true;
  }

  function draw(sketch) {
    updateScale(sketch);
    sketch.push();
    sketch.background(sketch.color(BACK_COLOR));

    // Transform the canvas into a box between (-1, -1) and (1, 1) plus a little border for the edge
    sketch.scale(WIDTH / 2, HEIGHT / 2);
    sketch.translate(1, 1);
    sketch.scale(EDGE, -EDGE);

    sketch.push();
    let circleColor = sketch.color(BULL_COLOR);
    circleColor.setAlpha(circleAlpha * 255);
    circleAlpha = 1;
    sketch.fill(circleColor);

    sketch.noStroke();
    sketch.circle(0, 0, gameRadius * 2);
    sketch.pop();

    dartThrowAnimation.update(sketch);

    // Draw score
    sketch.push();
    sketch.translate(-1, 1);
    sketch.scale(1, -1);
    sketch.noStroke();
    sketch.textSize(0.1);
    sketch.fill(sketch.color(LINE_COLOR));
    sketch.textAlign(sketch.LEFT, sketch.CENTER);
    sketch.text("Score:", -0.05, 0);
    sketch.fill(scoreColor);
    sketch.translate(-scoreSize / 4, 0);
    sketch.scale(1 + scoreSize, 1 + scoreSize);
    sketch.text(gameScore, 0.26, 0);
    sketch.pop();

    sketch.pop();
  }

  function transformMouseCoords(mouseX, mouseY) {
    function transform(coord, offset, sign) {
      let c = coord / SCALE;
      c /= sign * offset;
      c -= sign * 1;
      c /= EDGE;
      return c;
    }
    let cx = transform(mouseX, WIDTH / 2, 1);
    let cy = transform(mouseY, HEIGHT / 2, -1);
    return { cx, cy };
  }

  function crd(_x, _y) {
    return { x: _x, y: _y };
  }

  class Animation {
    constructor(frameLength, interpolator) {
      this.frameLength = frameLength;
      this.interpolator = this.chooseInterpolator(interpolator);
    }

    animate(sketch, frameNumber) {
      // Calls the draw function that should be set by the instantiating function
      // Passes a progress indicator from 0 to 1 to the draw function
      // Returns true when the animation is done, false if still working

      let progress = this.interpolator(frameNumber, this.frameLength);
      if (this.draw == undefined) {
        console.log(
          "Animation with length " +
            this.frameLength +
            " doesn't have an attached draw function!"
        );
        return true;
      }

      this.draw(sketch, progress);
      return frameNumber > this.frameLength;
    }

    linearInterpolate(x, length) {
      return x / length;
    }

    cubicInterpolate(x, length) {
      let nx = this.linearInterpolate(x, length);
      return -2 * nx * nx * nx + 3 * nx * nx;
    }

    heavyfootInterpolate(x, length) {
      let nx = this.linearInterpolate(x, length);
      return nx * nx;
    }

    lightfootInterpolate(x, length) {
      let nx = this.linearInterpolate(x, length);
      return Math.sqrt(nx);
    }

    chooseInterpolator(interpolator) {
      if (interpolator == "cubic") {
        return this.cubicInterpolate;
      } else if (interpolator == "lightfoot") {
        return this.lightfootInterpolate;
      } else if (interpolator == "heavyfoot") {
        return this.heavyfootInterpolate;
      }

      return this.linearInterpolate;
    }
  }

  class AnimationSequence {
    constructor(loop, onFinish) {
      // If loop is true, the animation will instantly restart after it has completed
      // If false, it will stop

      this.loop = loop;
      this.onFinish = onFinish;

      this.animations = [];
      this.currentFrame = 0;
      this.currentClip = 0;
      this.state = "stop";
    }

    registerAnimation(frameLength, drawFunction, interpolator) {
      // Add an animation to the sequence
      // The drawFunction should take in the sketch and a progress meter between 0 and 1

      let animation = new Animation(frameLength, interpolator);
      animation.draw = drawFunction;
      this.animations.push(animation);
    }

    registerFreezeFrame(frameLength) {
      // Adds a "clip" which animates the last frame of the previous clip for a certain number of frames

      // Don't do anything if there aren't any clips
      if (this.animations.length == 0) return;

      const previousAnimation = this.animations[this.animations.length - 1];
      let animation = {};
      animation.frameLength = frameLength;
      animation.animate = (sketch, frameIndex) => {
        previousAnimation.animate(sketch, previousAnimation.frameLength);
        return frameIndex > frameLength;
      };

      this.animations.push(animation);
    }

    registerTrigger(callback) {
      // Adds a trigger which will execute the callback once it hits this point in the animation sequence
      // It draws the previous frame before executing the callback

      let trigger = {};
      const previousAnimation = this.animations[this.animations.length - 1];
      trigger.animate = (sketch, frameIndex) => {
        previousAnimation.animate(sketch, previousAnimation.frameLength);
        callback();
        return true;
      };

      this.animations.push(trigger);
    }

    update(sketch) {
      if (this.state == "stop") return;

      if (this.currentClip >= this.animations.length) {
        this._finish();
        return;
      }

      let done = this.animations[this.currentClip].animate(
        sketch,
        this.currentFrame
      );

      if (this.state == "pause") return;

      this.currentFrame++;

      if (done) {
        // We're done with the current clip, move to the next one
        this.currentClip++;
        this.currentFrame = 0;
        if (this.currentClip >= this.animations.length) {
          // No more clips to play
          this._finish();
        }
      }
    }

    _finish(sketch) {
      if (this.loop) {
        this.restart();
      } else {
        this.stop();
      }

      if (this.onFinish != undefined) this.onFinish(sketch);
    }

    play() {
      // Resumes animation from current state
      // If the animation was at the end, it draws the last frame again
      this.state = "play";
    }

    restart() {
      // Restarts animation from the beginning
      this.currentFrame = 0;
      this.currentClip = 0;
      this.play();
    }

    pause() {
      // Pauses the animation on current frame
      // Continues to draw this frame each update (freeze frame)
      this.state = "pause";
    }

    stop() {
      // Stops the animation drawing process
      // Calling play after calling stop resumes from current state

      this.state = "stop";
    }

    removeAllClips() {
      // Removes all of the clips in this sequence
      // Can only be called when the animation is stopped

      if (this.state != "stop") return;

      this.animations = [];
      this.restart();
      this.stop();
    }
  }

  class Animations {
    // This is a utility class for generating animation lambdas
    // All factories have an optional formatting lambda which gets called before the actual drawing lambda
    //   the formatting lambda is typically used for setting colors and drawing settings

    static lineAnimation(x1, y1, x2, y2, formatting) {
      // Returns an animation lambda which draws a line starting from (x1, y1) to (x2, y2)
      return (sketch, progress) => {
        sketch.push();
        if (formatting != undefined) formatting(sketch);

        let cx = x1 + (x2 - x1) * progress;
        let cy = y1 + (y2 - y1) * progress;
        sketch.line(x1, y1, cx, cy);

        sketch.pop();
      };
    }

    static arcAnimation(beginAngle, endAngle, offsetAngle, radius, formatting) {
      // Returns an animation lambda which draws a growing/shrinking arc

      return (sketch, progress) => {
        sketch.push();
        if (formatting != undefined) formatting(sketch);

        let currentAngle = (endAngle - beginAngle) * progress;
        sketch.rotate(beginAngle + offsetAngle);
        sketch.arc(0, 0, radius * 2, radius * 2, 0, currentAngle);

        sketch.pop();
      };
    }

    static translateAnimation(drawing, tx, ty, formatting) {
      // Returns an animation lambda which draws the drawing moving to the offset

      return (sketch, progress) => {
        sketch.push();
        if (formatting != undefined) formatting(sketch);

        sketch.translate(tx * progress, ty * progress);
        drawing(sketch, progress);
        sketch.pop();
      };
    }

    static circleRadiusAnimation(beginRadius, endRadius, formatting) {
      // Returns an animation lambda which draws a circle changing radius

      return (sketch, progress) => {
        sketch.push();
        if (formatting != undefined) formatting(sketch);

        let currentRadius = beginRadius + (endRadius - beginRadius) * progress;
        sketch.circle(0, 0, currentRadius * 2);

        sketch.pop();
      };
    }

    static fadeAnimation(drawing, formatting) {
      // Returns an animation lambda which draws the drawing fading out

      return (sketch, progress) => {
        sketch.push();
        if (formatting != undefined) formatting(sketch);

        // Set opacity. May need to draw to a texture first because can't access color from here
        // Using global alpha isn't the best practice
        GLOBAL_ALPHA = 1 - progress;
        drawing(sketch, progress);
        GLOBAL_ALPHA = 1;

        sketch.pop();
      };
    }

    static zigzagAnimation(points, formatting) {
      // Returns an animation lambda which draws a series of connected line segments

      // Calculates weights for each segment based off distances
      // So a longer line gets more frames dedicated to it
      let distances = Animations._normalizedDistances(points);
      let sublambdas = [];

      for (let i = 1; i < points.length; i++) {
        sublambdas[i - 1] = Animations.lineAnimation(
          points[i - 1].x,
          points[i - 1].y,
          points[i].x,
          points[i].y
        );
      }

      return (sketch, progress) => {
        sketch.push();
        if (formatting != undefined) formatting(sketch);

        let cumDistance = 0;
        for (let i = 0; i < sublambdas.length; i++) {
          cumDistance += distances[i];
          if (cumDistance <= progress) {
            // Draw the full line
            sublambdas[i](sketch, 1);
          } else {
            // Draw part of the line
            let subprogress =
              (progress - cumDistance + distances[i]) / distances[i];
            sublambdas[i](sketch, subprogress);
            break;
          }
        }

        sketch.pop();
      };
    }

    static _normalizedDistances(points) {
      let distances = [];
      let sum = 0;
      for (let i = 1; i < points.length; i++) {
        let dx = points[i - 1].x - points[i].x;
        let dy = points[i - 1].y - points[i].y;
        let dist = Math.hypot(dx, dy);
        distances.push(dist);
        sum += Math.hypot(dx, dy);
      }

      for (let i = 0; i < distances.length; i++) {
        distances[i] /= sum;
      }

      return distances;
    }

    static overlap(animations) {
      // Takes an array of animations and merges them into a single animation
      // Drawn from front to back
      return (sketch, progress) => {
        for (let i = 0; i < animations.length; i++) {
          animations[i](sketch, progress);
        }
      };
    }

    static freeze(drawing, frozenProgress, formatting) {
      // Takes in an animation and creates an animation lambda which freezes at a certain progress
      return (sketch, progress) => {
        sketch.push();
        if (formatting != undefined) formatting(sketch);

        drawing(sketch, frozenProgress);

        sketch.pop();
      };
    }
  }

  return (
    <Sketch
      setup={setup}
      draw={draw}
      style={{ width: WIDTH, height: HEIGHT }}
    />
  );
}
