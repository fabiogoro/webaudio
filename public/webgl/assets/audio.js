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

function sound(speed_value) {
  var now = audio_context.currentTime;
  gain.gain.value = speed_value;
  gain.gain.cancelScheduledValues( now );
  gain.gain.setValueAtTime(gain.gain.value, now);
  gain.gain.linearRampToValueAtTime(0 , now + 1);
  oscillator.frequency.value = min_freq + speed_value * (max_freq-min_freq);
}
