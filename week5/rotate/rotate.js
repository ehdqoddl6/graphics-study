var gl;
var theta = 0;
var thetaLoc;

window.onload = function init() {
  var canvas = document.getElementById("gl-canvas");
  //tag와 관련된것
  gl = WebGLUtils.setupWebGL(canvas); //webgl용 canvas로 바꿔줌
  if (!gl) {
    alert("WebGL isn't available");
  }


  gl.viewport(0, 0, canvas.width, canvas.height); 
  gl.clearColor(1.0, 1.0, 1.0, 1.0); 
  gl.enable(gl.DEPTH_TEST);


  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);


  var vertices = [
    vec2(0, 1),
    vec2(-1, 0),
    vec2(1, 0),
    vec2(0, -1)
  ];


  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);

  thetaLoc = gl.getUniformLocation(program, "theta");

  setInterval(render, 100);


};


function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  theta += 0.1;
  gl.uniform1f(thetaLoc, theta);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
