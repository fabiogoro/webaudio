
var audio_context;
var gain;

audio_context = new (window.AudioContext || window.webkitAudioContext)();
var source;


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

/*var notes = [/*{ name: 'a4', frequency: 11.75, keyCode: 72 , oscillator: audio_context.createGain() },
             { name: 'a4', frequency: 27.5, keyCode: 72 , oscillator: audio_context.createGain() },*/
         /*   { name: 'a4', frequency: 55.0, keyCode: 72 , oscillator: audio_context.createGain() },
             { name: 'a4', frequency: 110.0, keyCode: 72 , oscillator: audio_context.createGain() },
             { name: 'a4', frequency: 220.0, keyCode: 72 , oscillator: audio_context.createGain() },
             { name: 'a4', frequency: 440.0, keyCode: 72 , oscillator: audio_context.createGain() },
             { name: 'a4', frequency: 880.0, keyCode: 72 , oscillator: audio_context.createGain() },
             { name: 'a4', frequency: 1760.0, keyCode: 72 , oscillator: audio_context.createGain() },
             { name: 'a4', frequency: 3520.0, keyCode: 72 , oscillator: audio_context.createGain() },
             { name: 'a4', frequency: 7040.0, keyCode: 72 , oscillator: audio_context.createGain() },
               { name: 'a4', frequency: 14080.0, keyCode: 72 , oscillator: audio_context.createGain() },
             { name: 'a4', frequency: 22000.0, keyCode: 72 , oscillator: audio_context.createGain() }
            ];*/


var buffer = null;

function load(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  request.onload = function() {
    audio_context.decodeAudioData(request.response, function(data) {
      buffer = data;
    });
  }
  request.send();
}

var gain_value;
var playing = [];

var compressor = audio_context.createDynamicsCompressor();

compressor.connect(audio_context.destination);

navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

if (navigator.getUserMedia) {
  navigator.getUserMedia({audio: true, video: false}, function(stream) {
    source = audio_context.createMediaStreamSource(stream);
    source.connect(compressor);
  }, function(e) {
    console.log('Reeeejected!', e);
  });
} else {
  var video = document.querySelector('video');
  video.src = 'somevideo.webm'; // fallback.
}

function play(note) {
  if(note.oscillator.gain.value == 0) {
    playing.push(note);
    note.oscillator.gain.value = 1;
  }
}

function play_buffer(){
  var source = audio_context.createBufferSource();
  source.buffer = buffer;
  source.connect(compressor);
  source.start();
}

function stop(note) {
  note.oscillator.gain.value = 0;
  playing.pop(note);
}

$(function(){
  load('assets/hardest.mp3');
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
      case 76: play(notes[8]); break;
      case 77: play(notes[9]); break;
      case 78: play(notes[10]); break;
      case 79: play_buffer(); break;
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
      case 76: stop(notes[8]); break;
      case 77: stop(notes[9]); break;
      case 78: stop(notes[10]); break;
      case 79: /*stop(notes[11]);*/ break;
    }
  });
});

function pitch(p) { return Math.pow(2,((p-69)/12))*440; }
function freq(f) { return Math.round(Math.log2(f/440)*12+69); }

var canvas;
var bufferLength;
var bin_size;
$(function(){
  var analyser = audio_context.createAnalyser();
  compressor.connect(analyser);
  analyser.fftSize = 16384;
  bin_size = 22010/analyser.fftSize*2;
  analyser.smoothingTimeConstant = 0.5;
  bufferLength = analyser.frequencyBinCount/8;
  bufferLengthtime = analyser.frequencyBinCount/16;
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
    var freqDomain = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(freqDomain);
    var value = [0,0,0,0,0,0,0,0,0,0,0,0];
    for (var i = 4; i < bufferLength; i++) {
      value[freq(i*bin_size)%12] += freqDomain[i];
      var percent = value / 256;
      var height = HEIGHT * percent;
      var offset = HEIGHT - height - 1;
      var barWidth = WIDTH/100;
      var hue = i/bufferLength * 360;
      //canvas.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
      //canvas.fillRect(freq(i*bin_size) * barWidth, offset, barWidth, height);
    }
    var max = 0;
    for (var i = 0; i < value.length; i++) {
      value[i] = Math.pow(value[i],2);
      if(value[i]>max) max = value[i];
    }
    for (var i = 0; i < value.length; i++) {
      //var value = freqDomain[i];
      //console.log(value);
      var percent = value[i] / max;
      var height = HEIGHT * percent;
      var offset = HEIGHT - height - 1;
      var barWidth = WIDTH/12;
      var hue = i/12 * 360;
      canvas.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
      canvas.fillRect(i * barWidth, offset, barWidth, height);
    }
    var timeDomain = new Uint8Array(bufferLengthtime);
    analyser.getByteTimeDomainData(timeDomain);
    for (var i = 0; i < bufferLengthtime; i++) {
      var value = timeDomain[i];
      var percent = value / 256;
      var height = HEIGHT * percent;
      var offset = HEIGHT - height - 1;
      var barWidth = WIDTH/bufferLengthtime;
      canvas.fillStyle = 'black';
      canvas.fillRect(i * barWidth, offset, 1, 1);
    }
    drawVisual = requestAnimationFrame(draw);
  }

  draw();
});
