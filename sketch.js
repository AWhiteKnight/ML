// AWhiteKnight
const WIDTH = 640;
const HEIGHT = 480;
const COLORS = ['red', 'green', 'yellow', 'blue'];
const TEXTSIZE = 12;

let yoloNet;
let uNet;
let video;
const boxes = [];

// load model(s)
function preload() {
  video = createCapture(VIDEO);
  video.size(WIDTH, HEIGHT);
  video.hide();
  //yoloNet = ml5.YOLO(video, {filterBoxesThreshold: 0.01, IOUThreshold: 0.4, classProbThreshold: 0.4}, () => {
  yoloNet = ml5.YOLO(video, {filterBoxesThreshold: 0.01, IOUThreshold: 0.4, classProbThreshold: 0.4}, () => {
    console.log('Model is ready!!!');
  });
}

// setup UI
function setup() {
  createCanvas(WIDTH, HEIGHT);
  background(0);
  strokeWeight(1);
  noFill();
  textSize(TEXTSIZE);
  yoloNet.detect(gotResults);
}

// update UI
function draw() {
  background(0);
  image(video, 0, 0);
  for(let i = 0; i < boxes.length; i++) {
    // color of rectangle
    stroke(COLORS[i%COLORS.length]);
    rect(boxes[i].x, boxes[i].y, boxes[i].w, boxes[i].h);
    text(boxes[i].label, boxes[i].x+2, boxes[i].y+TEXTSIZE);
    text(boxes[i].confidence, boxes[i].x+2, boxes[i].y+boxes[i].h-2);
  }
}

// handle detection results
function gotResults(error, results) {
  if (error) {
    console.error(error);
  } else {
    let k = 0;
    const l = boxes.length;
    for(let i=0; i < results.length; i++) {
      if(i < l) {
        boxes[i].confidence = results[i].confidence;
        boxes[i].label = results[i].label;
        boxes[i].x = results[i].x*WIDTH;
        boxes[i].y = results[i].y*HEIGHT;
        boxes[i].w = results[i].w*WIDTH;
        boxes[i].h = results[i].h*HEIGHT;
      } else {
        boxes.push({
          confidence: results[i].confidence,
          label: results[i].label,
          x: results[i].x*WIDTH,
          y: results[i].y*HEIGHT,
          w: results[i].w*WIDTH,
          h: results[i].h*HEIGHT
        });
      }
      k++;
    }
    // remove vanished objects
    for(let i = k; i < l; i++) {
      boxes.pop();
    }
    // restart
    yoloNet.detect(gotResults);
  }
}
