var audio_context;
var oscillator;
var gain;

audio_context = new (window.AudioContext || window.webkitAudioContext)();

var c4 = { name: 'C4', frequency: 261.6, oscillator: audio_context.createOscillator() };
var d4 = { name: 'D4', frequency: 293.7, oscillator: audio_context.createOscillator() };
var e4 = { name: 'E4', frequency: 329.6, oscillator: audio_context.createOscillator() };
var f4 = { name: 'F4', frequency: 349.2, oscillator: audio_context.createOscillator() };
var g4 = { name: 'G4', frequency: 392.0, oscillator: audio_context.createOscillator() };
var a4 = { name: 'A4', frequency: 440.0, oscillator: audio_context.createOscillator() };
var b4 = { name: 'B4', frequency: 493.9, oscillator: audio_context.createOscillator() };
var c5 = { name: 'C5', frequency: 523.3, oscillator: audio_context.createOscillator() };
var d5 = { name: 'D5', frequency: 587.3, oscillator: audio_context.createOscillator() };
var e5 = { name: 'E5', frequency: 659.3, oscillator: audio_context.createOscillator() };



function play(note) {
  note.oscillator.connect(audio_context.destination);
  connection.send({name: note.name,action: 'play'});
}

function stop(note) {
  note.oscillator.disconnect();
  connection.send({name: note.name,action: 'stop'});
}

$(function(){
  function setup(note) {
    note.oscillator.type = 'sawtooth'; // sine wave — other values are 'square', 'sawtooth', 'triangle' and 'custom'
    note.oscillator.frequency.value = note.frequency;
    note.oscillator.start(0);
  }
  setup(c4);
  setup(d4);
  setup(e4);
  setup(f4);
  setup(g4);
  setup(a4);
  setup(b4);
  setup(c5);
  setup(d5);
  setup(e5);

  $('body').on('keydown', function(e) {
    switch (e.keyCode) {
      case 65: play(c4); break;
      case 83: play(d4); break;
      case 68: play(e4); break;
      case 70: play(f4); break;
      case 71: play(g4); break;
      case 72: play(a4); break;
      case 74: play(b4); break;
      case 75: play(c5); break;
    }
  });
  $('body').on('keyup', function(e) {
    switch (e.keyCode) {
      case 65: stop(c4); break;
      case 83: stop(d4); break;
      case 68: stop(e4); break;
      case 70: stop(f4); break;
      case 71: stop(g4); break;
      case 72: stop(a4); break;
      case 74: stop(b4); break;
      case 75: stop(c5); break;
    }
  });
});
