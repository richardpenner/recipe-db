const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

const apiKey = process.env.GEMINI_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);
const OUTPUT_FILE = 'ottolenghi.json';
const INPUT_DIR = "/Users/richard/Desktop/ottolenghi simple";

/**
 * Uploads the given file to Gemini.
 *
 * See https://ai.google.dev/gemini-api/docs/prompting_with_media
 */
async function uploadToGemini(filename, mimeType) {
  const fullPath = path.join("/Users/richard/Desktop/ottolenghi simple", filename);
  const uploadResult = await fileManager.uploadFile(fullPath, {
    mimeType,
    displayName: filename,
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// Helper function to wait for user input
function waitForKeyPress(prompt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(prompt, () => {
      rl.close();
      resolve();
    });
  });
}

// Helper function to validate JSON response
function validateResponse(jsonResponse, originalFilename) {
  try {
    const recipes = JSON.parse(jsonResponse);
    if (!Array.isArray(recipes)) {
      throw new Error('Response is not an array');
    }
    if (recipes.length !== 1) {
      throw new Error(`Expected 1 recipe, but got ${recipes.length}`);
    }
    // Validate recipe has required fields
    const recipe = recipes[0];
    if (!recipe.title || !recipe.book) {
      throw new Error('Recipe missing required fields');
    }
    // Force the correct filename
    recipe.filename = originalFilename;
    return recipe;
  } catch (error) {
    throw new Error(`Invalid JSON response: ${error.message}`);
  }
}

// Helper function to read existing recipes
async function getExistingRecipes() {
  try {
    const content = await fs.readFile(OUTPUT_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Helper function to save recipe
async function saveRecipe(newRecipe) {
  const existing = await getExistingRecipes();
  const combined = [...existing, newRecipe];
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(combined, null, 2));
  console.log(`Saved recipe for ${newRecipe.filename} to ${OUTPUT_FILE}`);
}

// Helper function to check if a file has been processed
async function isFileProcessed(filename) {
  const existing = await getExistingRecipes();
  return existing.some(recipe => recipe.filename === filename);
}

async function processImage(filename) {
  console.log(`\nProcessing ${filename}...`);
  
  // Check if already processed
  if (await isFileProcessed(filename)) {
    console.log(`Skipping ${filename} - already processed`);
    return;
  }

  // Upload file
  const uploadedFile = await uploadToGemini(filename, "image/jpeg");

  // Create chat session
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            fileData: {
              mimeType: uploadedFile.mimeType,
              fileUri: uploadedFile.uri,
            },
          },
          {text: "I have attached a picture that contains a recipe. I want you to convert the image to a JSON object. The picture contains the following elements which should represent their own JSON attributes: a title, a description, coloured labels which will be one or more of \"S\", \"I\", \"M\", \"P\", \"L\", \"E\", how many people the recipe serves, a list of steps to make the recipe. Ignore page numbers. The object should also contain the key \"book\" and the value \"Ottolenghi simple\", and a key 'filename' which includes the filename it was processed from. For the ingredients I want you to break them down as follows:\n- quantity (such as the \"½\" in \"½ cup/10g mint leaves, roughly shredded\")\n- unit (such as the \"cup\" in \"½ cup/10g mint leaves, roughly shredded\")\n- name (such as \"mint leaves\" in \"½ cup/10g mint leaves, roughly shredded\")\n- descriptor (such as \"roughly shredded\" in \"½ cup/10g mint leaves, roughly shredded\"). I want you to process the labels too:\n- if you see S, the label value should be \"short-on-time\"\n- if you see I, the label value should be \"ten-ingredients\",\n- if you see M, the label value should be \"make-ahead\",\n- if you see P, the label value should be \"pantry\"\n- if you see L, the label value should be \"lazy\"\n- if you see E, the label value should be \"easier\". Return the result as an array containing this single object."},
        ],
      },
    ],
  });

  // Get and validate response
  const result = await chatSession.sendMessage("Please give me the JSON for the attached file as described.");
  const response = result.response.text();
  
  try {
    const recipe = validateResponse(response, filename);
    await saveRecipe(recipe);
  } catch (error) {
    console.error('Error processing image:', error.message);
    console.error('Raw response:', response);
    process.exit(1);
  }
}

async function getImageFiles() {
  try {
    const files = await fs.readdir(INPUT_DIR);
    return files
      .filter(file => file.toLowerCase().endsWith('.jpeg') || file.toLowerCase().endsWith('.jpg'))
      .sort((a, b) => a.localeCompare(b)); // Sort alphabetically for consistent order
  } catch (error) {
    console.error('Error reading directory:', error);
    process.exit(1);
  }
}

async function run() {
  try {
    const allFiles = await getImageFiles();
    console.log(`Found ${allFiles.length} image files in ${INPUT_DIR}`);
    
    for (let i = 0; i < allFiles.length; i++) {
      await processImage(allFiles[i]);
      
      // If there are more files to process, wait for user input
      if (i < allFiles.length - 1) {
        const nextFile = allFiles[i + 1];
        await waitForKeyPress(`\nPress Enter to process the next image (${nextFile})...`);
      }
    }

    console.log('\nAll files processed successfully!');
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

run();