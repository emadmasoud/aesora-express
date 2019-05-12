const router = require("express").Router();
const {
  register,
  getAllUsers,
  login
} = require("../controllers/userController");

router.post("/register", register);
router.get("/register", (req, res) => {
  return res.status(200).json({ name: "golam rabbi" });
});
router.get("/all", getAllUsers);

router.post("/login", login);

module.exports = router;
