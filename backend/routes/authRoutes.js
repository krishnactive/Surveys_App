const express = require("express");
const cloudinary = require("../config/cloudinary"); 
const fs = require("fs");
const passport = require("passport");
const{
    registerUser,
    loginUser,
    getUserInfo,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware")

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser",protect, getUserInfo);

//
router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "uploads", 
    });

    // Remove temp file
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      imageUrl: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Error uploading image", error: error.message });
  }
});

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google redirect callback
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',    // on failure, redirect here
    session: false           // we are using JWT not session
  }),
  (req, res) => {
    // Successful authentication
    // return JWT token or redirect to frontend
    // redirect to frontend with token in query
    const token = req.user.token;   // assuming passport sets req.user.token
    res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);

  }
);


module.exports = router;