const { getConnection } = require('../config/db');

const getAllCursos = async () => {
  let connection;

  try {
    connection = await getConnection();
    const [rows] = await connection.query(
      `SELECT id_curso, codigo, nombre, descripcion, creditos, catedratico, horario, estado
       FROM cursos
       ORDER BY id_curso DESC`
    );

    return rows;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const getCursoById = async (idCurso) => {
  let connection;

  try {
    connection = await getConnection();
    const [rows] = await connection.query(
      `SELECT id_curso, codigo, nombre, descripcion, creditos, catedratico, horario, estado
       FROM cursos
       WHERE id_curso = ?`,
      [idCurso]
    );

    return rows[0];
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const createCurso = async (curso) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query(
      `INSERT INTO cursos (codigo, nombre, descripcion, creditos, catedratico, horario, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        curso.codigo,
        curso.nombre,
        curso.descripcion || null,
        curso.creditos,
        curso.catedratico,
        curso.horario || null,
        curso.estado
      ]
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const updateCurso = async (idCurso, curso) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query(
      `UPDATE cursos
       SET codigo = ?, nombre = ?, descripcion = ?, creditos = ?, catedratico = ?, horario = ?, estado = ?
       WHERE id_curso = ?`,
      [
        curso.codigo,
        curso.nombre,
        curso.descripcion || null,
        curso.creditos,
        curso.catedratico,
        curso.horario || null,
        curso.estado,
        idCurso
      ]
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const deleteCurso = async (idCurso) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query('DELETE FROM cursos WHERE id_curso = ?', [idCurso]);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

module.exports = {
  getAllCursos,
  getCursoById,
  createCurso,
  updateCurso,
  deleteCurso
};
