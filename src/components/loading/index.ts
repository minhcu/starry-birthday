import { LoadingManager } from "three";
import camera from "../camera";
import { gsap, Power1 } from "gsap";

const HTML = `
<div class="content">
    <div class="statement">
        <span class="statement-divider" style="transform: scale(0.038, 1);"></span>
        <p class="text">
            Cảm ơn bạn đã đồng hành cùng S-Group trong năm 2024.
            Hãy cùng nhau nhìn lại những thành tựu mà chúng ta đã đạt được trong năm qua nhé!!!
        </p>
        <div class="statement-button">
            <a href="#">
              <span style="border-bottom: 1px solid #000;">-> Bắt đầu hành trình <-</span>
            </a>
        </div>
    </div>
</div>
`;
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
          loadingContainer.innerHTML = HTML;
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
