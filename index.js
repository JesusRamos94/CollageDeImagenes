const express = require('express')
const app = express();
const expressFileUpload = require('express-fileupload');
const port = 3000;
const path = require('path');
const fs = require('fs').promises;

const configFileUploadImg = {
    limits: { fileSize: 5000000 },
    abortOnLimit: true,
    responseOnLimit: 'El peso del archivo que intentas subir supera el limite permitido',
};

app.use(expressFileUpload(configFileUploadImg));
app.use('/imgs', express.static(path.join(__dirname, 'src', 'files')));

app.listen(port, () => {
    console.log(`Servidor a la escucha en el puerto ${port}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/layouts/formulario.html');
});

app.get('/imagen', (req, res) => {
    res.sendFile(__dirname + '/views/layouts/collage.html');
});

app.post("/imagen", (req, res) => {
    try {
        const imagen = req.files.target_file;
        const posicion = req.body.posicion;
        imagen.mv(__dirname + '/src/files/imagen-' + posicion + '.jpg', (err) => {
            err ? res.send("Error al cargar el archivo") :
                res.redirect('/imagen')
        });
    } catch (error) {
        res.send('<script>alert("No a seleccionado ninguna imagen"); window.location.href = "/";</script>')
    }

});

app.get("/deleteImg/:imagen", async (req, res) => {
    try {
        const { imagen } = req.params;
        await fs.unlink(path.join(__dirname, 'src', 'files', imagen));
        res.redirect('/imagen');
    } catch (error) {
        res.send('<script>alert("Error, imagen no encontrada"); window.location.href = "/";</script>')
    }
});
