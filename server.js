const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Mock user database
const users = {
  'AS-123456': {
    password: 'password123',
    data: {
      name: "Jean Dupont",
      contractId: "AS-123456",
      plan: "Famille",
      daysLeft: 24,
      address: "123 Rue de la République, 75001 Paris",
      phone: "06 12 34 56 78",
      notifications: 3,
      invoices: [
          { id: "F2025-01", date: "01/08/2025", amount: "89.00€" },
          { id: "F2025-02", date: "01/07/2025", amount: "89.00€" },
          { id: "F2025-03", date: "01/06/2025", amount: "89.00€" },
      ],
      recentActs: [
          { date: '15/08/2025', description: 'Consultation Généraliste', status: 'Remboursé', amount: '25.00€' },
          { date: '12/08/2025', description: 'Achat Pharmacie', status: 'Remboursé', amount: '12.50€' },
          { date: '05/08/2025', description: 'Soins Dentaires', status: 'En attente', amount: '120.00€' },
      ],
      alerts: [
        { type: 'info', message: 'Nouveau message de votre conseiller.' },
        { type: 'warning', message: 'Votre facture F2025-01 est bientôt due.' }
      ],
      family: [
        { id: 1, name: "Jean Dupont", isPrimary: true, recentActs: [
            { date: '15/08/2025', description: 'Consultation Généraliste', status: 'Remboursé', amount: '25.00€' }
        ]},
        { id: 2, name: "Marie Dupont", isPrimary: false, recentActs: [
            { date: '10/08/2025', description: 'Achat Pharmacie', status: 'Remboursé', amount: '8.50€' }
        ]},
        { id: 3, name: "Lucas Dupont", isPrimary: false, recentActs: [
            { date: '02/08/2025', description: 'Soins Dentaires', status: 'En attente', amount: '75.00€' }
        ]}
      ]
    }
  }
};

// API Endpoints
app.post('/api/login', (req, res) => {
  const { clientId, password } = req.body;
  const user = users[clientId];

  if (user && user.password === password) {
    // In a real app, you'd generate a JWT. Here, we'll just send back the user data.
    res.json({ success: true, token: 'mock-jwt-token', clientData: user.data });
  } else {
    res.status(401).json({ success: false, message: 'Identifiants incorrects' });
  }
});

app.post('/api/contact', (req, res) => {
    console.log('Contact form submission received:');
    console.log(req.body);
    res.json({ success: true, message: 'Message reçu. Nous vous répondrons bientôt.' });
});

// Multer config for file upload simulation
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/upload', upload.single('document'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Aucun fichier reçu.' });
    }
    console.log(`Received file: ${req.file.originalname} (${req.file.size} bytes)`);
    res.json({ success: true, message: `Fichier "${req.file.originalname}" reçu avec succès.` });
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
