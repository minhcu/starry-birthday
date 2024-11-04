import { Audio, AudioListener, AudioLoader } from "three";
import { gsap, Power1 } from "gsap";
import camera from "../camera";

export function initSound() {
  let isMusicLoaded = false;
  let isMusicPlaying = false;
  
  let listener: AudioListener | undefined = undefined;
  let sound: Audio | undefined = undefined;
  let audioLoader: AudioLoader | undefined = undefined;
  document
  .querySelector<HTMLDivElement>(".audio")!
  .addEventListener("click", () => {
      const play = document.querySelector<HTMLDivElement>(".play")!;
      const pause = document.querySelector<HTMLDivElement>(".pause")!;
      if (!audioLoader) audioLoader = new AudioLoader();
      if (!listener) {
        listener = new AudioListener();
        camera.add(listener);
      }
      if (!sound) sound = new Audio(listener);
      if (!isMusicLoaded) {
        audioLoader.load("./song/song.mp3", function (buffer) {
          isMusicLoaded = true;
          if (sound) {
            console.log(buffer)
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setVolume(1);
          }
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
                if (sound) sound.play();
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
              sound && sound.play();
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
              sound && sound.pause();
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

  return listener;
}
