var audio_context;
var oscillator;
var gain;
window.addEventListener('touchend',start,false);
window.addEventListener('click',start,false);
function start() {
  audio_context = new (window.AudioContext || window.webkitAudioContext)();
  oscillator = audio_context.createOscillator();

  oscillator.type = 'sine';
  oscillator.frequency.value = 261.6;
  oscillator.start(0);

  oscillator.connect(audio_context.destination);

  if (/(iPhone|iPad)/i.test(navigator.userAgent)) {
    var buffer = audio_context.createBuffer(1, 1, desiredSampleRate);
    var dummy = audio_context.createBufferSource();
    dummy.buffer = buffer;
    dummy.connect(audio_context.destination);
    dummy.start(0);
    dummy.disconnect();

    audio_context.close();
    audio_context = new (window.AudioContext || window.webkitAudioContext)();
  }
}

