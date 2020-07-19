const tf = require("@tensorflow/tfjs");
//const cocoSsd = require("@tensorflow-models/coco-ssd");

// References:
// - https://github.com/tensorflow/tfjs-models/blob/c37b1193358f12cc6726262285ad3d6b0f1046a0/coco-ssd/demo/index.js
// - https://github.com/tensorflow/tfjs-models/tree/c37b1193358f12cc6726262285ad3d6b0f1046a0/coco-ssd
// - https://www.npmjs.com/package/@tensorflow-models/coco-ssd

// References for using custom model
// - https://github.com/adriagil/tfjs-vue-example/blob/2efe55533c4564338687b1993ab0ac964154674a/src/App.vue
//    - https://towardsdatascience.com/training-tensorflow-object-detection-api-with-custom-dataset-for-working-in-javascript-and-vue-js-6634e0f33e03
// - https://github.com/tensorflow/tfjs-examples/blob/046a2a18f00bf5c24d8f5fc766127d2b217a1a45/simple-object-detection/index.js

const LABEL_MAP = {
  1: "thumper"
};

function renderPredictionBoxes(
  canvas,
  image,
  { predictionBoxes, predictionClasses, predictionScores, numPredictions }
) {
  console.log("predictionBoxes", predictionBoxes);
  console.log("predictionScores", predictionScores);
  console.log("predictionClasses", predictionClasses);

  // get the context of canvas
  const ctx = canvas.getContext("2d");
  // clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the image itself to the canvas
  ctx.drawImage(image, 0, 0, 816, 612);

  // draw results
  for (let i = 0; i < numPredictions[0]; i++) {
    const minY = predictionBoxes[i * 4] * 612;
    const minX = predictionBoxes[i * 4 + 1] * 816;
    const maxY = predictionBoxes[i * 4 + 2] * 612;
    const maxX = predictionBoxes[i * 4 + 3] * 816;

    const score = predictionScores[i * 3] * 100;
    if (score > 75) {
      ctx.beginPath();
      ctx.rect(minX, minY, maxX - minX, maxY - minY);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#00ff00";
      ctx.fillStyle = "#00ff00";
      ctx.stroke();
      ctx.shadowColor = "white";
      ctx.shadowBlur = 10;
      ctx.font = "14px Arial bold";
      ctx.fillText(
        `${score.toFixed(1)} - ${LABEL_MAP[predictionClasses[i * 3]]}`,
        minX,
        minY > 10 ? minY - 5 : 10
      );
    }
  }
}

async function detectImage(img) {
  // Load the model.
  console.log("Loading model...");

  const LOCAL_MODEL_PATH = "static/bunny-model1/model.json";
  const model = await tf.loadGraphModel(LOCAL_MODEL_PATH);

  const tfImg = tf.browser.fromPixels(img).expandDims(0);
  const smallImg = tf.image.resizeBilinear(tfImg, [408, 306]);
  const resized = tf.cast(smallImg, "float32");
  const tf4d = tf.tensor4d(Array.from(resized.dataSync()), [1, 408, 306, 3]);
  let predictions = await model.executeAsync({ image_tensor: tf4d }, [
    "detection_boxes",
    "detection_classes",
    "detection_scores",
    "num_detections"
  ]);

  console.log("Predictions: ");
  console.log(predictions);

  const canvas = document.getElementById("canvas");

  renderPredictionBoxes(canvas, img, {
    predictionBoxes: predictions[0].dataSync(),
    predictionClasses: predictions[1].dataSync(),
    predictionScores: predictions[2].dataSync(),
    numPredictions: predictions[3].dataSync()
  });
}

try {
  const img = document.querySelector("img");
  console.log("img", img);
  detectImage(img);
} catch (err) {
  console.log("err", err);
}
