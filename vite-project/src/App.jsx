import { useEffect } from 'react';

import * as THREE from 'three';

import { Gui } from 'dat.gui'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { TeapotGeometry } from 'three/examples/jsm/Addons.js';

import { RoundedBoxGeometry } from 'three/examples/jsm/Addons.js';

import Stats from 'three/examples/jsm/libs/stats.module';


function App() {
  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerWidth,
    0.1,
    2000
  );
  camera.position.z = 96
  
  const canvas = document.getElementById('myThreeJsCanvas')
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  ambientLight.castShadow = true;
  scene.add(THREE.AmbientLight);

  const spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.castShadow = true;
  spotLight.position.set(0, 64, 32);
  scene.add(spotLight);



  const boxGeometry = new THREE.BoxGeometry(10, 10, 10, 10, 10, 16);
  const boxMaterial= new THREE.MeshNormalMaterial({ color: 0xff0000ff, roughness: 0.4, metalness: 0.2, });
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  boxMesh.position.x = 0;
  boxMesh.position.y = 0;
  scene.add(boxMesh);

  /*const cylinderGeometry = new THREE.CylinderGeometry(5, 5, 20, 16, 32);
  const cylinderMateryal = new THREE.MeshNormalMaterial({ wime: true });
  const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMateryal);
  cylinderMesh.position.x = 10;
  cylinderMesh.position.y = 0;
  scene.add(cylinderMesh);*/

  const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 5;   // limite mínimo de distância (evita atravessar objetos)
    controls.maxDistance = 120; // limite máximo
    controls.update();

  const stats = Stats();
  document.body.appendChild(stats.dom);

const animate = () => {
  //oxMesh.rotation.x += 0.1;
  //boxMesh.rotation.y += -0.001;
  stats.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
}, []);

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}

export default App;
