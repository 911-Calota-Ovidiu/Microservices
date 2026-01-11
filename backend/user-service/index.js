const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

// User service to get user dat
app.get('/users/:id', (req, res) => {
    console.log("User Service hit!");
    user=res.json({
        id: req.params.id,
        username: `Student_${req.params.id}`,
        email: "test@example.com"
    });
});

app.listen(4001, () => console.log("User Service running on port 4001"));