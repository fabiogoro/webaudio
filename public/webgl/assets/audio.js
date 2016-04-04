var audio_context;
var oscillator;
var gain;
var min_freq = 261.6;
var max_freq = 659.3;
var mouse_pos_value;

audio_context = new (window.AudioContext || window.webkitAudioContext)();
oscillator = audio_context.createOscillator();
gain = audio_context.createGain();

oscillator.type = 'sin';
oscillator.frequency.value = 261.6;

oscillator.connect(gain);
gain.connect(audio_context.destination);

oscillator.start(0);
gain.gain.value = 0;
