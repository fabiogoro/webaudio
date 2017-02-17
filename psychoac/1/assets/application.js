var audio_context;
var gain;
var beat_interval = $('#speed').val()*20;
var note_sequence = [];
var playback = 1;

function init(){
  audio_context = new (window.AudioContext || window.webkitAudioContext)();
  gain = audio_context.createGain();
  gain.gain.value = 1;

  note_sequence = [[200,1],
                   [500,0.1],
                   [225,0.95],
                   [475,0.15],
                   [250,0.9],
                   [450,0.2]
                  ];
  playback = setInterval(beat, beat_interval*note_sequence.length);
}

function beat(){
  for(var i=0;i<note_sequence.length;i++){
    var oscillator = audio_context.createOscillator();
    var note_gain = audio_context.createGain();
    note_gain.gain.value = note_sequence[i][1];

    oscillator.connect(note_gain);
    note_gain.connect(gain);

    oscillator.frequency.value = note_sequence[i][0];
    oscillator.start(audio_context.currentTime+(i+0.1)*beat_interval/1000);
    oscillator.stop(audio_context.currentTime+(i+0.9)*beat_interval/1000);
  }
  setTimeout(set_beat, beat_interval*note_sequence.length-50);
}

function play(e){
  gain.connect(audio_context.destination);

  $(e).attr('onclick', 'stop(this);');
  $(e).html('<i class="fa fa-stop"></i>');
}

function stop(e){
  gain.disconnect();
  $(e).attr('onclick', 'play(this);');
  $(e).html('<i class="fa fa-play"></i>');
}

function set_beat(){
  if($('#speed').val()*20 !== beat_interval){
    clearInterval(playback);
    beat_interval = $('#speed').val()*20;
    beat();
    playback = setInterval(beat, beat_interval*note_sequence.length);
  }
}

function set_frequency(e){
  var factor = 1+e.val()/100;
  note_sequence[1][0] = note_sequence[1][0]*factor;
  note_sequence[3][0] = note_sequence[3][0]*factor;
  note_sequence[5][0] = note_sequence[5][0]*factor;
  note_sequence[1][1] = note_sequence[1][1]/factor;
  note_sequence[3][1] = note_sequence[3][1]/factor;
  note_sequence[5][1] = note_sequence[5][1]/factor;
}

init();
