var record = 1;
var canvas;
$(function(){
  var analyser = audio_context.createAnalyser();
  gain.connect(analyser);
  analyser.fftSize = 4096;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Float32Array(bufferLength);
  var canvas_e = $('.visualizer')[0];
  canvas = canvas_e.getContext("2d");
  canvas.clearRect(0, 0, WIDTH, HEIGHT);
  var WIDTH = canvas_e.width;
  var HEIGHT = canvas_e.height;
  canvas.fillStyle = 'rgb(255, 255, 255)';
  canvas.fillRect(0, 0, WIDTH, HEIGHT);

  function draw() {
    canvas.clearRect(0, 0, WIDTH, HEIGHT);
    var freqDomain = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(freqDomain);
    var fac = 4;
    for (var i = 0; i < analyser.frequencyBinCount/fac; i++) {
      var value = freqDomain[i];
      var percent = value / 256;
      var height = HEIGHT * percent;
      var offset = HEIGHT - height - 1;
      var barWidth = WIDTH/analyser.frequencyBinCount*fac;
      var hue = i/analyser.frequencyBinCount * 360;
      canvas.fillStyle = 'hsl(' + 1 + ', 100%, 50%)';
      canvas.fillRect(i * barWidth, offset, barWidth, height);
    }
    var timeDomain = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(timeDomain);
    for (var i = 0; i < analyser.frequencyBinCount; i++) {
      var value = timeDomain[i];
      var percent = value / 256;
      var height = HEIGHT * percent;
      var offset = HEIGHT - height - 1;
      var barWidth = WIDTH/analyser.frequencyBinCount;
      canvas.fillStyle = 'black';
      canvas.fillRect(i * barWidth, offset, 1, 1);
    }
    drawVisual = requestAnimationFrame(draw);
  }

  draw();
});
