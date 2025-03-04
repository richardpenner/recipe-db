<script setup>
// Component logic will go here
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
</style>
