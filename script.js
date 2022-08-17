import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {VRButton} from 'three/examples/jsm/webxr/VRButton';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory';

// cannonJS part   --friendship over with ammoJS😡, me fren wit cannonJS🗿🅱️ased🗿
console.log(CANNON)
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
})
//back to threeJS
let dougs=[];
let physicObj=[];
function rad(degrees) {
  return degrees/57.2957795
}
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
const imgLoader = new THREE.TextureLoader()
// The three.js scene: the 3D world where you put objects
const scene = new THREE.Scene();
// The camera
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
//CannonDebugger
const cannonDebugger = new CannonDebugger(scene, world, {
  // options...
})
//ee
camera.translateY(1.6);
const pickRoot = new THREE.Object3D();
  scene.add(pickRoot);
const light = new THREE.AmbientLight( 0x888888 ); // soft white light
scene.add( light );
for (let x = 0; x < 3; x++) {
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
const texture = imgLoader.load( 'tex/floor/color.jpg' );
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(8,8);
const texture2 = imgLoader.load( 'tex/floor/normal.jpg' );
texture2.wrapS = THREE.RepeatWrapping;
texture2.wrapT = THREE.RepeatWrapping;
texture.repeat.set(8,8);
const texture3 = imgLoader.load( 'tex/floor/color.jpg' );
texture3.wrapS = THREE.RepeatWrapping;
texture3.wrapT = THREE.RepeatWrapping;
texture.repeat.set(8,8);
const geometry = new THREE.PlaneGeometry( 25, 25 );
geometry.rotateX(rad(-90))
const floorMaterial = new THREE.MeshStandardMaterial( {color: 0xffffff, map: texture, normalMap:texture2, roughnessMap:texture3} );
const floor = new THREE.Mesh( geometry, floorMaterial );

const groundBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: new CANNON.Box(new CANNON.Vec3(12.5,5,12.5)),
  position: new CANNON.Vec3(0,-5,0)
})
groundBody.quaternion.setFromEuler(rad(0), 0, 0) // make it face up
world.addBody(groundBody)
floor.physic=groundBody
scene.add( floor );
function welcomRun(model){ // runs on loaded welcome screen
  model.position.set(0,3,-12.5)
}
loadModel("tex/modals/welcome.glb",welcomRun)

function dougRun(model) { //run on loaded model

   pickRoot.add(model)
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
for (let i = 1; i < 14; i++) {
  // spawns all the dougnuts
  loadModel("tex/modals/"+randInt(1,9)+".glb",dougRun)
// maek bloks yaaaaaaaaa
  let geometry2=new THREE.BoxGeometry(0.5, 0.5, 0.5);
  let material2 = new THREE.MeshStandardMaterial({
  color: 0xFFFFFF,
  map: imgLoader.load("tex/blocks/block"+randInt(1,10)+".jpg")          });
let cube = new THREE.Mesh( geometry2, material2 );
var heig=geometry2.parameters.height
cube.position.set(-7, 2 * (size + 0.02) * (i + 1),,-2.7)
//cube.rotateY(randInt(-180,180));

let cubeBody = new CANNON.Body({
  mass: 1, // kg
  shape: new CANNON.Box(new CANNON.Vec3(0.25,0.25,0.25)),
position: cube.position,
quaternion: cube.quaternion
})
console.log(cube)
console.log(cubeBody)
world.addBody(cubeBody)
cube.physic=cubeBody
pickRoot.add(cube)
physicObj.push(cube)

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
class ControllerPickHelper extends THREE.EventDispatcher {
  constructor(scene) {
    super();
    this.raycaster = new THREE.Raycaster();
    this.objectToColorMap = new Map();
    this.controllerToObjectMap = new Map();
    this.tempMatrix = new THREE.Matrix4();

    const pointerGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, -0.01),
      new THREE.Vector3(0, 0, -1),
    ]);

    this.controllers = [];

    const selectListener = (event) => {
      const controller = event.target;
      const selectedObject = this.controllerToObjectMap.get(event.target);
      if (selectedObject) {
        this.dispatchEvent({type: event.type, controller, selectedObject});
      }
    };

    const endListener = (event) => {
      const controller = event.target;
      this.dispatchEvent({type: event.type, controller});
    };

    for (let i = 0; i < 2; ++i) {
      const controller = renderer.xr.getController(i);
      controller.addEventListener('select', selectListener);
      controller.addEventListener('selectstart', selectListener);
      controller.addEventListener('selectend', endListener);
      scene.add(controller);

      const line = new THREE.Line(pointerGeometry);
      line.scale.z = 5;
      controller.add(line);
      this.controllers.push({controller, line});
    }
  }
  reset() {
    // restore the colors
    this.objectToColorMap.forEach((color, object) => {
      object.material.emissive.setHex(color);
    });
    this.objectToColorMap.clear();
    this.controllerToObjectMap.clear();
  }
  update(pickablesParent, time) {
    this.reset();
    for (const {controller, line} of this.controllers) {
      // cast a ray through the from the controller
      this.tempMatrix.identity().extractRotation(controller.matrixWorld);
      this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
      this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);
      // get the list of objects the ray intersected
      const intersections = this.raycaster.intersectObjects(pickablesParent.children);
      if (intersections.length) {
        const intersection = intersections[0];
        // make the line touch the object
        line.scale.z = intersection.distance;
        // pick the first object. It's the closest one
        const pickedObject = intersection.object;
        // save which object this controller picked
        this.controllerToObjectMap.set(controller, pickedObject);
        // highlight the object if we haven't already
        if (this.objectToColorMap.get(pickedObject) === undefined) {
          // save its color
          this.objectToColorMap.set(pickedObject, pickedObject.material.emissive.getHex());
          // set its emissive color to a bit of white
          pickedObject.material.emissive.setHex(0x3d3d3d);
        }
      } else {
        line.scale.z = 5;
      }
    }
  }
}

const controllerToSelection = new Map();
const pickHelper = new ControllerPickHelper(scene);
pickHelper.addEventListener('selectstart', (event) => {
  const {controller, selectedObject} = event;
  const existingSelection = controllerToSelection.get(controller);
  if (!existingSelection) {
    controllerToSelection.set(controller, {
      object: selectedObject,
      parent: selectedObject.parent,
    });
    controller.attach(selectedObject);
  }
});

pickHelper.addEventListener('selectend', (event) => {
  const {controller} = event;
  const selection = controllerToSelection.get(controller);
  if (selection) {
    controllerToSelection.delete(controller);
    selection.parent.attach(selection.object);
  }
});

//render loop for rendering scene and logic loop
function render(time) {
time *= 0.001;
  for (let i = 0; i < dougs.length; i++) {
  dougs[i].rotateX(0.009);
  dougs[i].rotateY(0.008);
}
  world.fixedStep()
  cannonDebugger.update() // Update the CannonDebugger meshes
for (let x = 0; x < physicObj.length; x++) {
  physicObj[x].position.copy(physicObj[x].physic.position)
  physicObj[x].quaternion.copy(physicObj[x].physic.quaternion)
}
pickHelper.update(pickRoot, time);

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
