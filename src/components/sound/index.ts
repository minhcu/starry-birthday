import { Audio, AudioListener, AudioLoader } from "three";

export const listener = new AudioListener();

export const sound = new Audio(listener);

export const audioLoader = new AudioLoader();

