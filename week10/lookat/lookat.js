
var canvas;
var gl;

var numVertices = 36;

var pointsArray = [];
var colorsArray = [];

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 ),
];

var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
];

var radius = 1.0;
var theta = 0.0;
var phi = 0.0;
var dr = 5.0* Math.PI/180.0;

var mvMatrix;
var modelView;
var eye;

const at = vec3(0.0,0.0,0.0);
const up = vec3(0.0,1.0,0.0);

function quad(a,b,c,d){

    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[b]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[a]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[c]);
    colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[d]);
    colorsArray.push(vertexColors[a]);
}

function colorCube(){

    quad(1,0,3,2);
    quad(2,3,7,6);
    quad(3,0,4,7);
    quad(6,5,1,2);
    quad(4,5,6,7);
    quad(5,4,0,1);
}

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    colorCube();
    
    // Make buffer for color
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    // connect vColor variable in vertex shader with JavaScript
    // and set color
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    // make buffer for vertex's position
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    // connect vPosition variable in vertex shader with JavaScript
    // and set position
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    //load uniform modelView
    modelView = gl.getUniformLocation(program, "modelView"); 
    
    //event listeners for buttons
    document.getElementById('button1').onclick = function () {
        radius *= 1.1;
    };
    document.getElementById('button2').onclick = function () {
        radius *= 0.9;
    };
    document.getElementById('button3').onclick = function () {
        theta += dr;
    };
    document.getElementById('button4').onclick = function () {
        theta -= dr;
    };
    document.getElementById('button5').onclick = function () {
        phi += dr;
    };
    document.getElementById('button6').onclick = function () {
        phi -=dr;
    };
        
    render();
}

var render = function()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(radius*Math.cos(theta)*Math.sin(phi), radius*Math.sin(theta), radius*Math.cos(theta)*Math.cos(phi));
    mvMatrix = lookAt(eye, at, up);
    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
    
    gl.drawArrays(gl.TRIANGLES,0,numVertices);
    
    requestAnimFrame(render);
    
}

