// Rutas del servicio de autenticación
const { Router } = require("express");
const { registrar, iniciarSesion, perfil } = require("../controllers/authController");
const verificarToken = require("../middleware/verificarToken");

const router = Router();

router.post("/registro", registrar);
router.post("/login", iniciarSesion);
router.get("/perfil", verificarToken, perfil);

module.exports = router;
