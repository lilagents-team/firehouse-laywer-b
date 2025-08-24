#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// List of files that had JSON syntax errors
const errorFiles = [
  'April2018FINAL-extracted.md.json',
  'January2024FINAL-extracted.md.json', 
  'May2023FINAL-extracted.md.json',
  'MayJune2021FINAL-extracted.md.json',
  'SeptemberOctober2024FINAL-extracted.md.json',
  'v01n07nov1997-extracted.md.json',
  'v02n07jul1998-extracted.md.json',
  'v03n03mar1999-extracted.md.json'
];

async function fixJsonSyntax() {
  console.log('🔧 Fixing JSON syntax errors...');
  
  const dataDir = path.join(process.cwd(), 'content/newsletters/data');
  
  let fixedCount = 0;
  let errorCount = 0;
  
  for (const file of errorFiles) {
    try {
      const filePath = path.join(dataDir, file);
      let content = await fs.readFile(filePath, 'utf-8');
      
      // Try to parse first to see if it's already fixed
      try {
        JSON.parse(content);
        console.log(`✅ Already valid: ${file}`);
        continue;
      } catch (e) {
        // File needs fixing
      }
      
      // Common JSON syntax fixes
      let fixed = false;
      
      // Fix markdown list syntax in arrays (- item -> "item")
      if (content.includes('    - ')) {
        content = content.replace(
          /^(\s+)- ([^"]*?)$/gm,
          '$1"$2",'
        );
        // Remove trailing comma from last array item
        content = content.replace(/",\n(\s+)\]/g, '"\n$1]');
        fixed = true;
      }
      
      // Fix missing commas in arrays
      if (content.match(/"\s*\n\s*"/)) {
        content = content.replace(/"\s*\n(\s*")/g, '",\n$1');
        fixed = true;
      }
      
      // Fix bad control characters
      content = content.replace(/[\x00-\x1F\x7F]/g, '');
      
      // Remove any remaining stray ``` markers
      content = content.replace(/^```\s*$/gm, '');
      
      // Verify the fixed JSON is valid
      try {
        JSON.parse(content);
        await fs.writeFile(filePath, content, 'utf-8');
        console.log(`✅ Fixed: ${file}`);
        fixedCount++;
      } catch (parseError) {
        console.log(`❌ Could not fix ${file}: ${parseError.message}`);
        errorCount++;
      }
      
    } catch (fileError) {
      console.log(`❌ Error reading ${file}: ${fileError.message}`);
      errorCount++;
    }
  }
  
  console.log('\n📊 Fix Summary:');
  console.log(`✅ Fixed files: ${fixedCount}`);
  console.log(`❌ Still broken: ${errorCount}`);
}

// Run if called directly
if (require.main === module) {
  fixJsonSyntax();
}

module.exports = { fixJsonSyntax };