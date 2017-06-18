var audio_context;

audio_context = new (window.AudioContext || window.webkitAudioContext)();

navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;
var mic;

var canvas;
$(function(){
  var analyser = audio_context.createAnalyser();
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
    for (var i = 0; i < analyser.frequencyBinCount/4; i++) {
      var value = freqDomain[i];
      var percent = value / 256;
      var height = HEIGHT * percent;
      var offset = HEIGHT - height - 1;
      var barWidth = WIDTH/analyser.frequencyBinCount*4;
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

  var offset_x=0;
  function draw2(){
    var freqDomain = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(freqDomain);
    var fac = 4;
    var width = WIDTH * 0.001;
    var height = HEIGHT/analyser.frequencyBinCount*fac;
    for (var i = 0; i < analyser.frequencyBinCount/fac; i++) {
      var value = freqDomain[i];
      var offset_y = HEIGHT - height*i - 1;
      var light = value/256 * 100;
      canvas.fillStyle = 'hsl(0, 0%, '+ light +'%)';
      canvas.fillRect(offset_x-0.3, offset_y, width, height);
    }
    offset_x=(offset_x+width)%WIDTH;
    canvas.clearRect(offset_x, 0, width, HEIGHT);
    drawVisual = requestAnimationFrame(draw2);
  }

  draw2();
    
  if (navigator.getUserMedia) {
    navigator.getUserMedia({audio: true, video: false}, function(stream) {
      mic = audio_context.createMediaStreamSource(stream);
      mic.connect(analyser);
    }, function(e) {
      console.log('Error:', e);
    });
  }
});
