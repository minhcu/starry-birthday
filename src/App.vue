<script setup lang="ts">
import { ref } from 'vue'
import { TresCanvas } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import CakeModel from './model/CakeModel/CakeModel.vue'
import PlaneModel from './model/PlaneModel.vue'

const sizesCanvas = {
    width: window.innerWidth,
    height: window.innerHeight
}

const scrollI = ref(0.0)

function animateScroll(e: WheelEvent) {
    const deltaY = e.deltaY
    if (deltaY > 0) scrollI.value++
    else if (deltaY < 0 && scrollI.value > 0) scrollI.value--
}

window.addEventListener('wheel', (e) => {
    animateScroll(e)
})
</script>

<template>
    <header class="logo">
      <a href="https://s-group.vn" target="_blank">
        <img src="./assets/s-logo.png" alt="s-group">
      </a>
    </header>

    <main>
      <TresCanvas clear-color="#82DBC5" window-size>
        <TresPerspectiveCamera :position="[0, 0, -5]" :args="[75, sizesCanvas.width/ sizesCanvas.height, 0.1, 100]"/>
        <TresAmbientLight :intensity="1.5"/>
        <OrbitControls :enabled="false" :enableZoom="false" />

        <Suspense>
          <CakeModel :scrollI="scrollI" />
        </Suspense>


        <PlaneModel v-for="i in 12" :key="i" :index="i" :u-scroll-i="scrollI"/>
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
  max-height: 100vh;
  max-width: 100vw;
  overflow: hidden;
}
#app {
  height: 100%;
  width: 100%;
}
</style>
