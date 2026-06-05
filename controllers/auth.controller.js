const usuariosModel = require('../models/usuarios.model');

const showLogin = (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }

  return res.render('auth/login', {
    title: 'Login - EduControl G3',
    errorMessage: null,
    formData: {
      correo: ''
    }
  });
};

const login = async (req, res) => {
  const correo = (req.body.correo || '').trim();
  const password = (req.body.password || '').trim();
  const formData = { correo };

  if (!correo || !password) {
    return res.render('auth/login', {
      title: 'Login - EduControl G3',
      errorMessage: 'Ingresa correo y contrasena.',
      formData
    });
  }

  try {
    const usuario = await usuariosModel.getUsuarioByCorreo(correo);

    if (!usuario) {
      return res.render('auth/login', {
        title: 'Login - EduControl G3',
        errorMessage: 'Credenciales incorrectas.',
        formData
      });
    }

    if (usuario.estado !== 'Activo') {
      return res.render('auth/login', {
        title: 'Login - EduControl G3',
        errorMessage: 'El usuario se encuentra inactivo.',
        formData
      });
    }

    // Para seguridad real, mas adelante se recomienda reemplazar esta comparacion por bcrypt.compare().
    if (usuario.password !== password) {
      return res.render('auth/login', {
        title: 'Login - EduControl G3',
        errorMessage: 'Credenciales incorrectas.',
        formData
      });
    }

    req.session.user = {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol
    };

    return res.redirect('/');
  } catch (error) {
    return res.render('auth/login', {
      title: 'Login - EduControl G3',
      errorMessage: `No se pudo iniciar sesion. Detalle: ${error.message}`,
      formData
    });
  }
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
};

module.exports = {
  showLogin,
  login,
  logout
};
