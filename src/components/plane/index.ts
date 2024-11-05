import { Group, PlaneGeometry, ShaderMaterial, DoubleSide, Mesh, MeshBasicMaterial } from "three";
import { gsap, Power1 } from "gsap";
import { Text } from "troika-three-text";

import { articles } from "../../constants";
import { vertext, fragment } from "../../shader";
import { textureLoader } from "../loader";

class CustomMesh extends Mesh<PlaneGeometry, ShaderMaterial> {
  customUrl?: string;
  isLoaded?: boolean;
  planeIndex?: number;
}

const groupPlanes = new Group();
const groupTexts = new Group();
const planeGeometry = new PlaneGeometry(2, 1.13, 32, 32);

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
  text.fontSize = 0.07;
  text.scale.x = -1;
  text.anchorX = "center";
  text.anchorY = "middle"
  text.textAlign = "center";
  text.color = "#fff";
  text.font = "./fonts/Montserrat-Regular.ttf";
  text.material = new MeshBasicMaterial({
    side: DoubleSide,
    transparent: true,
    opacity: 0,
  });
  text.outlineColor = "#28336e";
  text.outlineWidth = 0.009;
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
    text.position.set(x, y - 0.2, z + 0.6);
    text.lookAt(0, y, 0);
    updateTextOpacity(text, plane);
  });
}

function updatePlanesRect() {
  const ratio = document.body.clientWidth / 640;
  if (ratio > 1) return;
  groupPlanes.children.forEach((plane, index) => {
    plane.scale.set(-ratio, ratio, ratio);
    groupTexts.children[index].scale.set(-ratio, ratio, ratio);
  });
}

export { CustomMesh, groupPlanes, groupTexts, updatePlanesPosition, updatePlanesRect };
