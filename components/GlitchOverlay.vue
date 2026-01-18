<template>
  <Transition name="glitch-fade">
    <div v-if="show" class="glitch-overlay fixed inset-0 pointer-events-none z-[9999]">
      <!-- RGB Split Effect -->
      <div class="glitch-rgb-split">
        <div class="glitch-layer glitch-red"></div>
        <div class="glitch-layer glitch-green"></div>
        <div class="glitch-layer glitch-blue"></div>
      </div>
      
      <!-- Glitch Lines -->
      <div class="glitch-lines">
        <div
          v-for="line in lines"
          :key="line.id"
          class="glitch-line"
          :style="{
            top: `${line.top}%`,
            height: `${line.height}px`,
            animationDelay: `${line.delay}ms`,
            animationDuration: `${line.duration}ms`
          }"
        />
      </div>
      
      <!-- Broken Pixels -->
      <div class="glitch-pixels">
        <div
          v-for="pixel in pixels"
          :key="pixel.id"
          class="glitch-pixel"
          :style="{
            left: `${pixel.x}%`,
            top: `${pixel.y}%`,
            backgroundColor: pixel.color,
            width: `${pixel.size}px`,
            height: `${pixel.size}px`,
            animationDelay: `${pixel.delay}ms`,
            animationDuration: `${pixel.duration}ms`
          }"
        />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

interface Props {
  show: boolean
}

const props = defineProps<Props>()

interface Pixel {
  id: number
  x: number
  y: number
  color: string
  size: number
  delay: number
  duration: number
}

interface Line {
  id: number
  top: number
  height: number
  delay: number
  duration: number
}

const pixelCount = 300
const lineCount = 15
const colors = ['#00f0ff', '#ff00ff', '#00ff41', '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff']
const pixels = ref<Pixel[]>([])
const lines = ref<Line[]>([])

const generatePixels = () => {
  const newPixels: Pixel[] = []
  for (let i = 0; i < pixelCount; i++) {
    newPixels.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 2 + Math.random() * 6,
      delay: Math.random() * 4000,
      duration: 8000 + Math.random() * 6000
    })
  }
  pixels.value = newPixels
}

const generateLines = () => {
  const newLines: Line[] = []
  for (let i = 0; i < lineCount; i++) {
    newLines.push({
      id: i,
      top: Math.random() * 100,
      height: 1 + Math.random() * 3,
      delay: Math.random() * 4000,
      duration: 7000 + Math.random() * 7000
    })
  }
  lines.value = newLines
}

onMounted(() => {
  generatePixels()
})

watch(() => props.show, (newValue) => {
  if (newValue) {
    generatePixels()
    generateLines()
  }
})
</script>

<style scoped>
.glitch-overlay {
  background: transparent;
  overflow: hidden;
}

/* RGB Split Effect */
.glitch-rgb-split {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.glitch-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  mix-blend-mode: screen;
  animation: glitch-rgb-split 12s ease-out;
}

.glitch-red {
  background: linear-gradient(90deg, transparent 0%, rgba(255, 0, 0, 0.3) 50%, transparent 100%);
  transform: translateX(-2px);
}

.glitch-green {
  background: linear-gradient(90deg, transparent 0%, rgba(0, 255, 0, 0.3) 50%, transparent 100%);
  transform: translateX(0);
}

.glitch-blue {
  background: linear-gradient(90deg, transparent 0%, rgba(0, 0, 255, 0.3) 50%, transparent 100%);
  transform: translateX(2px);
}

@keyframes glitch-rgb-split {
  0% {
    transform: translateX(0);
    opacity: 0;
  }
  10% {
    transform: translateX(-5px);
    opacity: 1;
  }
  20% {
    transform: translateX(5px);
    opacity: 1;
  }
  30% {
    transform: translateX(-3px);
    opacity: 1;
  }
  40% {
    transform: translateX(3px);
    opacity: 1;
  }
  50% {
    transform: translateX(-2px);
    opacity: 1;
  }
  60% {
    transform: translateX(2px);
    opacity: 1;
  }
  70% {
    transform: translateX(-1px);
    opacity: 0.8;
  }
  80% {
    transform: translateX(1px);
    opacity: 0.6;
  }
  100% {
    transform: translateX(0);
    opacity: 0;
  }
}

/* Glitch Lines */
.glitch-lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.glitch-line {
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  background: linear-gradient(90deg, 
    transparent 0%,
    rgba(0, 240, 255, 0.8) 20%,
    rgba(255, 0, 255, 0.8) 50%,
    rgba(0, 255, 65, 0.8) 80%,
    transparent 100%
  );
  animation: glitch-line-animation;
  box-shadow: 0 0 10px currentColor;
}

@keyframes glitch-line-animation {
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }
  20% {
    opacity: 1;
    transform: translateX(0);
  }
  40% {
    opacity: 0.8;
    transform: translateX(10px);
  }
  60% {
    opacity: 1;
    transform: translateX(-5px);
  }
  80% {
    opacity: 0.6;
    transform: translateX(5px);
  }
  100% {
    opacity: 0;
    transform: translateX(100%);
  }
}

/* Broken Pixels */
.glitch-pixels {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.glitch-pixel {
  position: absolute;
  animation: glitch-pixel-animation;
  opacity: 0;
  box-shadow: 0 0 3px currentColor;
}

@keyframes glitch-pixel-animation {
  0% {
    opacity: 0;
    transform: scale(0) translate(0, 0);
  }
  5% {
    opacity: 1;
    transform: scale(2) translate(-2px, -2px);
  }
  10% {
    opacity: 1;
    transform: scale(1.5) translate(2px, 2px);
  }
  15% {
    opacity: 0.9;
    transform: scale(1.2) translate(-1px, 1px);
  }
  20% {
    opacity: 1;
    transform: scale(1.8) translate(1px, -1px);
  }
  25% {
    opacity: 0.8;
    transform: scale(1) translate(0, 0);
  }
  30% {
    opacity: 1;
    transform: scale(1.6) translate(-3px, 3px);
  }
  35% {
    opacity: 0.7;
    transform: scale(0.9) translate(3px, -3px);
  }
  40% {
    opacity: 1;
    transform: scale(1.4) translate(-2px, -2px);
  }
  45% {
    opacity: 0.6;
    transform: scale(0.8) translate(2px, 2px);
  }
  50% {
    opacity: 1;
    transform: scale(1.7) translate(-1px, 1px);
  }
  60% {
    opacity: 0.5;
    transform: scale(0.7) translate(1px, -1px);
  }
  70% {
    opacity: 0.8;
    transform: scale(1.3) translate(-2px, 2px);
  }
  80% {
    opacity: 0.4;
    transform: scale(0.6) translate(2px, -2px);
  }
  90% {
    opacity: 0.3;
    transform: scale(0.5) translate(0, 0);
  }
  100% {
    opacity: 0;
    transform: scale(0) translate(0, 0);
  }
}

.glitch-fade-enter-active {
  transition: opacity 2s ease-in;
}

.glitch-fade-leave-active {
  transition: opacity 5s ease-out;
}

.glitch-fade-enter-from,
.glitch-fade-leave-to {
  opacity: 0;
}

.glitch-fade-enter-to,
.glitch-fade-leave-from {
  opacity: 1;
}
</style>
