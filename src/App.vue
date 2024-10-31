<script setup lang="ts">
import { computedAsync } from '@vueuse/core'

import { TresCanvas } from '@tresjs/core'
import { OrbitControls, useProgress } from '@tresjs/cientos'

import CakeModel from './model/CakeModel/CakeModel.vue'
import CandleModel from './model/CakeModel/CandleModel.vue'

import LoadingScreen from './components/LoadingScreen.vue'
import MusicPlayer from './components/MusicPlayer.vue'

// const download = computedAsync(async () => {
//   return await useProgress();
// })

const polarAngle = Math.PI/4
</script>

<template>
    <header class="logo">
      <a href="https://s-group.vn" target="_blank">
        <img src="./assets/s-logo.png" alt="s-group">
      </a>
    </header>

    <main>
      <LoadingScreen />

      <MusicPlayer />

      <TresCanvas clear-color="#82DBC5" window-size>
        <TresPerspectiveCamera :position="[10, 10, 0]" />
        <TresAmbientLight :intensity="1" />
        <OrbitControls :enableZoom="false" :maxPolarAngle="polarAngle" :minPolarAngle="polarAngle" />
        <Suspense>
          <CandleModel :position="[-2, 1.5, -0.25]" />
        </Suspense>

        <Suspense>
          <CandleModel :position="[-2, 1.5, 0.25]" />
        </Suspense>

        <Suspense>
          <CakeModel />
        </Suspense>
      </TresCanvas>
    </main>


    <footer>

    </footer>

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
  height: 100%;
  width: 100%;
}
#app {
  height: 100%;
  width: 100%;
}
</style>
