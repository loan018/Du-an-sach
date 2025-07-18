import Address from "../models/add.js";

export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy địa chỉ" });
  }
};

export const addAddress = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      province,
      ward,
      street,
      isDefault = false,
      type = "home",
    } = req.body;

    if (!fullName || !phone || !province || !ward || !street) {
      return res.status(400).json({ message: "Thiếu thông tin địa chỉ" });
    }

    // Nếu là mặc định thì gỡ mặc định cũ
    if (isDefault) {
      await Address.updateMany({ user: req.user.id }, { $set: { isDefault: false } });
    }

    const newAddress = await Address.create({
      user: req.user.id,
      fullName,
      phone,
      province,
      ward,
      street,
      isDefault,
      type,
    });

    res.status(201).json(newAddress);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi thêm địa chỉ" });
  }
};


export const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!address) {
      return res.status(404).json({ message: "Không tìm thấy địa chỉ" });
    }
    res.json({ message: "Đã xoá" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi xoá địa chỉ" });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    // Reset tất cả isDefault = false
    await Address.updateMany(
      { user: req.user.id },
      { $set: { isDefault: false } }
    );

    // Gán isDefault = true cho địa chỉ mới
    const updated = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: { isDefault: true } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy địa chỉ" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật mặc định" });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const { fullName, phone, province, ward, street, isDefault,type } = req.body;

    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ message: "Không tìm thấy địa chỉ" });
    }

    address.fullName = fullName;
    address.phone = phone;
    address.province = province;
    address.ward = ward;
    address.street = street;
    address.isDefault = isDefault ?? false;
    address.type = type ?? "home";

    await address.save();

    if (isDefault) {
      await Address.updateMany(
        { user: address.user, _id: { $ne: address._id } },
        { $set: { isDefault: false } }
      );
    }

    res.json(address);
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật địa chỉ", error });
  }
};
