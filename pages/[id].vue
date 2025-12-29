<template>
  <div class="min-h-screen bg-cyber-dark">
    <!-- Navigation -->
    <nav v-if="!isPdfMode" class="fixed top-0 left-0 right-0 z-50 bg-cyber-dark-secondary/80 backdrop-blur-sm border-b-2 border-cyber-blue">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div class="text-cyber-blue font-bold text-xl">
          BrokenPix Robotics
        </div>
        <div class="flex gap-4">
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

    <!-- Member Content -->
    <div :class="{ 'pt-20': !isPdfMode }">
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

const handleNext = () => {
  if (currentIndex.value === -1) return
  
  const nextIndex = (currentIndex.value + 1) % members.length
  const nextMember = members[nextIndex]
  router.push(`/${nextMember.id}`)
}

const handlePrevious = () => {
  if (currentIndex.value === -1) return
  
  const prevIndex = currentIndex.value === 0 ? members.length - 1 : currentIndex.value - 1
  const prevMember = members[prevIndex]
  router.push(`/${prevMember.id}`)
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
    handleNext()
  } else if (event.key === 'ArrowLeft') {
    handlePrevious()
  }
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

