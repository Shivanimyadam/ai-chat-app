const express = require('express');
const router = express.Router();
const axios = require('axios');


// **`routes/chat.js`**
// - Listens for a **POST request** at `/api/chat`
// - Takes the `message` from the request body
// - Sends it to **Gemini API**
// - Gets the AI reply back
// - Sends the reply to your frontend

router.post('/', async(req,res) =>{
    const { message } = req.body;
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: message }]}]
            }
        );

        const reply = response.data.candidates[0].content.parts[0].text;
    res.json({ reply });

    }catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
