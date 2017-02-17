var audio_context;
var gain;

audio_context = new (window.AudioContext || window.webkitAudioContext)();

var notes = [{ name: 'c4', frequency: 261.6, keyCode: 65 , oscillator: audio_context.createOscillator() },
             { name: 'd4', frequency: 293.7, keyCode: 83 , oscillator: audio_context.createOscillator() },
             { name: 'e4', frequency: 329.6, keyCode: 68 , oscillator: audio_context.createOscillator() },
             { name: 'f4', frequency: 349.2, keyCode: 70 , oscillator: audio_context.createOscillator() },
             { name: 'g4', frequency: 392.0, keyCode: 71 , oscillator: audio_context.createOscillator() },
             { name: 'a4', frequency: 440.0, keyCode: 72 , oscillator: audio_context.createOscillator() },
             { name: 'b4', frequency: 493.9, keyCode: 74 , oscillator: audio_context.createOscillator() },
             { name: 'c5', frequency: 523.3, keyCode: 75 , oscillator: audio_context.createOscillator() },
             { name: 'd5', frequency: 587.3, keyCode: 76 , oscillator: audio_context.createOscillator() },
             { name: 'e5', frequency: 659.3, keyCode: 186, oscillator: audio_context.createOscillator() }];


function play(note) {
  note.oscillator.connect(audio_context.destination);
}

function stop(note) {
  note.oscillator.disconnect();
}

$(function(){
  function setup(note) {
    note.oscillator.type = 'sawtooth'; // sine wave — other values are 'square', 'sawtooth', 'triangle' and 'custom'
    note.oscillator.frequency.value = note.frequency;
    note.oscillator.start(0);
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
    }
  });
});
