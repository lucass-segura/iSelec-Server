const express = require("express") //require: Es una función global de Node.js que se utiliza para cargar módulos en una aplicación.
// Permite incluir módulos escritos en otros archivos y hacerlos accesibles en el archivo actual
const path = require('path');
const app = express();
const mysql = require('mysql')
const cors = require("cors");
const fs = require('fs');

app.use(cors());
app.use(express.json())




// Configurar el middleware para servir archivos estáticos
app.use('/images', express.static(path.join(__dirname, 'public/images/iphones')));
app.use('/iphones', express.static(path.join(__dirname, 'public/iphones')));

const db = mysql.createConnection({
    host: 'aws.connect.psdb.cloud',
    user: '7c9qz8wiy2bdmyib5tv3',
    password: 'pscale_pw_HRP19IxfnqYMLAny1kgJr7THAC4POMXR077hUIlSAkm',
    database: "iselec",
    ssl: { 
        rejectUnauthorized: false
    }
});




app.post("/create", (req, res) => {
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const precio = req.body.precio;
    const img = req.body.img;
    const idCategory = req.body.idCategory;



    var _path = path.join(__dirname, "public/images/iphones");
    var base64Data = img.replace("data:image/png;base64,", "");

    let pathParcial = '';

        var _nombre = nombre.replace(' ', '_');
        console.log(_nombre)
        console.log(pathParcial)
        pathParcial = `/${_nombre}/${_nombre}.png`;
        fs.mkdir(_path+'\\'+_nombre,(err)=>{
            console.log('error al crear directorio' , err)
        })

        _path = path.join(_path, pathParcial);

        fs.writeFile(_path, base64Data, 'base64', function (err) {
            console.log(err);
        });

    db.query("INSERT INTO dispositivo(nombre,descripcion,precio,img,idCategory) VALUES(?,?,?,?,?)", [nombre, descripcion, precio, pathParcial, idCategory],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("dispositivo registrado con exito");
            }
        }
    );
});


//FUNCION PARA MODIFICAR DISPOSITIVOS
app.put("/update", (req, res) => {
    const id = req.body.id;
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const precio = req.body.precio;
    const img = req.body.img;
    const idCategory = req.body.idCategory;




    var _path = path.join(__dirname, "public/images/iphones");
    var base64Data = img.replace("data:image/png;base64,", "");

    let pathParcial = '';

        var _nombre = nombre.replace(' ', '_');
        console.log(_nombre)
        console.log(pathParcial)
        pathParcial = `/${_nombre}/${_nombre}.png`;
        fs.mkdir(_path+'\\'+_nombre,(err)=>{
            console.log('error al crear directorio' , err)
        })

        _path = path.join(_path, pathParcial);

        fs.writeFile(_path, base64Data, 'base64', function (err) {
            console.log(err);
        });

    db.query("UPDATE dispositivo SET nombre=?, descripcion=? ,precio=?,img=?, idCategory=? WHERE id=?", [nombre, descripcion, precio, pathParcial, idCategory, id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Dispositivo actualizado");
            }
        }
    );
});


// Agrega una ruta para el inicio de sesión
app.post("/login", (req, res) => {
    const { user, password } = req.body;
  
    // Realiza la validación de inicio de sesión en la base de datos
    db.query("SELECT * FROM user WHERE user = ? AND password = ?", [user, password],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error al intentar iniciar sesión.");
        } else {
          // Verifica si se encontró un usuario con el nombre de usuario y contraseña proporcionados
          if (result.length > 0) {
            res.json({
              success: true,
              message: "Inicio de sesión exitoso",
            });
          } else {
            res.json({
              success: false,
              message: "Credenciales inválidas",
            });
          }
        }
      }
    );
  });



//FUNCION QUE SIRVE PARA TRAERME TODOS LOS DISPOSITIVOS
app.get("/dispositivos", (req, res) => {

    db.query("SELECT * FROM dispositivo",
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});



//FUNCION QUE SIRVE PARA TRAERME TODOS LAS CATEGORIAS
app.get("/category", (req, res) => {

    db.query("SELECT * FROM category",
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});








//FUNCION PARA ELIMINAR
app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    db.query("DELETE FROM dispositivo WHERE id=?", [id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Dispositivo eliminado");
            }
        }
    );
});




app.get("/category/:id", (req, res) => {
    const id = req.params.id;

    db.query("SELECT * FROM dispositivo WHERE idCategory = ?", [id],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error al obtener los dispositivos.");
            } else {
                console.log(result); // Imprimir los datos recibidos por ID en la consola
                res.send(result);
            }
        }
    );
});



app.get("/dispositivo/:id", (req, res) => {
    const id = req.params.id;

    db.query("SELECT * FROM dispositivo WHERE id = ?", [id],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send("Error al obtener los dispositivos.");
            } else {
                console.log(result); // Imprimir los datos recibidos por ID en la consola
                res.send(result);
            }
        }
    );
});



app.listen(3001, () => {
    console.log("corriendo en el puerto 3001");
});