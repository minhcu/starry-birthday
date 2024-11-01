<script setup lang="ts">
import { ref, watch } from 'vue'
import { TresCanvas, useLoader } from '@tresjs/core'
import { Environment, OrbitControls } from '@tresjs/cientos'
import PlaneModel from './model/PlaneModel.vue'
import LogoModel from './model/LogoModel.vue'
import * as Hammer from 'hammerjs'
import { computedAsync } from '@vueuse/core'
import { TextureLoader } from 'three'

const sizesCanvas = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const scrollI = ref(0.0)
function animateScroll(deltaY: number) {
  if (deltaY > 0) scrollI.value++
  else if (deltaY < 0 && scrollI.value > 0) scrollI.value--
}

// TODO: Speed
window.addEventListener('wheel', e => {
  animateScroll(e.deltaY)
})
Hammer.default(window).on('pan', (e: any) => {
  switch (e.additionalEvent) {
    case 'panleft':
      animateScroll(1)
      break
    case 'panright':
      animateScroll(-1)
      break
    default:
      break
  }
})

const articles = [
  {
    title: '1. This is 5 word title',
    image: './model/test-image.jpg',
  },
  {
    title: '2. This is 5 word title',
    image: './model/test-image.jpg',
  },
  {
    title: '3. This is 5 word title',
    image: './model/test-image.jpg',
  },
  {
    title: '4. This is 5 word title',
    image: './model/test-image.jpg',
  },
  {
    title: '5. This is 5 word title',
    image: './model/test-image.jpg',
  },
  {
    title: '6. This is 5 word title',
    image: './model/test-image.jpg',
  },
  {
    title: '7. This is 5 word title',
    image: './model/test-image.jpg',
  },
  {
    title: '8. This is 5 word title',
    image: './model/test-image.jpg',
  },
  {
    title: '9. This is 5 word title',
    image: './model/test-image.jpg',
  },
  {
    title: '10. This is 5 word title',
    image: './model/test-image.jpg',
  },
  {
    title: '11. This is 5 word title',
    image: './model/test-image.jpg',
  },
]
import { BasicShadowMap, NoToneMapping, SRGBColorSpace } from 'three'

import * as THREE from "three";
const canvasRef = ref();
watch(canvasRef, (canvas) => {
  const backgroundTexture = new THREE.TextureLoader().load('./model/background.jpg');
  canvas.context.scene.value.background = backgroundTexture
})
const gl = {
  clearColor: '#82DBC5',
  shadows: true,
  alpha: false,
  shadowMapType: BasicShadowMap,
  outputColorSpace: SRGBColorSpace,
  toneMapping: NoToneMapping,
}
</script>

<template>
  <header class="logo">
    <a href="https://s-group.vn" target="_blank">
      <img src="./assets/s-logo.png" alt="s-group" />
    </a>
  </header>

  <main>
    <TresCanvas ref="canvasRef" window-size v-bind="gl">
      <TresAxesHelper :position="[1, 1, 1]" />
      <TresGridHelper :size="100" :divisions="100" />
      <TresPerspectiveCamera
        :position="[0, 1, -5]"
        :args="[75, sizesCanvas.width / sizesCanvas.height, 0.1, 100]"
      />
      <TresAmbientLight />
      <OrbitControls :enabled="false" :enableZoom="false" />

      <Suspense>
        <LogoModel :scrollI="scrollI" />
      </Suspense>

      <Suspense v-for="(article, index) in articles" :key="index">
        <PlaneModel :index="index" :article="article" :u-scroll-i="scrollI" />
      </Suspense>
    </TresCanvas>
  </main>

  <footer></footer>
</template>

<style>
.logo {
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 0;
  margin: 0;
  z-index: 100;
}
.logo img {
  height: 50px;
}
html,
body {
  margin: 0;
  padding: 0;
  max-height: 100vh;
  max-width: 100vw;
  overflow: hidden;
}
#app {
  height: 100%;
  width: 100%;
}
.color {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
  background: #fff;
}
</style>
