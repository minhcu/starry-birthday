import "./style.css"
import { Scene, WebGLRenderer, LoadingManager } from "three"
import { canvasSize } from "./constants"
import camera from "./components/camera";
import { ambientLight, pointLight, directionalLight } from "./components/light";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { gsap, Power1 } from "gsap";

// Global variables
const scene = new Scene();
const renderer = new WebGLRenderer({
  canvas: document.querySelector<HTMLCanvasElement>("#canvas")!,
});
const controls = new OrbitControls(camera, renderer.domElement);

scene.add(ambientLight, pointLight, directionalLight, directionalLight.target);
scene.add(camera);
renderer.setPixelRatio(window.devicePixelRatio || 2);
renderer.setSize(canvasSize.width, canvasSize.height);
controls.enableZoom = false;
controls.enabled = false;

import { GridHelper } from "three";
const gridHelper = new GridHelper(100, 100);
scene.add(gridHelper);
import { AxesHelper } from "three";
const axesHelper = new AxesHelper(3);
scene.add(axesHelper);

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const loadingManager = new LoadingManager(
  () => {
    setTimeout(() => {
      gsap.from(camera.position, {
        duration: 1.5,
        x: -30,
        y: 20,
        z: -10,
        ease: Power1.easeOut,
      })
      gsap.from(canvas, {
        duration: 2,
        css: { opacity: 0 },
        ease: Power1.easeInOut,
      })
    }, 50);
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
import { Group, Mesh, PlaneGeometry, ShaderMaterial, DoubleSide, Vector3 } from "three";
import { vertext, fragment } from "./shader";
import { Text } from "troika-three-text";

const groupPlanes = new Group();
const groupTexts = new Group();
scene.add(groupPlanes, groupTexts);
const planeGeometry = new PlaneGeometry(2, 1.25, 32, 32)

const helix = {
  initialRadius: 3,
  heightSpacing: 1.5,
  angleSpacing: Math.PI / 2,
  targetPosition: new Vector3(0, 1.5, 3)
}
articles.forEach(article => {
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
  groupPlanes.add(plane);

  const text = new Text();
  text.text = article.title;
  text.fontSize = 0.1;
  text.scale.x = -1; // Mirror the text
  text.anchorX = "right";
  groupTexts.add(text);
});

function updatePlanesPosition(scrollProgress: number) {
  groupPlanes.children.forEach((plane, index) => {
    const progress = - index + scrollProgress + 1;
    const angle = (- index + scrollProgress) * Math.PI / 2 * 1.5
    const x = - 2 * Math.cos(angle);
    const y = progress * helix.heightSpacing * 1.2
    const z = - 2.5 * Math.sin(angle); 
    plane.position.set(x, y, z);
    plane.lookAt(0, y, 0);

    const text = groupTexts.children[index];
    text.position.set(x - 0.2, y, z + 0.4);
    text.lookAt(0, y, 0);
  });
}
updatePlanesPosition(-0.6683333);

let minScrollProgress = -0.6683333523273476;
let scrollProgress = minScrollProgress;
let touchStartY = 0;

window.addEventListener("wheel", (event) => {
  scrollProgress += event.deltaY * 0.001;
  if (scrollProgress <= minScrollProgress) scrollProgress = minScrollProgress;
  updatePlanesPosition(scrollProgress);
});

window.addEventListener("touchstart", (event) => {
  touchStartY = event.touches[0].clientX;
});

import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
window.addEventListener("touchmove", async (event) => {
  const touchCurrentY = event.touches[0].clientX;
  const touchDeltaY = touchCurrentY - touchStartY;
  await gsap.to({}, {
    duration: 0.12,
    onUpdate: () => {
      scrollProgress -= touchDeltaY * 0.00005;
      if (scrollProgress <= minScrollProgress) scrollProgress = minScrollProgress;
      updatePlanesPosition(scrollProgress);
    },
    onComplete: () => {
      touchStartY = touchCurrentY;
    }
  });
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

function updatePlanesSize() {
  // const ratio = 2 / 1.25
  const aspect = canvasSize.width / canvasSize.height;
  groupPlanes.children.forEach((plane) => {
    plane.scale.set(1, aspect, 1);
  });
}

window.addEventListener("resize", () => {
  canvasSize.width = window.innerWidth;
  canvasSize.height = window.innerHeight;
  camera.aspect = canvasSize.width / canvasSize.height;
  camera.updateProjectionMatrix();
  renderer.setSize(canvasSize.width, canvasSize.height);
  renderer.setPixelRatio(window.devicePixelRatio || 2);
  updatePlanesSize();
})

document.querySelector<HTMLButtonElement>(".statement-button a")!.addEventListener("click", () => {
  gsap.to(document.querySelector<HTMLDivElement>(".statement .text"), {
    css: { opacity: 0 },
    duration: 0.3,
  })
})