const { getConnection } = require('../config/db');

const getUsuarioByCorreo = async (correo) => {
  let connection;

  try {
    connection = await getConnection();
    const [rows] = await connection.query(
      `SELECT id_usuario, nombre, correo, password, rol, estado
       FROM usuarios
       WHERE correo = ?
       LIMIT 1`,
      [correo]
    );

    return rows[0];
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

module.exports = {
  getUsuarioByCorreo
};
