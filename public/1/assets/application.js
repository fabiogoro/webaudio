var audio_context;
var oscillator;
var gain;

audio_context = new (window.AudioContext || window.webkitAudioContext)();
oscillator = audio_context.createOscillator();
gain = audio_context.createGain();

oscillator.connect(gain);
gain.connect(audio_context.destination);

oscillator.type = 'sin'; // sine wave — other values are 'square', 'sawtooth', 'triangle' and 'custom'
oscillator.frequency.value = 2500;
oscillator.start(0);
