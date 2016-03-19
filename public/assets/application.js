var audio_context;
var oscillator;
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
  var i=0;
  while(i<notes.length) {
    if(notes[i].keyCode===note) {
      notes[i].oscillator.connect(audio_context.destination);
      send({name: notes[i].name,action: 'play'});
      i = notes.length;
    } else if(notes[i].name===note) {
      notes[i].oscillator.connect(audio_context.destination);
      send({name: notes[i].name,action: 'play'});
      i = notes.length;
    }
    i++;
  }

}

function stop(note) {
  i=0;
  while(i<notes.length) {
    if(notes[i].keyCode===note) {
      notes[i].oscillator.disconnect();
      send({name: notes[i].name,action: 'stop'});
      i = notes.length;
    } else if(notes[i].name===note) {
      notes[i].oscillator.disconnect();
      send({name: notes[i].name,action: 'stop'});
      i = notes.length;
    }
    i++;
  }
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
    play(e.keyCode);
  });
  $('body').on('keyup', function(e) {
    stop(e.keyCode);
  });
});
