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
        const roomId = req.query.roomId;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        const query = `SELECT room_id FROM booking Where room_id = $1 And NOT (start_date BETWEEN $2 And $3) And NOT (end_date BETWEEN $2 And $3)`;
        const { rows } = await pool.query(query, [roomId, startDate, endDate]);

        res.json(rows);
    } catch (error) {
        console.error('Error fetching rooms', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default roomRouter;