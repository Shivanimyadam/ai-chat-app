const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db');
const jwt = require('jsonwebtoken');

// Middleware to verify token

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log("token ", req.headers, "---", token);
    if (!token) {
        return res.status(401).json({ error: "No token provided " });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded", decoded);
        req.user = decoded;
        next(); // moves to next step (route handler)
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};


// **`routes/chat.js`**
// - Listens for a **POST request** at `/api/chat`
// - Takes the `message` from the request body
// - Sends it to **Gemini API**
// - Gets the AI reply back
// - Sends the reply to your frontend

router.post('/', verifyToken, async (req, res) => {

    const { message, session_id } = req.body;
    const userId = req.user.id;
    // Validate
  if (!message || !session_id) {
    return res.status(400).json({ error: 'Message and session_id are required' });
  }
  
// Use this instead ✅
console.log("message:", message, "session_id:", session_id);
    try {
        // first save user messages to db
        db.query(
            'INSERT INTO messages (role,text,user_id,session_id) VALUES (?,?,?,?)', ['user', message, userId, session_id]
        );
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: message }]
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log("Groq response:", JSON.stringify(response.data, null, 2));
        const reply = response.data.choices[0].message.content;
        // save AI reply to db
        db.query(
            'UPDATE sessions SET title = ? WHERE id = ? AND title = "New Chat"',
            [message.slice(0, 30), session_id]
        );
        db.query(
            'INSERT INTO messages (role,text,user_id,session_id) VALUES (?,?,?,?)', ['ai', reply, userId, session_id]
        );
        res.json({ reply });

    } catch (error) {
        console.error(error.message);
        console.error("Full error:", error.response?.data);
        console.error("Status:", error.response?.status);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// creating GET route - to load previous messages

router.get('/', verifyToken, (req, res) => {
  
    const { session_id } = req.query;

      console.log("chat session get msg", session_id);
    
    db.query('SELECT * FROM messages WHERE user_id = ? AND session_id = ? ORDER BY created_at ASC',
        [req.user.id, session_id], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to fetch messages' });
            }
            res.json(results);
        });
});

module.exports = router;
