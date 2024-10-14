import { Router } from "express";
import { posts } from '../data/posts.js';  




const postsRouter = Router();

/**
 * GET ALL POSTS
 */
postsRouter.get("/", (req, res, next) => {
  res.json(posts);
  // next(error(402, 'Something went wrong!'))
});


/**
 * GET A SINGLE POST by ID
 */
postsRouter.get('/:id', (req, res) => {
  const postId = parseInt(req.params.id)
  const post = posts.find(p => p.id === postId);
  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
  });
  
/**
 * CREATE A NEW POST 
 */
postsRouter.post('/', (req, res) => {
  const newPost = {
      id: posts.length + 1,
      title: req.body.title,
      content: req.body.content,
      user_id: req.body.user_id,
      tags: req.body.tags || [],
      likes: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
  };
  
  posts.push(newPost);
  res.status(201).json(newPost);
});


/**
 * PATCH to update a post
 */
postsRouter.patch('/:id', (req, res) => {

  const postId = parseInt(req.params.id);
  const post = posts.find(p => p.id === postId);
  if (post) {
    Object.assign(post, req.body);
    res.status(200).json(post);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

/**
 * DELETE to remove a post
 */
postsRouter.delete('/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const index = posts.findIndex(p => p.id === postId);
  if (index !== -1) {
    posts.splice(index, 1);
    res.status(200).json({ message: 'Post deleted' });
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});
export default postsRouter;