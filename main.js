import './style.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';

//creating gui
const gui = new dat.GUI();
console.log(gui);
const world = {
  plane: {
    width: 10,
    height: 10,
    widthSegments: 10,
    heightSegments: 10,
  },
};
//add plane width to gui
gui.add(world.plane, 'width', 1, 20).onChange(generatePlane);
//add plane height to gui
gui.add(world.plane, 'height', 1, 20).onChange(generatePlane);
gui.add(world.plane, 'widthSegments', 1, 20).onChange(generatePlane);
gui.add(world.plane, 'heightSegments', 1, 20).onChange(generatePlane);

function generatePlane() {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  );

  const { array } = planeMesh.geometry.attributes.position;
  for (let i = 0; i < array.length; i += 3) {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];
    array[i + 2] = z + Math.random();
  }
}

//import raycaster
const raycaster = new THREE.Raycaster();

//set a scene
const scene = new THREE.Scene();
//set a camera
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
);
//set a renderer
const renderer = new THREE.WebGLRenderer();

//append to html
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

//orbit control
new OrbitControls(camera, renderer.domElement);

//change the camera position in order to see our mesh
camera.position.z = 5;

const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10);
console.log(planeGeometry);
const planeMaterial = new THREE.MeshPhongMaterial({
  // color: 0x006778,
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
  vertexColors: true,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);
console.log(planeMesh.geometry.attributes.position.array);

const { array } = planeMesh.geometry.attributes.position;
for (let i = 0; i < array.length; i += 3) {
  const x = array[i];
  const y = array[i + 1];
  const z = array[i + 2];
  array[i + 2] = z + Math.random();
}

const colors = [];
for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
  console.log(i);
  colors.push(0, 1, 0);
}
console.log(colors);

planeMesh.geometry.setAttribute(
  'color',
  new THREE.BufferAttribute(new Float32Array(colors), 3)
);

////create a light
const light = new THREE.DirectionalLight(0xffffff, 1);
//position a light (x,y,z)
light.position.set(0, 0, 1);
//add light to the scene
scene.add(light);

////create a backlight
const backLight = new THREE.DirectionalLight(0xffffff, 1);
//position a light (x,y,z)
backLight.position.set(0, 0, -1);
//add light to the scene
scene.add(backLight);

const mouse = {
  x: undefined,
  y: undefined,
};
//create an animate function, and it will call itself which will form a loop
function animate() {
  requestAnimationFrame(animate);
  //call renderer
  renderer.render(scene, camera);

  //use raycaster
  raycaster.setFromCamera(mouse, camera);
  //to which object do we want to know if it is touching
  const intersects = raycaster.intersectObject(planeMesh);
  // console.log(intersects);
  if (intersects.length > 0) {
    // console.log('intersecting');
    // console.log(intersects[0].face);
    console.log(intersects[0].object.geometry.attributes.color);
  }
}

animate();

//add mousemove event
addEventListener('mousemove', e => {
  mouse.x = (e.clientX / innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / innerHeight) * 2 + 1;
});
