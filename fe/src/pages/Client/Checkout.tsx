import React, { useEffect, useState } from "react";
import { createOrder, createVnpayPayment } from "../../services/orderService";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../services/authService";
import { getAddresses } from "../../services/addService";
import { IAddress } from "../../interface/order";
import { IBook } from "../../interface/book";

interface CheckoutItem {
  _id: string;
  book: IBook;
  quantity: number;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<{ name: string; phone: string }>({
    name: "",
    phone: "",
  });

  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showAddressList, setShowAddressList] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "vnpay">("cod");
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const items = localStorage.getItem("checkout_items");
    if (!items) {
      alert("Không có sản phẩm để thanh toán.");
      navigate("/cart");
      return;
    }

    const parsedItems: CheckoutItem[] = JSON.parse(items);
    setCheckoutItems(parsedItems);

    const total = parsedItems.reduce(
      (sum, item) => sum + item.book.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const me = await getMe();
      setUser({ name: me.name, phone: me.phone });

      const addrList = await getAddresses();
      setAddresses(addrList);

      const defaultAddr = addrList.find((a) => a.isDefault);
      setSelectedAddressId(defaultAddr?._id || addrList[0]?._id || "");
    };

    fetchData();
  }, []);

  const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

 const handleOrder = async () => {
  if (!selectedAddress) {
    alert("Vui lòng chọn địa chỉ giao hàng!");
    return;
  }

  const items = checkoutItems.map((item) => ({
    book: item.book._id,
    quantity: item.quantity,
    price: item.book.price,
  }));

  try {
    // Gọi API tạo đơn hàng
    const order = await createOrder({
      shippingInfo: {
        name: selectedAddress.fullName,
        phone: selectedAddress.phone,
        address: `${selectedAddress.street}, ${selectedAddress.ward}, ${selectedAddress.province}`,
      },
      items,
      totalAmount: totalPrice,
      paymentMethod,
      isPaid: false,
    });

    // Nếu thanh toán qua VNPAY → chuyển hướng
    if (paymentMethod === "vnpay") {
      const url = await createVnpayPayment(order._id);
      window.location.href = url;
    } else {
      localStorage.removeItem("checkout_items");
      alert("Đặt hàng thành công!");
      navigate("/list");
    }
  } catch (err) {
    console.error("Lỗi đặt hàng:", err);
    alert("Đặt hàng thất bại!");
  }
};


  return (
    <div className="min-h-screen bg-[#f5f5f5] px-4 py-8 md:px-12">
      <h2 className="text-2xl font-bold mb-6">Xác nhận đơn hàng</h2>

      {/* Địa chỉ giao hàng */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="flex justify-between items-start">
          <div>
            {selectedAddress ? (
              <>
                <p className="font-semibold text-base">
                  {selectedAddress.fullName} (+84) {selectedAddress.phone}
                </p>
                <p className="text-gray-700 mt-1">
                  {selectedAddress.street}, {selectedAddress.ward}, {selectedAddress.province}
                </p>
                {selectedAddress.isDefault && (
                  <span className="text-sm text-green-600 font-medium">Mặc định</span>
                )}
              </>
            ) : (
              <p className="text-red-500">Chưa có địa chỉ được chọn</p>
            )}
          </div>
          <button
            onClick={() => setShowAddressList(!showAddressList)}
            className="text-blue-600 hover:underline"
          >
            Thay đổi
          </button>
        </div>

        {showAddressList && (
          <select
            className="mt-4 w-full bg-gray-100 px-4 py-2 rounded border border-gray-300"
            value={selectedAddressId}
            onChange={(e) => setSelectedAddressId(e.target.value)}
          >
            {addresses.map((addr) => (
              <option key={addr._id} value={addr._id}>
                {addr.fullName} - {addr.street}, {addr.ward}, {addr.province}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Thông tin đơn hàng */}
        <div className="bg-white p-4 rounded shadow space-y-4">
          <h3 className="text-lg font-semibold">Chi tiết đơn hàng</h3>

          {checkoutItems.map((item) => (
            <div key={item.book._id} className="flex items-center gap-4 border-b pb-3">
              <img
                src={item.book.image}
                alt={item.book.title}
                className="w-16 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="text-sm font-medium">{item.book.title}</h4>
                <p className="text-sm text-gray-600">
                  {item.quantity} x {item.book.price.toLocaleString()}đ
                </p>
              </div>
              <div className="font-bold">
                {(item.book.price * item.quantity).toLocaleString()}đ
              </div>
            </div>
          ))}

          <div className="flex justify-between text-lg font-bold pt-4 border-t">
            <span>Tổng cộng:</span>
            <span>{totalPrice.toLocaleString()}đ</span>
          </div>
        </div>

        {/* Phương thức thanh toán */}
        <div className="bg-white p-4 rounded shadow space-y-4">
          <h3 className="text-lg font-semibold">Phương thức thanh toán</h3>

          <select
            className="w-full bg-gray-100 px-4 py-2 rounded border border-gray-300"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as "cod" | "vnpay")}
          >
            <option value="cod">Thanh toán khi nhận hàng</option>
            <option value="vnpay">Thanh toán qua VNPAY</option>
          </select>

          <button
            onClick={handleOrder}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded text-lg font-bold"
            disabled={!selectedAddress}
          >
            ĐẶT HÀNG NGAY
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
