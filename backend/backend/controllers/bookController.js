const Book = require('../models/Book');
const Review = require('../models/Review');

exports.createBook = async (req, res) => {
  try {
    const { title, author, description, genre, year } = req.body;
    const book = new Book({ title, author, description, genre, year, addedBy: req.user.id });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.addedBy.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    const updates = req.body;
    Object.assign(book, updates);
    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.addedBy.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    await Review.deleteMany({ book: book._id });
    await book.remove();
    res.json({ message: 'Book removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBooks = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = 5;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.search) {
      const q = req.query.search;
      filter.$or = [
        { title: new RegExp(q, 'i') },
        { author: new RegExp(q, 'i') },
        { genre: new RegExp(q, 'i') }
      ];
    }

    let sort = {};
    if (req.query.sortBy === 'year') sort = { year: -1 };
    if (req.query.sortBy === 'rating') {
      // will sort after aggregation, fallback to createdAt
      sort = { createdAt: -1 };
    }

    const total = await Book.countDocuments(filter);
    const books = await Book.find(filter).sort(sort).skip(skip).limit(limit).lean();

    // compute avg rating for each book
    const bookIds = books.map(b => b._id);
    const ratings = await Review.aggregate([
      { $match: { book: { $in: bookIds } } },
      { $group: { _id: "$book", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }
    ]);

    const ratingMap = {};
    ratings.forEach(r => ratingMap[r._id.toString()] = { avgRating: r.avgRating, count: r.count });

    const results = books.map(b => ({
      ...b,
      avgRating: ratingMap[b._id.toString()]?.avgRating ? Number(ratingMap[b._id.toString()].avgRating.toFixed(2)) : null,
      reviewCount: ratingMap[b._id.toString()]?.count || 0
    }));

    res.json({ page, totalPages: Math.ceil(total / limit), total, books: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('addedBy', 'name email').lean();
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const reviews = await Review.find({ book: book._id }).populate('user', 'name').lean();
    const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : null;

    res.json({ ...book, reviews, avgRating: avg ? Number(avg.toFixed(2)) : null, reviewCount: reviews.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
