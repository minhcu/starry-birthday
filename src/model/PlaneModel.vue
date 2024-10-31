<script setup lang="ts">
import { ref, shallowReactive, watch } from 'vue';
import { useLoader, useRenderLoop } from '@tresjs/core'
import { TextureLoader } from 'three'

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
  article: {
    type: Object,
    required: true,
  }
})

const texture = await useLoader(TextureLoader, props.article.image)
console.log(texture)

import { Mesh } from 'three'

const blobRef = ref<Mesh | null>(null)

// Plane Initial Position
const distance = 1;
const speed = 0.05;
const posX = () => distance * 4 * Math.sin(props.index + 1 * props.uScrollI * speed)
const posY = () => (props.index - 12) + (props.uScrollI * speed)
const posZ = () => - distance * 2.5 * Math.cos(props.index + 1 * props.uScrollI * speed)
const position = shallowReactive({
  x: posX(),
  y: posY(),
  z: posZ()
})


// On Scroll
watch(() => props.uScrollI, (newVal) => {
  uniforms.uScrollI.value = newVal
  position.x = posX()
  position.y = posY()
  position.z = posZ()
})

// ShaderMaterial
const fragmentShader = `
uniform sampler2D uTexture;
uniform float uTouch;
uniform float uTime;

varying vec2 vUv;

void main() {
    vec4 texture = texture2D(uTexture, vUv);
    vec3 gray = vec3((texture.r + texture.g + texture.b) * 0.3);

    float strength = distance(vUv, vec2(1.2, 0.5));
    strength -= - sin(uTouch - 0.5) * 3.0;

    vec3 color = mix(texture.rgb, gray.rgb, smoothstep(strength, strength - 0.2, uTouch));

    gl_FragColor = vec4(color, 1.0);
}
`
const vertexShader = `
uniform float uTime;

varying vec2 vUv;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.z += sin(modelPosition.x * 5.0 - uTime) * 0.1;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    vUv = uv;
}
`
const uniforms = {
  uTime: {
    value: 0,
  },
  uScrollI: {
    value: props.uScrollI,
  },
  uTexture: {
    value: texture,
  },
  uTouch: {
    value: 0,
  }
}

const { onLoop } = useRenderLoop()

onLoop(({ elapsed }) => {
  if (blobRef.value) {
    blobRef.value.material.uniforms.uTime.value = elapsed
  }
})
</script>

<template>
  <TresMesh ref="blobRef" :look-at="[0, position.y, 0]" :position="[position.x, position.y, position.z]">
    <TresPlaneGeometry :args="[2, 1.25, 32, 32]" />
    <TresShaderMaterial :side="2" :uniforms="uniforms" :vertex-shader="vertexShader" :fragment-shader="fragmentShader" />
    <!-- <TresMeshStandardMaterial :side="2" :map="texture" /> -->
  </TresMesh>
</template>
