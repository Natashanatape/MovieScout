const express = require('express');
const router = express.Router();

router.get('/feed', (req, res) => {
  const sampleActivities = [
    { id: 1, user: 'John', action: 'rated', movie: 'The Dark Knight', rating: 9, time: '2 hours ago' },
    { id: 2, user: 'Sarah', action: 'reviewed', movie: 'Inception', time: '4 hours ago' },
    { id: 3, user: 'Mike', action: 'added to watchlist', movie: 'Interstellar', time: '6 hours ago' }
  ];
  res.json(sampleActivities);
});

module.exports = router;