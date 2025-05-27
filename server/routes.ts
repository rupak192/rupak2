import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { insertUserSchema, insertOrderSchema, insertNotificationSchema } from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "fullstack-app-secret-key";

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Middleware to verify JWT token
const authenticate = (req: Request, res: Response, next: Function) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = express.Router();

  // Basic health check endpoint
  apiRouter.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'API is running' });
  });

  // Auth routes
  apiRouter.post('/auth/register', async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);

      // Check if user already exists
      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }

      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Create new user
      const user = await storage.createUser(userData);

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating user" });
    }
  });

  apiRouter.post('/auth/login', async (req: Request, res: Response) => {
    try {
      console.log('Login attempt received:', { username: req.body.username });
      const { username, password } = req.body;

      if (!username || !password) {
        console.log('Login failed: Missing credentials');
        return res.status(400).json({ message: "Username and password required" });
      }

      // Demo credentials check
      if (username === "demo" && password === "demo123") {
        const token = jwt.sign(
          { id: 999, username: "demo", role: "user" },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        return res.json({
          user: {
            id: 999,
            username: "demo",
            email: "demo@example.com",
            name: "Demo User",
            role: "user"
          },
          token
        });
      }

      // Find user for production login
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Update the last login time
      try {
        await storage.updateUser(user.id, {
          lastLogin: new Date()
        });
      } catch (updateError) {
        console.error("Error updating last login:", updateError);
        // Continue with login even if the lastLogin update fails
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // User routes
  apiRouter.get('/users', authenticate, async (req: Request, res: Response) => {
    try {
      const users = await storage.getAllUsers();
      // Remove passwords from response
      const sanitizedUsers = users.map(({ password, ...rest }) => rest);
      res.json(sanitizedUsers);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });

  apiRouter.get('/users/:id', authenticate, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;

      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user" });
    }
  });

  // Order routes
  apiRouter.get('/orders', authenticate, async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const orders = await storage.getAllOrders(limit);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders" });
    }
  });

  apiRouter.get('/cart', authenticate, async (req: Request, res: Response) => {
    // Mock cart data
    const cart = {
      items: [
        { id: 1, name: "Wireless Earbuds", price: 129.99, quantity: 1 },
        { id: 2, name: "Smart Watch", price: 199.99, quantity: 2 },
        { id: 3, name: "Laptop Sleeve", price: 29.99, quantity: 1 },
      ],
      total: 559.96
    };
    res.json(cart);
  });

  apiRouter.get('/wishlist', authenticate, async (req: Request, res: Response) => {
    // Mock wishlist data
    const wishlist = [
      { id: 1, name: "4K Monitor", price: 399.99, image: "https://placehold.co/300x200" },
      { id: 2, name: "Mechanical Keyboard", price: 149.99, image: "https://placehold.co/300x200" },
      { id: 3, name: "Gaming Mouse", price: 79.99, image: "https://placehold.co/300x200" },
    ];
    res.json(wishlist);
  });

  apiRouter.post('/orders', authenticate, async (req: Request, res: Response) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating order" });
    }
  });

  apiRouter.get('/orders/:id', authenticate, async (req: Request, res: Response) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await storage.getOrder(orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Error fetching order" });
    }
  });

  apiRouter.put('/orders/:id', authenticate, async (req: Request, res: Response) => {
    try {
      const orderId = parseInt(req.params.id);
      const orderData = req.body;

      const updatedOrder = await storage.updateOrder(orderId, orderData);

      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: "Error updating order" });
    }
  });

  // Category routes
  const categories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Clothing' },
    { id: 3, name: 'Books' },
  ];

  apiRouter.get('/categories', (req: Request, res: Response) => {
    console.log('Categories route hit'); // Debug log
    res.json(categories);
  });

  apiRouter.get('/categories/:id', (req: Request, res: Response) => {
    console.log('Category by ID route hit:', req.params.id); // Debug log
    const category = categories.find(cat => cat.id === parseInt(req.params.id));
    if (!category) return res.status(404).send('Category not found');
    res.json(category);
  });

  // Mount all API routes under /api
  app.use('/api', apiRouter);

  return createServer(app);
}