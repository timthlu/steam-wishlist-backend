const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/games', async (req, res) => {
    const response = await axios.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/');

    if (response.status === 200) {
        return res.json(response.data.applist.apps.filter(game => game.name));
    }
});

app.get('/games/:id', async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({error: 'Error: ID param missing'});
    }

    const response = await axios.get('https://store.steampowered.com/api/appdetails?appids=' + req.params.id);

    if (response.status === 200) {
        if (response.data[req.params.id].success) {
            return res.json(response.data[req.params.id].data);
        } else {
            return res.status(404).json({ error: "Game does not exist on steam"});
        }
    }
});

app.listen(port, () => {
    console.log('Server started on port', port);
});
