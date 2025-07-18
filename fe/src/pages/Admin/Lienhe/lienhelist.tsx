import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

const ContactList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  const fetchContacts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/contact");
      setContacts(res.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy liên hệ:", error);
    }
  };

  const deleteContact = async (id: string) => {
    if (window.confirm("Bạn có chắc muốn xoá liên hệ này?")) {
      try {
        await axios.delete(`http://localhost:3000/api/contact/${id}`);
        setContacts(contacts.filter((item) => item._id !== id));
      } catch (error) {
        console.error("Lỗi xoá:", error);
      }
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Danh sách liên hệ</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 border">Tên</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Nội dung</th>
              <th className="px-4 py-2 border">Thời gian</th>
              <th className="px-4 py-2 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact._id}>
                <td className="px-4 py-2 border">{contact.name}</td>
                <td className="px-4 py-2 border">{contact.email}</td>
                <td className="px-4 py-2 border">{contact.message}</td>
                <td className="px-4 py-2 border">
                  {new Date(contact.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => deleteContact(contact._id)}
                    className="text-red-500 hover:text-red-700"
                    title="Xoá"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {contacts.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  Không có liên hệ nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactList;
