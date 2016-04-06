var canvas;
var gl;
var program;

var modelView;
var ypos = 4.0;
var gravity = -9.81;
var speed = 0;
var friction = 0.8;

var eye;
const at = vec3(0.0, -1.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var projection;
var left = -3;
var right = 3;
var ytop = 0.0;
var bottom = -6.0;
var near = -10;
var far = 10;

var vertices = [];
var normals = [];
var indices = [];
var index = 0;
var ballDivision = 2;

var ballStyle;

var floorBufferId;

var lightPosition = vec4(1.0, 1.0, 1.0, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1, 0.0, 0.0, 1.0 );
var materialDiffuse = vec4( 0.5, 0.0, 0.0, 1.0 );
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 20.0;

window.onload = function init()
{
  canvas = document.getElementById( "gl-canvas" );

  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }
  ballStyle = gl.TRIANGLES;

  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor(0.0, 0.0, 0.1, 1.0);
  gl.enable( gl.DEPTH_TEST );

  program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );

  build();

  render();
};

function build(){
  var specularProduct = mult(lightSpecular, materialSpecular);

  sphere([0.0, 0.0, -1.0, 1], [0.0, 0.942809, 0.333333, 1], [-0.816497, -0.471405, 0.333333, 1], [0.816497, -0.471405, 0.333333, 1], ballDivision);

  vertices.push(5.0,0.0,10.0,1, -5.0,0.0,10.0,1, 5.0,0.0,-10.0,1,-5.0,0.0,-10.0,1);
  normals.push(1,1,1,0.0, 1,1,1,0.0, 1,1,1,1.0, 1,1,1,0.0);

  var nBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
  gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );

  var vNormal = gl.getAttribLocation( program, "vNormal" );
  gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vNormal);

  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation( program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  var indexBufferId = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferId);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
  projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
  normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );

  gl.uniform4fv( gl.getUniformLocation(program,
     "specularProduct"),flatten(specularProduct) );
  gl.uniform4fv( gl.getUniformLocation(program,
     "lightPosition"),flatten(lightPosition) );
  gl.uniform1f( gl.getUniformLocation(program,
     "shininess"),materialShininess );

  projection = ortho( left, right, bottom, ytop, near, far );
  eye = vec3(0, 0, 6*Math.cos(0));
}

