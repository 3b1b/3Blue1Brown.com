/**
 * This is an interactive applet created by River Way for the Visual Fourier Transform lesson.
 * It uses p5.js to interface with JS canvas and create an interactable winding machine.
 */

import React from "react";
import Sketch from "react-p5";
import {
  drawGraph,
  drawWinder,
  drawFourier,
  calculateFourier,
} from "../fourier_lib/winding_machine";

const WIDTH = 880;
const HEIGHT = 500;

const BKGD_COLOR = "#000000";
const TEXT_COLOR = "#FFFFFF";
const MASS_COLOR = "#ff6363";

export default function BasicWindingMachine() {
  const GRAPH_ORIGIN = { x: 50, y: 100 };
  const GRAPH_SIZE = { x: 800, y: 120 };
  const WINDER_ORIGIN = { x: 165, y: 335 };
  const WINDER_SIZE = 120;
  const FOURIER_ORIGIN = { x: 400, y: 335 };
  const FOURIER_SIZE = { x: 400, y: 120 };

  const FREQS = [0, 3];

  function setup(sketch, canvasParentRef) {
    sketch.createCanvas(WIDTH, HEIGHT).parent(canvasParentRef);
    sketch.angleMode(sketch.DEGREES);
    sketch.textAlign(sketch.CENTER);

    sketch.background(sketch.color(BKGD_COLOR));
    drawGraph(sketch, FREQS, GRAPH_ORIGIN, GRAPH_SIZE);
    calculateFourier(0, FREQS);
  }

  let frequencyMovement = 1;
  let previousTime = performance.now();
  let previousFreq = -1;
  function draw(sketch) {
    let currentTime = performance.now();
    let deltaTime = currentTime - previousTime;
    previousTime = currentTime;

    if (sketch.movedX == 0 && sketch.movedY == 0 && frequencyMovement < 1e-4) {
      // If the mouse didn't move and the winding frequency is pretty much the same,
      // Then don't bother to draw everything again. Its a waste
      previousTime = performance.now();
      return;
    }

    // Wipe clean
    sketch.fill(sketch.color(BKGD_COLOR));
    sketch.rect(0, WINDER_ORIGIN.y - WINDER_SIZE - 30, WINDER_SIZE * 2.5, 50);

    let winding_freq = drawFourier(
      sketch,
      FOURIER_ORIGIN,
      FOURIER_SIZE,
      FREQS,
      0,
      deltaTime
    );
    frequencyMovement = Math.abs(winding_freq - previousFreq);
    previousFreq = winding_freq;
    drawWinder(sketch, FREQS, winding_freq, WINDER_ORIGIN, WINDER_SIZE);

    sketch.noStroke();
    sketch.textStyle(sketch.NORMAL);
    sketch.textFont("cmunrm");
    sketch.fill(sketch.color(TEXT_COLOR));
    sketch.textSize(24);
    sketch.text(
      winding_freq.toFixed(2) + " cycles/second",
      WINDER_ORIGIN.x,
      WINDER_ORIGIN.y - WINDER_SIZE - 10
    );

    sketch.fill(sketch.color(MASS_COLOR));
    sketch.text(
      "-coordinate for center of mass",
      FOURIER_ORIGIN.x + FOURIER_SIZE.x / 2,
      FOURIER_ORIGIN.y - FOURIER_SIZE.y
    );

    sketch.textStyle(sketch.ITALIC);
    sketch.text("x", 450, 215);
  }

  const mobileStyling = {
    touchAction: "none"
  };

  return <Sketch setup={setup} draw={draw} style={mobileStyling}/>;
}
