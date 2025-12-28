<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'BrokenPix Robotics - Команда по робототехнике',
  meta: [
    { name: 'description', content: 'Сайт-визитка команды BrokenPix по робототехнике' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  htmlAttrs: {
    lang: 'ru'
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #0a0a0a;
  color: #ffffff;
  overflow-x: hidden;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #1a1a2e;
}

::-webkit-scrollbar-thumb {
  background: #00f0ff;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #00ff41;
  box-shadow: 0 0 10px #00ff41;
}

/* Selection */
::selection {
  background: rgba(0, 240, 255, 0.3);
  color: #00f0ff;
}
</style>

