import { PerspectiveCamera } from "three"
import { listener } from "../sound"
const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(-20, 50, -10)

camera.add(listener)

export default camera