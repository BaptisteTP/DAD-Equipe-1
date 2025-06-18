// 1. Charger les variables d'environnement
require('dotenv').config({ path: __dirname + '/.env' });

const express       = require('express');
const cors          = require('cors');
const helmet        = require('helmet');
const rateLimit     = require('express-rate-limit');

const connectDB     = require('./config/db');
const postRoutes    = require('./routes/postRoutes');
const likeRoutes    = require('./routes/likeRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();

// 2. Connexion à MongoDB
connectDB();

// 3. Middlewares de sécurité
app.use(helmet());                              // Sécuriser les headers HTTP
app.use(rateLimit({                             // Limiter le nombre de requêtes
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Trop de requêtes depuis cette IP, réessayez dans 15 minutes'
}));

// 4. Middlewares globaux
app.use(cors());                                // Autoriser CORS
app.use(express.json());                        // Parser le JSON

// 5. Routes de l’API
app.use('/api/posts', postRoutes);
app.use('/api/posts', likeRoutes);
app.use('/api/posts/:postId/comments', commentRoutes);

// 7. Gestionnaire d’erreurs global
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

// 8. Démarrage du serveur
const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
