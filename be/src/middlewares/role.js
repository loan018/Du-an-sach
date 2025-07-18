export const requireStaffOrAdmin = (req, res, next) => {
  if (["admin", "staff"].includes(req.user.role)) {
    return next();
  }
  return res.status(403).json({ message: "Bạn không có quyền thực hiện thao tác này" });
};

