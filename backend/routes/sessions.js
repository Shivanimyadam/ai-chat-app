const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

// Middleware to verify token


const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log("Sessions token ", req.headers, "---", token);
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

// Get all sessions

router.get('/', verifyToken, (req, res) => {
    db.query('SELECT * FROM sessions WHERE user_id = ? ORDER BY created_at DESC',
        [req.user.id],
        (error, results) => {
            if (error) return res.status(500).json({ error: 'Failed to fetch sessions' });
            res.json(results);
        }
    );
});

// Create new session

router.post('/', verifyToken, (req, res) => {
    // console.log("POST req,res ", req, res);
    const { title } = req.body;
    db.query('INSERT INTO sessions(user_id, title) VALUES (?,?)',
        [req.user.id, title || 'New Chat'],
        (error, results) => {
            if (error) return res.status(500).json({ error: 'Failed to fetch sessions' });
            console.log("error, results", error, "-", results);
            res.json({ id: results.insertId, title: title || 'New Chat' });
        }
    );
});

// Delete session

router.delete('/:id', verifyToken, (req, res) => {
    const sessionId = req.params.id;

    db.query('DELETE FROM messages WHERE session_id = ?  ',
        [sessionId],
        (error) => {
            if (error) return res.status(500).json({ error: 'Failed to delete messages' });
            db.query('DELETE FROM sessions where session_id=? AND user_id=?',
                [sessionId, req.user.id],
                (error) => {
                    if (error) return res.status(500).json({ error: 'Failed to delete session' });
                    res.json({ message: 'Session deleted' });
                }
            );
        }
    );
});

// Update session title
router.put('/:id', (req, res) => {
    const { title } = req.body;
    console.log("PUT", req, req.body);
    db.query('UPDATE sessions SET title = ? WHERE id = ? AND user_id= ?',
        [title, req.params.id, req.user.id],
        (error) => {
            if (err) return res.status(500).json({ error: 'Failed to update session' });
            res.json({ message: 'Session updated' });
        }
    );
});

module.exports = router;
