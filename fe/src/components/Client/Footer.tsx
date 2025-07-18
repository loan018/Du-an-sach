import React from "react";
import { Facebook, Instagram, Phone, Mail, MapPin, Truck, RotateCcw, HelpCircle } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#5b3c1d] text-white py-10 mt-16 text-sm">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-left">

        {/* Về BookNext */}
        <div>
          <h4 className="font-bold mb-3 text-lg">Về BookNext</h4>
          <p>
            BookNext là hiệu sách đáng tin cậy, cung cấp hàng ngàn đầu sách thuộc nhiều thể loại.
            Trải nghiệm mua sắm dễ dàng tại cửa hàng và trực tuyến.
          </p>
        </div>

        {/* Hỗ trợ khách hàng */}
        <div>
          <h4 className="font-bold mb-3 text-lg">Hỗ trợ khách hàng</h4>
          <ul className="space-y-2">
            <li className="flex items-center gap-2"><Truck size={16} /> <a href="#" className="hover:underline">Chính sách vận chuyển</a></li>
            <li className="flex items-center gap-2"><RotateCcw size={16} /> <a href="#" className="hover:underline">Chính sách đổi trả</a></li>
            <li className="flex items-center gap-2"><HelpCircle size={16} /> <a href="#" className="hover:underline">Câu hỏi thường gặp</a></li>
          </ul>
        </div>

        {/* Liên hệ */}
        <div className="space-y-2">
          <h4 className="font-bold mb-3 text-lg">Thông tin liên hệ</h4>
          <p className="flex items-start gap-2"><MapPin size={16} /> <span>123 Trịnh Vặn Bô, Nam Từ Nam, TP.Hà Nội</span></p>
          <p className="flex items-center gap-2"><Phone size={16} /> 0909 999 999</p>
          <p className="flex items-center gap-2"><Mail size={16} /> lienhe@booknext.vn</p>
          <p className="mt-2">Giờ làm việc: 8:00 - 21:00 (T2 - CN)</p>
        </div>

        {/* Mạng xã hội */}
        <div>
          <h4 className="font-bold mb-3 text-lg">Kết nối với chúng tôi</h4>
          <div className="flex flex-col space-y-2">
            <a href="#" className="hover:text-yellow-300 flex items-center gap-2"><Facebook size={16} /> Facebook</a>
            <a href="#" className="hover:text-yellow-300 flex items-center gap-2"><Instagram size={16} /> Instagram</a>
          </div>
        </div>
      </div>

      <div className="text-center mt-10 border-t border-white pt-4 text-xs">
        © 2025 BookNext. Bản quyền đã được bảo hộ.
      </div>
    </footer>
  );
};

export default Footer;
