import { createRouter, createWebHistory } from 'vue-router'
import RecipeList from '../views/RecipeList.vue'
import RecipeEditor from '../views/RecipeEditor.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: RecipeList
    },
    {
      path: '/edit/:id?',
      name: 'edit',
      component: RecipeEditor
    }
  ]
})

export default router 