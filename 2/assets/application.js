var audio_context;
var oscillator;
var gain;

audio_context = new (window.AudioContext || window.webkitAudioContext)();

function play(e){
  oscillator = audio_context.createOscillator();
  gain = audio_context.createGain();

  oscillator.connect(gain);
  gain.connect(audio_context.destination);

  oscillator.type = 'sin'; // sine wave — other values are 'square', 'sawtooth', 'triangle' and 'custom'
  oscillator.frequency.value = 2500;
  oscillator.start(0);

  $(e).attr('onclick', 'stop(this);');
  $(e).html('<i class="fa fa-stop"></i>');
  change_frequency($('#frequency'));
  change_waveform($('#waveform'));
}

function stop(e){
  oscillator.stop(0);
  $(e).attr('onclick', 'play(this);');
  $(e).html('<i class="fa fa-play"></i>');
}

function change_frequency(e){
  oscillator.frequency.value = modulate_frequency(e);
}

function modulate_frequency(e){
  return $(e).val()*50+100;
}

function change_waveform(e){
  oscillator.type = $(e).val();
}
