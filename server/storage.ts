import { 
  users, type User, type InsertUser,
  orders, type Order, type InsertOrder,
  notifications, type Notification, type InsertNotification,
  activities, type Activity, type InsertActivity,
  stats, type Stat, type InsertStat
} from "@shared/schema";
import bcrypt from "bcryptjs";

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  
  // Order operations
  getOrder(id: number): Promise<Order | undefined>;
  getOrderByOrderId(orderId: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, orderData: Partial<InsertOrder>): Promise<Order | undefined>;
  deleteOrder(id: number): Promise<boolean>;
  getAllOrders(limit?: number): Promise<Order[]>;
  getUserOrders(userId: number): Promise<Order[]>;
  
  // Notification operations
  getNotification(id: number): Promise<Notification | undefined>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  updateNotification(id: number, notificationData: Partial<InsertNotification>): Promise<Notification | undefined>;
  deleteNotification(id: number): Promise<boolean>;
  getUserNotifications(userId: number): Promise<Notification[]>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  
  // Activity operations
  getActivity(id: number): Promise<Activity | undefined>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  getAllActivities(limit?: number): Promise<Activity[]>;
  getUserActivities(userId: number): Promise<Activity[]>;
  
  // Stats operations
  getStat(key: string): Promise<Stat | undefined>;
  createOrUpdateStat(key: string, value: number, trend?: string, trendValue?: string): Promise<Stat>;
  getAllStats(): Promise<Stat[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private orders: Map<number, Order>;
  private notifications: Map<number, Notification>;
  private activities: Map<number, Activity>;
  private stats: Map<string, Stat>;
  
  private userIdCounter: number;
  private orderIdCounter: number;
  private notificationIdCounter: number;
  private activityIdCounter: number;
  private statIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.orders = new Map();
    this.notifications = new Map();
    this.activities = new Map();
    this.stats = new Map();
    
    this.userIdCounter = 1;
    this.orderIdCounter = 1;
    this.notificationIdCounter = 1;
    this.activityIdCounter = 1;
    this.statIdCounter = 1;
    
    // Initialize some default stats
    this.initializeDefaultStats();
  }
  
  private initializeDefaultStats() {
    const defaultStats = [
      { key: 'total_users', value: 2543, trend: 'up', trendValue: '12%' },
      { key: 'new_orders', value: 128, trend: 'up', trendValue: '8%' },
      { key: 'revenue', value: 24830, trend: 'up', trendValue: '18%' },
      { key: 'active_users', value: 1428, trend: 'down', trendValue: '3%' }
    ];
    
    for (const stat of defaultStats) {
      this.createOrUpdateStat(stat.key, stat.value, stat.trend, stat.trendValue);
    }
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    
    const user: User = {
      ...insertUser,
      id,
      password: hashedPassword,
      createdAt: new Date(),
      lastLogin: null,
    };
    
    this.users.set(id, user);
    
    // Create activity for new user registration
    this.createActivity({
      userId: id,
      type: 'user_registered',
      details: { username: user.username }
    });
    
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    if (userData.password) {
      updatedUser.password = await bcrypt.hash(userData.password, 10);
    }
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  // Order operations
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async getOrderByOrderId(orderId: string): Promise<Order | undefined> {
    return Array.from(this.orders.values()).find(
      (order) => order.orderId === orderId,
    );
  }
  
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.orderIdCounter++;
    const order: Order = {
      ...insertOrder,
      id,
      createdAt: new Date(),
    };
    
    this.orders.set(id, order);
    
    // Create activity for new order
    this.createActivity({
      userId: order.userId,
      type: 'order_placed',
      details: { orderId: order.orderId, amount: order.amount }
    });
    
    // Create notification for the user
    this.createNotification({
      userId: order.userId,
      type: 'new_order',
      message: `Your order #${order.orderId} has been placed successfully`,
      read: false
    });
    
    return order;
  }
  
  async updateOrder(id: number, orderData: Partial<InsertOrder>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, ...orderData };
    this.orders.set(id, updatedOrder);
    
    // Create activity for order update
    this.createActivity({
      userId: order.userId,
      type: 'order_updated',
      details: { orderId: order.orderId, newStatus: orderData.status }
    });
    
    // Create notification if status changed
    if (orderData.status && orderData.status !== order.status) {
      this.createNotification({
        userId: order.userId,
        type: 'order_status_change',
        message: `Your order #${order.orderId} status changed to ${orderData.status}`,
        read: false
      });
    }
    
    return updatedOrder;
  }
  
  async deleteOrder(id: number): Promise<boolean> {
    return this.orders.delete(id);
  }
  
  async getAllOrders(limit?: number): Promise<Order[]> {
    let orders = Array.from(this.orders.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
    
    if (limit) {
      orders = orders.slice(0, limit);
    }
    
    return orders;
  }
  
  async getUserOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  // Notification operations
  async getNotification(id: number): Promise<Notification | undefined> {
    return this.notifications.get(id);
  }
  
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.notificationIdCounter++;
    const notification: Notification = {
      ...insertNotification,
      id,
      createdAt: new Date(),
    };
    
    this.notifications.set(id, notification);
    return notification;
  }
  
  async updateNotification(id: number, notificationData: Partial<InsertNotification>): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) return undefined;
    
    const updatedNotification = { ...notification, ...notificationData };
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }
  
  async deleteNotification(id: number): Promise<boolean> {
    return this.notifications.delete(id);
  }
  
  async getUserNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) return undefined;
    
    const updatedNotification = { ...notification, read: true };
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }
  
  // Activity operations
  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }
  
  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.activityIdCounter++;
    const activity: Activity = {
      ...insertActivity,
      id,
      createdAt: new Date(),
    };
    
    this.activities.set(id, activity);
    return activity;
  }
  
  async getAllActivities(limit?: number): Promise<Activity[]> {
    let activities = Array.from(this.activities.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    if (limit) {
      activities = activities.slice(0, limit);
    }
    
    return activities;
  }
  
  async getUserActivities(userId: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  // Stats operations
  async getStat(key: string): Promise<Stat | undefined> {
    return this.stats.get(key);
  }
  
  async createOrUpdateStat(key: string, value: number, trend?: string, trendValue?: string): Promise<Stat> {
    const existingStat = this.stats.get(key);
    
    let stat: Stat;
    if (existingStat) {
      stat = {
        ...existingStat,
        value,
        trend: trend || existingStat.trend,
        trendValue: trendValue || existingStat.trendValue,
        updatedAt: new Date()
      };
    } else {
      stat = {
        id: this.statIdCounter++,
        key,
        value,
        trend,
        trendValue,
        updatedAt: new Date()
      };
    }
    
    this.stats.set(key, stat);
    return stat;
  }
  
  async getAllStats(): Promise<Stat[]> {
    return Array.from(this.stats.values());
  }
}

import { db } from "./db";
import { eq } from "drizzle-orm";

// Database storage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id });
    return result.length > 0;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getOrderByOrderId(orderId: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.orderId, orderId));
    return order || undefined;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
    return order;
  }

  async updateOrder(id: number, orderData: Partial<InsertOrder>): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set(orderData)
      .where(eq(orders.id, id))
      .returning();
    return order || undefined;
  }

  async deleteOrder(id: number): Promise<boolean> {
    const result = await db
      .delete(orders)
      .where(eq(orders.id, id))
      .returning({ id: orders.id });
    return result.length > 0;
  }

  async getAllOrders(limit?: number): Promise<Order[]> {
    let query = db.select().from(orders);
    if (limit) {
      query = query.limit(limit);
    }
    return query.orderBy(orders.createdAt);
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(orders.createdAt);
  }

  async getNotification(id: number): Promise<Notification | undefined> {
    const [notification] = await db.select().from(notifications).where(eq(notifications.id, id));
    return notification || undefined;
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values(insertNotification)
      .returning();
    return notification;
  }

  async updateNotification(id: number, notificationData: Partial<InsertNotification>): Promise<Notification | undefined> {
    const [notification] = await db
      .update(notifications)
      .set(notificationData)
      .where(eq(notifications.id, id))
      .returning();
    return notification || undefined;
  }

  async deleteNotification(id: number): Promise<boolean> {
    const result = await db
      .delete(notifications)
      .where(eq(notifications.id, id))
      .returning({ id: notifications.id });
    return result.length > 0;
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    return db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(notifications.createdAt);
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const [notification] = await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id))
      .returning();
    return notification || undefined;
  }

  async getActivity(id: number): Promise<Activity | undefined> {
    const [activity] = await db.select().from(activities).where(eq(activities.id, id));
    return activity || undefined;
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db
      .insert(activities)
      .values(insertActivity)
      .returning();
    return activity;
  }

  async getAllActivities(limit?: number): Promise<Activity[]> {
    let query = db.select().from(activities);
    if (limit) {
      query = query.limit(limit);
    }
    return query.orderBy(activities.createdAt);
  }

  async getUserActivities(userId: number): Promise<Activity[]> {
    return db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(activities.createdAt);
  }

  async getStat(key: string): Promise<Stat | undefined> {
    const [stat] = await db.select().from(stats).where(eq(stats.key, key));
    return stat || undefined;
  }

  async createOrUpdateStat(key: string, value: number, trend?: string, trendValue?: string): Promise<Stat> {
    // Check if stat exists
    const existingStat = await this.getStat(key);
    
    if (existingStat) {
      // Update existing stat
      const [updatedStat] = await db
        .update(stats)
        .set({
          value,
          trend: trend as any,
          trendValue,
          updatedAt: new Date().toISOString()
        })
        .where(eq(stats.id, existingStat.id))
        .returning();
      
      return updatedStat;
    } else {
      // Create new stat
      const [newStat] = await db
        .insert(stats)
        .values({
          key,
          value,
          trend: trend as any,
          trendValue,
          updatedAt: new Date().toISOString()
        })
        .returning();
        
      return newStat;
    }
  }

  async getAllStats(): Promise<Stat[]> {
    return db.select().from(stats);
  }
}

export const storage = new DatabaseStorage();
