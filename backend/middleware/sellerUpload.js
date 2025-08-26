import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/sellers/"),
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    //cb(null, `${Date.now()}.${ext}`);
    cb(null, Date.now() + "_" + file.originalname);

  },
});

export const uploadSellerImage = multer({ storage });
