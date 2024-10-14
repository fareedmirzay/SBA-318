import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import { error}  from "./utilities/error.js"; 
import postsRouter  from "./routes/posts.js";
import usersRouter from "./routes/users.js"; 
import commentsRouter from "./routes/comments.js"; 


const app = express();
const Port = 4060

// Valid API Keys.
const apiKeys = ["Software-engineering-class"];

// in order to handle __dirname, i need to define these here
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//setting the views engine to ejs and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Middleware to serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));


//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));


// New logging middleware to help us keep track of
// requests during testing!
app.use((req, res, next) => {
  const time = new Date();
  console.log(
    `-----
  ${time.toLocaleTimeString()}: Received a ${req.method} request to ${
      req.url
    }.`,
  );
  if (Object.keys(req.body).length > 0) {
    console.log("Containing the data:");
    console.log(`${JSON.stringify(req.body)}`);
  }
  next();
});

// API KEY middleware for specific API routes, excluding /api/users
app.use("/api", (req, res, next) => {
  if (req.path !== '/users') { 
    const key = req.query["api-key"];
    if (!key) {
      return next(error(400, "API Key Required"));
    }
    if (apiKeys.indexOf(key) === -1) {
      return next(error(401, "Invalid API Key"));
    }
    req.key = key;
  }
  next();
});

// ======= API Routes
app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);
app.use("/api/comments", commentsRouter);


let users = [
  { name: 'John Doe', email: 'john@example.com', username: "janesmith456" },
  { name: 'Jane Smith', email: 'jane@example.com', username: "alicej789" },
  { name: 'Robert Lee', email: 'roblee@example.com', username: "roblee101" },
  { name: 'Samantha Green', email: 'samgreen@example.com', username: "samgreen202", }
];

// Route to render the user list (index.ejs)
app.get('/', (req, res) => {
  res.render('index', { users });
});

// Route to render the form (form.ejs)
app.get('/form', (req, res) => {
  res.render('form');
});

// Route to handle form submissions from form.ejs and index.ejs
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  users.push({ name, email });
  res.redirect('/');
});


// Error middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({ error: error.message });
});

app.listen(Port, () => console.log(`Server running on port: ${Port}`));