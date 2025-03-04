<template>
  <div class="card">
    <h2 class="recipe-title">My Recipes</h2>
    
    <div v-if="recipes.length === 0" class="recipe-description">
      No recipes yet. Create your first recipe!
    </div>
    
    <div v-else class="recipe-list">
      <div v-for="recipe in recipes" :key="recipe.id" class="recipe-card">
        <div class="recipe-header">
          <h3 class="recipe-title">{{ recipe.title }}</h3>
          <router-link 
            :to="{ name: 'edit', params: { id: recipe.id }}"
            class="nav-link"
          >
            Edit
          </router-link>
        </div>
        <p class="recipe-description">{{ recipe.description }}</p>
        
        <div v-if="recipe.labels && recipe.labels.length > 0" class="recipe-labels">
          <span
            v-for="labelId in sortLabels([...recipe.labels])"
            :key="labelId"
            class="recipe-label"
            :style="{ '--label-color': availableLabels[labelId]?.color }"
          >
            {{ availableLabels[labelId]?.text }}
          </span>
        </div>
        
        <div class="recipe-ingredients">
          <span class="ingredients-label">Ingredients:</span>
          <span class="ingredients-list">{{ formatIngredients(recipe.ingredients) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const recipes = ref([])

const availableLabels = {
  'short-on-time': { text: 'Short on Time', color: '#f97316' },
  'ten-ingredients': { text: '10 Ingredients or Less', color: '#eab308' },
  'make-ahead': { text: 'Make Ahead', color: '#22c55e' },
  'pantry': { text: 'Pantry', color: '#3b82f6' },
  'lazy': { text: 'Lazy', color: '#14b8a6' },
  'easier': { text: 'Easier Than You Think', color: '#ef4444' }
}

// Define the order of labels
const labelOrder = [
  'short-on-time',
  'ten-ingredients',
  'make-ahead',
  'pantry',
  'lazy',
  'easier'
]

// Function to sort labels according to the defined order
const sortLabels = (labels) => {
  return labels.sort((a, b) => labelOrder.indexOf(a) - labelOrder.indexOf(b))
}

const formatIngredients = (ingredients) => {
  if (!ingredients || ingredients.length === 0) return 'No ingredients listed'
  
  const formattedIngredients = ingredients.map(ing => {
    const parts = [
      ing.quantity,
      ing.unit,
      ing.name
    ].filter(Boolean)
    
    if (ing.descriptor) {
      parts.push(`(${ing.descriptor})`)
    }
    
    return parts.join(' ')
  })
  
  // Join with commas and limit to 3 ingredients
  if (formattedIngredients.length <= 3) {
    return formattedIngredients.join(', ')
  }
  
  return formattedIngredients.slice(0, 3).join(', ') + '...'
}

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/recipes')
    recipes.value = await response.json()
  } catch (error) {
    console.error('Error fetching recipes:', error)
  }
})
</script>

<style scoped>
.recipe-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.recipe-labels {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.recipe-label {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: var(--label-color);
  color: white;
}

.recipe-ingredients {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
}

.ingredients-label {
  font-weight: 500;
  margin-right: 0.5rem;
}

.ingredients-list {
  color: #6b7280;
}
</style> 