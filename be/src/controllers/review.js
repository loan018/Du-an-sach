import Review from "../models/review.js";
import Book from "../models/books.js";
import Order from "../models/order.js"; 

export const getReviewsBook = async (req, res) => {
  try {
    const {
      id, 
      search = "",
      page = 1,
      limit = 10,
      rating,
    } = req.query;

    const query = {
      isActive: true,
    };

    if (id && id !== "all") {
      query.book = id; 
    }
    const allReviews = await Review.find(query)
      .populate("user", "name")
      .populate("book", "title")
      .sort({ createdAt: -1 });
    const filteredReviews = allReviews.filter((review) =>
      review.user?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const ratedReviews =
      rating && rating !== "all"
        ? filteredReviews.filter((r) => r.rating === Number(rating))
        : filteredReviews;

    const currentPage = parseInt(page, 10) || 1;
    const perPage = parseInt(limit, 10) || 10;
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;

    const paginatedReviews = ratedReviews.slice(start, end);

    res.json({
      success: true,
      message: "Lấy danh sách đánh giá bình luận thành công",
      data: paginatedReviews,
      pagination: {
        totalItems: ratedReviews.length,
        totalPages: Math.ceil(ratedReviews.length / perPage),
        currentPage,
        perPage,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Không lấy được đánh giá bình luận",
      error: err.message,
    });
  }
};



//Hàm tính lại rating trung bình và số đánh giá của sách
const updateBookRating = async (bookId) => {
  const reviews = await Review.find({ book: bookId, isActive: true });

  const totalReviews = reviews.length;
  const average = totalReviews
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;

  await Book.findByIdAndUpdate(bookId, {
    averageRating: average,
    reviewCount: totalReviews,
  });
};

//Thêm đánh giá mới
export const createReview = async (req, res) => {
  try {
    const { book, rating, comment } = req.body;

    const hasPurchased = await Order.findOne({
      user: req.user.id,
      "items.book": book,
      status: "delivered",
    });

    if (!hasPurchased) {
      return res.status(403).json({
        success: false,
        message: "Bạn phải mua sách này trước khi đánh giá và bình luận.",
      });
    }

    const existing = await Review.findOne({
      user: req.user.id,
      book,
      isActive: true,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã đánh giá bình luận sách này rồi.",
      });
    }

    const newReview = await Review.create({
      user: req.user.id,
      book,
      rating,
      comment,
    });

    await updateBookRating(book);

    res.status(201).json({
      success: true,
      message: "Đánh giá bình luận thành công",
      data: newReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Thêm đánh giá bình luận thất bại",
      error: error.message,
    });
  }
};


//Lấy danh sách đánh giá theo sách
export const getReviewsByBook = async (req, res) => {
  try {
    const reviews = await Review.find({
      book: req.params.id,
      isActive: true
    }).populate("user", "name");

    res.json({
      success: true,
      message: "Lấy được đánh giá bình luận thành công",
      data: reviews
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Không lấy được đánh giá bình luận",
      error: err.message,
    });
  }
};


export const hideReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đánh giá bình luận" });
    }

    if (!review.isActive) {
      return res.status(400).json({ success: false, message: "Đánh giá bình luận đã bị ẩn" });
    }

    review.isActive = false;
    await review.save();

    await updateBookRating(review.book);

    res.json({ success: true, message: "Ẩn đánh giá bình luận thành công" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Ẩn đánh giá bình luận thất bại",
      error: err.message,
    });
  }
};

