const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/connection');

require('dotenv').config();
const port = process.env.PORT

const User = require('./user/User');
const authController = require('./auth/AuthController');

app.use(express.urlencoded({
     extended: true
}));
app.use(bodyParser.json());

connection.authenticate().then(() =>{
    console.log("🟢 MYSQL Conectado com sucesso!")
}).catch((error) => {
    return console.error();
});

app.use("/auth", authController);

app.listen(port, () => {
    console.log(`🟢 Servidor iniciado com sucesso na porta: [${port}]`);
})