var audio_context = new (window.AudioContext || window.webkitAudioContext)();
var oscillator;
var gain;

function play(e){
  oscillator = audio_context.createOscillator();
  gain = audio_context.createGain();

  oscillator.connect(gain);
  gain.connect(audio_context.destination);

  oscillator.type = 'square'; // sine wave — other values are 'square', 'sawtooth', 'triangle' and 'custom'
  oscillator.frequency.value = 2500;
  oscillator.start(0);

  gain.gain.value = 1;
  $(e).attr('onclick', 'stop(this);');
  $(e).html('<i class="fa fa-stop"></i>');
}

function stop(e){
  oscillator.stop(0);
  $(e).attr('onclick', 'play(this);');
  $(e).html('<i class="fa fa-play"></i>');
}

function change_frequency(e){
  oscillator.frequency.value = $(e).val()*50+100;
}
