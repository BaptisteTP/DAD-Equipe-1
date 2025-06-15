const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const likeRoutes = require('./routes/likeRoutes');
const commentRoutes = require('./routes/commentRoutes');
const followRoutes = require('./routes/followRoutes');
const userRoutes   = require('./routes/userRoutes');

// Charger les variables d'environnement
dotenv.config({ path: __dirname + '/.env' });

// Connexion à MongoDB
connectDB();

const app = express();

// === Middlewares globaux ===
// Autoriser les requêtes CORS
app.use(cors());

// Pour parser le JSON dans le body des requêtes
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts', likeRoutes);
app.use('/api/posts/:postId/comments', commentRoutes);
app.use('/api/users', followRoutes);
app.use('/api/users', userRoutes);


// === Route de base (placeholder) ===
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API Breezy !' });
});

// === Gestionnaire d’erreurs générique ===
// Cette fonction attrape les erreurs lancées depuis les controllers
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  res.status(status).json({
    error: {
      message: err.message || 'Erreur interne',
      code: status
    }
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
