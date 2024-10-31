<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos'
import type { PropType } from 'vue';

type Position = [number, number, number]

const { position } = defineProps({
  position: {
    type: Array as unknown as PropType<Position>,
    default: () => [0, 0, 0],
  },
})

const { nodes } = await useGLTF('./model/candle.glb', { draco: true })
const candle = nodes['Text020']
const p = Math.PI

candle.position.set(...position)
candle.rotation.set(p / 2, 0, p * 3 / 2)
</script>
<template>
  <primitive :object="nodes['Text020']" />
</template>
