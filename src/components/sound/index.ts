import { gsap, Power1 } from "gsap";

export function initSound() {
  let isMusicPlaying = false;
  const audioHolder = document.querySelector<HTMLAudioElement>("audio")!;
  const play = document.querySelector<HTMLDivElement>(".play")!;
  const pause = document.querySelector<HTMLDivElement>(".pause")!;

  document.querySelector<HTMLDivElement>(".audio")!.addEventListener("click", () => {
    if (!isMusicPlaying) {
      gsap
        .timeline()
        .to(play, {
          duration: 0.2,
          css: {
            opacity: 0,
            transform: "translateX(-15px)",
          },
          ease: Power1.easeIn,
          onComplete: () => {
            audioHolder && audioHolder.play();
          },
        })
        .to(pause, {
          duration: 0.2,
          css: {
            opacity: 1,
            transform: "translateX(0)",
          },
          ease: Power1.easeIn,
          onComplete: () => {
            isMusicPlaying = true;
          },
        });
    } else {
      gsap
        .timeline()
        .to(pause, {
          duration: 0.2,
          css: {
            opacity: 0,
            transform: "translateX(15px)",
          },
          ease: Power1.easeOut,
          onComplete: () => {
            audioHolder && audioHolder.pause();
          },
        })
        .to(play, {
          duration: 0.2,
          css: {
            opacity: 1,
            transform: "translateX(0)",
          },
          ease: Power1.easeOut,
          onComplete: () => {
            isMusicPlaying = false;
          },
        });
    }
  });
}
