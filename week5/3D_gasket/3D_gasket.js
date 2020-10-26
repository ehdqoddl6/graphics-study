var gl;
var points = [];
var colors = [];
var NumTimesToSubdivide = 1;

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
    vec3(0, 0, -1),
    vec3(0, 0.9428, 0.3333),
    vec3(-0.8165, -0.4714, 0.3333),
    vec3(0.8165, -0.4714, 0.3333)
  ];

  divideTetra(vertices[0], vertices[1], vertices[2], vertices[3], NumTimesToSubdivide);


  var cBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

  var vColor = gl.getAttribLocation( program, "vColor" );
  gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray( vColor);


  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0); 
  gl.enableVertexAttribArray(vPosition);


  render();
};


function triangle(a, b, c, color){  

  var baseColors = [
    vec3(1.0, 0.0, 0.0),
    vec3(0.0, 1.0, 0.0),
    vec3(0.0, 0.0, 1.0),
    vec3(0.0, 0.0, 0.0)
  ];

  colors.push(baseColors[color]);
  points.push(a);
  colors.push(baseColors[color]);
  points.push(b);
  colors.push(baseColors[color]);
  points.push(c);
}


function tetra(a,b,c,d){

  triangle(b,c,d,3);
  triangle(a,c,b,0);
  triangle(a,c,d,1);
  triangle(a,b,d,2);
}

function divideTetra(a, b, c, d, count){

  if ( count == 0 ) {
    tetra( a, b, c, d);
  }

  else {
    //bisect the sides
    var ab = mix( a, b, 0.5 );
    var ac = mix( a, c, 0.5 );
    var ad = mix( a, d, 0.5 );
    var bc = mix( b, c, 0.5 );
    var bd = mix( b, d, 0.5 );
    var cd = mix( c, d, 0.5 ); 
          
                                   
    count--;
    // three new triangles
    divideTetra(a, ab, ac, ad, count);
    divideTetra(ab, b, bc, bd, count);
    divideTetra(ac, bc, c, cd, count);
    divideTetra(ad, bd, cd, d, count);
  }
  
} 

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, points.length);
}
