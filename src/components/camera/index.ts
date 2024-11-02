import { PerspectiveCamera } from "three"
import { canvasSize } from "../../constants"
const camera = new PerspectiveCamera(45, canvasSize.width / canvasSize.height, 0.1, 100)
camera.position.set(0, 1, 6)

export default camera