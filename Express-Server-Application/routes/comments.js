import { Router } from "express";
import { comments } from "../data/comments.js";

const commentsRouter = Router();

/**
 * GET
 */
commentsRouter.get("/", (req, res, next) => {
  res.json(comments);
});



// GET a single comment by ID
commentsRouter.get('/:id', (req, res) => {
    const commentId = parseInt(req.params.id);
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      res.status(200).json(comment);
    } else {
      res.status(404).json({ message: 'Comment not found' });
    }
  });

// GET comments by post_id
commentsRouter.get('/post/:postId', (req, res) => {
  const { postId } = req.params;
  const postComments = comments.filter(comment => comment.post_id === parseInt(postId));
  if (postComments.length > 0) {
    res.status(200).json(postComments);
  } else {
    res.status(404).json({ message: 'No comments found for this post' });
  }
});

// POST a new comment
commentsRouter.post('/', (req, res) => {
  const { post_id, user_id, content, likes } = req.body;
  const newComment = {
    id: comments.length + 1,
    post_id,
    user_id,
    content,
    likes: likes || 0,
    created_at: new Date().toISOString(),
    replies: []
  };
  comments.push(newComment);
  res.status(201).json(newComment);
});

  
// PATCH to update a comment
commentsRouter.patch('/:id', (req, res) => {
    const commentId = parseInt(req.params.id);
    const comment = comments.find(c => c.id === commentId);
    if (comment) {
      Object.assign(comment, req.body); 
      res.status(200).json(comment);
    } else {
      res.status(404).json({ message: 'Comment not found' });
    }
  });


// DELETE to remove a comment
commentsRouter.delete('/:id', (req, res) => {
    const commentId = parseInt(req.params.id);
    const index = comments.findIndex(c => c.id === commentId);
    if (index !== -1) {
      comments.splice(index, 1); // Remove the comment
      res.status(200).json({ message: 'Comment deleted' });
    } else {
      res.status(404).json({ message: 'Comment not found' });
    }
  });

  export default commentsRouter;