function render() {
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
  materialAmbient = vec4( 0, 1.0, 0.0, 1.0 );
  var ambientProduct = mult(lightAmbient, materialAmbient);
  gl.uniform4fv( gl.getUniformLocation(program,
     "ambientProduct"),flatten(ambientProduct) );

  modelView = lookAt( eye, at, up );
  normalMatrix = [
      vec3(modelView[0][0], modelView[0][1], modelView[0][2]),
      vec3(modelView[1][0], modelView[1][1], modelView[1][2]),
      vec3(modelView[2][0], modelView[2][1], modelView[2][2])
  ];

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelView) );
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projection) );
  gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );

  gl.drawArrays(gl.TRIANGLES, index, 3);
  gl.drawArrays(gl.TRIANGLES, index+1, 3);

  speed += gravity/1000;
  ypos += speed;
  if(ypos<1){
    speed = -speed*friction;
    ypos = 1;
    if(speed > 0.015) {
      ballDivision++;
      if(ballDivision>6) ballDivision = 2;
      vertices = [];
      normals = [];
      indices = [];
      index = 0;
      build();
      sound(speed);
    }
  }
  materialAmbient = vec4( 1.0, 1.0, 0.0, 1.0 );
  materialDiffuse = vec4( 1.0, 1.0, 0.0, 1.0 );
  var ambientProduct = mult(lightAmbient, materialAmbient);
  var diffuseProduct = mult(lightDiffuse, materialDiffuse);
  gl.uniform4fv( gl.getUniformLocation(program,
    "ambientProduct"),flatten(ambientProduct) );
  gl.uniform4fv( gl.getUniformLocation(program,
    "diffuseProduct"),flatten(diffuseProduct) );

  modelView = lookAt( eye, at, up );
  modelView = mult(modelView, translate([0, ypos, 1] ));
  normalMatrix = [
      vec3(modelView[0][0], modelView[0][1], modelView[0][2]),
      vec3(modelView[1][0], modelView[1][1], modelView[1][2]),
      vec3(modelView[2][0], modelView[2][1], modelView[2][2])
  ];

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelView) );
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projection) );
  gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );

  gl.uniformMatrix4fv( gl.getUniformLocation(program,
          "modelViewMatrix"), false, flatten(modelView) );

  gl.drawElements(ballStyle, index, gl.UNSIGNED_SHORT, 0);

  materialAmbient = vec4( 0.3, 0.0, 0.0, 1.0 );
  materialDiffuse = vec4( 0.3, 0.0, 0.0, 1.0 );
  var ambientProduct = mult(lightAmbient, materialAmbient);
  var diffuseProduct = mult(lightDiffuse, materialDiffuse);
  gl.uniform4fv( gl.getUniformLocation(program,
    "ambientProduct"),flatten(ambientProduct) );
  gl.uniform4fv( gl.getUniformLocation(program,
    "diffuseProduct"),flatten(diffuseProduct) );

  modelView = lookAt( eye, at, up );
  modelView = mult(modelView, translate([2,ypos,-2] ));

  gl.uniformMatrix4fv( gl.getUniformLocation(program,
          "modelViewMatrix"), false, flatten(modelView) );

  gl.drawElements(ballStyle, index, gl.UNSIGNED_SHORT, 0);

  materialAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );
  materialDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
  var ambientProduct = mult(lightAmbient, materialAmbient);
  var diffuseProduct = mult(lightDiffuse, materialDiffuse);
  gl.uniform4fv( gl.getUniformLocation(program,
    "ambientProduct"),flatten(ambientProduct) );
  gl.uniform4fv( gl.getUniformLocation(program,
    "diffuseProduct"),flatten(diffuseProduct) );

  modelView = lookAt( eye, at, up );
  modelView = mult(modelView, translate([-2,ypos,-1] ));

  gl.uniformMatrix4fv( gl.getUniformLocation(program,
          "modelViewMatrix"), false, flatten(modelView) );

  gl.drawElements(ballStyle, index, gl.UNSIGNED_SHORT, 0);

  animation = window.requestAnimFrame(render);
}

function sphere(a, b, c, d, n) {
  divideTriangle(a, b, c, n);
  divideTriangle(a, c, d, n);
  divideTriangle(a, d, b, n);
  divideTriangle(d, c, b, n);
}

function divideTriangle(a, b, c, count) {
  if ( count > 0 ) {
    var ab = [(a[0]+b[0])/2, (a[1]+b[1])/2, (a[2]+b[2])/2, (a[3]+b[3])/2];
    var ac = [(a[0]+c[0])/2, (a[1]+c[1])/2, (a[2]+c[2])/2, (a[3]+c[3])/2];
    var bc = [(c[0]+b[0])/2, (c[1]+b[1])/2, (c[2]+b[2])/2, (c[3]+b[3])/2];

    ab = normalize(ab,true);
    ac = normalize(ac,true);
    bc = normalize(bc,true);

    divideTriangle( ab, bc, ac, count - 1 );
    divideTriangle( bc, c, ac, count - 1 );
    divideTriangle( a, ab, ac, count - 1 );
    divideTriangle( ab, b, bc, count - 1 );
  }
  else {
    triangle( a, b, c );
  }
}

function triangle(a, b, c) {
  for(var i=0; i<4; i++){
    vertices.push(a[i]);
  }
  indices.push(index++);
  for( i=0; i<4; i++){
    vertices.push(b[i]);
  }
  indices.push(index++);
  for( i=0; i<4; i++){
    vertices.push(c[i]);
  }
  indices.push(index++);

  var t1 = subtract(b, a);
  var t2 = subtract(c, a);
  var normal = normalize(cross(t2, t1));
  normal = vec4(normal);
  normal[3]  = 0.0;

  normals.push(normal);
  normals.push(normal);
  normals.push(normal);
}
