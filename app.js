const express = require('express');
const path = require('path');


const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', require('./routes/index.routes'));
app.use('/clientes', require('./routes/clientes.routes'));
app.use('/jugadores', require('./routes/jugadores.routes'));
app.use('/categorias', require('./routes/categorias.routes'));
app.use('/domicilios', require('./routes/domicilios.routes'));
// app.use('/auto', require('./routes/auto.routes')); 
// app.use('/casa', require('./routes/casa.routes'));
app.use('/computadora', require('./routes/computadora.routes'));
app.use('/videojuegos', require('./routes/videojuegos.routes'));
app.use('/comida', require('./routes/comida.routes'));
app.use('/gastos', require('./routes/gastos.routes'));

app.listen(3000, () => {
console.log('Servidor en http://localhost:3000');
});