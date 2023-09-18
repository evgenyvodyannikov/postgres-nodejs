import express from 'express';
import pool from '../db.js';

const roomRouter = express.Router();

roomRouter.get('/rooms', async (req, res) => {
    try {
        const query = 'SELECT * FROM room';
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching rooms', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

roomRouter.get('/AvailableRooms', async (req, res) => {
    try {
        const query = 'SELECT * FROM available_room Where is_available = TRUE';
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching rooms', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default roomRouter;