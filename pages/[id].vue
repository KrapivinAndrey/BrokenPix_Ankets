<template>
  <div class="min-h-screen bg-cyber-dark">
    <!-- Glitch Overlay -->
    <GlitchOverlay :show="showGlitch" />

    <!-- Navigation -->
    <nav v-if="!isPdfMode" class="fixed top-0 left-0 right-0 z-50 bg-cyber-dark-secondary/80 backdrop-blur-sm border-b-2 border-cyber-blue">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <img 
            :src="getLogoUrl()" 
            alt="Broken Pixels Logo" 
            class="h-10 w-auto"
          />
          <div class="text-cyber-blue font-bold text-xl">
            Broken Pixels. Робокод. Екатеринбург
          </div>
        </div>
        <div class="hidden md:flex gap-4">
          <button
            @click="handlePrevious"
            @keydown="handleKeyDown($event, handlePrevious)"
            class="cyber-button"
            tabindex="0"
            aria-label="Предыдущий участник"
          >
            ← Предыдущий
          </button>
          <button
            @click="handleNext"
            @keydown="handleKeyDown($event, handleNext)"
            class="cyber-button"
            tabindex="0"
            aria-label="Следующий участник"
          >
            Следующий →
          </button>
        </div>
      </div>
    </nav>

    <!-- Mobile Bottom Navigation -->
    <nav v-if="!isPdfMode" class="fixed bottom-0 left-0 right-0 z-50 bg-cyber-dark-secondary/80 backdrop-blur-sm border-t-2 border-cyber-blue flex md:hidden">
      <div class="max-w-7xl mx-auto w-full px-4 py-4">
        <div class="flex gap-4 justify-center">
          <button
            @click="handlePrevious"
            @keydown="handleKeyDown($event, handlePrevious)"
            class="cyber-button flex-1"
            tabindex="0"
            aria-label="Предыдущий участник"
          >
            ← Предыдущий
          </button>
          <button
            @click="handleNext"
            @keydown="handleKeyDown($event, handleNext)"
            class="cyber-button flex-1"
            tabindex="0"
            aria-label="Следующий участник"
          >
            Следующий →
          </button>
        </div>
      </div>
    </nav>

    <!-- Member Content -->
    <div :class="{ 'pt-20 pb-20 md:pb-0': !isPdfMode, 'glitch-content': showGlitch }">
      <TeamMember v-if="member" :member="member" />
      <div v-else class="min-h-screen flex items-center justify-center">
        <div class="text-cyber-blue text-2xl animate-glow-pulse">
          Участник не найден
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { members } from '~/data/members'
import type { TeamMember } from '~/types/member'

const route = useRoute()
const router = useRouter()

const showGlitch = ref(false)

const isPdfMode = computed(() => {
  return route.query.pdf === 'true'
})

const memberId = computed(() => {
  const id = parseInt(route.params.id as string)
  return isNaN(id) ? null : id
})

const member = computed<TeamMember | undefined>(() => {
  if (!memberId.value) return undefined
  return members.find(m => m.id === memberId.value)
})

const currentIndex = computed(() => {
  if (!memberId.value) return -1
  return members.findIndex(m => m.id === memberId.value)
})

const activateGlitch = () => {
  showGlitch.value = true
  setTimeout(() => {
    showGlitch.value = false
  }, 3000)
}

const handleNext = () => {
  if (currentIndex.value === -1) return
  
  activateGlitch()
  setTimeout(() => {
    const nextIndex = (currentIndex.value + 1) % members.length
    const nextMember = members[nextIndex]
    router.push(`/${nextMember.id}`)
  }, 100)
}

const handlePrevious = () => {
  if (currentIndex.value === -1) return
  
  activateGlitch()
  setTimeout(() => {
    const prevIndex = currentIndex.value === 0 ? members.length - 1 : currentIndex.value - 1
    const prevMember = members[prevIndex]
    router.push(`/${prevMember.id}`)
  }, 100)
}

const handleKeyDown = (event: KeyboardEvent, callback: () => void) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    callback()
  }
}

// Keyboard navigation
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    handleNext()
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    handlePrevious()
  }
}

const getLogoUrl = (): string => {
  const config = useRuntimeConfig()
  const baseURL = config.public?.baseURL || config.app?.baseURL || '/BrokenPix_Ankets/'
  const normalizedBaseURL = baseURL.endsWith('/') ? baseURL : `${baseURL}/`
  return `${normalizedBaseURL}logo/logo.png`
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
})
</script>

<style scoped>
.cyber-button {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 2px solid #00f0ff;
  color: #00f0ff;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  text-shadow: 0 0 5px #00f0ff;
}

.cyber-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.cyber-button:hover::before {
  left: 100%;
}

.cyber-button:hover,
.cyber-button:focus {
  background: rgba(0, 240, 255, 0.1);
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.5);
  transform: translateY(-2px);
}

.cyber-button:active {
  transform: translateY(0);
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
}

.cyber-button:focus-visible {
  outline: 2px solid #00f0ff;
  outline-offset: 2px;
}

.glitch-content {
  animation: glitch-shake 0.1s infinite;
  filter: contrast(1.1) brightness(1.05);
}

@keyframes glitch-shake {
  0%, 100% {
    transform: translateX(0);
  }
  10% {
    transform: translateX(-2px);
  }
  20% {
    transform: translateX(2px);
  }
  30% {
    transform: translateX(-1px);
  }
  40% {
    transform: translateX(1px);
  }
  50% {
    transform: translateX(-1px);
  }
  60% {
    transform: translateX(1px);
  }
  70% {
    transform: translateX(-0.5px);
  }
  80% {
    transform: translateX(0.5px);
  }
  90% {
    transform: translateX(0);
  }
}

@media print {
  .min-h-screen {
    min-height: auto;
  }
  
  body {
    background: white;
    color: black;
  }
}
</style>

