import { Router } from "express";
import { users } from "../data/users.js";

const usersRouter = Router();

/**
 * GET
 */
usersRouter.get("/", (req, res,) => {
  res.json(users);
});


// GET a single user by ID
usersRouter.get('/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ message: 'User no tfound' });
    }
 });



// DELETE to remove a user
usersRouter.delete('/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users.splice(index, 1); 
      res.status(200).json({ message: 'user deleted' });
    } else {
      res.status(404).json({ message: 'user not found' });
    }
  });


usersRouter.post('/', (req, res) => {
  const { name, username, email } = req.body;
  if (!name || !username || !email) {
      return res.status(400).json({ message: "Name, username, and email are required" });
  }
  const newUser = { id: users.length + 1, name, username, email };
  users.push(newUser);
  return res.status(201).json(newUser);
});

// PATCH to update user details
usersRouter.patch('/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
  }
  const user = users.find(u => u.id === userId);
  if (!user) {
      return res.status(404).json({ message: `User with ID ${userId} not found` });
  }
  const { name, username, email, bio, profile_picture } = req.body;
  if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
          return res.status(400).json({ message: 'Invalid email format' });
      }
  }
  if (name) user.name = name;
  if (username) user.username = username;
  if (email) user.email = email;
  if (bio) user.bio = bio;
  if (profile_picture) user.profile_picture = profile_picture;
  res.status(200).json(user);
});



export default usersRouter;