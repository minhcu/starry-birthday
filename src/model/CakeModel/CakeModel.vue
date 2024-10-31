<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos'

const { nodes } = await useGLTF('./model/cake_3d.glb', { draco: true })

</script>
<template>
  <primitive :object="nodes['Sketchfab_Scene']" />
</template>
