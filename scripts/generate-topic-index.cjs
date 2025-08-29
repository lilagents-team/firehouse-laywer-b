const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/**
 * Generate topic index from newsletter comments
 * Creates a structured JSON file organizing comments by topic and subtopic
 */
function generateTopicIndex() {
  const commentsDir = path.join(__dirname, '..', 'content', 'comments');
  const outputPath = path.join(__dirname, '..', 'public', 'topic_index.json');
  
  console.log('🔍 Processing newsletter comments for topic index...');
  
  if (!fs.existsSync(commentsDir)) {
    console.log('❌ Comments directory not found:', commentsDir);
    return;
  }

  // Read all comment files
  const commentFiles = fs.readdirSync(commentsDir).filter(file => file.endsWith('.md'));
  console.log(`📁 Found ${commentFiles.length} comment files`);
  
  const topicsMap = new Map();
  let processedCount = 0;
  let errorCount = 0;
  let duplicateCount = 0;
  const seenIds = new Map(); // Track ID -> filename mapping

  // Process each comment file
  commentFiles.forEach(filename => {
    try {
      const filePath = path.join(commentsDir, filename);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Parse with error handling for problematic YAML
      let frontmatter;
      try {
        const parsed = matter(content);
        frontmatter = parsed.data;
      } catch (yamlError) {
        // Try to extract fields manually from YAML frontmatter if parsing fails
        const yamlMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (yamlMatch) {
          const yamlContent = yamlMatch[1];
          const id = yamlContent.match(/^id:\s*([0-9]+)/m)?.[1];
          const topic = yamlContent.match(/^topic:\s*(.+)$/m)?.[1];
          const subtopic = yamlContent.match(/^subtopic:\s*(.+)$/m)?.[1];
          
          frontmatter = {
            id: id ? parseInt(id) : null,
            topic: topic?.trim(),
            subtopic: subtopic?.trim()
          };
        } else {
          throw yamlError;
        }
      }
      
      // Extract required fields - ALWAYS extract ID manually to avoid YAML octal parsing
      let { topic, subtopic } = frontmatter;
      
      // ALWAYS use manual regex extraction for ID to prevent octal interpretation
      // YAML parsers treat numbers with leading zeros (000010) as octal
      const idMatch = content.match(/^id:\s*([0-9]+)/m);
      let id = idMatch ? idMatch[1] : null;
      
      if (!id || !topic) {
        console.log(`⚠️  Skipping ${filename}: missing id or topic`);
        errorCount++;
        return;
      }
      
      // Format ID with leading zeros (6 digits) 
      const commentaryId = String(id).padStart(6, '0');
      
      
      // Check for duplicate IDs
      if (seenIds.has(commentaryId)) {
        console.log(`⚠️  Duplicate ID found: ${commentaryId} in ${filename} (previously seen in ${seenIds.get(commentaryId)})`);
        duplicateCount++;
      } else {
        seenIds.set(commentaryId, filename);
      }
      
      // Initialize topic if it doesn't exist
      if (!topicsMap.has(topic)) {
        topicsMap.set(topic, {
          name: topic,
          commentary_ids: [],
          subtopics: new Map()
        });
      }
      
      const topicData = topicsMap.get(topic);
      
      if (subtopic && subtopic.trim() !== '') {
        // Has subtopic - add to subtopic
        if (!topicData.subtopics.has(subtopic)) {
          topicData.subtopics.set(subtopic, {
            name: subtopic,
            commentary_ids: []
          });
        }
        // Check for duplicates before adding
        if (!topicData.subtopics.get(subtopic).commentary_ids.includes(commentaryId)) {
          topicData.subtopics.get(subtopic).commentary_ids.push(commentaryId);
        }
      } else {
        // No subtopic - add directly to topic
        // Check for duplicates before adding
        if (!topicData.commentary_ids.includes(commentaryId)) {
          topicData.commentary_ids.push(commentaryId);
        }
      }
      
      processedCount++;
      
    } catch (error) {
      console.log(`❌ Error processing ${filename}:`, error.message);
      errorCount++;
    }
  });

  // Convert Maps to final JSON structure
  const topics = Array.from(topicsMap.entries()).map(([topicName, topicData]) => {
    const topic = {
      name: topicName,
      commentary_ids: topicData.commentary_ids.sort()
    };
    
    // Add subtopics if they exist
    if (topicData.subtopics.size > 0) {
      topic.subtopics = Array.from(topicData.subtopics.values()).map(subtopic => ({
        name: subtopic.name,
        commentary_ids: subtopic.commentary_ids.sort()
      })).sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return topic;
  }).sort((a, b) => a.name.localeCompare(b.name));

  // Generate final output
  const output = {
    topics,
    generated_at: new Date().toISOString(),
    total_topics: topics.length,
    total_subtopics: topics.reduce((sum, topic) => sum + (topic.subtopics?.length || 0), 0),
    total_commentary_ids: topics.reduce((sum, topic) => {
      return sum + topic.commentary_ids.length + 
             (topic.subtopics?.reduce((subSum, sub) => subSum + sub.commentary_ids.length, 0) || 0);
    }, 0)
  };

  // Write output file
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  
  console.log('✅ Topic index generated successfully!');
  console.log(`📊 Statistics:`);
  console.log(`   • Topics: ${output.total_topics}`);
  console.log(`   • Subtopics: ${output.total_subtopics}`);
  console.log(`   • Total commentary IDs: ${output.total_commentary_ids}`);
  console.log(`   • Processed files: ${processedCount}`);
  console.log(`   • Errors: ${errorCount}`);
  console.log(`   • Duplicate IDs: ${duplicateCount}`);
  console.log(`   • Output: ${outputPath}`);
}

if (require.main === module) {
  generateTopicIndex();
}

module.exports = { generateTopicIndex };