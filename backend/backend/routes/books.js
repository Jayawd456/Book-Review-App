const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const bookCtrl = require('../controllers/bookController');

router.post('/', auth, bookCtrl.createBook);
router.put('/:id', auth, bookCtrl.updateBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.get('/', bookCtrl.getBooks); // public
router.get('/:id', bookCtrl.getBookById);

module.exports = router;
