function Noisy(audio_context){
  this.audio_context = audio_context || this._create_context();
  this._size = 65536;
  this._fft = new FFT(this._size);
}

Noisy.prototype._create_context = function _create_context(){
  return new (window.AudioContext || window.webkitAudioContext)();
}

Noisy.prototype._noise_block = function _noise_block(bottom, top){
  const audio_context = this.audio_context;
  const size = this._size;
  const fft = this._fft;
  const out = fft.createComplexArray();
  const res = fft.createComplexArray();
  const bottom_bin = Math.round(bottom*size/audio_context.sampleRate);
  const top_bin = Math.round(top*size/audio_context.sampleRate);

  var norm = 0;
  out.fill(0);
  for (var i = bottom_bin*2; i < top_bin*2; i+=2) {
    var rand = Math.random()*2-1;
    out[i] = rand;
    out[2*size-i-2] = rand;
    norm += 2*rand*rand;
  }
  var n = Math.sqrt(norm/(size));
  for (var i = bottom_bin*2; i < top_bin*2; i+=2) {
    out[2*size-i-2] /= n;
    out[i] /= n;
  }

  fft.inverseTransform(res,out);
  return fft.fromComplexArray(res);
}

Noisy.prototype._noise_gen = function _createNoise(bottom, top){
  const size = this._size;
  const audio_context = this.audio_context;
  var block1 = this._noise_block(top,bottom);
  var block2 = this._noise_block(top,bottom);
  var noise_buffer = audio_context.createBuffer(1, size, audio_context.sampleRate);
  var output = noise_buffer.getChannelData(0);
  for (var i = 0; i < size/2; i++) {
    output[i] = (block1[i]+block2[size/2+i]);
    output[i+size/2] = (block1[i+size/2]+block2[i]);
  }
  var max = Math.max.apply(null,output);
  for (var i = 0; i < size; i++) {
    output[i] /= max;
  }
  return noise_buffer;
}

Noisy.prototype.createNoise = function createNoise(bottom, top){
  const audio_context = this.audio_context;
  var noise_node = audio_context.createBufferSource();
  noise_node.buffer = this._noise_gen(top,bottom);
  noise_node.loop = true;
  return noise_node;
}
