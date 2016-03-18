var audio_context;
var oscillator;
var gain;
var cur_x;
var cur_y;
var max_freq = 6000;
var max_vol = 0.02;
var initial_freq = 3000;
var initial_vol = 0.001;

audio_context = new (window.AudioContext || window.webkitAudioContext)();

oscillator = audio_context.createOscillator();
gain = audio_context.createGain();

oscillator.connect(gain);
gain.connect(audio_context.destination);

oscillator.type = 'sin'; // sine wave — other values are 'square', 'sawtooth', 'triangle' and 'custom'
oscillator.frequency.value = initial_freq;
oscillator.start(0);

document.onmoudexsemove = update_page;

function update_page(e) {
  cur_x = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
  cur_y = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);

  oscillator.frequency.value = (cur_x/WIDTH) * max_freq;
  gain.gain.value = (cur_y/HEIGHT) * max_vol;
}
