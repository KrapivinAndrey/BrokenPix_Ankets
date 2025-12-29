<template>
  <div class="min-h-screen bg-cyber-dark text-white flex items-center justify-center p-4">
    <div class="max-w-4xl w-full">
      <div class="cyber-card relative overflow-hidden">
        <!-- Animated background grid -->
        <div class="absolute inset-0 opacity-10">
          <div class="grid-pattern"></div>
        </div>

        <!-- Content -->
        <div class="relative z-10 p-8 md:p-12">
          <!-- Photo -->
          <div class="mb-8 flex justify-center">
            <div class="w-48 h-48 rounded-lg border-2 border-cyber-blue shadow-cyber-blue relative overflow-hidden bg-cyber-dark-secondary">
              <img
                v-if="photoUrl"
                :src="photoUrl"
                :alt="member.fullName"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
              <div
                v-if="!photoUrl"
                class="absolute inset-0 flex items-center justify-center text-cyber-blue text-6xl font-bold animate-glow-pulse"
              >
                {{ member.fullName.charAt(0) }}
              </div>
              <div class="absolute inset-0 border-2 border-cyber-blue animate-pulse pointer-events-none"></div>
            </div>
          </div>

          <!-- Full Name -->
          <h1 class="text-4xl md:text-5xl font-bold mb-8 text-center cyber-text-glow">
            {{ member.fullName }}
          </h1>

          <!-- Info Grid -->
          <div class="space-y-6">
            <!-- Age -->
            <div class="cyber-info-item">
              <div class="cyber-label">Возраст</div>
              <div class="cyber-value">{{ member.age }} лет</div>
            </div>

            <!-- Hobbies -->
            <div class="cyber-info-item">
              <div class="cyber-label">Хобби</div>
              <div class="cyber-value">{{ member.hobbies }}</div>
            </div>

            <!-- Games -->
            <div class="cyber-info-item">
              <div class="cyber-label">Во что играешь</div>
              <div class="cyber-value">{{ member.games }}</div>
            </div>

            <!-- Summer -->
            <div class="cyber-info-item">
              <div class="cyber-label">Как провел лето</div>
              <div class="cyber-value">{{ member.summer }}</div>
            </div>

            <!-- Expectations -->
            <div class="cyber-info-item">
              <div class="cyber-label">Ожидания от команды</div>
              <div class="cyber-value cyber-text-accent">{{ member.expectations }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TeamMember } from '~/types/member'

interface Props {
  member: TeamMember
}

const props = defineProps<Props>()

const imageFormats = ['png', 'jpg', 'jpeg', 'webp', 'gif']
const currentFormatIndex = ref(0)
const imageError = ref(false)

const photoUrl = computed(() => {
  if (imageError.value) return null
  if (props.member.photo) return props.member.photo
  
  const format = imageFormats[currentFormatIndex.value]
  // Use baseURL from Nuxt config (set in nuxt.config.ts)
  // For GitHub Pages, this will be '/BrokenPix_Ankets/'
  const config = useRuntimeConfig()
  const baseURL = config.public?.baseURL || config.app?.baseURL || '/BrokenPix_Ankets/'
  // Ensure baseURL ends with /
  const normalizedBaseURL = baseURL.endsWith('/') ? baseURL : `${baseURL}/`
  return `${normalizedBaseURL}photos/${props.member.id}.${format}`
})

const handleImageError = () => {
  if (currentFormatIndex.value < imageFormats.length - 1) {
    currentFormatIndex.value++
    imageError.value = false
  } else {
    imageError.value = true
  }
}
</script>

<style scoped>
.cyber-card {
  background: linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%);
  border: 2px solid #00f0ff;
  border-radius: 12px;
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.3), inset 0 0 30px rgba(0, 240, 255, 0.1);
  position: relative;
  animation: fade-in 0.6s ease-out;
  min-height: 900px;
}

.cyber-card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #00f0ff, #ff00ff, #00ff41, #00f0ff);
  border-radius: 12px;
  z-index: -1;
  opacity: 0.5;
  animation: glow-pulse 3s ease-in-out infinite;
}

