var audio_context;
var n;
var gain;
var destination;
var canvas;
var analyser;
var WIDTH;
var HEIGHT;
start_web_audio();


function start_web_audio(){
  // Create some nodes...
  if(audio_context!=null) audio_context.close();
  audio_context = new (window.AudioContext || window.webkitAudioContext)();
  gain = audio_context.createGain();
  master_gain = audio_context.createGain();
  compressor = audio_context.createDynamicsCompressor();
  compressor.connect(gain);
  gain.gain.value = 1;
  gain.connect(master_gain);
  destination = gain;//compressor;
  master_gain.connect(audio_context.destination);
  
  // Create Noisy node...
  n = new Noisy(audio_context, 16384); 
  beat(440,3200,1); // This function creates noise in a range of the spectrum for a short time.
  //harmonic(440,1); // This function uses Noisy as an oscillator, making only one bin active.
  beat(440,440*3,1.5);
  beat(440,440*6,2);
  beat(493.88,493.88*3,2.5);
  beat(493.88,493.88*6,3);
  beat(554.37,554.37*3,3.5);
  beat(554.37,554.37*6,4);
  beat(587.33,587.33*3,4.5);
  node = n.createNoiseProcessor(); // NoiseProcessor is better if noise is playing for a long time, but it is more CPU consuming though...
  var g = audio_context.createGain();
  g.gain.value = 0;
  node.connect(g); // Noise processor won't start/stop, it gets connected and play. Control it with gain nodes.
  g.connect(destination);
  g.gain.setValueAtTime(1,5)

  // Draw spectrum...
  analyser = audio_context.createAnalyser();
  gain.connect(analyser);
  analyser.fftSize = 4096;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Float32Array(bufferLength);
  var canvas_e = document.getElementsByClassName('visualizer')[0];
  canvas = canvas_e.getContext("2d");
  canvas.clearRect(0, 0, WIDTH, HEIGHT);
  WIDTH = canvas_e.width;
  HEIGHT = canvas_e.height;
  canvas.fillStyle = 'rgb(255, 255, 255)';
  canvas.fillRect(0, 0, WIDTH, HEIGHT);

  draw();
}

function beat(l, h, t){
  var b = n.createNoise(l,h); // Create the node.
  b.start();
  var g = audio_context.createGain(); // Gain node simulating ADSR
  g.gain.value = 0;
  g.gain.linearRampToValueAtTime(0,t);
  g.gain.linearRampToValueAtTime(1,t+0.05);
  g.gain.linearRampToValueAtTime(0.2,t+0.15);
  g.gain.linearRampToValueAtTime(0,t+0.50);
  b.connect(g); // Connect it, just like a regular node.
  g.connect(destination);
}

function harmonic(hz, t){
  var h1 = n.createNoise(hz);
  var h2 = n.createNoise(hz*2);
  var h3 = n.createNoise(hz*3);
  h1.start(t); 
  h1.connect(destination);
  h1.stop(t+1);
  h2.start(t); 
  h2.connect(destination);
  h2.stop(t+1);
  h3.start(t); 
  h3.connect(destination);
  h3.stop(t+1);
}

function draw() {
  canvas.clearRect(0, 0, WIDTH, HEIGHT);
  var freqDomain = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(freqDomain);
  var fac = 4;
  for (var i = 0; i < analyser.frequencyBinCount/fac; i++) {
    var value = freqDomain[i];
    var percent = value / 256;
    var height = HEIGHT * percent;
    var offset = HEIGHT - height - 1;
    var barWidth = WIDTH/analyser.frequencyBinCount*fac;
    var hue = i/analyser.frequencyBinCount * 360;
    canvas.fillStyle = 'hsl(' + 1 + ', 100%, 50%)';
    canvas.fillRect(i * barWidth, offset, barWidth, height);
  }
  var timeDomain = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteTimeDomainData(timeDomain);
  for (var i = 0; i < analyser.frequencyBinCount; i++) {
    var value = timeDomain[i];
    var percent = value / 256;
    var height = HEIGHT * percent;
    var offset = HEIGHT - height - 1;
    var barWidth = WIDTH/analyser.frequencyBinCount;
    canvas.fillStyle = 'black';
    canvas.fillRect(i * barWidth, offset, 1, 1);
  }
  drawVisual = requestAnimationFrame(draw);
}
