const express = require('express');
const path = require('path');
const app = express();
const port = 4040;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname,"public")));


app.get('/login/login.html', (req, res) => {
    res.render('login/login');  
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'usuario' && password === 'contraseña') {
        res.redirect('/index'); 
    } else {
        res.send('Credenciales incorrectas, por favor intente de nuevo.');  
    }
});


app.get('/index.html', (req, res) => {
    res.render('index');  
});


app.listen(port, () => {
   console.log("app running in port");
});