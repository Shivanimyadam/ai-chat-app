const express = require('express'); // web framework
const cors = require('cors'); // Allows FRONTEND to talkto BACKEND
require('dotenv').config();  // loads .env file

//cors = — without this, your React app can't communicate with the backend
//- Then it connects the chat route and starts the server on port 5000

const app = express();

// app.use(cors({
//     origin:'http://localhost:5173',
//     methods:['GET','POST'],
//     allowedHeaders:['Content-Type']
// }));
app.use(cors());
app.use(express.json());

const chatRoute = require('./routes/chat');

const authRoute = require('./routes/auth');

app.use('/api/chat',chatRoute);

app.use('/api/auth',authRoute);

const PORT = process.env.PORT || 5001;
app.listen(PORT,() => {
    console.log(`Server running on port ${PORT} `);
});



// Simple Flow
// React → POST /api/chat → Gemini API → reply → React
