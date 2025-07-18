import Contact from "../models/lienhe.js";

// Tạo mới liên hệ
export const createContact = async (req, res) => {
  try {
    const { name, email,subject, message } = req.body;

    if (!name || !email ||!subject|| !message) {
      return res.status(400).json({ success: false, message: "Vui lòng điền đầy đủ thông tin." });
    }

    const newContact = new Contact({ name, email,subject, message });
    await newContact.save();

    res.status(201).json({ success: true, message: "Liên hệ của bạn đã được gửi." });
  } catch (error) {
    console.error("Lỗi khi gửi liên hệ:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi server." });
  }
};

// Lấy tất cả liên hệ
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server khi lấy danh sách liên hệ" });
  }
};

// ✅ Lấy chi tiết liên hệ theo ID
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Không tìm thấy liên hệ" });
    }
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server khi lấy liên hệ" });
  }
};

// ✅ Sửa liên hệ
export const updateContact = async (req, res) => {
  try {
    const { name, email,subject, message } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { name, email,subject, message },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ success: false, message: "Không tìm thấy liên hệ để cập nhật" });
    }

    res.json({ success: true, message: "Cập nhật liên hệ thành công", data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server khi cập nhật" });
  }
};

// Xoá liên hệ
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Không tìm thấy liên hệ" });
    }
    res.json({ success: true, message: "Xoá liên hệ thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server khi xoá" });
  }
};
