<template>
  <div class="card recipe-editor">
    <h2 class="recipe-title">
      {{ isEditing ? 'Edit Recipe' : 'New Recipe' }}
    </h2>

    <form @submit.prevent="saveRecipe">
      <!-- Title -->
      <div class="form-group">
        <label class="label">Title</label>
        <input
          v-model="recipe.title"
          type="text"
          class="input"
          required
        />
      </div>

      <!-- Description -->
      <div class="form-group">
        <label class="label">Description</label>
        <textarea
          v-model="recipe.description"
          rows="3"
          class="input"
          required
        ></textarea>
      </div>

      <!-- Labels -->
      <div class="form-group">
        <label class="label">Labels</label>
        <div class="labels-container">
          <button
            v-for="label in availableLabels"
            :key="label.id"
            type="button"
            class="label-button"
            :class="{ 'label-button-selected': isLabelSelected(label.id) }"
            :style="{ '--label-color': label.color }"
            @click="toggleLabel(label.id)"
          >
            {{ label.text }}
          </button>
        </div>
      </div>

      <!-- Ingredients -->
      <div class="form-group">
        <label class="label">Ingredients</label>
        <div class="ingredients-list">
          <div v-for="(ingredient, index) in recipe.ingredients" 
               :key="index"
               class="ingredient-row">
            <input
              v-model="ingredient.quantity"
              type="text"
              class="input ingredient-quantity"
              placeholder="1"
            />
            <input
              v-model="ingredient.unit"
              type="text"
              class="input ingredient-unit"
              placeholder="whole"
            />
            <input
              v-model="ingredient.name"
              type="text"
              class="input ingredient-name"
              placeholder="Ingredient name"
              required
            />
            <input
              v-model="ingredient.descriptor"
              type="text"
              class="input ingredient-descriptor"
              placeholder="Optional descriptor"
            />
            <button
              type="button"
              @click="removeIngredient(index)"
              class="btn btn-danger"
            >
              Remove
            </button>
          </div>
        </div>
        <button
          type="button"
          @click="addIngredient"
          class="btn btn-primary add-item-btn"
        >
          Add Ingredient
        </button>
      </div>

      <!-- Steps -->
      <div class="form-group">
        <label class="label">Steps</label>
        <div class="steps-list">
          <div v-for="(step, index) in recipe.steps" 
               :key="index"
               class="step-row">
            <div class="step-number">{{ index + 1 }}</div>
            <textarea
              v-model="step.description"
              rows="2"
              class="input step-description"
              placeholder="Step description"
              required
            ></textarea>
            <button
              type="button"
              @click="removeStep(index)"
              class="btn btn-danger"
            >
              Remove
            </button>
          </div>
        </div>
        <button
          type="button"
          @click="addStep"
          class="btn btn-primary add-item-btn"
        >
          Add Step
        </button>
      </div>

      <!-- Save Button -->
      <div class="form-actions">
        <button
          type="submit"
          class="btn btn-primary"
        >
          Save Recipe
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isEditing = computed(() => !!route.params.id)

const defaultRecipe = {
  title: '',
  description: '',
  ingredients: [],
  steps: [],
  labels: []
}

const recipe = ref({ ...defaultRecipe })

// Load from localStorage on component creation
const loadFromStorage = () => {
  const stored = localStorage.getItem('current-recipe')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      recipe.value = {
        ...defaultRecipe,
        ...parsed,
        labels: parsed.labels || []
      }
    } catch (e) {
      console.error('Error loading from localStorage:', e)
      recipe.value = { ...defaultRecipe }
    }
  }
}

// Save to localStorage whenever recipe changes
watch(recipe, (newValue) => {
  localStorage.setItem('current-recipe', JSON.stringify(newValue))
}, { deep: true })

const availableLabels = [
  { id: 'short-on-time', text: 'Short on Time', color: '#f97316' },
  { id: 'ten-ingredients', text: '10 Ingredients or Less', color: '#eab308' },
  { id: 'make-ahead', text: 'Make Ahead', color: '#22c55e' },
  { id: 'pantry', text: 'Pantry', color: '#3b82f6' },
  { id: 'lazy', text: 'Lazy', color: '#14b8a6' },
  { id: 'easier', text: 'Easier Than You Think', color: '#ef4444' }
]

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

const toggleLabel = (labelId) => {
  const index = recipe.value.labels.indexOf(labelId)
  if (index === -1) {
    recipe.value.labels.push(labelId)
  } else {
    recipe.value.labels.splice(index, 1)
  }
}

const isLabelSelected = (labelId) => {
  return recipe.value.labels.includes(labelId)
}

const addIngredient = () => {
  recipe.value.ingredients.push({
    quantity: '',
    unit: '',
    name: '',
    descriptor: ''
  })
}

const removeIngredient = (index) => {
  recipe.value.ingredients.splice(index, 1)
}

const addStep = () => {
  recipe.value.steps.push({
    description: ''
  })
}

const removeStep = (index) => {
  recipe.value.steps.splice(index, 1)
}

const saveRecipe = async () => {
  try {
    const url = isEditing.value
      ? `http://localhost:3000/api/recipes/${route.params.id}`
      : 'http://localhost:3000/api/recipes'
    
    const method = isEditing.value ? 'PUT' : 'POST'
    
    const recipeData = {
      ...recipe.value,
      labels: recipe.value.labels || []
    }
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recipeData)
    })

    if (!response.ok) throw new Error('Failed to save recipe')
    
    // Reset to default recipe
    recipe.value = { ...defaultRecipe }
    localStorage.removeItem('current-recipe')
    
    router.push('/')
  } catch (error) {
    console.error('Error saving recipe:', error)
  }
}

onMounted(async () => {
  if (isEditing.value) {
    try {
      const response = await fetch(`http://localhost:3000/api/recipes/${route.params.id}`)
      if (!response.ok) throw new Error('Failed to fetch recipe')
      const recipeData = await response.json()
      // Ensure all required fields exist
      recipe.value = {
        ...defaultRecipe,
        ...recipeData,
        labels: recipeData.labels || []
      }
    } catch (error) {
      console.error('Error fetching recipe:', error)
      // Reset to default recipe on error
      recipe.value = { ...defaultRecipe }
    }
  } else {
    // Load from localStorage for new recipes
    loadFromStorage()
  }
})
</script>

<style scoped>
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
}

.labels-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.label-button {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.label-button:hover {
  background-color: #e5e7eb;
}

.label-button-selected {
  background-color: var(--label-color) !important;
  color: #000000;
  border-color: var(--label-color);
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.label-button-selected:hover {
  filter: brightness(0.95);
  transform: translateY(-1px);
}

.ingredients-list,
.steps-list {
  margin-bottom: 1rem;
}

.add-item-btn {
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.75rem;
  font-size: 1rem;
  background-color: #f3f4f6;
  color: #374151;
  border: 1px dashed #d1d5db;
  transition: all 0.2s ease-in-out;
}

.add-item-btn:hover {
  background-color: #e5e7eb;
  border-color: #9ca3af;
}

.add-item-btn:active {
  transform: translateY(1px);
}
</style> 