const sqlite = require('better-sqlite3');
const fs = require('fs').promises;
const path = require('path');

async function importRecipes() {
  try {
    // Read the JSON file
    const jsonContent = await fs.readFile(path.join(__dirname, 'ottolenghi.json'), 'utf-8');
    const recipes = JSON.parse(jsonContent);
    
    // Connect to database
    const db = new sqlite(path.join(__dirname, 'recipes.db'));
    
    // Prepare statements
    const insertRecipe = db.prepare(`
      INSERT INTO recipes (title, description)
      VALUES (?, ?)
    `);
    
    const insertIngredient = db.prepare(`
      INSERT INTO ingredients (recipe_id, quantity, unit, name, descriptor)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const insertRecipeLabel = db.prepare(`
      INSERT INTO recipe_labels (recipe_id, label_id)
      VALUES (?, ?)
    `);

    const insertStep = db.prepare(`
      INSERT INTO steps (recipe_id, step_number, description)
      VALUES (?, ?, ?)
    `);
    
    // Create transaction that handles all recipes
    const importAllRecipes = db.transaction((recipes) => {
      console.log(`Starting import of ${recipes.length} recipes...`);
      
      for (const recipe of recipes) {
        console.log(`Importing recipe: ${recipe.title}`);
        
        // Insert recipe
        const recipeResult = insertRecipe.run(recipe.title, recipe.description);
        const recipeId = recipeResult.lastInsertRowid;
        
        // Insert ingredients
        recipe.ingredients.forEach(ingredient => {
          insertIngredient.run(
            recipeId,
            ingredient.quantity,
            ingredient.unit,
            ingredient.name,
            ingredient.descriptor
          );
        });
        
        // Insert steps
        recipe.steps.forEach((step, index) => {
          insertStep.run(recipeId, index + 1, step);
        });
        
        // Insert labels
        if (recipe.labels) {
          recipe.labels.forEach(label => {
            insertRecipeLabel.run(recipeId, label);
          });
        }
      }
      
      console.log('All recipes imported successfully');
    });
    
    // Process all recipes in a single transaction
    try {
      importAllRecipes(recipes);
    } catch (error) {
      console.error('Error during import - rolling back all changes:', error);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run the import
importRecipes(); 