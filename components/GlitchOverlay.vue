<template>
  <Transition name="glitch-fade">
    <div v-if="show" class="glitch-overlay fixed inset-0 pointer-events-none z-[10000]">
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
import { onMounted, ref, watch, nextTick } from 'vue'

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

const pixelCount = 600
const colors = ['#00f0ff', '#ff00ff', '#00ff41', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff0080']
const pixels = ref<Pixel[]>([])

const generatePixels = () => {
  const newPixels: Pixel[] = []
  for (let i = 0; i < pixelCount; i++) {
    newPixels.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 14,
      delay: Math.random() * 300,
      duration: 500 + Math.random() * 800
    })
  }
  pixels.value = newPixels
}

onMounted(() => {
  generatePixels()
})

watch(() => props.show, (newValue) => {
  if (newValue) {
    // Сброс и регенерация элементов для перезапуска анимаций
    pixels.value = []
    
    // Используем nextTick для гарантии, что DOM обновится
    nextTick(() => {
      generatePixels()
    })
  }
})
</script>

<style scoped>
.glitch-overlay {
  background: transparent;
  overflow: hidden;
  will-change: contents;
  transform: translateZ(0);
  backface-visibility: hidden;
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
  box-shadow: 
    0 0 12px currentColor, 
    0 0 24px currentColor, 
    0 0 36px currentColor,
    0 0 48px currentColor,
    0 0 60px currentColor;
  border-radius: 3px;
  filter: brightness(2) saturate(1.5) contrast(1.2);
  will-change: transform, opacity;
  transform: translateZ(0);
  border: 2px solid currentColor;
  mix-blend-mode: screen;
}

@keyframes glitch-pixel-animation {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  3% {
    opacity: 1;
    transform: scale(1.8);
  }
  6% {
    opacity: 1;
    transform: scale(1.5);
  }
  9% {
    opacity: 1;
    transform: scale(1.7);
  }
  12% {
    opacity: 1;
    transform: scale(1.3);
  }
  15% {
    opacity: 1;
    transform: scale(1.6);
  }
  18% {
    opacity: 1;
    transform: scale(1.2);
  }
  21% {
    opacity: 1;
    transform: scale(1.4);
  }
  24% {
    opacity: 1;
    transform: scale(1.1);
  }
  27% {
    opacity: 1;
    transform: scale(1.3);
  }
  30% {
    opacity: 1;
    transform: scale(1);
  }
  33% {
    opacity: 1;
    transform: scale(1.2);
  }
  36% {
    opacity: 1;
    transform: scale(1.05);
  }
  40% {
    opacity: 1;
    transform: scale(1.1);
  }
  45% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  55% {
    opacity: 0.98;
    transform: scale(0.98);
  }
  60% {
    opacity: 0.95;
    transform: scale(0.95);
  }
  65% {
    opacity: 0.98;
    transform: scale(1);
  }
  70% {
    opacity: 0.9;
    transform: scale(0.9);
  }
  75% {
    opacity: 0.95;
    transform: scale(0.95);
  }
  80% {
    opacity: 0.85;
    transform: scale(0.85);
  }
  85% {
    opacity: 0.75;
    transform: scale(0.75);
  }
  90% {
    opacity: 0.6;
    transform: scale(0.6);
  }
  93% {
    opacity: 0.4;
    transform: scale(0.4);
  }
  96% {
    opacity: 0.25;
    transform: scale(0.25);
  }
  100% {
    opacity: 0;
    transform: scale(0);
  }
}

.glitch-fade-enter-active {
  transition: opacity 0.1s ease-in;
}

.glitch-fade-leave-active {
  transition: opacity 0.2s ease-out;
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
