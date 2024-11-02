import "./style.css";
import { Scene, WebGLRenderer, PerspectiveCamera } from "three"
import { ambientLight, pointLight, directionalLight } from "./components/light";


const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

const canvasSize = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new Scene();
scene.add(ambientLight, pointLight, directionalLight, directionalLight.target);

const camera = new PerspectiveCamera(45, canvasSize.width / canvasSize.height, 0.1, 100);
camera.position.set(0, 1, 6);
scene.add(camera);

const renderer = new WebGLRenderer({
  canvas: document.querySelector<HTMLCanvasElement>("#canvas")!,
});
renderer.setPixelRatio(window.devicePixelRatio || 2);
renderer.setSize(canvasSize.width, canvasSize.height);

import { OrbitControls } from "three/examples/jsm/Addons.js";
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
// controls.enabled = false;


import { GridHelper } from "three";
const gridHelper = new GridHelper(100, 100);
scene.add(gridHelper);
import { AxesHelper } from "three";
const axesHelper = new AxesHelper(3);
scene.add(axesHelper);


import { LoadingManager } from "three";
import { gsap, Power1 } from "gsap";
const loadingManager = new LoadingManager(
  () => {
    // setTimeout(() => {
    //   gsap.from(camera.position, {
    //     duration: 1.5,
    //     x: -30,
    //     y: 20,
    //     z: -10,
    //     ease: Power1.easeOut,
    //   })
    //   gsap.from(canvas, {
    //     duration: 2,
    //     css: { opacity: 0 },
    //     ease: Power1.easeInOut,
    //   })
    // }, 50);
  }
);
import { TextureLoader } from "three";
const textureLoader = new TextureLoader(loadingManager);
import { GLTFLoader } from "three/examples/jsm/Addons.js";
const gltfLoader = new GLTFLoader(loadingManager);

textureLoader.load('./images/background.jpg', (texture) => {
  scene.background = texture;
})
gltfLoader.load('./models/s-logo.glb', (gltf) => {
  const logoScale = 35;
  gltf.scene.scale.set(logoScale, logoScale, logoScale);
  gltf.scene.rotation.x = Math.PI / 2;
  gltf.scene.position.x = -1
  gltf.scene.position.y = -1
  scene.add(gltf.scene);
})


import { articles } from "./constants";
import { Group, Mesh, PlaneGeometry, ShaderMaterial, DoubleSide, Vector3, Clock } from "three";
import { vertext, fragment } from "./shader";
import { Text } from "troika-three-text";

const groupPlanes = new Group();
const groupTexts = new Group();
scene.add(groupPlanes, groupTexts);
const planeGeometry = new PlaneGeometry(2, 1.25, 32, 32)
const planes: ShaderMaterial[] = [];

const helix = {
  initialRadius: 3,
  heightSpacing: 1.5,
  angleSpacing: Math.PI / 2,
  targetPosition: new Vector3(0, 1.5, 3)
}
const clock = new Clock();
articles.forEach((article, index) => {
  const material = new ShaderMaterial({
    side: DoubleSide,
    vertexShader: vertext,
    fragmentShader: fragment,
    uniforms: {
      uTime: { value: 0 },
      uTouch: { value: 0 },
    }
  });

  const plane: Mesh<PlaneGeometry, ShaderMaterial> = new Mesh(planeGeometry, material);
  // planes.push(material);
  groupPlanes.add(plane);
});

function updatePlanes(scrollProgress: number) {
  console.log(scrollProgress);
  groupPlanes.children.forEach((plane, index) => {
    const progress = - index + scrollProgress + 1;
    const angle = (- index + scrollProgress) * Math.PI / 2 * 1.5
    const x = - 2 * Math.cos(angle);
    const y = progress * helix.heightSpacing * 1.2
    const z = - 2 * Math.sin(angle); 
    plane.position.set(x, y, z);
    plane.lookAt(0, y, 0);
  });
}
updatePlanes(0);

let scrollProgress = 0;
window.addEventListener("wheel", (event) => {
  scrollProgress += event.deltaY * 0.0005; // Adjust the scroll speed as needed
  updatePlanes(scrollProgress);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  canvasSize.width = window.innerWidth;
  canvasSize.height = window.innerHeight;
  camera.aspect = canvasSize.width / canvasSize.height;
  camera.updateProjectionMatrix();
  renderer.setSize(canvasSize.width, canvasSize.height);
  renderer.setPixelRatio(window.devicePixelRatio || 2);
})