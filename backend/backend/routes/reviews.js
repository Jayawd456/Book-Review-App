const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const reviewCtrl = require('../controllers/reviewController');

router.post('/:bookId', auth, reviewCtrl.addReview);
router.put('/:id', auth, reviewCtrl.updateReview);
router.delete('/:id', auth, reviewCtrl.deleteReview);

module.exports = router;
