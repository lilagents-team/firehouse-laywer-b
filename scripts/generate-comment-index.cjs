#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');

async function generateCommentIndex() {
  console.log('📋 Generating newsletter comment indexes...');
  
  const commentsDir = path.join(process.cwd(), 'content/comments');
  const outputDir = path.join(process.cwd(), 'client/public/data');
  
  try {
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });
    
    // Read all comment files
    const files = await fs.readdir(commentsDir);
    const commentFiles = files.filter(file => file.endsWith('.md') && file !== 'summary.json');
    
    console.log(`Processing ${commentFiles.length} comment files...`);
    
    const comments = [];
    const topicIndex = {};
    const subtopicIndex = {};
    const yearIndex = {};
    
    for (const file of commentFiles) {
      try {
        const filePath = path.join(commentsDir, file);
        const fileContent = await fs.readFile(filePath, 'utf8');
        
        // Parse with error handling for problematic YAML
        let frontmatter, content;
        try {
          const parsed = matter(fileContent);
          frontmatter = parsed.data;
          content = parsed.content;
        } catch (yamlError) {
          // Try to extract fields manually from YAML frontmatter if parsing fails
          const yamlMatch = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
          if (yamlMatch) {
            const yamlContent = yamlMatch[1];
            const newsletter = yamlContent.match(/^newsletter:\s*(.+)$/m)?.[1];
            const volume_issue = yamlContent.match(/^volume_issue:\s*(.+)$/m)?.[1];
            const year = yamlContent.match(/^year:\s*(.+)$/m)?.[1];
            const month = yamlContent.match(/^month:\s*(.+)$/m)?.[1];
            const topic = yamlContent.match(/^topic:\s*(.+)$/m)?.[1];
            const subtopic = yamlContent.match(/^subtopic:\s*(.+)$/m)?.[1];
            
            frontmatter = {
              newsletter: newsletter?.trim(),
              volume_issue: volume_issue?.trim(),
              year: year ? parseInt(year) : null,
              month: month ? parseInt(month) : null,
              topic: topic?.trim(),
              subtopic: subtopic?.trim()
            };
            content = yamlMatch[2] || '';
          } else {
            throw yamlError;
          }
        }
        
        // Extract ID from filename as string to preserve leading zeros (000001.md -> "000001")
        const id = file.replace(/\.md$/, '');
        
        const comment = {
          id,
          filename: file,
          newsletter: frontmatter.newsletter || '',
          volume_issue: frontmatter.volume_issue || '',
          year: frontmatter.year || null,
          month: frontmatter.month || null,
          topic: frontmatter.topic || '',
          subtopic: frontmatter.subtopic || '',
          content: content.trim(),
          excerpt: content.trim().substring(0, 200) + (content.length > 200 ? '...' : '')
        };
        
        comments.push(comment);
        
        // Build topic index
        if (comment.topic) {
          if (!topicIndex[comment.topic]) {
            topicIndex[comment.topic] = [];
          }
          topicIndex[comment.topic].push({
            id: comment.id,
            filename: comment.filename,
            newsletter: comment.newsletter,
            year: comment.year,
            month: comment.month,
            subtopic: comment.subtopic,
            excerpt: comment.excerpt
          });
        }
        
        // Build subtopic index
        if (comment.subtopic) {
          if (!subtopicIndex[comment.subtopic]) {
            subtopicIndex[comment.subtopic] = [];
          }
          subtopicIndex[comment.subtopic].push({
            id: comment.id,
            filename: comment.filename,
            newsletter: comment.newsletter,
            topic: comment.topic,
            year: comment.year,
            month: comment.month,
            excerpt: comment.excerpt
          });
        }
        
        // Build year index
        if (comment.year) {
          if (!yearIndex[comment.year]) {
            yearIndex[comment.year] = [];
          }
          yearIndex[comment.year].push({
            id: comment.id,
            filename: comment.filename,
            newsletter: comment.newsletter,
            topic: comment.topic,
            subtopic: comment.subtopic,
            month: comment.month
          });
        }
        
      } catch (error) {
        console.warn(`Warning: Could not process ${file}:`, error.message);
      }
    }
    
    // Sort comments by ID (string comparison for proper ordering)
    comments.sort((a, b) => a.id.localeCompare(b.id));
    
    // Sort indexes
    Object.keys(topicIndex).forEach(topic => {
      topicIndex[topic].sort((a, b) => a.id.localeCompare(b.id));
    });
    
    Object.keys(subtopicIndex).forEach(subtopic => {
      subtopicIndex[subtopic].sort((a, b) => a.id.localeCompare(b.id));
    });
    
    Object.keys(yearIndex).forEach(year => {
      yearIndex[year].sort((a, b) => a.id.localeCompare(b.id));
    });
    
    // Generate summary statistics
    const stats = {
      totalComments: comments.length,
      topics: Object.keys(topicIndex).length,
      subtopics: Object.keys(subtopicIndex).length,
      years: Object.keys(yearIndex).length,
      topicCounts: Object.fromEntries(
        Object.entries(topicIndex).map(([topic, items]) => [topic, items.length])
      ),
      yearRange: {
        min: Math.min(...comments.filter(c => c.year).map(c => c.year)),
        max: Math.max(...comments.filter(c => c.year).map(c => c.year))
      },
      lastUpdated: new Date().toISOString()
    };
    
    // Create topic list with counts (sorted by frequency)
    const topicList = Object.entries(topicIndex)
      .map(([topic, items]) => ({
        name: topic,
        slug: topic.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        count: items.length
      }))
      .sort((a, b) => b.count - a.count);
    
    // Create subtopic list with counts
    const subtopicList = Object.entries(subtopicIndex)
      .map(([subtopic, items]) => ({
        name: subtopic,
        slug: subtopic.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        count: items.length,
        parentTopic: items[0]?.topic || ''
      }))
      .sort((a, b) => b.count - a.count);
    
    // Create API-compatible response format for Netlify static serving
    const apiResponse = {
      comments: comments,
      pagination: {
        page: 1,
        limit: 5000,
        total: comments.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      },
      filters: {
        search: '',
        topic: ''
      }
    };

    // Write all index files
    const outputs = [
      { file: 'comments-all.json', data: comments, desc: 'All comments' },
      { file: 'comments-api.json', data: apiResponse, desc: 'API-compatible comments response' },
      { file: 'comments-by-topic.json', data: topicIndex, desc: 'Comments grouped by topic' },
      { file: 'comments-by-subtopic.json', data: subtopicIndex, desc: 'Comments grouped by subtopic' },
      { file: 'comments-by-year.json', data: yearIndex, desc: 'Comments grouped by year' },
      { file: 'comment-stats.json', data: stats, desc: 'Comment statistics' },
      { file: 'topics-list.json', data: topicList, desc: 'Topic list with counts' },
      { file: 'subtopics-list.json', data: subtopicList, desc: 'Subtopic list with counts' }
    ];
    
    for (const output of outputs) {
      const outputPath = path.join(outputDir, output.file);
      await fs.writeFile(outputPath, JSON.stringify(output.data, null, 2));
      console.log(`✅ Generated ${output.file} (${output.desc})`);
    }
    
    console.log('📊 Index Generation Complete:');
    console.log(`   📝 ${stats.totalComments} total comments`);
    console.log(`   📂 ${stats.topics} topics`);
    console.log(`   🏷️  ${stats.subtopics} subtopics`);
    console.log(`   📅 ${stats.years} years (${stats.yearRange.min}-${stats.yearRange.max})`);
    console.log(`   💾 Generated 7 index files in ${outputDir}`);
    
  } catch (error) {
    console.error('❌ Error generating comment index:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateCommentIndex();
}

module.exports = generateCommentIndex;