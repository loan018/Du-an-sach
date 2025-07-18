import React, { useEffect, useState } from "react";
import { getAllContacts, deleteContact } from "../../services/lienService";
import { toast } from "react-toastify";
import { IContact } from "../../interface/lienhe";
import { Link, useNavigate } from "react-router-dom";

const LienHeList: React.FC = () => {
  const [contacts, setContacts] = useState<IContact[]>([]);
  const navigate = useNavigate();

  const fetchContacts = async () => {
    try {
      const data = await getAllContacts();
      setContacts(data);
    } catch (error) {
      toast.error("Không thể lấy danh sách liên hệ.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc muốn xoá liên hệ này?")) {
      try {
        await deleteContact(id);
        toast.success("Đã xoá liên hệ.");
        setContacts((prev) => prev.filter((c) => c._id !== id));
      } catch (error) {
        toast.error("Xoá thất bại.");
      }
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-600">Danh sách liên hệ</h2>
        <button
          onClick={() => navigate("/contact/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Thêm liên hệ
        </button>
      </div>

      {contacts.length === 0 ? (
        <p className="text-gray-500">Chưa có liên hệ nào.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse table-auto text-left">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3">STT</th>
                <th className="p-3">Chủ đề</th>
                <th className="p-3">Nội dung</th>
                <th className="p-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact, index) => (
                <tr key={contact._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{contact.subject}</td>
                  <td className="p-3">{contact.message}</td>
                  <td className="p-3 text-center space-x-2">
                  <Link to={`edit/${contact._id}`} className="text-blue-600 hover:underline">
  Sửa
</Link>


                    <button
                      onClick={() => handleDelete(contact._id)}
                      className="text-red-600 hover:underline"
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LienHeList;
