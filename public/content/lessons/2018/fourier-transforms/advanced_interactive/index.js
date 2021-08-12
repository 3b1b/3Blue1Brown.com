/**
 * This is an interactive applet created by River Way for the Visual Fourier Transform lesson.
 * It uses p5.js to interface with JS canvas and create an interactable winding machine.
 * The advanced version has a textbox linked that will change the input wave.
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
const HEIGHT = 550;

const BKGD_COLOR = "#000000";
const TEXT_COLOR = "#FFFFFF";
const MASS_COLOR = "#ff6363";

export default function BasicWindingMachine() {
  const GRAPH_ORIGIN = { x: 50, y: 130 };
  const GRAPH_SIZE = { x: 800, y: 120 };
  const WINDER_ORIGIN = { x: 165, y: 385 };
  const WINDER_SIZE = 120;
  const FOURIER_ORIGIN = { x: 400, y: 385 };
  const FOURIER_SIZE = { x: 400, y: 120 };

  let FREQS = [2, 3];

  function setup(sketch, canvasParentRef) {
    sketch.createCanvas(WIDTH, HEIGHT).parent(canvasParentRef);
    sketch.angleMode(sketch.DEGREES);
    sketch.textAlign(sketch.CENTER);

    sketch.background(sketch.color(BKGD_COLOR));
    drawTopGraph(sketch);
  }

  function drawTopGraph(sketch) {
    drawGraph(sketch, FREQS, GRAPH_ORIGIN, GRAPH_SIZE);
    calculateFourier(1, FREQS);
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
      return;
    }

    if (frequencyMovement == 1) {
      drawTopGraph(sketch);
    }

    // Wipe clean
    sketch.fill(sketch.color(BKGD_COLOR));
    sketch.rect(0, WINDER_ORIGIN.y - WINDER_SIZE - 30, WINDER_SIZE * 2.5, 50);

    let winding_freq = drawFourier(
      sketch,
      FOURIER_ORIGIN,
      FOURIER_SIZE,
      FREQS,
      1,
      deltaTime
    );
    frequencyMovement = Math.abs(winding_freq - previousFreq);
    previousFreq = winding_freq;
    drawWinder(sketch, FREQS, winding_freq, WINDER_ORIGIN, WINDER_SIZE);

    // Clean text area
    sketch.fill(sketch.color(BKGD_COLOR));
    sketch.rect(0, 0, WIDTH, 0);
    drawText(sketch, winding_freq);
  }

  function drawText(sketch, winding_freq) {
    sketch.noStroke();
    sketch.textStyle(sketch.NORMAL);
    sketch.textFont("cmunrm");
    sketch.fill(sketch.color(TEXT_COLOR));
    sketch.textSize(24);
    sketch.text(
      formatNumber(winding_freq) + " cycles/second",
      WINDER_ORIGIN.x,
      WINDER_ORIGIN.y - WINDER_SIZE - 10
    );

    drawHzs(sketch);

    sketch.push();
    sketch.fill(sketch.color(MASS_COLOR));
    sketch.text(
      "-coordinate for center of mass",
      FOURIER_ORIGIN.x + FOURIER_SIZE.x / 2,
      FOURIER_ORIGIN.y - FOURIER_SIZE.y
    );

    sketch.textStyle(sketch.ITALIC);
    sketch.text("x", 450, 265);

    sketch.pop();
  }

  function formatNumber(number) {
    let strNumber = number.toFixed(2);
    if (strNumber[strNumber.length - 1] == "0") {
      strNumber = strNumber.substring(0, strNumber.length - 1);
    }
    if (strNumber[strNumber.length - 1] == "0") {
      strNumber = strNumber.substring(0, strNumber.length - 2);
    }

    return strNumber;
  }

  function drawHzs(sketch) {
    let str = "";
    for (let i = 0; i < FREQS.length; i++) {
      if (str != "") str += " + ";

      str += formatNumber(FREQS[i]) + "Hz";
    }

    sketch.text(str, WIDTH / 2, GRAPH_ORIGIN.y - 90);
  }

  const MAX_FREQS = 5;
  function updateFrequencies(event) {
    let value = event.target.value;
    let strings = value.split(",");
    let frequencies = [];
    for (let i = 0; i < strings.length; i++) {
      let float = parseFloat(strings[i]);
      if (isNaN(float)) continue;
      if (float < 0) continue;
      if (float > 4.4) continue;

      frequencies.push(float);
      if (frequencies.length == MAX_FREQS) break;
    }

    FREQS = frequencies;
    // Update so the draw event happens
    frequencyMovement = 1;
  }

  const textboxStyle = {
    background: "#eee",
    padding: "10px 0 10px 44px",
    marginBottom: "20px",
    font: "inherit",
    fontSize: "26px",
  };

  const mobileStyling = {
    touchAction: "none",
  };

  return [
    <Sketch
      key="fourier_interactive_1"
      setup={setup}
      draw={draw}
      style={mobileStyling}
    />,
    <input
      key="fourier_interactive_2"
      type="text"
      onChange={updateFrequencies}
      defaultValue="2,3"
      style={textboxStyle}
    />,
  ];
}
