var MAX_POINTS = 3000;
var line;
var drawCount;
var scene = new THREE.Scene();
const url = "https://hidalgoivan.github.io/StrangeAttractors/";
renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000000 );
camera.position.set( 0, 0, 50 );
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
var urlParams = new URLSearchParams(location.search);

if(urlParams.has('eqX'))
{
    a = eval(urlParams.get('a'));
    b = eval(urlParams.get('b'));
    c = eval(urlParams.get('c'));
    equationX = urlParams.get('eqX');
    equationY = urlParams.get('eqY');
    equationZ = urlParams.get('eqZ');
    document.getElementById("equationX").value = equationX;
    document.getElementById("equationY").value = equationY;
    document.getElementById("equationZ").value = equationZ;
    document.getElementById("a").value = a;
    document.getElementById("b").value = b;
    document.getElementById("c").value = c;
    document.getElementById("shareLink").value = (url + "?eqX=" + equationX + "&eqY=" + equationY + "&eqZ=" + equationZ + "&a=" + urlParams.get('a') + "&b=" + urlParams.get('b') + "&c=" + urlParams.get('c')).replace(/\s/g, '');
}
var dt, dx, dy, dz;
// update positions
updatePositions();

function updatePositions() {
    try{
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
    catch(err){
        altert("Reached infinity");
        console.log(err);
    }
}
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
    
    document.getElementById("shareLink").value = (url + "?eqX=" + equationX + "&eqY=" + equationY + "&eqZ=" + equationZ + "&a=" + document.getElementById("a").value + "&b=" + document.getElementById("b").value + "&c=" + document.getElementById("c").value).replace(/\s/g, '');
    updatePositions();
}
document.getElementById("shareIcon").addEventListener("click", copyLink);
function copyLink(){
    var copyText = document.getElementById("shareLink");
    copyText.select();
    copyText.setSelectionRange(0, 9999);
    document.execCommand("copy");
    alert("Copied to clipboard");
}