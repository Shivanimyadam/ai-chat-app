const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db');


// **`routes/chat.js`**
// - Listens for a **POST request** at `/api/chat`
// - Takes the `message` from the request body
// - Sends it to **Gemini API**
// - Gets the AI reply back
// - Sends the reply to your frontend

router.post('/', async (req, res) => {
    const { message } = req.body;
    try {
        // first save user messages to db
        db.query(
            'INSERT INTO messages (role,text) VALUES (?,?)',['user',message]
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
            'INSERT INTO messages (role,text) VALUES (?,?)',['ai',reply]
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

router.get('/',(req,res)=>{
    db.query('SELECT * FROM messages ORDER BY created_at ASC',(err,results)=>{
         if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }
    res.json(results);
    });
});

module.exports = router;
