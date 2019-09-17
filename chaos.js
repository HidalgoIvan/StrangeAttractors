var MAX_POINTS = 3000;
var line;
var drawCount;
var scene = new THREE.Scene();
const url = "https://mypage.com/StrangeAttractors/";
renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000000 );
camera.position.set( 0, 0, 50 );
//https://mypage.com/StrangeAttractors/?eqX=a*(y-x)&eqY=x*(b-z)-y&eqZ=x*y-c&a=5&b=28&c=2.6666666666666665
//https://mypage.com/StrangeAttractors/?eqX=a*(y-x)&eqY=x*(b-z)-y&eqZ=x*y+a*b&a=5&b=5&c=1
//https://mypage.com/StrangeAttractors/?eqX=(y-x)*c&eqY=a*(b-x-z)&eqZ=x*y-c*z&a=50&b=35&c=15
// controls
controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 10;
controls.maxDistance = 500000;
var geometry = new THREE.BufferGeometry();

// attributes
var positions = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point
geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

// drawcalls
drawCount = 2; // draw the first 2 points, only
geometry.setDrawRange( 0, drawCount );

// material
var material = new THREE.LineBasicMaterial( { color: 0xff0000, linewidth: 2 } );

// line
line = new THREE.Line( geometry,  material );
line.material.color.setHSL( Math.random(), 1, 0.5 );
scene.add( line );
var x = 0.01;
var y = 0; 
var z = 0;
var a = eval(document.getElementById("a").value);
var b = eval(document.getElementById("b").value);
var c = eval(document.getElementById("c").value);
var equationX = document.getElementById("equationX").value;
var equationY = document.getElementById("equationY").value;
var equationZ = document.getElementById("equationZ").value;
var dt, dx, dy, dz;
// update positions
updatePositions();

function updatePositions() {

	var positions = line.geometry.attributes.position.array;

	var index = 0;

	for ( var i = 0, l = MAX_POINTS; i < l; i ++ ) {

		positions[ index ++ ] = x;
		positions[ index ++ ] = y;
		positions[ index ++ ] = z;
		
        // attractor is here
        dt = 0.01;
        dx = eval(equationX) * dt;
        dy = eval(equationY) * dt;
        dz = eval(equationZ) * dt;
        x = x + dx;
        y = y + dy;
        z = z + dz;

	}
}
var points = [];
var point = new THREE.Mesh(geometry, material);
point.position.x = -1.0;
point.position.y = -1.0;
scene.add(point);
animate();

function animate(){
    requestAnimationFrame(animate);

    drawCount = ( drawCount + 1 ) % MAX_POINTS;

	line.geometry.setDrawRange( 0, drawCount );

	if ( drawCount === 0 ) {

		// periodically, generate new data

		updatePositions();

		line.geometry.attributes.position.needsUpdate = true; // required after the first render

		line.material.color.setHSL( Math.random(), 1, 0.5 );
	}

    controls.update();

    renderer.render(scene, camera);

}
document.getElementById("draw").addEventListener("click", redraw);
function redraw(){
    while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
    }
    var newGeometry = new THREE.BufferGeometry();

    // attributes
    var newPositions = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point
    newGeometry.addAttribute( 'position', new THREE.BufferAttribute( newPositions, 3 ) );
    var newMaterial = new THREE.LineBasicMaterial( { color: 0xff0000, linewidth: 2 } );
    // drawcalls
    drawCount = 2; // draw the first 2 points, only
    newGeometry.setDrawRange( 0, drawCount );
    line = new THREE.Line( newGeometry,  newMaterial );
    line.material.color.setHSL( Math.random(), 1, 0.5 );
    scene.add( line );
    x = 0.01;
    y = 0; 
    z = 0;
    a = eval(document.getElementById("a").value);
    b = eval(document.getElementById("b").value);
    c = eval(document.getElementById("c").value);
    equationX = document.getElementById("equationX").value;
    equationY = document.getElementById("equationY").value;
    equationZ = document.getElementById("equationZ").value;
    
    document.getElementById("shareLink").value = (url + "?eqX=" + equationX + "&eqY=" + equationY + "&eqZ=" + equationZ + "&a=" + eval(document.getElementById("a").value) + "&b=" + eval(document.getElementById("b").value) + "&c=" + eval(document.getElementById("c").value)).replace(/\s/g, '');;
    updatePositions();
}
function generateEquation(){
    let result = "";
    if(Math.random() <= 0.5) // a *  (x - y)
    {
        let r1 = Math.random();
        let outside = r1 <= 0.3 ? "a" : r1 <= 0.6 ? "b" : "c";
        let r2 = Math.random();
        let symbol1 = r2 <= 0.16 ? "a" : r2 <= 0.32 ? "b" : r2 <= 0.48 ? "c" : r2 <= 0.64 ? generateSingle("x") : r2 <= 0.80 ? generateSingle("y"):generateSingle("z");
        let r3 = Math.random();
        let symbol2 = r3 <= 0.3 ? generateSingle("x") : r3 <= 0.6 ? generateSingle("y") : generateSingle("z");
        result += outside;
        let operation = "+";
        if(Math.random() <= 0.5) // a *  (x - y)
        {
            operation = "-";
        }
        if(symbol2.includes("-")){
            operation = "";
        }
        result = outside + "*(" + symbol1 + operation + symbol2 + ")";
    }else{
        let r = Math.random();
        result = r <= 0.3 ? "x*y" : r <= 0.6 ? "x*z" : "y*z";
    }
    let r = Math.random();
    result += r <= 0.3 ? generateSingle("x") : r <= 0.6 ? generateSingle("y") : generateSingle("z");
   return result;
}
function generateSingle(symbol){
    let result = "";
    if(Math.random() >= 0.5) // Multiplying the symbol
    {
        let r = Math.random();
        let multiplier = r >= .3 ? "a" : r >= .6 ? "b" : "c";
        symbol = multiplier + "*" + symbol;
    }
    return "-" + symbol;
}
function generatePair(symbol1, symbol2){
    let result = "";
    if(Math.random() >= 0.5){ // 1 before 2
        result = symbol1 + " - " + symbol2
    }else{ // 2 before 1
        result = symbol1 + " - " + symbol2
    }
    if(Math.random() >= 0.5){ // change to substraction
        result = result.replace("+","-");
    }
    if(Math.random() >= 0.5){ // Exterior multipication
        let r = Math.random();
        let multiplier = r <= .3 ? "a" : r <= .6 ? "b" : "c";
        result = multiplier + "*(" + result + ")";
    }
    if(Math.random() >= 0.5){ // all negative
        result = "-" + result;
    }
    return result;
}
function evaluate(parts, x, y){
    let result = 0;
    for(var i = 0; i < parts.length; i++)
    {
        if(parts[i] == null)
        {
            continue;
        }
        let addition = 0;
        switch(i){
            case 0: // x^2
                addition = Math.pow(x,2);
                break;
            case 1: // y^2
                addition = Math.pow(y,2);
                break;
            case 2: // y
                addition = x* y;
                break;
            case 3: // x
                addition = x;
                break;
            case 4: // y
                addition = y;
                break;
        } // end switch
        if(parts[i].includes('-'))
        {
            addition = -addition;
        }
        result += addition;
    }
    return result;
}