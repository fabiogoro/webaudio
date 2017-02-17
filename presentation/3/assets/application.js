var audio_context;
var oscillator;
var gain;

audio_context = new (window.AudioContext || window.webkitAudioContext)();

oscillator = audio_context.createOscillator();
gain = audio_context.createGain();

oscillator.connect(gain);

oscillator.type = 'sin'; // sine wave — other values are 'square', 'sawtooth', 'triangle' and 'custom'
oscillator.frequency.value = 261.6;
oscillator.start(0);

function play(e){
  gain.connect(audio_context.destination);

  $(e).attr('onclick', 'stop(this);');
  $(e).html('<i class="fa fa-stop"></i>');
  change_frequency($('#frequency'));
  change_waveform($('#waveform'));
}

function stop(e){
  gain.disconnect();
  $(e).attr('onclick', 'play(this);');
  $(e).html('<i class="fa fa-play"></i>');
}

function change_frequency(e){
  oscillator.frequency.value = ($(e).val()/100)*(659.3-261.6)+261.6;
}

function change_waveform(e){
  oscillator.type = $(e).val();
}

function change_gain(e){
  gain.gain.value = $(e).val()/100;
}
