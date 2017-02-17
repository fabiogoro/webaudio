var audio_context;
var oscillator;
var min_freq = 261.6;
var max_freq = 659.3;
var mouse_pos_value;

audio_context = new (window.AudioContext || window.webkitAudioContext)();
oscillator = audio_context.createOscillator();

oscillator.type = 'sin'; // sine wave — other values are 'square', 'sawtooth', 'triangle' and 'custom'
oscillator.frequency.value = 261.6;
oscillator.start(0);

oscillator.connect(audio_context.destination);

$(document).mousemove(function(document) {
  mouse_pos_value = get_mouse_pos_value(document);
  oscillator.frequency.value = min_freq + mouse_pos_value * (max_freq-min_freq);
});

function get_mouse_pos_value(element){
  width_value = element.pageX/$(window).width();
  height_value = element.pageY/$(window).height();
  return (width_value+height_value)/2;
}
