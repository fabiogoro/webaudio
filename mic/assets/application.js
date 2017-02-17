var audio_context;
var gain;

audio_context = new (window.AudioContext || window.webkitAudioContext)();
var source;

var buffer = null;

var fs = audio_context.sampleRate;
var size = fs*5;
var array = audio_context.createBuffer(1, size,fs);

$(function(){
  var channel_buffer = array.getChannelData(0);
  for (var i = 0; i < size; i++) {
    channel_buffer[i] = Math.sin(i/2);
  }
  var source = audio_context.createBufferSource();
  source.buffer = array;
  source.connect(audio_context.destination);
  source.start();
});

/*
var resp;
function load_file(url) {
  $('#play').text('Carregando '+url.files[0].name);
  $('#play').removeAttr('onclick');
  
  var reader = new FileReader();
  reader.onload = function(filedata) {
    audio_context.decodeAudioData(filedata.target.result, function(data) {
      buffer = data;
      $('#play').text('Reproduzir');
      $('#play').on('click', play_buffer)
    });
  };
  reader.readAsArrayBuffer(url.files[0]);
}
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

var gain = audio_context.createGain();
var lowpass = audio_context.createBiquadFilter();
lowpass.type = "lowpass";
lowpass.frequency.value = 20000;
lowpass.Q.value = 1;
var lowpass_out = audio_context.createBiquadFilter();
lowpass_out.type = "lowpass";
lowpass_out.frequency.value = 20000;
lowpass_out.Q.value = 1;
var highpass = audio_context.createBiquadFilter();
highpass.type = "highpass";
highpass.frequency.value = 10;
highpass.Q.value = 1;
lowpass.connect(highpass);
var highpass_out = audio_context.createBiquadFilter();
highpass_out.type = "highpass";
highpass_out.frequency.value = 10;
highpass_out.Q.value = 1;
lowpass_out.connect(highpass_out);
highpass_out.connect(audio_context.destination);
*/
navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;
var mic;
if (navigator.getUserMedia) {
  navigator.getUserMedia({audio: true, video: false}, function(stream) {
    mic = audio_context.createMediaStreamSource(stream);
  }, function(e) {
    console.log('Reeeejected!', e);
  });
} else {
  var video = document.querySelector('video');
  video.src = 'somevideo.webm';
}

/*
function play_buffer(){
  var source = audio_context.createBufferSource();
  source.buffer = buffer;
  source.connect(lowpass);
  source.connect(lowpass_out);
  source.start();
  $('#play').text('Parar');
  $('#play').off('click');
  $('#play').on('click', function(){source.stop();$('#play').text('Reproduzir');$('#play').on('click',play_buffer); });
}

$(function(){
  load('assets/hardest.mp3');

  $('body').on('keydown', function(e) {
    switch (e.keyCode) {
      case 79: play_buffer(); break;
    }
  });
});

function change_Q(e){
  lowpass.Q.value = $(e).val();
  lowpass_out.Q.value = $(e).val();
  highpass.Q.value = $(e).val();
  highpass_out.Q.value = $(e).val();
}

function change_lowpass(e){
  if(on_low){
    lowpass.frequency.value = $(e).val();
    lowpass_out.frequency.value = $(e).val();
    $('#actual_low').text(Math.round(lowpass_out.frequency.value));
  }
}
function change_highpass(e){
  if(on_high){
    highpass.frequency.value = $(e).val();
    highpass_out.frequency.value = $(e).val();
    $('#actual_high').text(Math.round(highpass_out.frequency.value));
  }
}
var on_low = 1;
function lowpass_toggle(e){
  $(e).toggleClass('btn-danger');
  if(on_low){
    lowpass.frequency.value = 22040;
    lowpass_out.frequency.value = 22040;
    $('#actual_low').text(0);
    on_low = 0;
  }
  else {
    lowpass_out.frequency.value = $('#low_frequency').val();
    lowpass.frequency.value = $('#low_frequency').val();
    $('#actual_low').text($('#low_frequency').val());
    on_low = 1;
  }
}
var on_high = 1;
function highpass_toggle(e){
  $(e).toggleClass('btn-danger');
  if(on_high){
    highpass.frequency.value = 0;
    highpass_out.frequency.value = 0;
    $('#actual_high').text(0);
    on_high = 0;
  }
  else {
    highpass_out.frequency.value = $('#high_frequency').val();
    highpass.frequency.value = $('#high_frequency').val();
    $('#actual_high').text($('#high_frequency').val());
    on_high = 1;
  }
}

$(function(){
  var canvas;
  var analyser = audio_context.createAnalyser();
  highpass.connect(analyser);
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

$(function(){
  var canvas;
  var analyser = audio_context.createAnalyser();
  gain.connect(analyser);
  analyser.fftSize = 2048;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Float32Array(bufferLength);
  var canvas_e = $('.nofilter')[0];
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
});*/
