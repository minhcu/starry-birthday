<script setup lang="ts">
import { ref, shallowReactive, watch, computed } from 'vue';
import { Mesh, TextureLoader } from 'three'
import { useLoader, useRenderLoop } from '@tresjs/core'
import { Text } from 'troika-three-text'

const blobRef = ref<Mesh | null>(null)

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

// Plane Initial Position
const initialIndex = 2.55
const distance = 1;
const speed = 0.02;
const posX = () => distance * 4 * Math.sin((props.index + initialIndex) + 1 * props.uScrollI * speed)
const posY = () => ((props.index + initialIndex) - 12) + (props.uScrollI * speed)
const posZ = () => - distance * 2.5 * Math.cos((props.index + initialIndex) + 1 * props.uScrollI * speed)

const position = shallowReactive({
  x: posX(),
  y: posY(),
  z: posZ()
})
// On Scroll
const newText = new Text()
newText.text = props.article.title
newText.fontSize = 0.2
newText.position.y = position.y
newText.position.x = position.x
newText.position.z = position.z
newText.anchorX = 'right'

watch(() => props.uScrollI, (newVal) => {
  uniforms.uScrollI.value = newVal
  position.x = posX()
  position.y = posY()
  position.z = posZ()
  newText.position.y = position.y
  newText.position.x = position.x * 1.05
  newText.position.z = position.z * 1.05
  newText.lookAt(position.x * 2, position.y + 0.5, position.z * 2)
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
  <TresMesh :look-at="[0, position.y * 0.5, 0]" :position="[position.x, position.y, position.z]">
    <TresPlaneGeometry :args="[2, 1.25, 32, 32]" />
    <TresShaderMaterial :side="2" :uniforms="uniforms" :vertex-shader="vertexShader" :fragment-shader="fragmentShader" />
  </TresMesh>
  <primitive :object="newText" />
</template>
