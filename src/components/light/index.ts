import { AmbientLight } from "three";
import { PointLight } from "three";
import { DirectionalLight } from "three";

const ambientLight = new AmbientLight(0xffffff, 1.5);
ambientLight.position.set(0, 2, 8);

const pointLight = new PointLight(0xffffff, 1.5);
pointLight.position.set(1, 1, 1);

const directionalLight = new DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(1, 2, 4);
directionalLight.target.position.set(0, 0, 0);

export { ambientLight, pointLight, directionalLight };