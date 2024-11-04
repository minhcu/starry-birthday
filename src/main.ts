import "./style.css";
import { Scene, WebGLRenderer, MeshBasicMaterial } from "three";
import { canvasSize } from "./constants";
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

import { articles } from "./constants";
import { Group, PlaneGeometry, ShaderMaterial, DoubleSide, Mesh } from "three";
import { vertext, fragment } from "./shader";
import { Text } from "troika-three-text";

const groupPlanes = new Group();
const groupTexts = new Group();
scene.add(groupPlanes, groupTexts);
const planeGeometry = new PlaneGeometry(2, 1.13, 32, 32);

class CustomMesh extends Mesh<PlaneGeometry, ShaderMaterial> {
  customUrl?: string;
  isLoaded?: boolean;
  planeIndex?: number;
}
articles.forEach((article, index) => {
  const image = textureLoader.load(article.image);
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
    },
  });

  const plane: CustomMesh = new CustomMesh(planeGeometry, material);
  plane.customUrl = article.url;
  plane.planeIndex = index;
  plane.scale.x = -1;
  groupPlanes.add(plane);

  const text = new Text();
  text.text = article.title;
  text.fontSize = 0.1;
  text.scale.x = -1;
  text.color = "#fff";
  text.font = "./fonts/Itim-Regular.ttf";
  text.material = new MeshBasicMaterial({
    side: DoubleSide,
    transparent: true,
    opacity: 0,
  });
  text.outlineColor = "#000";
  text.outlineWidth = 0.01;
  groupTexts.add(text);
});

function updateTextOpacity(text: any, plane: any) {
  const beginCoors = {
    x: 1.2,
    y: 0.21,
  };
  const endCoors = {
    x: -1.2,
    y: 1,
  };
  const { x, y } = text.position;
  if (
    x < beginCoors.x &&
    x > endCoors.x &&
    y > beginCoors.y &&
    y < endCoors.y
  ) {
    gsap.to(text.material[1], {
      duration: 0.15,
      opacity: 1,
      ease: Power1.easeInOut,
      onStart: () => {
        plane.isLoaded = true;
      },
    });
  } else {
    gsap.to(text.material[1], {
      duration: 0.15,
      opacity: 0,
      ease: Power1.easeInOut,
      onStart: () => {
        plane.isLoaded = false;
      },
    });
  }
}

function updatePlanesPosition(scrollProgress: number) {
  groupPlanes.children.forEach((plane, index) => {
    const progress = -index + scrollProgress + 1;
    const angle = (((-index + scrollProgress) * Math.PI) / 2) * 1.5;
    const x = -2.5 * Math.cos(angle);
    const y = progress * 1.5 * 1.2;
    const z = -2.5 * Math.sin(angle);
    plane.position.set(x, y, z);
    plane.lookAt(0, y, 0);

    const text = groupTexts.children[index];
    text.position.set(x, y, z + 0.6);
    text.lookAt(0, y, 0);
    updateTextOpacity(text, plane);
  });
}
updatePlanesPosition(-0.6683333523273476);

const minScrollProgress = -0.6683333523273476;
const maxScrollProgress = 10.84;
let scrollProgress = minScrollProgress;
let touchStartY = 0;

window.addEventListener("wheel", (event) => {
  if (isPopupOpen) return;
  scrollProgress += event.deltaY * 0.001;
  if (scrollProgress <= minScrollProgress) scrollProgress = minScrollProgress;
  if (scrollProgress >= maxScrollProgress) scrollProgress = maxScrollProgress;
  updatePlanesPosition(scrollProgress);
});

window.addEventListener("touchstart", (event) => {
  touchStartY = event.touches[0].clientX;
});

import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
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
}, { passive: false }); // Set passive to false to allow preventDefault

function updatePlanesRect() {
  const ratio = document.body.clientWidth / 800;
  if (ratio > 1) return;
  groupPlanes.children.forEach((plane, index) => {
    plane.scale.set(-ratio, ratio, ratio);
    groupTexts.children[index].scale.set(-ratio, ratio, ratio);
  });
}
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

import { Raycaster, Vector2 } from "three";

const mouse = new Vector2();
const raycaster = new Raycaster();
window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / canvasSize.width) * 2 - 1;
  mouse.y = -(event.clientY / canvasSize.height) * 2 + 1;
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
window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / canvasSize.width) * 2 - 1;
  mouse.y = -(event.clientY / canvasSize.height) * 2 + 1;
  animate();
  if (isPopupOpen) return;
  if (currentIntersect && currentIntersect.isLoaded) openPopup(currentIntersect);
});

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

import { audioLoader, sound } from "./components/sound";
let isMusicLoaded = false;
let isMusicPlaying = false;
document
  .querySelector<HTMLDivElement>(".audio")!
  .addEventListener("click", () => {
    const play = document.querySelector<HTMLDivElement>(".play")!;
    const pause = document.querySelector<HTMLDivElement>(".pause")!;
    if (!isMusicLoaded) {
      audioLoader.load("./song/song.mp3", function (buffer) {
        isMusicLoaded = true;
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(1);

        gsap
          .timeline()
          .to(play, {
            duration: 0.2,
            css: {
              opacity: 0,
              transform: "translateX(-15px)",
            },
            ease: Power1.easeIn,
            onComplete: () => {
              sound.play();
            },
          })
          .to(pause, {
            duration: 0.2,
            css: {
              opacity: 1,
              transform: "translateX(0)",
            },
            ease: Power1.easeIn,
            onComplete: () => {
              isMusicPlaying = true;
            },
          });
      });
      return;
    }
    if (!isMusicPlaying) {
      gsap
        .timeline()
        .to(play, {
          duration: 0.2,
          css: {
            opacity: 0,
            transform: "translateX(-15px)",
          },
          ease: Power1.easeIn,
          onComplete: () => {
            sound.play();
          },
        })
        .to(pause, {
          duration: 0.2,
          css: {
            opacity: 1,
            transform: "translateX(0)",
          },
          ease: Power1.easeIn,
          onComplete: () => {
            isMusicPlaying = true;
          },
        });
    } else {
      gsap
        .timeline()
        .to(pause, {
          duration: 0.2,
          css: {
            opacity: 0,
            transform: "translateX(15px)",
          },
          ease: Power1.easeOut,
          onComplete: () => {
            sound.pause();
          },
        })
        .to(play, {
          duration: 0.2,
          css: {
            opacity: 1,
            transform: "translateX(0)",
          },
          ease: Power1.easeOut,
          onComplete: () => {
            isMusicPlaying = false;
          },
        });
    }
  });
window.addEventListener("DOMContentLoaded", () => {
  document.querySelector<HTMLDivElement>("#app")!.style.opacity = "1";
});
