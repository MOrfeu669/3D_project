import { useEffect } from 'react';
import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; 
import Stats from 'three/examples/jsm/libs/stats.module';


function App() {
  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(0, 10, 40);

    const canvas = document.getElementById('myThreeJsCanvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio || 1);

    // Habilita sombras
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    
    

    // --- Objetos ---

    //#objetos .glft
    
    //Textura de coisa
    const uv = new THREE.TextureLoader().load('./assets/uv.jpeg')

    //#caixa cudo
    const roundedBoxGeometry = new RoundedBoxGeometry(10, 10, 10);
    const roundedBoxMaterial = new THREE.MeshStandardMaterial({ map: uv});
    const roundedBoxMesh = new THREE.Mesh(roundedBoxGeometry, roundedBoxMaterial);
    roundedBoxMesh.castShadow = true;
    roundedBoxMesh.receiveShadow = false;
    roundedBoxMesh.position.set(15, 0, 0);
    scene.add(roundedBoxMesh);

    //#Textura chao
    const brickWall = new THREE.TextureLoader().load('./assets/brick.jpeg')

    // "Chão"
    const roundedBoxGeometry1 = new RoundedBoxGeometry(100, 1, 100, 10, 1);
    const roundedBoxMaterial1 = new THREE.MeshStandardMaterial({ map: brickWall });
    const roundedBoxMesh1 = new THREE.Mesh(roundedBoxGeometry1, roundedBoxMaterial1);
    roundedBoxMesh1.receiveShadow = true;
    roundedBoxMesh1.position.y = -6;
    scene.add(roundedBoxMesh1);

    // cuia
    const teapotGeometry = new TeapotGeometry(1, 8);
    const teapotMaterial = new THREE.MeshPhongMaterial({ color: 0x8888ff });
    const teapotMesh = new THREE.Mesh(teapotGeometry, teapotMaterial);
    teapotMesh.castShadow = true;
    teapotMesh.receiveShadow = false;
    teapotMesh.position.set(0, 20, 0);
    scene.add(teapotMesh);

    // Controles e stats
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 5;
    controls.maxDistance = 120;

    const stats = Stats();
    document.body.appendChild(stats.dom);

    // Luz ambiente suave
    const al = new THREE.AmbientLight(0xffffff, 0);
    scene.add(al);

    // GUI
    const gui = new GUI();
    const lightFolder = gui.addFolder('Luzes');
    lightFolder.open();

    // Luz ambiente
    const alF = lightFolder.addFolder('Luz ambiente');
    const alSettings = { color: al.color.getHex() };
    alF.add(al, 'visible');
    alF.add(al, 'intensity', 0, 1, 0.01);
    alF
      .addColor(alSettings, 'color')
      .onChange((value) => al.color.set(value));
    alF.open();

    // SpotLight
    const sl = new THREE.SpotLight(0xffffff, 400, 0, Math.PI / 6, 0.2);
    sl.position.set(30, 40, 20);
    sl.castShadow = true;
    sl.shadow.mapSize.set(2048, 2048);
    sl.shadow.camera.near = 1;
    sl.shadow.camera.far = 500;
    sl.shadow.bias = -0.0005;
    const slHelper = new THREE.SpotLightHelper(sl);
    scene.add(sl, slHelper);

    const slSettings = { visible: true };
    const slFolder = lightFolder.addFolder('Spot Light');
    slFolder.add(slSettings, 'visible').onChange((value) => {
      sl.visible = value;
      slHelper.visible = value;
    });
    slFolder.add(sl, 'intensity', 1, 1000, 0.1);
    slFolder.add(sl, 'angle', Math.PI / 32, Math.PI / 2, Math.PI / 64);
    slFolder.add(sl.position, 'x', -100, 100, 1);
    slFolder.add(sl.position, 'y', -100, 100, 1);
    slFolder.add(sl.position, 'z', -100, 100, 1);
    slFolder.open();

    // PointLight
    const pl = new THREE.PointLight(0xffffff, 0.6, 0);
    pl.position.set(2, 10, 2);
    pl.castShadow = true;
    pl.shadow.mapSize.set(1024, 1024);
    pl.shadow.camera.near = 0.5;
    pl.shadow.camera.far = 500;
    const plHelper = new THREE.PointLightHelper(pl, 0.5);
    scene.add(pl, plHelper);

    const plSettings = { visible: true, color: pl.color.getHex() };
    const plFolder = lightFolder.addFolder('Point Light');
    plFolder.add(plSettings, 'visible').onChange((value) => {
      pl.visible = value;
      plHelper.visible = value;
    });
    plFolder.add(pl, 'intensity', 0, 10, 0.25);
    plFolder.add(pl.position, 'x', -100, 100, 0.5);
    plFolder.add(pl.position, 'y', -100, 100, 0.5);
    plFolder.add(pl.position, 'z', -100, 100, 0.5);
    plFolder
      .addColor(plSettings, 'color')
      .onChange((value) => pl.color.set(value));
    plFolder.open();

    // Geometry GUI
    const geometryFolder = gui.addFolder('Mesh Geometry');
    geometryFolder.open();
    const rotationFolder = geometryFolder.addFolder('Rotarion');
    rotationFolder.add(roundedBoxMesh.rotation, 'x', 0, Math.PI).name('Girar eixo X');
    rotationFolder.add(roundedBoxMesh.rotation, 'y', 0, Math.PI).name('Girar eixo Y');
    rotationFolder.add(roundedBoxMesh.rotation, 'z', 0, Math.PI).name('Girar eixo Z');
    const scaleFolder = geometryFolder.addFolder('Scale');
    scaleFolder.open();
    scaleFolder.add(roundedBoxMesh.scale, 'x', 0, 2).name('Aumentar X');
    scaleFolder.add(roundedBoxMesh.scale, 'y', 0, 2).name('Aumentar Y');
    scaleFolder.add(roundedBoxMesh.scale, 'z', 0, 2).name('Aumentar Z');
    scaleFolder.open();

    const materialFolder = gui.addFolder('Mesh Material');
    const materialParams = {
      roundedBoxMeshColor: '#' + roundedBoxMesh.material.color.getHexString()
    };
    materialFolder.add(roundedBoxMesh.material, 'wireframe');
    materialFolder
      .addColor(materialParams, 'roundedBoxMeshColor').name('Cor')
      .onChange((value) => {
        roundedBoxMesh.material.color.set(value);
      });

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // Animate loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Animação de giro da cuia
      teapotMesh.rotation.x += 0.01;
      teapotMesh.rotation.y += 1;
      teapotMesh.rotation.z += 0.5;

      slHelper.update();
      plHelper.update();

      controls.update();
      stats.update();
      renderer.render(scene, camera);
    };

    animate();
    return () => {
      window.removeEventListener('resize', onResize);
      gui.destroy();
      // remover stats dom
      if (stats && stats.dom && stats.dom.parentNode) {
        stats.dom.parentNode.removeChild(stats.dom);
      }
      roundedBoxGeometry.dispose();
      roundedBoxMaterial.dispose();
      roundedBoxGeometry1.dispose();
      roundedBoxMaterial1.dispose();
      teapotGeometry.dispose();
      teapotMaterial.dispose && teapotMaterial.dispose();

      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}

export default App;
