#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

/**
 * Migrate existing JSON newsletter data to CMS-compatible markdown files
 * This allows users to edit existing newsletter metadata through Sveltia CMS
 */

async function migrateJsonToCms() {
  try {
    console.log('🔄 Starting JSON to CMS migration...');
    
    const dataDir = path.join(process.cwd(), 'content/newsletters/data');
    const cmsDir = path.join(process.cwd(), 'content/newsletters');
    
    // Get all JSON files
    const jsonFiles = (await fs.readdir(dataDir)).filter(file => file.endsWith('.json'));
    console.log(`📄 Found ${jsonFiles.length} JSON files to migrate`);
    
    let migrated = 0;
    let skipped = 0;
    
    for (const file of jsonFiles) {
      try {
        const jsonPath = path.join(dataDir, file);
        const baseName = file.replace(/\.(md\.)?json$/, '');
        const markdownPath = path.join(cmsDir, baseName + '.md');
        
        // Skip if markdown already exists (don't overwrite CMS entries)
        try {
          await fs.access(markdownPath);
          console.log(`⏭️  Skipping ${file} - markdown already exists`);
          skipped++;
          continue;
        } catch {
          // File doesn't exist, proceed with migration
        }
        
        // Read and parse JSON
        let content = await fs.readFile(jsonPath, 'utf-8');
        
        // Handle JSON wrapped in markdown code blocks
        if (content.startsWith('```json')) {
          const jsonMatch = content.match(/```json\\n([\\s\\S]*?)\\n```/);
          if (jsonMatch) {
            content = jsonMatch[1];
          }
        }
        
        const data = JSON.parse(content);
        
        // Skip if essential data is missing or corrupted
        if (!data.title || (!data.volume && !data.edition)) {
          console.log(`⚠️  Skipping ${file} - missing essential data`);
          skipped++;
          continue;
        }
        
        // Detect corrupted volume/edition data
        const hasValidVolume = data.volume && typeof data.volume === 'number' && !isNaN(data.volume);
        const hasValidEdition = data.edition && typeof data.edition === 'number' && !isNaN(data.edition);
        
        if (!hasValidVolume || !hasValidEdition) {
          console.log(`⚠️  Corrupted vol/ed data in ${file} - Vol: ${data.volume}, Ed: ${data.edition}`);
        }
        
        // Create frontmatter
        const frontmatter = {
          // Basic Information
          title: data.title || 'Untitled Newsletter',
          volume: hasValidVolume ? parseInt(data.volume) : 0,
          edition: hasValidEdition ? parseInt(data.edition) : 0,
          date: data.date || new Date().toISOString(),
          summary: data.summary || data.compressed_content || '',
          
          // Searchable Metadata
          keywords: Array.isArray(data.keywords) ? data.keywords : [],
          topics: Array.isArray(data.topics) ? data.topics : [],
          
          // Legal References
          legal_cases: data.legal_references?.cases || data.legal_cases || [],
          legal_statutes: data.legal_references?.statutes || data.legal_statutes || [],
          
          // Content Analysis
          key_findings: Array.isArray(data.key_findings) ? data.key_findings : [],
          recommendations: Array.isArray(data.recommendations) ? data.recommendations : [],
          
          // Technical Details
          source_pdf: data.original_filename || extractPdfNameFromSlug(data.slug) || '',
          featured: false,
          metadata_quality: data.metadata_quality || 'medium',
          
          // Migration metadata
          migrated_from: 'json_extraction',
          migration_date: new Date().toISOString(),
          corruption_detected: data.corruption_detected || (!hasValidVolume || !hasValidEdition),
          corruption_notes: data.corruption_notes || (!hasValidVolume || !hasValidEdition ? 'Invalid volume/edition data detected during migration' : '')
        };
        
        // Generate markdown content
        const markdownContent = generateNewsletterMarkdown(data, frontmatter);
        
        // Write markdown file
        await fs.writeFile(markdownPath, markdownContent);
        
        console.log(`✅ Migrated ${file} → ${path.basename(markdownPath)}`);
        migrated++;
        
      } catch (error) {
        console.error(`❌ Error migrating ${file}:`, error.message);
      }
    }
    
    console.log(`\\n📊 Migration Summary:`);
    console.log(`   ✅ Migrated: ${migrated} files`);
    console.log(`   ⏭️  Skipped: ${skipped} files`);
    console.log(`   📁 Output: ${cmsDir}`);
    console.log(`\\n🎯 Next steps:`);
    console.log(`   1. Review migrated files in Sveltia CMS`);
    console.log(`   2. Edit and enhance metadata as needed`);
    console.log(`   3. Run 'node scripts/generate-newsletter-cms.cjs' to build`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

function extractPdfNameFromSlug(slug) {
  if (!slug) return '';
  
  // Common patterns for PDF filenames
  const patterns = [
    slug + 'FINAL.pdf',
    slug + '.pdf',
    slug.replace('-extracted', '') + '.pdf',
    slug.replace('-extracted', '') + 'FINAL.pdf'
  ];
  
  return patterns[0]; // Return most likely match
}

function generateNewsletterMarkdown(data, frontmatter) {
  // Convert frontmatter to YAML
  const yamlLines = ['---'];
  
  for (const [key, value] of Object.entries(frontmatter)) {
    if (value === null || value === undefined) continue;
    
    if (Array.isArray(value)) {
      if (value.length === 0) {
        yamlLines.push(`${key}: []`);
      } else {
        yamlLines.push(`${key}:`);
        value.forEach(item => yamlLines.push(`  - "${item}"`));
      }
    } else if (typeof value === 'string') {
      yamlLines.push(`${key}: "${value}"`);
    } else {
      yamlLines.push(`${key}: ${value}`);
    }
  }
  
  yamlLines.push('---');
  
  // Generate markdown content
  const content = `
# ${frontmatter.title}

*Volume ${frontmatter.volume}, Issue ${frontmatter.edition}*

## Summary

${frontmatter.summary}

${data.key_findings && data.key_findings.length > 0 ? `
## Key Findings

${data.key_findings.map(finding => `- ${finding}`).join('\\n')}
` : ''}

${data.recommendations && data.recommendations.length > 0 ? `
## Recommendations

${data.recommendations.map(rec => `- ${rec}`).join('\\n')}
` : ''}

${data.legal_references?.cases && data.legal_references.cases.length > 0 ? `
## Legal Cases Referenced

${data.legal_references.cases.map(legalCase => `- ${legalCase}`).join('\\n')}
` : ''}

${data.legal_references?.statutes && data.legal_references.statutes.length > 0 ? `
## Statutes Referenced

${data.legal_references.statutes.map(statute => `- ${statute}`).join('\\n')}
` : ''}

---

*This newsletter was migrated from extracted data. Please review and enhance the metadata above using the CMS interface.*
`.trim();

  return yamlLines.join('\\n') + '\\n\\n' + content;
}

// Run if called directly
if (require.main === module) {
  migrateJsonToCms();
}

module.exports = { migrateJsonToCms };