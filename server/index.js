const express = require('express')
const cors = require('cors')
const Database = require('better-sqlite3')
const path = require('path')
const { Document, Paragraph, TextRun, HeadingLevel, Packer } = require('docx')

const app = express()
const port = 3000

// Middleware
app.use(cors())
app.use(express.json())

// Database setup
const db = new Database(path.join(__dirname, 'recipes.db'))

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id INTEGER NOT NULL,
    quantity TEXT,
    unit TEXT,
    name TEXT NOT NULL,
    descriptor TEXT,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS steps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id INTEGER NOT NULL,
    step_number INTEGER NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS labels (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    color TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS recipe_labels (
    recipe_id INTEGER NOT NULL,
    label_id TEXT NOT NULL,
    PRIMARY KEY (recipe_id, label_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (label_id) REFERENCES labels(id) ON DELETE CASCADE
  );

  -- Insert default labels if they don't exist
  INSERT OR IGNORE INTO labels (id, text, color) VALUES
    ('short-on-time', 'Short on Time', '#f97316'),
    ('ten-ingredients', '10 Ingredients or Less', '#eab308'),
    ('make-ahead', 'Make Ahead', '#22c55e'),
    ('pantry', 'Pantry', '#3b82f6'),
    ('lazy', 'Lazy', '#14b8a6'),
    ('easier', 'Easier Than You Think', '#ef4444');
`)

// API Routes

// Export recipes as DOCX
app.get('/api/recipes/export', async (req, res) => {
  try {
    const recipes = db.prepare(`
      SELECT 
        r.*,
        GROUP_CONCAT(DISTINCT l.text) as label_texts,
        GROUP_CONCAT(DISTINCT json_object(
          'quantity', i.quantity,
          'unit', i.unit,
          'name', i.name,
          'descriptor', i.descriptor
        )) as ingredients,
        GROUP_CONCAT(DISTINCT json_object(
          'number', s.step_number,
          'description', s.description
        )) as steps
      FROM recipes r
      LEFT JOIN recipe_labels rl ON r.id = rl.recipe_id
      LEFT JOIN labels l ON rl.label_id = l.id
      LEFT JOIN ingredients i ON r.id = i.recipe_id
      LEFT JOIN steps s ON r.id = s.recipe_id
      GROUP BY r.id
      ORDER BY r.created_at DESC
    `).all()

    // Create document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: "Recipe Book",
            heading: HeadingLevel.TITLE,
          }),
          ...recipes.flatMap(recipe => {
            const children = []
            
            // Recipe Title
            children.push(
              new Paragraph({
                text: recipe.title,
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 120 }
              })
            )
            
            // Description
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: recipe.description,
                    size: 24
                  })
                ],
                spacing: { before: 120, after: 120 }
              })
            )
            
            // Labels
            if (recipe.label_texts) {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: "Labels: ",
                      bold: true,
                      size: 24
                    }),
                    new TextRun({
                      text: recipe.label_texts.split(',').join(', '),
                      size: 24
                    })
                  ],
                  spacing: { before: 120, after: 120 }
                })
              )
            }
            
            // Ingredients
            children.push(
              new Paragraph({
                text: "Ingredients",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 120 }
              })
            )
            
            if (recipe.ingredients) {
              const ingredients = recipe.ingredients.split(',').map(i => {
                try {
                  const ing = JSON.parse(i)
                  return new Paragraph({
                    children: [
                      new TextRun({
                        text: `• ${ing.quantity || ''} ${ing.unit || ''} ${ing.name}${ing.descriptor ? ' (' + ing.descriptor + ')' : ''}`,
                        size: 24
                      })
                    ],
                    spacing: { before: 80, after: 80 }
                  })
                } catch (e) {
                  return null
                }
              }).filter(Boolean)
              
              children.push(...ingredients)
            }
            
            // Steps
            children.push(
              new Paragraph({
                text: "Steps",
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 120 }
              })
            )
            
            if (recipe.steps) {
              const steps = recipe.steps.split(',').map(s => {
                try {
                  const step = JSON.parse(s)
                  return new Paragraph({
                    children: [
                      new TextRun({
                        text: `${step.number}. ${step.description}`,
                        size: 24
                      })
                    ],
                    spacing: { before: 80, after: 80 }
                  })
                } catch (e) {
                  return null
                }
              }).filter(Boolean)
              
              children.push(...steps)
            }
            
            // Add page break after each recipe except the last one
            if (recipes.indexOf(recipe) < recipes.length - 1) {
              children.push(
                new Paragraph({
                  pageBreakBefore: true
                })
              )
            }
            
            return children
          })
        ]
      }]
    })

    // Generate the document
    const buffer = await Packer.toBuffer(doc)
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    res.setHeader('Content-Disposition', 'attachment; filename=recipes.docx')
    res.send(buffer)
  } catch (error) {
    console.error('Error exporting recipes:', error)
    res.status(500).json({ error: 'Failed to export recipes' })
  }
})

// Get all recipes
app.get('/api/recipes', (req, res) => {
  const recipes = db.prepare('SELECT * FROM recipes ORDER BY created_at DESC').all()
  
  const recipesWithDetails = recipes.map(recipe => {
    const ingredients = db.prepare('SELECT * FROM ingredients WHERE recipe_id = ?').all(recipe.id)
    const steps = db.prepare('SELECT * FROM steps WHERE recipe_id = ? ORDER BY step_number').all(recipe.id)
    const labels = db.prepare(`
      SELECT l.id, l.text, l.color 
      FROM labels l 
      JOIN recipe_labels rl ON l.id = rl.label_id 
      WHERE rl.recipe_id = ?
    `).all(recipe.id)
    
    return {
      ...recipe,
      ingredients: ingredients.map(({ id, recipe_id, ...rest }) => rest),
      steps: steps.map(({ id, recipe_id, ...rest }) => rest),
      labels: labels.map(label => label.id)
    }
  })
  
  res.json(recipesWithDetails)
})

// Get a single recipe
app.get('/api/recipes/:id', (req, res) => {
  const recipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(req.params.id)
  
  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' })
  }
  
  const ingredients = db.prepare('SELECT * FROM ingredients WHERE recipe_id = ?').all(recipe.id)
  const steps = db.prepare('SELECT * FROM steps WHERE recipe_id = ? ORDER BY step_number').all(recipe.id)
  const labels = db.prepare(`
    SELECT l.id, l.text, l.color 
    FROM labels l 
    JOIN recipe_labels rl ON l.id = rl.label_id 
    WHERE rl.recipe_id = ?
  `).all(recipe.id)
  
  res.json({
    ...recipe,
    ingredients: ingredients.map(({ id, recipe_id, ...rest }) => rest),
    steps: steps.map(({ id, recipe_id, ...rest }) => rest),
    labels: labels.map(label => label.id)
  })
})

// Create a new recipe
app.post('/api/recipes', (req, res) => {
  const { title, description, ingredients, steps, labels } = req.body
  
  const insertRecipe = db.prepare(`
    INSERT INTO recipes (title, description)
    VALUES (?, ?)
  `)
  
  const insertIngredient = db.prepare(`
    INSERT INTO ingredients (recipe_id, quantity, unit, name, descriptor)
    VALUES (?, ?, ?, ?, ?)
  `)
  
  const insertStep = db.prepare(`
    INSERT INTO steps (recipe_id, step_number, description)
    VALUES (?, ?, ?)
  `)

  const insertRecipeLabel = db.prepare(`
    INSERT INTO recipe_labels (recipe_id, label_id)
    VALUES (?, ?)
  `)
  
  const transaction = db.transaction((recipe) => {
    const result = insertRecipe.run(recipe.title, recipe.description)
    const recipeId = result.lastInsertRowid
    
    recipe.ingredients.forEach(ingredient => {
      insertIngredient.run(
        recipeId,
        ingredient.quantity,
        ingredient.unit,
        ingredient.name,
        ingredient.descriptor
      )
    })
    
    recipe.steps.forEach((step, index) => {
      insertStep.run(recipeId, index + 1, step.description)
    })

    if (recipe.labels) {
      recipe.labels.forEach(labelId => {
        insertRecipeLabel.run(recipeId, labelId)
      })
    }
    
    return recipeId
  })
  
  try {
    const recipeId = transaction(req.body)
    res.status(201).json({ id: recipeId })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create recipe' })
  }
})

// Update a recipe
app.put('/api/recipes/:id', (req, res) => {
  const { title, description, ingredients, steps, labels } = req.body
  
  const updateRecipe = db.prepare(`
    UPDATE recipes
    SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `)
  
  const deleteIngredients = db.prepare('DELETE FROM ingredients WHERE recipe_id = ?')
  const deleteSteps = db.prepare('DELETE FROM steps WHERE recipe_id = ?')
  const deleteLabels = db.prepare('DELETE FROM recipe_labels WHERE recipe_id = ?')
  
  const insertIngredient = db.prepare(`
    INSERT INTO ingredients (recipe_id, quantity, unit, name, descriptor)
    VALUES (?, ?, ?, ?, ?)
  `)
  
  const insertStep = db.prepare(`
    INSERT INTO steps (recipe_id, step_number, description)
    VALUES (?, ?, ?)
  `)

  const insertRecipeLabel = db.prepare(`
    INSERT INTO recipe_labels (recipe_id, label_id)
    VALUES (?, ?)
  `)
  
  const transaction = db.transaction((recipe) => {
    updateRecipe.run(recipe.title, recipe.description, recipe.id)
    
    deleteIngredients.run(recipe.id)
    deleteSteps.run(recipe.id)
    deleteLabels.run(recipe.id)
    
    recipe.ingredients.forEach(ingredient => {
      insertIngredient.run(
        recipe.id,
        ingredient.quantity,
        ingredient.unit,
        ingredient.name,
        ingredient.descriptor
      )
    })
    
    recipe.steps.forEach((step, index) => {
      insertStep.run(recipe.id, index + 1, step.description)
    })

    if (recipe.labels) {
      recipe.labels.forEach(labelId => {
        insertRecipeLabel.run(recipe.id, labelId)
      })
    }
  })
  
  try {
    transaction({ ...req.body, id: req.params.id })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update recipe' })
  }
})

// Delete a recipe
app.delete('/api/recipes/:id', (req, res) => {
  const deleteRecipe = db.prepare('DELETE FROM recipes WHERE id = ?')
  
  try {
    deleteRecipe.run(req.params.id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete recipe' })
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
}) 