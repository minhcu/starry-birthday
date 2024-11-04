import { LoadingManager } from "three";
import camera from "../camera";
import { gsap, Power1 } from "gsap";

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const loadingImage = document.querySelector<HTMLImageElement>("#loading")!;
const loadingContainer =
  document.querySelector<HTMLDivElement>(".loading-container")!;
const landing = document.querySelector<HTMLDivElement>(".landing")!;
const loadingManager = new LoadingManager(
  () => {
    let isStart = false;
    gsap
      .timeline()
      .to(loadingContainer, {
        duration: 1.5,
        css: { opacity: 0 },
        delay: 0.5,
        onComplete: () => {
          document.body.classList.remove("loading");
          loadingContainer
            .querySelector(".statement-button a")!
            .addEventListener("click", (e) => {
              e.preventDefault();
              if (isStart) return;
              isStart = true;
              gsap.to(landing, {
                duration: 1,
                css: { opacity: 0 },
                onComplete: () => {
                  landing.style.display = "none";
                }
              });
              gsap.to(camera.position, {
                duration: 2,
                x: 0,
                y: 1,
                z: 6,
                ease: Power1.easeOut,
              });
              gsap.from(canvas, {
                duration: 2,
                css: { opacity: 0 },
                ease: Power1.easeInOut,
              });
            });
        },
      })
      .to(loadingContainer, {
        duration: 1.5,
        css: { opacity: 1 },
        delay: 0.25,
      });
  },
  (_, loaded, total) => {
    const progress = loaded / total;
    loadingImage.style.height = `${progress * 360}px`;
  }
);

export default loadingManager;
