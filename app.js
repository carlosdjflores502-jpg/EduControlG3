require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const indexRoutes = require('./routes/index.routes');
const alumnosRoutes = require('./routes/alumnos.routes');
const cursosRoutes = require('./routes/cursos.routes');
const inscripcionesRoutes = require('./routes/inscripciones.routes');
const calificacionesRoutes = require('./routes/calificaciones.routes');
const reportesRoutes = require('./routes/reportes.routes');
const { requireAuth, setCurrentUser } = require('./middleware/auth.middleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'educontrol_g3_session_secret',
  resave: false,
  saveUninitialized: false
}));

app.use(setCurrentUser);

app.use('/', authRoutes);
app.use('/', requireAuth, indexRoutes);
app.use('/alumnos', requireAuth, alumnosRoutes);
app.use('/cursos', requireAuth, cursosRoutes);
app.use('/inscripciones', requireAuth, inscripcionesRoutes);
app.use('/calificaciones', requireAuth, calificacionesRoutes);
app.use('/reportes', requireAuth, reportesRoutes);

app.listen(PORT, () => {
  console.log(`EduControl G3 ejecutandose en http://localhost:${PORT}`);
});
