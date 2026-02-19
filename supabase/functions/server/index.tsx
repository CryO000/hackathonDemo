import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-0db36b3b/health", (c) => {
  return c.json({ status: "ok" });
});

// Initialize Supabase Admin Client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- Auth Routes ---

app.post("/make-server-0db36b3b/signup", async (c) => {
  const { email, password, name } = await c.req.json();
  
  if (!email || !password) {
    return c.json({ error: "Email and password are required" }, 400);
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { name },
    email_confirm: true
  });

  if (error) {
    console.error("Signup error:", error);
    return c.json({ error: error.message }, 400);
  }

  return c.json({ user: data.user });
});

// --- Chat Routes ---

app.get("/make-server-0db36b3b/chat", async (c) => {
  try {
    const messages = await kv.getByPrefix("chat:msg:");
    // Sort messages by timestamp if needed, but keys are usually sorted?
    // If keys are timestamps, they come back in order?
    // Let's assume we sort in memory.
    const sortedMessages = (messages || []).sort((a: any, b: any) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    return c.json({ messages: sortedMessages });
  } catch (error) {
    console.error("Error fetching chat:", error);
    return c.json({ error: "Failed to fetch messages" }, 500);
  }
});

app.post("/make-server-0db36b3b/chat", async (c) => {
  try {
    const { user, role, message, avatar } = await c.req.json();
    
    if (!message) {
      return c.json({ error: "Message is required" }, 400);
    }

    const timestamp = new Date().toISOString();
    const id = Date.now().toString(); // Simple ID
    
    const newMessage = {
      id,
      user,
      role,
      message,
      timestamp, // Store full ISO string
      avatar: avatar || 'U'
    };

    // Store in KV with prefix
    // Key format: chat:msg:<timestamp>:<id> to ensure unique and sortable
    await kv.set(`chat:msg:${timestamp}:${id}`, newMessage);

    return c.json({ message: newMessage });
  } catch (error) {
    console.error("Error posting chat:", error);
    return c.json({ error: "Failed to post message" }, 500);
  }
});

Deno.serve(app.fetch);
