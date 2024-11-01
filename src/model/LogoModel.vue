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

scene.children.forEach(mesh => {
  mesh.position.x = -0.03
  mesh.position.z = 0.03
})
// Initial
const scaleNumer = 45
scene.scale.set(scaleNumer, scaleNumer, scaleNumer)
scene.rotation.z = rotationInital.value
scene.rotation.x = Math.PI / 2
watch(() => props.scrollI, (newVal) => {
  scene.rotation.z = rotationInital.value + newVal * 0.02
})
</script>

<template>
  <primitive :object="scene" />
</template>
