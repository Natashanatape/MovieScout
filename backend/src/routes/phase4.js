const express = require('express');
const router = express.Router();
const Phase4Controller = require('../controllers/phase4Controller');
const auth = require('../middleware/auth');

// Coming Soon
router.get('/coming-soon', Phase4Controller.getComingSoon);
router.post('/coming-soon/:movieId/remind', auth, Phase4Controller.setReminder);
router.delete('/coming-soon/:movieId/remind', auth, Phase4Controller.deleteReminder);
router.get('/user/reminders', auth, Phase4Controller.getUserReminders);
router.put('/reminders/:id/settings', auth, Phase4Controller.updateReminderSettings);

// Box Office
router.get('/box-office/weekend', Phase4Controller.getBoxOfficeWeekend);
router.get('/box-office/movie/:id', Phase4Controller.getMovieBoxOffice);

// TV Episodes
router.get('/tv/:id/seasons', Phase4Controller.getTVSeasons);
router.get('/tv/:id/season/:seasonNum/episodes', Phase4Controller.getSeasonEpisodes);
router.post('/episodes/:id/mark-watched', auth, Phase4Controller.markEpisodeWatched);

// Technical Specs
router.get('/movies/:id/technical-specs', Phase4Controller.getTechnicalSpecs);

// Release Dates
router.get('/movies/:id/release-dates', Phase4Controller.getReleaseDates);

// Companies
router.get('/movies/:id/companies', Phase4Controller.getMovieCompanies);

module.exports = router;
