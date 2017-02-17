var audio_context;
var gain;

audio_context = new (window.AudioContext || window.webkitAudioContext)();

var notes = [{ name: 'c4', frequency: 261.6, keyCode: 65 , oscillator: audio_context.createOscillator(), i: 0 },
             { name: 'd4', frequency: 293.7, keyCode: 83 , oscillator: audio_context.createOscillator(), i: 0 },
             { name: 'e4', frequency: 329.6, keyCode: 68 , oscillator: audio_context.createOscillator(), i: 0 },
             { name: 'f4', frequency: 349.2, keyCode: 70 , oscillator: audio_context.createOscillator(), i: 0 },
             { name: 'g4', frequency: 392.0, keyCode: 71 , oscillator: audio_context.createOscillator(), i: 0 },
             { name: 'a4', frequency: 440.0, keyCode: 72 , oscillator: audio_context.createOscillator(), i: 0 },
             { name: 'b4', frequency: 493.9, keyCode: 74 , oscillator: audio_context.createOscillator(), i: 0 },
             { name: 'c5', frequency: 523.3, keyCode: 75 , oscillator: audio_context.createOscillator(), i: 0 },
             { name: 'd5', frequency: 587.3, keyCode: 76 , oscillator: audio_context.createOscillator(), i: 0 },
             { name: 'e5', frequency: 659.3, keyCode: 186, oscillator: audio_context.createOscillator(), i: 0 }];

function key_lookup(note){
  if(note.action===1) {
    notes[note.name].oscillator.connect(audio_context.destination);
  } else {
    notes[note.name].oscillator.disconnect();
  }
}

function hit(button, note) {
  send(note);
  if(note.action === 1)
    $(button).off(hit);
  else
    $(button).on(hit);
}

$(function() {
  function setup(note) {
    note.oscillator.type = 'sawtooth'; // sine wave — other values are 'square', 'sawtooth', 'triangle' and 'custom'
    note.oscillator.frequency.value = note.frequency;
    note.oscillator.start(0);
  }
  for(var i=0;i<notes.length;i++){
    setup(notes[i]);
  }

  $('body').on('keydown', function(e) {
    data = null;
    switch (e.keyCode) {
      case 65: if(!notes[0].i){data = {name: 0, action: 1}; notes[0].i++;} break;
      case 83: if(!notes[1].i){data = {name: 1, action: 1}; notes[1].i++;} break;
      case 68: if(!notes[2].i){data = {name: 2, action: 1}; notes[2].i++;} break;
      case 70: if(!notes[3].i){data = {name: 3, action: 1}; notes[3].i++;} break;
      case 71: if(!notes[4].i){data = {name: 4, action: 1}; notes[4].i++;} break;
      case 72: if(!notes[5].i){data = {name: 5, action: 1}; notes[5].i++;} break;
      case 74: if(!notes[6].i){data = {name: 6, action: 1}; notes[6].i++;} break;
      case 75: if(!notes[7].i){data = {name: 7, action: 1}; notes[7].i++;} break;
      case 76: if(!notes[8].i){data = {name: 8, action: 1}; notes[8].i++;} break;
    }
    if(data)
      send(data);
  });
  $('body').on('keyup', function(e) {
    data = null;
    switch (e.keyCode) {
      case 65: data = {name: 0, action: 0}; notes[0].i--; break;
      case 83: data = {name: 1, action: 0}; notes[1].i--; break;
      case 68: data = {name: 2, action: 0}; notes[2].i--; break;
      case 70: data = {name: 3, action: 0}; notes[3].i--; break;
      case 71: data = {name: 4, action: 0}; notes[4].i--; break;
      case 72: data = {name: 5, action: 0}; notes[5].i--; break;
      case 74: data = {name: 6, action: 0}; notes[6].i--; break;
      case 75: data = {name: 7, action: 0}; notes[7].i--; break;
      case 76: data = {name: 8, action: 0}; notes[8].i--; break;
    }
    if(data)
      send(data);
  });
});