.grid-pattern {
  background-image: 
    linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  width: 100%;
  height: 100%;
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

.cyber-info-item {
  border-left: 3px solid #00f0ff;
  padding-left: 1.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  background: rgba(0, 240, 255, 0.05);
  border-radius: 4px;
  transition: all 0.3s ease;
  animation: slide-in 0.5s ease-out;
  animation-fill-mode: both;
}

.cyber-info-item:nth-child(1) { animation-delay: 0.1s; }
.cyber-info-item:nth-child(2) { animation-delay: 0.2s; }
.cyber-info-item:nth-child(3) { animation-delay: 0.3s; }
.cyber-info-item:nth-child(4) { animation-delay: 0.4s; }
.cyber-info-item:nth-child(5) { animation-delay: 0.5s; }

.cyber-info-item:hover {
  background: rgba(0, 240, 255, 0.1);
  border-left-color: #00ff41;
  transform: translateX(5px);
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
}

.cyber-label {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #00f0ff;
  margin-bottom: 0.5rem;
  font-weight: 600;
  text-shadow: 0 0 5px #00f0ff;
}

.cyber-value {
  font-size: 1.125rem;
  line-height: 1.6;
  color: #e0e0e0;
}

.cyber-text-accent {
  color: #00ff41;
  text-shadow: 0 0 10px #00ff41;
}

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
  border-radius: 4px;
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

@media print {
  /* Reset animations and effects */
  * {
    animation: none !important;
    transition: none !important;
  }
  
  /* Optimize container */
  .min-h-screen {
    min-height: auto;
    padding: 0 !important;
  }
  
  .max-w-4xl {
    max-width: 100%;
  }
  
  /* Optimize card */
  .cyber-card {
    border-radius: 0;
    box-shadow: none;
    border: 1px solid #000;
    background: white !important;
  }
  
  .cyber-card::before {
    display: none;
  }
  
  .grid-pattern {
    display: none;
  }
  
  /* Optimize content padding */
  .relative.z-10 {
    padding: 1rem !important;
  }
  
  /* Optimize photo size */
  .mb-8.flex.justify-center > div {
    width: 120px !important;
    height: 120px !important;
    margin-bottom: 1rem !important;
  }
  
  /* Optimize heading */
  h1 {
    font-size: 1.75rem !important;
    margin-bottom: 1rem !important;
    color: #000 !important;
    text-shadow: none !important;
  }
  
  .cyber-text-glow {
    text-shadow: none !important;
    color: #000 !important;
  }
  
  /* Optimize info items spacing */
  .space-y-6 {
    gap: 0.75rem !important;
  }
  
  .space-y-6 > * {
    margin-bottom: 0.75rem !important;
  }
  
  .cyber-info-item {
    padding-left: 0.75rem !important;
    padding-top: 0.25rem !important;
    padding-bottom: 0.25rem !important;
    margin-bottom: 0.5rem !important;
    border-left: 2px solid #000 !important;
    background: transparent !important;
    border-radius: 0 !important;
  }
  
  .cyber-label {
    font-size: 0.75rem !important;
    margin-bottom: 0.25rem !important;
    color: #000 !important;
    text-shadow: none !important;
  }
  
  .cyber-value {
    font-size: 0.875rem !important;
    line-height: 1.4 !important;
    color: #000 !important;
  }
  
  .cyber-text-accent {
    color: #000 !important;
    text-shadow: none !important;
  }
  
  /* Remove decorative elements */
  .animate-pulse,
  .animate-glow-pulse {
    animation: none !important;
  }
  
  /* Ensure text is black for printing */
  .text-white {
    color: #000 !important;
  }
  
  .bg-cyber-dark {
    background: white !important;
  }
  
  .bg-cyber-dark-secondary {
    background: #f5f5f5 !important;
  }
  
  .border-cyber-blue {
    border-color: #000 !important;
  }
  
  .text-cyber-blue {
    color: #000 !important;
  }
}
</style>

