import { Audio, AudioListener, AudioLoader } from "three";
import { gsap, Power1 } from "gsap";

export const listener = new AudioListener();

export const sound = new Audio(listener);

export const audioLoader = new AudioLoader();

export function initSound() {
  let isMusicLoaded = false;
  let isMusicPlaying = false;
  document
    .querySelector<HTMLDivElement>(".audio")!
    .addEventListener("click", () => {
      const play = document.querySelector<HTMLDivElement>(".play")!;
      const pause = document.querySelector<HTMLDivElement>(".pause")!;
      if (!isMusicLoaded) {
        audioLoader.load("./song/song.mp3", function (buffer) {
          isMusicLoaded = true;
          sound.setBuffer(buffer);
          sound.setLoop(true);
          sound.setVolume(1);

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
                sound.play();
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
        });
        return;
      }
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
              sound.play();
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
              sound.pause();
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
