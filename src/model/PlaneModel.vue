<script setup lang="ts">
import { shallowReactive, watch } from 'vue';

const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
  uScrollI: {
    type: Number,
    required: true,
    default: 0.0,
  },
})

// Plane Position
const position = shallowReactive({
  y: props.index - 14.2,
  x: - Math.cos(props.index) * Math.PI,
  z: - Math.sin(props.index) * Math.PI,
})

watch(() => props.uScrollI, (newVal) => {
  uniforms.uScrollI.value = newVal
  position.z = - Math.PI * Math.cos(props.index + 1 * props.uScrollI * 0.02 )
  position.x = - Math.PI * Math.sin(props.index + 1 * props.uScrollI * 0.02 )
  position.y = (props.index - 14.2) + (props.uScrollI * 0.02)
})


// ShaderMaterial
const side = 2
const uniforms = shallowReactive({
  uTime: {
    value: 0,
  },
  uScrollI: {
    value: props.uScrollI,
  },
})
</script>

<template>
  <TresMesh :look-at="[0, position.y, 0]" :position="[position.x, position.y, position.z]">
    <TresPlaneGeometry :args="[2, 1.25, 32, 32]" />
    <TresShaderMaterial :side="side" :uniforms="uniforms"/>
  </TresMesh>
</template>
