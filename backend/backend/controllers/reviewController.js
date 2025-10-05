const Review = require('../models/Review');
const Book = require('../models/Book');

exports.addReview = async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    const bookId = req.params.bookId;
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // If user already reviewed the book, update instead of creating duplicate (optional)
    let review = await Review.findOne({ book: bookId, user: req.user.id });
    if (review) {
      review.rating = rating;
      review.reviewText = reviewText;
      await review.save();
      return res.json(review);
    }

    review = new Review({ book: bookId, user: req.user.id, rating, reviewText });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    review.rating = req.body.rating ?? review.rating;
    review.reviewText = req.body.reviewText ?? review.reviewText;
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    await review.remove();
    res.json({ message: 'Review removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
