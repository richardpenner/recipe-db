<script setup>
import { useRoute, useRouter } from 'vue-router'

const exportRecipes = async () => {
  try {
    // Trigger file download
    window.location.href = 'http://localhost:3000/api/recipes/export'
  } catch (error) {
    console.error('Error exporting recipes:', error)
    alert('Failed to export recipes')
  }
}
</script>

<template>
  <div>
    <nav class="nav">
      <div class="nav-content">
        <div class="nav-title">Recipe DB</div>
        <div class="nav-links">
          <router-link
            to="/"
            class="nav-link"
            :class="{ active: $route.path === '/' }"
          >
            Recipes
          </router-link>
          <router-link
            to="/edit"
            class="nav-link"
            :class="{ active: $route.path.startsWith('/edit') }"
          >
            New Recipe
          </router-link>
          <button 
            @click="exportRecipes" 
            class="nav-link"
          >
            Export
          </button>
        </div>
      </div>
    </nav>

    <main class="container">
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.nav {
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-link {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  color: #4b5563;
  text-decoration: none;
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
}

.nav-link:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.nav-link.active {
  background-color: #f3f4f6;
  color: #111827;
}

.container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}
</style>
