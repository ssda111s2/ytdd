const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chatApp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log(err));

// Define the message schema
const messageSchema = new mongoose.Schema({
    sender: String,
    text: String,
    timestamp: { type: Date, default: Date.now }
});

// Create the Message model
const Message = mongoose.model('Message', messageSchema);

// Endpoint to get all messages
app.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
});

// Endpoint to send a message
app.post('/messages', async (req, res) => {
    try {
        const { sender, text } = req.body;
        const newMessage = new Message({ sender, text });
        await newMessage.save();
        res.json(newMessage);
    } catch (err) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
