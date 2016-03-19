var audio_context;
var oscillator;
var gain;

audio_context = new (window.AudioContext || window.webkitAudioContext)();
oscillator = audio_context.createOscillator()

oscillator.type = 'sawtooth';
oscillator.start(0);

function play(note) {
  oscillator.frequency.value = note;
  oscillator.connect(audio_context.destination);
}

function stop() {
  oscillator.disconnect();
}

$(function(){

  $('body').on('keydown', function(e) {
    switch (e.keyCode) {
      case 65: play(261.6); break;
      case 83: play(293.7); break;
      case 68: play(329.6); break;
      case 70: play(349.2); break;
      case 71: play(392.0); break;
      case 72: play(440.0); break;
      case 74: play(493.9); break;
      case 75: play(523.3); break;
    }
  });
  $('body').on('keyup', function(e) {
    stop()
  });
});
