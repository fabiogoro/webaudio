var audio_context;
var oscillator;
var gain;
var max_freq = 6000;

audio_context = new (window.AudioContext || window.webkitAudioContext)();

oscillator = audio_context.createOscillator();
gain = audio_context.createGain();

oscillator.connect(gain);
gain.connect(audio_context.destination);

oscillator.type = 'sin'; // sine wave — other values are 'square', 'sawtooth', 'triangle' and 'custom'
oscillator.frequency.value = 3000;
oscillator.start(0);


document.onmousemove = update_page;

function update_page(e) {
  oscillator.frequency.value = calculate_frequency(e);
}

function calculate_frequency(e) {
  return (e.pageX/$(window).width()+e.pageY/$(window).height())/2 * max_freq;
}
