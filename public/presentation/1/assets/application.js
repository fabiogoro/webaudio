var audio_context;
var oscillator;
var gain;

audio_context = new (window.AudioContext || window.webkitAudioContext)();
oscillator = audio_context.createOscillator();

oscillator.type = 'sin'; // sine wave — other values are 'square', 'sawtooth', 'triangle' and 'custom'
oscillator.frequency.value = 261.6;
oscillator.start();

oscillator.connect(audio_context.destination);
