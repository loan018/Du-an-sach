import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IBook } from "../../interface/book";
import { ICategory } from "../../interface/category";
import { getAllBooks } from "../../services/bookService";
import { getAllCategories } from "../../services/categoryService";

const Book: React.FC = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sort, setSort] = useState<string>("");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const slug = searchParams.get("category") || "";
        setCategoryFilter(slug);

        // Lấy danh mục
        const categoryRes = await getAllCategories();
        const categoryList = categoryRes.data || categoryRes;
        const activeCategories = categoryList.filter((c: ICategory) => c.isActive);
        setCategories(activeCategories);

        // Gọi API lấy sách có lọc theo slug
        const bookRes = await getAllBooks({ categorySlug: slug , limit: 100 });
        setBooks(bookRes.data || bookRes);
      } catch (err) {
        console.error("Lỗi khi tải sách hoặc danh mục:", err);
      }
    };

    fetchData();
  }, [searchParams]);

  const filteredBooks = books
    .filter((book) => {
      if (minPrice !== null && book.price < minPrice) return false;
      if (maxPrice !== null && book.price > maxPrice) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "sold") return (b.sold || 0) - (a.sold || 0);
      return 0;
    });

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 px-4 py-6 max-w-7xl mx-auto">
      {/* Bộ lọc */}
      <aside className="md:col-span-1">
        <h2 className="font-semibold mb-3 text-lg">Bộ lọc tìm kiếm</h2>
        <div className="space-y-4 text-sm">
          {/* Danh mục */}
          <div>
            <label className="block font-medium mb-1">Danh mục</label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                const slug = e.target.value;
                setCategoryFilter(slug);
                navigate(`/book?category=${slug}`);
              }}
              className="w-full border rounded p-2"
            >
              <option value="">Tất cả</option>
              {categories.map((cate) => (
                <option key={cate._id} value={cate.slug}>
                  {cate.name}
                </option>
              ))}
            </select>
          </div>

          {/* Khoảng giá */}
          <div>
            <label className="block font-medium mb-1">Khoảng giá</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="₫ từ"
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-full border rounded p-2"
              />
              <input
                type="number"
                placeholder="₫ đến"
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          {/* Sắp xếp */}
          <div>
            <label className="block font-medium mb-1">Sắp xếp</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Mặc định</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="sold">Bán chạy</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Danh sách sách */}
      <section className="md:col-span-4">
        <h1 className="text-2xl font-bold mb-6">
          {categoryFilter
            ? categories.find((c) => c.slug === categoryFilter)?.name
            : "Tất cả Sách"}
        </h1>

        {filteredBooks.length === 0 ? (
          <p className="text-gray-500">Không có sản phẩm phù hợp.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book._id}
                className="border rounded-lg p-3 hover:shadow-md cursor-pointer"
                onClick={() => navigate(`/book/${book._id}`)}
              >
                <img
                  src={book.image}
                  alt={book.title}
                  className="h-32 w-full object-contain rounded mb-2"
                />
                <h3 className="text-sm font-medium line-clamp-2">{book.title}</h3>
                <p className="text-red-500 font-semibold text-sm mt-1">
                  {book.price.toLocaleString()}₫
                </p>
                {book.oldPrice && (
                  <p className="text-xs line-through text-gray-500">
                    {book.oldPrice.toLocaleString()}₫
                  </p>
                )}
                <p className="text-xs text-gray-500">Đã bán: {book.sold || 0}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Book;
