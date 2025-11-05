// Prebuild script to generate lesson metadata JSON file
// This runs at build time to create a static JSON file that can be used in serverless functions

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the lesson metadata computation (lightweight version without MDX dependencies)
import { lessonMetaLight } from '../util/lessonData.js';

// Write to public directory so it's available in the deployed build
const outputPath = path.join(__dirname, '../public/lesson-data.json');

fs.writeFileSync(outputPath, JSON.stringify(lessonMetaLight, null, 2));

console.log(`✓ Generated lesson data: ${lessonMetaLight.length} lessons written to ${outputPath}`);
