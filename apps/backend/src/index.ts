import express from "express";
import { prisma } from "@repo/db";

const app = express();
app.use(express.json());

// Create a new user
app.post("/users", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await prisma.user.create({
      data: {
        email,
        password,
        name,
      },
    });
    res.status(201).json(user);
  } catch (error: any) {
    if (error.code === "P2002") {
      // Unique constraint failed
      return res.status(409).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { todos: true },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new todo
app.post("/todos", async (req, res) => {
  try {
    const { title, description, userId } = req.body;
    if (!title || !userId) {
      return res.status(400).json({ error: "Title and userId are required" });
    }
    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        userId,
      },
    });
    res.status(201).json(todo);
  } catch (error: any) {
    if (error.code === "P2003") {
      // Foreign key constraint failed
      return res.status(400).json({ error: "Invalid userId" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      include: { user: true },
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
