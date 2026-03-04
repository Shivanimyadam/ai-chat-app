const express = require('express');
const router = express.Router();
const axios = require('axios');


// **`routes/chat.js`**
// - Listens for a **POST request** at `/api/chat`
// - Takes the `message` from the request body
// - Sends it to **Gemini API**
// - Gets the AI reply back
// - Sends the reply to your frontend

router.post('/', async (req, res) => {
    const { message } = req.body;
    try {
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
        res.json({ reply });

    } catch (error) {
        console.error(error.message);
        console.error("Full error:", error.response?.data);
        console.error("Status:", error.response?.status);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

module.exports = router;
