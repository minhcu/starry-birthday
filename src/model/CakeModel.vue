<script setup lang="ts">
import { ref, watch } from 'vue'
import { useGLTF } from '@tresjs/cientos'

const { scene } = await useGLTF('./model/cake_3d.glb', { draco: true })

const props = defineProps({
  scrollI: {
    type: Number,
    default: () => 0.0
  }
})

const rotationInital = ref(Math.PI / 2)

scene.scale.set(0.3, 0.3, 0.3)
scene.rotation.x = - Math.PI / 100 * 28
scene.rotation.y = rotationInital.value
watch(() => props.scrollI, (newVal) => {
  scene.rotation.y = rotationInital.value - newVal * 0.02
  // scene.position.y = rotationInital.value - newVal * 0.01 * 0.8
  scene.position.z = - newVal * 0.02 * 0.5
})
</script>

<template>
  <primitive :object="scene" />
</template>
