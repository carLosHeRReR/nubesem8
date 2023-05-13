require('dotenv').config();
const express = require('express')
const app = express()
const port = process.env.PORT || 3010

const mysql = require('mysql2')
const connection = mysql.createConnection(process.env.DATABASE_URL);

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

connection.connect()

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  connection.query('SELECT * FROM productos', (error, results, fields) => {
    if (error) throw error;
    res.render('index', { data: results });
  });
});

app.get('/delete/:id', (req,res) => {
  const id = req.params.id
  connection.query('DELETE FROM productos WHERE id = ?',[id],(error, results) => {
    if (error) throw error;
    res.redirect('/');
  });
});

app.get('/add', (req, res) => {
  res.render('Agregar')
});

app.post('/save', (req, res) => {
  const nombre = req.body.nombre;
  const descripcion = req.body.descripcion;
  const precio = req.body.precio;
  connection.query('INSERT INTO productos SET ?',{nombre:nombre, descripcion:descripcion, precio:precio}, (error, results)=>{
    if(error){
        console.log(error);
    }else{
          
      res.redirect('/');  
      console.log(`Producto ${nombre} creado`);
    }         
  });
});

app.get('/up', (req, res) =>  {
  res.render('Editar.ejs')
});

app.post('/update/<%= data.id %>', (req, res) => {
  const nombre = req.body.nombre;
  const descripcion = req.body.descripcion;
  const precio = req.body.precio;
  connection.query('UPDATE productos SET nombre = ?, descripcion = ?, precio = ? WHERE id = ?', [nombre, descripcion, precio, id], (error, results) => {
    if (error) throw error;
    res.redirect('/');
  });
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
