const express = require('express');
const cors = require('cors');
const auth = require('./auth');
const axios = require('axios');
const app = express();

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

//Cors used so localhost backend allows communication to localhost frontend (why localhost wouldn't "talk" to localhost is beyond me). It still is a part of security so I won't argue 🤷
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 1. Login to get a token (secured REST part)
app.post('/login', (req, res) => {
    const token = require('jsonwebtoken').sign({ id: 1, name: "Student" }, "wedontgotocreic");
    res.json({ token });
});

// 2. GET user data from user microservice
app.get('/profile/:id', auth, async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:4001/users/${req.params.id}`);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: "User Service is down" });
    }
});
// 3. POST order to order microservice (rewrite this comment when you can speak english)
app.post('/api/orders', auth, async (req, res) => {
    try {
        const response = await axios.post(`http://localhost:4002/orders`, req.body);
        res.status(201).json(response.data);
    } catch (err) {
        res.status(500).json({ error: "Order Service is down" });
    }
});

app.listen(3000, () => console.log("Gateway running on port 3000"));