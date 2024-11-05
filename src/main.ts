import "./style.css";
import { Scene, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { gsap, Power1 } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import camera from "./components/camera";
import { canvasSize } from "./constants";
import { ambientLight, pointLight, directionalLight } from "./components/light";
import { textureLoader, gltfLoader } from "./components/loader";
import { groupPlanes, groupTexts, CustomMesh, updatePlanesPosition, updatePlanesRect } from "./components/plane";
import { initSound } from "./components/sound";
import { mouse, raycaster } from "./components/raycaster";

const minScrollProgress = -0.6683333523273476;
const maxScrollProgress = 11.84;
let scrollProgress = minScrollProgress;
let touchStartY = 0;

const scene = new Scene();
const renderer = new WebGLRenderer({
  canvas: document.querySelector<HTMLCanvasElement>("#canvas")!,
});
const controls = new OrbitControls(camera, renderer.domElement);

gsap.registerPlugin(ScrollTrigger);
scene.add(ambientLight, pointLight, directionalLight, directionalLight.target);
scene.add(camera);
scene.add(groupPlanes, groupTexts);
renderer.setPixelRatio(window.devicePixelRatio || 2);
renderer.setSize(window.innerWidth, window.innerHeight);
controls.enableZoom = false;
controls.enabled = false;

textureLoader.load("./images/background.jpg", (texture) => {
  scene.background = texture;
});
gltfLoader.load("./models/s-logo.glb", (gltf) => {
  const logoScale = 35;
  gltf.scene.scale.set(logoScale, logoScale, logoScale);
  gltf.scene.rotation.x = Math.PI / 2;
  gltf.scene.position.x = -1;
  gltf.scene.position.y = -1;
  scene.add(gltf.scene);
});

updatePlanesPosition(minScrollProgress);

window.addEventListener("wheel", (event) => {
  if (isPopupOpen || !isStart) return;
  scrollProgress += event.deltaY * 0.001;
  if (scrollProgress <= minScrollProgress) scrollProgress = minScrollProgress;
  if (scrollProgress >= maxScrollProgress) scrollProgress = maxScrollProgress;
  updatePlanesPosition(scrollProgress);
});

window.addEventListener("touchstart", (event) => {
  touchStartY = event.touches[0].clientX;
});

window.addEventListener("touchmove", (event) => {
  if (isPopupOpen) return;
  const touchCurrentY = event.touches[0].clientX;
  const touchDeltaY = touchCurrentY - touchStartY;
  gsap.to(
    {},
    {
      duration: 0.12,
      onUpdate: () => {
        scrollProgress -= touchDeltaY * 0.00005;
        if (scrollProgress <= minScrollProgress) scrollProgress = minScrollProgress;
        if (scrollProgress >= maxScrollProgress) scrollProgress = maxScrollProgress;
        updatePlanesPosition(scrollProgress);
      },
      onComplete: () => {
        touchStartY = touchCurrentY;
      },
    }
  );
}, { passive: false });

updatePlanesRect();
window.addEventListener("resize", () => {
  canvasSize.width = window.innerWidth;
  canvasSize.height = window.innerHeight;
  camera.aspect = canvasSize.width / canvasSize.height;
  camera.updateProjectionMatrix();
  renderer.setSize(document.body.clientWidth, document.body.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio || 2);
  updatePlanesRect();
});

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / canvasSize.width) * 2 - 1;
  mouse.y = -(event.clientY / canvasSize.height) * 2 + 1;
});
window.addEventListener("click", (event) => {
  if (!isStart) return;
  mouse.x = (event.clientX / canvasSize.width) * 2 - 1;
  mouse.y = -(event.clientY / canvasSize.height) * 2 + 1;
  animate();
  if (isPopupOpen) return;
  if (currentIntersect && currentIntersect.isLoaded) openPopup(currentIntersect);
});

const popup = document.querySelector<HTMLDivElement>(".explore-overlay")!;
popup.querySelector<HTMLDivElement>(".close")!.addEventListener("click", () => {
  gsap.to(popup, {
    duration: 0.2,
    opacity: 0,
    ease: Power1.easeOut,
    onComplete: () => {
      isPopupOpen = false;
      popup.style.display = "none";
    },
  });
});
popup.querySelector<HTMLDivElement>(".overlay-background")!.addEventListener("click", () => {
  gsap.to(popup, {
    duration: 0.2,
    opacity: 0,
    ease: Power1.easeOut,
    onComplete: () => {
      isPopupOpen = false;
      popup.style.display = "none";
    },
  });
});
import { popupTemplate } from "./constants";

let isPopupOpen = false;
function openPopup(plane: any) {
  isPopupOpen = true;
  popup.style.display = "block";
  popup.style.opacity = "1";
  popup.querySelector<HTMLDivElement>(".overlay-content-wrapper")!.innerHTML = popupTemplate(plane.planeIndex!);
  popup.querySelector<HTMLAnchorElement>(".more")!.href = plane.customUrl!;
}

let currentIntersect: CustomMesh | null = null;
import confetti from "canvas-confetti";
let isCelebrate = false;
const celebrate = document.querySelector<HTMLDivElement>(".celebrate")!
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

  if (scrollProgress > 10.8) isCelebrate = true;
  else isCelebrate = false;

  if (isCelebrate) {
    celebrate.style.display = "block";
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#1363DF", "#F86F03"],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#1363DF", "#F86F03"],
    });
  } else {
    celebrate.style.display = "none";
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

let isStart = false;
window.addEventListener("DOMContentLoaded", () => {
  initSound();
  document.querySelector<HTMLDivElement>(".statement-button a")!.addEventListener("click", () => {
    isStart = true;
    animate();
  })
  document.querySelector<HTMLDivElement>("#app")!.style.opacity = "1";
});