<script setup lang="ts">
import { ref, watch } from 'vue'
import { useGLTF } from '@tresjs/cientos'

const { scene } = await useGLTF('./model/s-logo.glb', { draco: true })
const props = defineProps({
  scrollI: {
    type: Number,
    default: () => 0.0
  }
})

const rotationInital = ref(Math.PI)
console.log(scene)

scene.children.forEach(mesh => {
  mesh.position.x = -0.03
  mesh.position.z = 0.03
})
// Initial
const scaleNumer = 25
scene.scale.set(scaleNumer, scaleNumer, scaleNumer)
scene.rotation.z = rotationInital.value
scene.rotation.x = Math.PI / 2
// scene.position.x = 0.6
watch(() => props.scrollI, (newVal) => {
  scene.rotation.z = rotationInital.value - newVal * 0.02
  // scene.position.z = - newVal * 0.02 * 0.5
})
</script>

<template>
  <primitive :object="scene" />
</template>
