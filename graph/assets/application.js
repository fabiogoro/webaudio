var audio_context;
var gain;

audio_context = new (window.AudioContext || window.webkitAudioContext)();

var notes = [{ name: 'c4', frequency: 261.6, keyCode: 65 , oscillator: audio_context.createGain() },
             { name: 'd4', frequency: 293.7, keyCode: 83 , oscillator: audio_context.createGain() },
             { name: 'e4', frequency: 329.6, keyCode: 68 , oscillator: audio_context.createGain() },
             { name: 'f4', frequency: 349.2, keyCode: 70 , oscillator: audio_context.createGain() },
             { name: 'g4', frequency: 392.0, keyCode: 71 , oscillator: audio_context.createGain() },
             { name: 'a4', frequency: 440.0, keyCode: 72 , oscillator: audio_context.createGain() },
             { name: 'b4', frequency: 493.9, keyCode: 74 , oscillator: audio_context.createGain() },
             { name: 'c5', frequency: 523.3, keyCode: 75 , oscillator: audio_context.createGain() },
             { name: 'd5', frequency: 587.3, keyCode: 76 , oscillator: audio_context.createGain() },
             { name: 'e5', frequency: 659.3, keyCode: 186, oscillator: audio_context.createGain() }];

var gain_value;
var playing = [];

var compressor = audio_context.createDynamicsCompressor();
compressor.threshold.value = -50;
compressor.knee.value = 40;
compressor.ratio.value = 24;
compressor.reduction.value = -20;

compressor.connect(audio_context.destination);

function play(note) {
  if(note.oscillator.gain.value == 0) {
    playing.push(note);
    note.oscillator.gain.value = 1;
  }
}

function stop(note) {
  note.oscillator.gain.value = 0;
  playing.pop(note);
}

$(function(){
  function setup(note) {
    var osc = audio_context.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = note.frequency;
    osc.start(0);
    osc.connect(note.oscillator);
    note.oscillator.gain.value = 0;
    note.oscillator.connect(compressor);
  }
  for(var i=0;i<notes.length;i++){
    setup(notes[i]);
  }

  $('body').on('keydown', function(e) {
    switch (e.keyCode) {
      case 65: play(notes[0]); break;
      case 83: play(notes[1]); break;
      case 68: play(notes[2]); break;
      case 70: play(notes[3]); break;
      case 71: play(notes[4]); break;
      case 72: play(notes[5]); break;
      case 74: play(notes[6]); break;
      case 75: play(notes[7]); break;
    }
  });
  $('body').on('keyup', function(e) {
    switch (e.keyCode) {
      case 65: stop(notes[0]); break;
      case 83: stop(notes[1]); break;
      case 68: stop(notes[2]); break;
      case 70: stop(notes[3]); break;
      case 71: stop(notes[4]); break;
      case 72: stop(notes[5]); break;
      case 74: stop(notes[6]); break;
      case 75: stop(notes[7]); break;
    }
  });
});

var canvas;
$(function(){
  var analyser = audio_context.createAnalyser();
  compressor.connect(analyser);
  analyser.fftSize = 2048;
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
    for (var i = 0; i < analyser.frequencyBinCount; i++) {
      var value = freqDomain[i];
      var percent = value / 256;
      var height = HEIGHT * percent;
      var offset = HEIGHT - height - 1;
      var barWidth = WIDTH/analyser.frequencyBinCount;
      var hue = i/analyser.frequencyBinCount * 360;
      canvas.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
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
