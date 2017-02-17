var audio_context;
var gain;
var beat_interval = $('#speed').val()*20;
var note_sequence = [];
var different_waveforms = 0;
var x = 0;

function init(){
  audio_context = new (window.AudioContext || window.webkitAudioContext)();
  gain = audio_context.createGain();
  gain.gain.value = 1;
  gain.connect(audio_context.destination);

  note_sequence = [[pitch(0),1],
                   [pitch(1),0.9],
                   [pitch(2),0.6],
                   [pitch(3),0.5],
                   [pitch(4),0.45],
                   [pitch(5),0.45],
                   [pitch(6),0.4],
                   [pitch(0),1],
                   [pitch(1),0.9],
                   [pitch(2),0.6],
                   [pitch(3),0.5],
                   [pitch(4),0.45],
                   [pitch(5),0.45],
                   [pitch(6),0.4]
                  ];
}

function beat(){
  for(var i=0;i<note_sequence.length;i++){
    var oscillator = audio_context.createOscillator();
    var note_gain = audio_context.createGain();
    note_gain.gain.value = note_sequence[note_sequence.length-1-i][1];

    oscillator.connect(note_gain);
    note_gain.connect(gain);

    oscillator.frequency.value = note_sequence[note_sequence.length-1-i][0];
    oscillator.start(audio_context.currentTime+(i)*beat_interval/1000);
    oscillator.stop(audio_context.currentTime+(i+0.5)*beat_interval/1000);

    if(i>6 || x){
      oscillator = audio_context.createOscillator();
      if(different_waveforms) oscillator.type = 'sawtooth';
      note_gain = audio_context.createGain();
      note_gain.gain.value = note_sequence[i][1];

      oscillator.connect(note_gain);
      note_gain.connect(gain);

      oscillator.frequency.value = note_sequence[i][0];
      oscillator.start(audio_context.currentTime+(i+0.5)*beat_interval/1000);
      oscillator.stop(audio_context.currentTime+(i+1)*beat_interval/1000);
    }
  }
  if(x) x = 0;
}

function play_X(){
  x = 1;
  play_whole();
}
function play_whole(){
  note_sequence = [[pitch(0),1],
                   [pitch(1),0.9],
                   [pitch(2),0.6],
                   [pitch(3),0.5],
                   [pitch(4),0.45],
                   [pitch(5),0.45],
                   [pitch(6),0.4],
                   [pitch(0),1],
                   [pitch(1),0.9],
                   [pitch(2),0.6],
                   [pitch(3),0.5],
                   [pitch(4),0.45],
                   [pitch(5),0.45],
                   [pitch(6),0.4]
                  ];
  play();
}

function play_asc(){
  note_sequence = [[pitch(0),1],
                   [pitch(1),0.9],
                   [pitch(2),0.6],
                   [pitch(3),0.5],
                   [pitch(4),0.45],
                   [pitch(5),0.45],
                   [pitch(6),0.4]
                  ];
  play();
}
function play_dsc(){
  note_sequence = [[pitch(6),0.4],
                   [pitch(5),0.45],
                   [pitch(4),0.45],
                   [pitch(3),0.5],
                   [pitch(2),0.6],
                   [pitch(1),0.9],
                   [pitch(0),1]
                  ];
  play();
}
function play_v(){
  note_sequence = [[pitch(0),1],
                   [pitch(1),0.9],
                   [pitch(2),0.6],
                   [pitch(3),0.5],
                   [pitch(2),0.6],
                   [pitch(1),0.9],
                   [pitch(0),1]
                  ];
  play();
}

function play(){
  beat_interval = $('#speed').val()*20;
  beat();
}

function waveform(e){
  different_waveforms = (different_waveforms+1)%2
  if(different_waveforms) $(e).html('Desativar ondas diferentes');
  else $(e).html('Ativar ondas diferentes');
}

init();

function pitch(p) { return Math.pow(2,((p)/3))*400; }
function freq(f) { return Math.round(Math.log2(f/400)*3); }

var canvas;
var bufferLength;
var bin_size;
$(function(){
  var analyser = audio_context.createAnalyser();
  gain.connect(analyser);
  analyser.fftSize = 16384;
  bin_size = 22010/analyser.fftSize*2;
  analyser.smoothingTimeConstant = 0.5;
  bufferLength = analyser.frequencyBinCount/8;
  bufferLengthtime = analyser.frequencyBinCount/16;
  var dataArray = new Float32Array(bufferLength);
  var canvas_e = $('.visualizer')[0];
  canvas = canvas_e.getContext("2d");
  canvas.clearRect(0, 0, WIDTH, HEIGHT);
  var WIDTH = canvas_e.width;
  var HEIGHT = canvas_e.height;
  canvas.fillStyle = 'rgb(255, 255, 255)';
  canvas.fillRect(0, 0, WIDTH, HEIGHT);

  function draw() {
    canvas.clearRect(0, 0, WIDTH, HEIGHT);
    var freqDomain = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(freqDomain);
    var value = [0,0,0,0,0,0,0];
    for (var i = 4; i < bufferLength; i++) {
      value[freq(i*bin_size)%7] += freqDomain[i];
      var percent = value / 256;
      var height = HEIGHT * percent;
      var offset = HEIGHT - height - 1;
      var barWidth = WIDTH/100;
      var hue = i/bufferLength * 360;
      //canvas.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
      //canvas.fillRect(freq(i*bin_size) * barWidth, offset, barWidth, height);
    }
    var max = 0;
    for (var i = 0; i < value.length; i++) {
      //value[i] = Math.pow(value[i],2);
      if(value[i]>max) max = value[i];
    }
    for (var i = 0; i < value.length; i++) {
      //var value = freqDomain[i];
      //console.log(value);
      var percent = value[i] / max;
      var height = HEIGHT * percent;
      var offset = HEIGHT - height - 1;
      var barWidth = WIDTH/12;
      var hue = i/12 * 360;
      canvas.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
      canvas.fillRect(i * barWidth, offset, barWidth, height);
    }
    drawVisual = requestAnimationFrame(draw);
  }

  draw();
});
