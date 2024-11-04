import { PerspectiveCamera } from "three"
import { canvasSize } from "../../constants"
import { listener } from "../sound"
const camera = new PerspectiveCamera(45, canvasSize.width / canvasSize.height, 0.1, 100)
camera.position.set(-20, 50, -10)

camera.add(listener)

export default camera