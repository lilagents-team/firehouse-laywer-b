#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

async function fixJsonFiles() {
  console.log('🔧 Starting JSON file cleanup...');
  
  const dataDir = path.join(process.cwd(), 'content/newsletters/data');
  
  try {
    const files = await fs.readdir(dataDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    console.log(`📄 Found ${jsonFiles.length} JSON files to check`);
    
    let fixedCount = 0;
    let alreadyCleanCount = 0;
    let errorCount = 0;
    
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(dataDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        
        // Check if file has markdown code block wrapper
        if (content.startsWith('```json') && content.endsWith('```')) {
          // Extract JSON content from markdown code block
          const jsonMatch = content.match(/```json\n([\s\S]*?)\n```$/);
          if (jsonMatch) {
            const cleanJson = jsonMatch[1];
            
            // Verify it's valid JSON before writing
            try {
              JSON.parse(cleanJson);
              await fs.writeFile(filePath, cleanJson, 'utf-8');
              console.log(`✅ Fixed: ${file}`);
              fixedCount++;
            } catch (parseError) {
              console.log(`❌ Invalid JSON in ${file}: ${parseError.message}`);
              errorCount++;
            }
          } else {
            console.log(`⚠️  Could not extract JSON from ${file}`);
            errorCount++;
          }
        } else {
          // File is already clean
          alreadyCleanCount++;
        }
      } catch (fileError) {
        console.log(`❌ Error processing ${file}: ${fileError.message}`);
        errorCount++;
      }
    }
    
    console.log('\n📊 Cleanup Summary:');
    console.log(`✅ Fixed files: ${fixedCount}`);
    console.log(`✓ Already clean: ${alreadyCleanCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📋 Total processed: ${jsonFiles.length}`);
    
    if (fixedCount > 0) {
      console.log('\n🎉 JSON files have been cleaned! The markdown code block wrappers have been removed.');
    }
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  fixJsonFiles();
}

module.exports = { fixJsonFiles };