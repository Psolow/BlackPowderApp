const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

const readJSONFile = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading JSON file:', error);
        return {};
    }
};

const writeJSONFile = async (filePath, data) => {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing to JSON file:', error);
    }
};

app.get('/unit-attributes', async (req, res) => {
    const attributes = await readJSONFile(path.join(__dirname, 'data', 'unit_attributes.json'));
    res.json(attributes);
});

app.get('/get-units', async (req, res) => {
    const country = req.query.country;
    const units = await readJSONFile(path.join(__dirname, 'data', 'black_powder_units.json'));
    res.json(units[country] || []);
});

app.get('/army/:id', async (req, res) => {
    const userId = req.params.id;
    const armies = await readJSONFile(path.join(__dirname, 'data', 'armies.json'));
    res.json(armies[userId] || { army: [] });
});

app.post('/army/save', async (req, res) => {
    const { id, army } = req.body;
    const armies = await readJSONFile(path.join(__dirname, 'data', 'armies.json'));
    armies[id] = { army };
    await writeJSONFile(path.join(__dirname, 'data', 'armies.json'), armies);
    res.sendStatus(200);
});

app.post('/manage-units', async (req, res) => {
    const unit = req.body;
    const units = await readJSONFile(path.join(__dirname, 'data', 'black_powder_units.json'));
    
    if (!units[unit.country]) {
        units[unit.country] = [];
    }
    
    units[unit.country].push(unit);
    await writeJSONFile(path.join(__dirname, 'data', 'black_powder_units.json'), units);
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
