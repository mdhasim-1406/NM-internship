const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'people.json');

app.use(cors());
app.use(express.json());

// Helper function to read data
const readData = () => {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
};

// Helper function to write data
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// GET (all) - Read all people
app.get('/api/people', (req, res) => {
    try {
        const people = readData();
        res.json(people);
    } catch (error) {
        res.status(500).json({ message: 'Error reading data' });
    }
});

// GET (by id) - Read a single person
app.get('/api/people/:id', (req, res) => {
    try {
        const people = readData();
        const person = people.find(p => p.id === parseInt(req.params.id));
        if (!person) return res.status(404).json({ message: 'Person not found' });
        res.json(person);
    } catch (error) {
        res.status(500).json({ message: 'Error reading data' });
    }
});

// POST - Create a new person
app.post('/api/people', (req, res) => {
    try {
        const people = readData();
        const newPerson = {
            id: people.length > 0 ? Math.max(...people.map(p => p.id)) + 1 : 1,
            name: req.body.name,
            email: req.body.email
        };
        people.push(newPerson);
        writeData(people);
        res.status(201).json(newPerson);
    } catch (error) {
        res.status(500).json({ message: 'Error saving data' });
    }
});

// PUT - Update an existing person
app.put('/api/people/:id', (req, res) => {
    try {
        const people = readData();
        const index = people.findIndex(p => p.id === parseInt(req.params.id));
        if (index === -1) return res.status(404).json({ message: 'Person not found' });

        people[index] = {
            ...people[index],
            name: req.body.name || people[index].name,
            email: req.body.email || people[index].email
        };
        writeData(people);
        res.json(people[index]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating data' });
    }
});

// DELETE - Remove a person
app.delete('/api/people/:id', (req, res) => {
    try {
        let people = readData();
        const personExists = people.some(p => p.id === parseInt(req.params.id));
        if (!personExists) return res.status(404).json({ message: 'Person not found' });

        people = people.filter(p => p.id !== parseInt(req.params.id));
        writeData(people);
        res.json({ message: 'Person deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
