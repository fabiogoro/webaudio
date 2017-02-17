function pause(e){
  $(e).attr('onclick', 'play(this);');
  $(e).html('<i class="fa fa-play"></i>');
  window.cancelAnimationFrame(animation);
}

function play(e){
  $(e).attr('onclick', 'pause(this);');
  $(e).html('<i class="fa fa-pause"></i>');
  render();
}

function restart(){
  ballDivision = 2;
  vertices = [];
  normals = [];
  indices = [];
  index = 0;
  speed = 0;
  ypos = 4.0;
  build();
}

function wire(e){
  $(e).attr('onclick', 'shaded(this);');
  $(e).html('Shade');
  ballStyle = gl.LINES;
}

function shaded(e){
  $(e).attr('onclick', 'wire(this);');
  $(e).html('Wire');
  ballStyle = gl.TRIANGLES;
}

function changeGravity(inc){
  gravity += inc;
  $('#grav').html(-gravity.toFixed(2));
}
