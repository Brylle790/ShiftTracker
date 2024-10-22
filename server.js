const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Use middleware to enable CORS
app.use(cors());
app.use(express.json());

let shiftData = {};

// Function to fetch user avatar URL from Roblox API
async function fetchUserAvatar(userId) {
    try {
        const response = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=true`);
        const data = await response.json();
        return data.data[0].imageUrl; // Assuming this returns the correct avatar URL
    } catch (error) {
        console.error('Error fetching avatar:', error);
        return 'https://www.roblox.com/asset/?id=0'; // Fallback placeholder
    }
}

// Route to handle POST requests to /shiftData
app.post('/shiftData', async (req, res) => {
    const data = req.body;

    // Log received shift data
    console.log('Received shift data:', data);

    // Fetch avatar URL from Roblox API
    const avatarUrl = await fetchUserAvatar(data.userId);

    // Store or update shift data based on userId
    shiftData[data.userId] = {
        username: data.username,
        totalTime: data.totalTime,
        userId: data.userId,
        avatarUrl: avatarUrl, // Store fetched avatar URL
        date: data.date
    };

    // Send a response to acknowledge receipt of data
    res.status(200).send('Shift data received successfully');
});

// Route to serve the shift data on a GET request
app.get('/shiftData', (req, res) => {
    // Return shift data with avatar URLs included
    res.status(200).json(Object.values(shiftData));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
