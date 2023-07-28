const express = require("express");
const app = express();
const mysql = require('mysql');
const cors = require("cors");

app.use(cors());
app.use(express.json());

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
    const { nombre, descripcion, precio, img, idCategory } = req.body;
    const imageUrl = `https://server-iselec.onrender.com/iphones/${idCategory}/${img}.png`;

    db.query("INSERT INTO dispositivo(nombre, descripcion, precio, img, idCategory) VALUES(?, ?, ?, ?, ?)", [nombre, descripcion, precio, imageUrl, idCategory], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error al crear el dispositivo.");
        } else {
            res.send("Dispositivo registrado con éxito");
        }
    });
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