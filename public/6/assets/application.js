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

function hit(note){
  if(note===0){
    stop();
  } else {
    send(note);
    play(note);
  }
}

$(function(){

  $('body').on('keydown', function(e) {
    switch (e.keyCode) {
      case 65:
        note = 261.6;
        send(note);
        play(note);
        break;
      case 83:
        note = 293.7;
        send(note);
        play(note);
        break;
      case 68:
        note = 329.6;
        send(note);
        play(note);
        break;
      case 70:
        note = 349.2;
        send(note);
        play(note);
        break;
      case 71:
        note = 392.0;
        send(note);
        play(note);
        break;
      case 72:
        note = 440.0;
        send(note);
        play(note);
        break;
      case 74:
        note = 493.9;
        send(note);
        play(note);
        break;
      case 75:
        note = 523.3;
        send(note);
        play(note);
        break;
    }
  });
  $('body').on('keyup', function(e) {
    send(0);
    stop();
  });
});
