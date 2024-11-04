import "./style.css"
import { Scene, WebGLRenderer, MeshBasicMaterial } from "three"
import { canvasSize } from "./constants"
import camera from "./components/camera";
import { ambientLight, pointLight, directionalLight } from "./components/light";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { gsap, Power1 } from "gsap";
import { textureLoader, gltfLoader } from "./components/loader";

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
import { Group, PlaneGeometry, ShaderMaterial, DoubleSide, Mesh } from "three";
import { vertext, fragment } from "./shader";
import { Text } from "troika-three-text";

const groupPlanes = new Group();
const groupTexts = new Group();
scene.add(groupPlanes, groupTexts);
const planeGeometry = new PlaneGeometry(2, 1.13, 32, 32)

class CustomMesh extends Mesh<PlaneGeometry, ShaderMaterial> {
  customUrl?: string;
  isLoaded?: boolean;
}
articles.forEach(article => {
  const image = textureLoader.load(article.image)
  const material = new ShaderMaterial({
    side: DoubleSide,
    vertexShader: vertext,
    fragmentShader: fragment,
    uniforms: {
      uTime: { value: 0 },
      // TODO: Black and white animation
      uTouch: { value: 0 },
      // TODO: Open article on click
      uTexture: { value: image },
    }
  });
  
  const plane: CustomMesh = new CustomMesh(planeGeometry, material);
  plane.customUrl = article.url;
  plane.scale.x = -1
  groupPlanes.add(plane);
  
  const text = new Text();
  text.text = article.title;
  text.fontSize = 0.1;
  text.scale.x = -1;
  text.color = '#fff'
  text.material = new MeshBasicMaterial({ 
    side: DoubleSide,
    transparent: true,
    opacity: 0
  });
  text.outlineColor = "#000"
  text.outlineWidth = 0.01;
  groupTexts.add(text);
});

function updateTextOpacity(text: any, plane: any) {
  const beginCoors = {
    x: 1.2,
    y: 0.21,
  }
  const endCoors = {
    x: -1.2,
    y: 1,
  }
  const { x, y} = text.position;
  if (x < beginCoors.x && x > endCoors.x && y > beginCoors.y && y < endCoors.y) {
    gsap.to(text.material[1], {
      duration: 0.15,
      opacity: 1,
      ease: Power1.easeInOut,
      onStart: () => {
        plane.isLoaded = true;
      }
    })
  } else {
    gsap.to(text.material[1], {
      duration: 0.15,
      opacity: 0,
      ease: Power1.easeInOut,
      onStart: () => {
        plane.isLoaded = false;
      }
    })
  }
}

function updatePlanesPosition(scrollProgress: number) {
  groupPlanes.children.forEach((plane, index) => {
    const progress = - index + scrollProgress + 1;
    const angle = (- index + scrollProgress) * Math.PI / 2 * 1.5
    const x = - 2.5 * Math.cos(angle);
    const y = progress * 1.5 * 1.2
    const z = - 2.5 * Math.sin(angle); 
    plane.position.set(x, y, z);
    plane.lookAt(0, y, 0);

    const text = groupTexts.children[index];
    text.position.set(x, y, z + 0.6);
    text.lookAt(0, y, 0);
    updateTextOpacity(text, plane);
  });
}
updatePlanesPosition(-0.6683333523273476);

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
    },
  });
});

window.addEventListener("resize", () => {
  canvasSize.width = window.innerWidth;
  canvasSize.height = window.innerHeight;
  camera.aspect = canvasSize.width / canvasSize.height;
  camera.updateProjectionMatrix();
  renderer.setSize(canvasSize.width, canvasSize.height);
  renderer.setPixelRatio(window.devicePixelRatio || 2);
})

import { Raycaster, Vector2 } from "three";

const mouse = new Vector2();
const raycaster = new Raycaster();
window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / canvasSize.width) * 2 - 1;
  mouse.y = - (event.clientY / canvasSize.height) * 2 + 1;
})

window.addEventListener("click", () => {
  if (currentIntersect && currentIntersect.isLoaded) {
    window.open(currentIntersect.customUrl, "_blank");
  }
})

let currentIntersect: CustomMesh | null = null;
function animate() {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(groupPlanes.children);
  if (intersects.length && intersects) {
    if (currentIntersect !== intersects[0].object) {
      currentIntersect = intersects[0].object as CustomMesh;
      if (currentIntersect.isLoaded) document.body.style.cursor = "pointer";
      else document.body.style.cursor = "auto";
    }
  } else {
    currentIntersect = null;
    document.body.style.cursor = "auto";
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

window.addEventListener('DOMContentLoaded', () => {
  document.querySelector<HTMLDivElement>('#app')!.style.opacity = '1'
})