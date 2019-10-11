// https://deeplizard.com/learn/video/nnxJyxtIuFM

// selecting an image
$("#image-selector").change(function () {
    let reader = new FileReader();
    reader.onload = function () {
        let dataURL = reader.result;
        $("#selected-image").attr("src", dataURL);
        $("#prediction-list").empty();
    }
    let file = $("#image-selector").prop("files")[0];
    reader.readAsDataURL(file);
}); 

// Loading the model 
// Attention: change Port appropriate
let model;
(async function () {
    model = await tf.loadModel("http://localhost:8080/tfjs-models/VGG16/model.json");
    $(".progress-bar").hide();
})();

// transform image into rank 4 tensor
let image = $("#selected-image").get(0);
let tensor = tf.fromPixels(image)
.resizeNearestNeighbor([224, 224])
.toFloat()
.expandDims();

// More pre-processing to be added here later

// get a prediction
let predictions = model.predict(tensor).data();
let top5 = Array.from(predictions)
    .map(function (p, i) {
        return {
            probability: p,
            className: IMAGENET_CLASSES[i]
        };
    }).sort(function (a, b) {
        return b.probability - a.probability;
    }).slice(0, 5);

// show predicitions
$("#prediction-list").empty();
top5.forEach(function (p) {
    $("#prediction-list").append(`<li>${p.className}: ${p.probability.toFixed(6)}</li>`);
});

