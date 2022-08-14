import * as THREE from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {VRButton} from 'three/examples/jsm/webxr/VRButton';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory';

let dougs=[];
function rad(degrees) {
  return degrees/57.2957795
}
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

// The three.js scene: the 3D world where you put objects
const scene = new THREE.Scene();
// The camera
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
camera.translateY(1.6);

const light = new THREE.AmbientLight( 0x888888 ); // soft white light
scene.add( light );
for (let i = 0; i < 3; i++) {
  let light4 = new THREE.PointLight( 0xffffff, 0.1, 0, 2 );
light4.position.set( randInt(-25,25), 3, randInt(-25,25) );
scene.add( light4 );
}
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}
// load models
const glLoader = new GLTFLoader();
// loads a model with 1 as dir string and 2 as the func to run when the model loaded
function loadModel(url,func) {
  glLoader.load( //load model
	// resource URL
	url,
	// called when the resource is loaded
	function ( gltf ) {
		scene.add(gltf.scene)
    func(gltf.scene)
	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);
}
const texture = new THREE.TextureLoader().load( 'tex/floor/color.jpg' );
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(8,8);
const texture2 = new THREE.TextureLoader().load( 'tex/floor/normal.jpg' );
texture2.wrapS = THREE.RepeatWrapping;
texture2.wrapT = THREE.RepeatWrapping;
texture.repeat.set(8,8);
const texture3 = new THREE.TextureLoader().load( 'tex/floor/color.jpg' );
texture3.wrapS = THREE.RepeatWrapping;
texture3.wrapT = THREE.RepeatWrapping;
texture.repeat.set(8,8);
const geometry = new THREE.PlaneGeometry( 25, 25 );
geometry.rotateX(rad(-90))
const floorMaterial = new THREE.MeshStandardMaterial( {color: 0xffffff, map: texture, normalMap:texture2, roughnessMap:texture3} );
const floor = new THREE.Mesh( geometry, floorMaterial );
scene.add( floor );
function welcomRun(model){ // runs on loaded welcome screen
  model.position.set(0,3,-12.5)
}
loadModel("tex/modals/welcome.glb",welcomRun)

function dougRun(model) { //run on loaded model


    model.position.set(
      randInt(-30,30)
     ,randInt(0,30)
     ,randInt(-30,30))
    model.name="doug";
    dougs.push(model)
    model.rotateZ(randInt(-10,10));
    model.rotateY(randInt(-10,10));
    model.rotateX(randInt(-10,10));
	}
function sofaRun(model) {
		scene.add( model );
    model.position.set(7,0,-3)
    model.scale.set(0.2,0.2,0.2)
    model.name="sofa"}
loadModel("tex/modals/end.glb",sofaRun)
// spawns all the dougnuts
for (let i = 0; i < 14; i++) {
  loadModel("tex/modals/"+randInt(1,9)+".glb",dougRun)
}
//skybox and loaders
const cubeLoader = new THREE.CubeTextureLoader();
const skyboss = cubeLoader.load( [
	'tex/box/px.png', 'tex/box/nx.png',
	'tex/box/py.png', 'tex/box/ny.png',
	'tex/box/pz.png', 'tex/box/nz.png'
] );
scene.background=skyboss

// The renderer: something that draws 3D objects onto the canvas
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#c"), antialias: true });


renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1);
// Append the renderer canvas into <body>
document.body.appendChild(renderer.domElement);
// add vr button
renderer.xr.enabled = true;
renderer.xr.setFramebufferScaleFactor(2.0);
document.body.appendChild(VRButton.createButton(renderer));
// controllers
   const controller1 = renderer.xr.getController(0);
   controller1.name="con1"
   scene.add(controller1);

   const controller2 = renderer.xr.getController(1);
   controller2.name="con2"
   scene.add(controller2);
   var controllerModelFactory = new XRControllerModelFactory();

   var controllerGrip1 = renderer.xr.getControllerGrip(0);
   controllerGrip1.add(
       controllerModelFactory.createControllerModel(controllerGrip1)
   );
   scene.add(controllerGrip1);

   var controllerGrip2 = renderer.xr.getControllerGrip(1);
   controllerGrip2.add(
       controllerModelFactory.createControllerModel(controllerGrip2)
   );
   scene.add(controllerGrip2);


const dolly = new THREE.Group();
  dolly.position.set(0, 0, 0);
  dolly.name = "dolly";
  scene.add(dolly);
  dolly.add(camera);
  dolly.add(controller1);
  dolly.add(controller2);
  dolly.add(controllerGrip1);
  dolly.add(controllerGrip2);
  dolly.name="dolly"

//controller raycasting

//render loop for rendering scene and logic loop
function render() {
  for (let i = 0; i < dougs.length; i++) {
  dougs[i].rotateX(0.009);
  dougs[i].rotateY(0.008);
}


  // Render the scene and the camera
  renderer.render(scene, camera);
  // resizing logic
  const canvas = renderer.domElement;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();

   if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  } // other stuff


  // Make it call the render() function about every 1/60 second
 renderer.setAnimationLoop(render);
}

render();
