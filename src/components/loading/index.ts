import { LoadingManager } from "three";
import camera from "../camera";
import { gsap, Power1 } from "gsap";

// const HTML = `
// <div class="content">
//     <div class="statement">
//         <span class="statement-divider" style="transform: scale(0.038, 1);"></span>
//         <p class="text">
//             Cảm ơn bạn đã đồng hành cùng S-Group trong năm 2024.
//             Hãy cùng nhau nhìn lại những thành tựu mà chúng ta đã đạt được trong năm qua nhé!!!
//         </p>
//         <div class="statement-button">
//             <a href="#">
//             <span>Bắt đầu hành trình</span>
//             <span class="line"></span>
//             </a>
//         </div>
//     </div>
// </div>
// `;
const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const loadingImage = document.querySelector<HTMLImageElement>("#loading")!;
const loadingManager = new LoadingManager(
  () => {
    setTimeout(() => {
        document.querySelector<HTMLDivElement>('.landing')!.style.display = 'none';
        gsap.from(camera.position, {
          duration: 1.5,
          x: -30,
          y: 20,
          z: -10,
          ease: Power1.easeOut,
        });
        gsap.from(canvas, {
          duration: 2,
          css: { opacity: 0 },
          ease: Power1.easeInOut,
        });
    }, 500);
  },
  (_, loaded, total) => {
    const progress = loaded / total;
    loadingImage.style.height = `${progress * 360}px`;
  }
);

export default loadingManager;