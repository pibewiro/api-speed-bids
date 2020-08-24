const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const auth = require("../../middlewares/verifyToken");

router.post("/auth", authController.loginUser);
router.post("/auth/admin", authController.loginAdmin);
router.post("/auth", authController.loginAdmin);
router.get("/auth", authController.logoutUser);
router.delete("/auth/:password/:id", auth, authController.deleteUser);
router.put("/auth/change-password/:id", auth, authController.updatePassword);
router.get(
  "/auth/delete-profile-email/:email/:firstname/:lastname",
  auth,
  authController.emailDeletedUser
);
router.get("/auth/recover-password/:email", authController.recoverPassword)

module.exports = router;
