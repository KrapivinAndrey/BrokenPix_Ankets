<template>
  <div class="min-h-screen bg-cyber-dark">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-cyber-dark-secondary/80 backdrop-blur-sm border-b-2 border-cyber-blue">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="text-cyber-blue font-bold text-xl">
          BrokenPix Robotics
        </div>
      </div>
    </nav>

    <!-- Members Grid -->
    <div class="pt-24 pb-12 px-4">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-bold text-center mb-12 cyber-text-glow">
          Команда BrokenPix
        </h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="member in members"
            :key="member.id"
            class="cyber-member-card"
          >
            <!-- Photo -->
            <div 
              class="flex justify-center mb-4 cursor-pointer photo-container"
              @click="handleMemberClick(member.id)"
              @keydown="handleKeyDown($event, () => handleMemberClick(member.id))"
              tabindex="0"
              :aria-label="`Открыть анкету участника ${member.fullName}`"
            >
              <div class="w-32 h-32 rounded-lg border-2 border-cyber-blue shadow-cyber-blue relative overflow-hidden bg-cyber-dark-secondary photo-hover-effect">
                <img
                  :src="getPhotoUrl(member, getFormatIndex(member.id))"
                  :alt="member.fullName"
                  class="w-full h-full object-cover relative z-10"
                  @error="handleImageError($event, member.id)"
                />
                <div
                  class="absolute inset-0 flex items-center justify-center text-cyber-blue text-5xl font-bold animate-glow-pulse pointer-events-none z-0"
                >
                  {{ member.fullName.charAt(0) }}
                </div>
                <div class="absolute inset-0 border-2 border-cyber-blue animate-pulse pointer-events-none z-20"></div>
              </div>
            </div>

            <!-- Name -->
            <h2 class="text-2xl font-bold text-center mb-2 text-cyber-blue">
              {{ member.fullName }}
            </h2>

            <!-- Age -->
            <p class="text-center text-gray-300 mb-3">
              {{ member.age }} лет
            </p>

            <!-- Hobbies preview -->
            <p class="text-center text-sm text-gray-400 line-clamp-2">
              {{ member.hobbies }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { members } from '~/data/members'

const router = useRouter()

const imageFormats = ['png', 'jpg', 'jpeg', 'webp', 'gif']
const memberFormats = ref<Record<number, number>>({})

const getFormatIndex = (memberId: number): number => {
  return memberFormats.value[memberId] ?? 0
}

const getPhotoUrl = (member: typeof members[0], formatIndex: number = 0): string => {
  if (member.photo) return member.photo
  const format = imageFormats[formatIndex]
  // Use baseURL from Nuxt config (set in nuxt.config.ts)
  // For GitHub Pages, this will be '/BrokenPix_Ankets/'
  const config = useRuntimeConfig()
  const baseURL = config.public?.baseURL || config.app?.baseURL || '/BrokenPix_Ankets/'
  // Ensure baseURL ends with /
  const normalizedBaseURL = baseURL.endsWith('/') ? baseURL : `${baseURL}/`
  return `${normalizedBaseURL}photos/${member.id}.${format}`
}

const handleImageError = (event: Event, memberId: number) => {
  const img = event.target as HTMLImageElement
  const currentIndex = getFormatIndex(memberId)
  
  if (currentIndex < imageFormats.length - 1) {
    memberFormats.value[memberId] = currentIndex + 1
    const member = members.find(m => m.id === memberId)
    if (member) {
      img.src = getPhotoUrl(member, currentIndex + 1)
    }
  } else {
    img.style.display = 'none'
  }
}

const handleMemberClick = (memberId: number) => {
  router.push(`/${memberId}`)
}

const handleKeyDown = (event: KeyboardEvent, callback: () => void) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    callback()
  }
}
</script>

<style scoped>
.cyber-member-card {
  background: linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%);
  border: 2px solid #00f0ff;
  border-radius: 12px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: fade-in 0.6s ease-out;
}

.cyber-member-card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #00f0ff, #ff00ff, #00ff41, #00f0ff);
  border-radius: 12px;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cyber-member-card:hover::before,
.cyber-member-card:focus::before {
  opacity: 0.5;
}

.photo-hover-effect {
  transition: all 0.3s ease;
}

.photo-container:hover .photo-hover-effect,
.photo-container:focus .photo-hover-effect {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.5), 0 0 50px rgba(0, 240, 255, 0.3);
  border-color: #00ff41;
}

.photo-container:focus-visible {
  outline: 2px solid #00f0ff;
  outline-offset: 4px;
  border-radius: 8px;
}

.cyber-text-glow {
  text-shadow: 
    0 0 10px #00f0ff,
    0 0 20px #00f0ff,
    0 0 30px #00f0ff,
    0 0 40px #00f0ff;
  color: #00f0ff;
  animation: glow-pulse 2s ease-in-out infinite alternate;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes glow-pulse {
  0%, 100% {
    opacity: 0.8;
    filter: brightness(1);
  }
  50% {
    opacity: 1;
    filter: brightness(1.3);
  }
}

.cyber-member-card:nth-child(1) { animation-delay: 0.1s; }
.cyber-member-card:nth-child(2) { animation-delay: 0.2s; }
.cyber-member-card:nth-child(3) { animation-delay: 0.3s; }
.cyber-member-card:nth-child(4) { animation-delay: 0.4s; }
.cyber-member-card:nth-child(5) { animation-delay: 0.5s; }
.cyber-member-card:nth-child(6) { animation-delay: 0.6s; }
</style>

