import express from 'express';
import pool from '../db.js';

const roomRouter = express.Router();

// имитация получения VIP статуса из спец. сервиса (не нашел специального API под это, поэтому VIP определяется практически рандомом)
const isVipClient = async (clientId) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${clientId}`);
    const data = await response.json();
    return data.username?.length > 4;
}

const getAvailableRooms = async (roomId, startDate, endDate) => {
    const query = `SELECT id
        FROM room
        WHERE id NOT IN (
            SELECT DISTINCT room_id
            FROM booking
            WHERE room_id = $1
            AND (
                (start_date BETWEEN $2 AND $3)
                OR (end_date BETWEEN $2 AND $3)
            )
            AND NOT is_cancelled
        )
    `;

    const result = await pool.query(query, [roomId, startDate, endDate]);
    return result.rows;
}

roomRouter.get('/', async (req, res) => {
    try {
        const query = 'SELECT * FROM room';
        const result = await pool.query(query);

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching rooms', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

roomRouter.get('/available', async (req, res) => {
    try {
        const roomId = req.query.roomId;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        const rows = await getAvailableRooms(roomId, startDate, endDate);

        res.json(rows);
    } catch (error) {
        console.error('Error fetching rooms', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

roomRouter.post('/book', async (req, res) => {
    try {
        const roomId = req.body.roomId;
        const clientId = req.body.clientId;
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;

        const isVip = await isVipClient(clientId);

        const availableRooms = await getAvailableRooms(roomId, startDate, endDate);
        const isRoomAvailable = availableRooms.filter(room => room.id == roomId).length > 0;

        if(!isRoomAvailable){
            res.status(406).json({ error: "Room is not available" });
            return;
        }

        const query = `INSERT INTO booking(start_date, end_date, room_id, client_id, is_vip_client)
            VALUES ($1, $2, $3, $4, $5);`;

        const result = await pool.query(query, [startDate, endDate, roomId, clientId, isVip]);

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching rooms', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default roomRouter;