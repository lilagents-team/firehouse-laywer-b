import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = Router();

// Helper function to safely read JSON files with fallback paths
async function readJsonFile(filename: string) {
  const possiblePaths = [
    path.join(process.cwd(), 'client/public/data', filename), // Development
    path.join(process.cwd(), 'dist/public/data', filename), // Production build
    path.join(process.cwd(), 'public/data', filename), // Alternative production
  ];
  
  for (const filePath of possiblePaths) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // Continue to next path
      continue;
    }
  }
  
  console.error(`Error: Could not find ${filename} in any of the expected locations:`, possiblePaths);
  return null;
}

// Get all comments with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const search = req.query.search as string || '';
    const topic = req.query.topic as string || '';
    
    const comments = await readJsonFile('comments-all.json');
    
    if (!comments) {
      return res.status(500).json({ error: 'Could not load comments data' });
    }
    
    let filteredComments = comments;
    
    // Filter by topic if specified
    if (topic) {
      filteredComments = comments.filter((comment: any) => 
        comment.topic.toLowerCase() === topic.toLowerCase()
      );
    }
    
    // Filter by search term if specified
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredComments = filteredComments.filter((comment: any) => 
        comment.topic.toLowerCase().includes(searchTerm) ||
        comment.subtopic.toLowerCase().includes(searchTerm) ||
        comment.content.toLowerCase().includes(searchTerm) ||
        comment.newsletter.toLowerCase().includes(searchTerm)
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedComments = filteredComments.slice(startIndex, endIndex);
    
    res.json({
      comments: paginatedComments,
      pagination: {
        page,
        limit,
        total: filteredComments.length,
        totalPages: Math.ceil(filteredComments.length / limit),
        hasNext: endIndex < filteredComments.length,
        hasPrev: page > 1
      },
      filters: {
        search,
        topic
      }
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get comment by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid comment ID' });
    }
    
    const comments = await readJsonFile('comments-all.json');
    
    if (!comments) {
      return res.status(500).json({ error: 'Could not load comments data' });
    }
    
    const comment = comments.find((c: any) => c.id === id);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    res.json(comment);
  } catch (error) {
    console.error('Error fetching comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get comments by topic
router.get('/topic/:topic', async (req, res) => {
  try {
    const topic = decodeURIComponent(req.params.topic);
    
    const topicsData = await readJsonFile('comments-by-topic.json');
    
    if (!topicsData) {
      return res.status(500).json({ error: 'Could not load topics data' });
    }
    
    const topicComments = topicsData[topic];
    
    if (!topicComments) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    
    res.json({
      topic,
      comments: topicComments,
      count: topicComments.length
    });
  } catch (error) {
    console.error('Error fetching topic comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get comments by subtopic
router.get('/subtopic/:subtopic', async (req, res) => {
  try {
    const subtopic = decodeURIComponent(req.params.subtopic);
    
    const subtopicsData = await readJsonFile('comments-by-subtopic.json');
    
    if (!subtopicsData) {
      return res.status(500).json({ error: 'Could not load subtopics data' });
    }
    
    const subtopicComments = subtopicsData[subtopic];
    
    if (!subtopicComments) {
      return res.status(404).json({ error: 'Subtopic not found' });
    }
    
    res.json({
      subtopic,
      comments: subtopicComments,
      count: subtopicComments.length
    });
  } catch (error) {
    console.error('Error fetching subtopic comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all topics with counts
router.get('/meta/topics', async (req, res) => {
  try {
    const topics = await readJsonFile('topics-list.json');
    
    if (!topics) {
      return res.status(500).json({ error: 'Could not load topics data' });
    }
    
    res.json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all subtopics with counts
router.get('/meta/subtopics', async (req, res) => {
  try {
    const subtopics = await readJsonFile('subtopics-list.json');
    
    if (!subtopics) {
      return res.status(500).json({ error: 'Could not load subtopics data' });
    }
    
    res.json(subtopics);
  } catch (error) {
    console.error('Error fetching subtopics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get comment statistics
router.get('/meta/stats', async (req, res) => {
  try {
    const stats = await readJsonFile('comment-stats.json');
    
    if (!stats) {
      return res.status(500).json({ error: 'Could not load stats data' });
    }
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get comments by year
router.get('/year/:year', async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    
    if (isNaN(year)) {
      return res.status(400).json({ error: 'Invalid year' });
    }
    
    const yearData = await readJsonFile('comments-by-year.json');
    
    if (!yearData) {
      return res.status(500).json({ error: 'Could not load year data' });
    }
    
    const yearComments = yearData[year.toString()];
    
    if (!yearComments) {
      return res.status(404).json({ error: 'No comments found for that year' });
    }
    
    res.json({
      year,
      comments: yearComments,
      count: yearComments.length
    });
  } catch (error) {
    console.error('Error fetching year comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;