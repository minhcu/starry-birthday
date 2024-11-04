import { TextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import loadingManager from "../loading";

export const textureLoader = new TextureLoader(loadingManager);
export const gltfLoader = new GLTFLoader(loadingManager);