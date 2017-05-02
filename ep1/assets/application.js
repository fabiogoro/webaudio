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
  //source.connect(audio_context.destination);
  source.start();
});

navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;
var mic;
var dest;
if (navigator.getUserMedia) {
  navigator.getUserMedia({audio: true, video: false}, function(stream) {
    mic = audio_context.createMediaStreamSource(stream);
    dest = audio_context.createMediaStreamDestination();
    mic.connect(dest);
  }, function(e) {
    console.log('Reeeejected!', e);
  });
} else {
  var video = document.querySelector('video');
  video.src = 'somevideo.webm';
}

function log(){
 alert(dest.stream);  
}
