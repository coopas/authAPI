const express = require('express');
const router = express.Router();
const User = require("../user/User");
const { hashPassword, verifyPassword } = require('../utils/hash');
const { Op } = require('sequelize');
const validator = require('validator');

router.post("/register", async (req, res) => {

    const {email, username, password} = req.body;

    if(!email || !username || !password) {
        return res.status(400).json({
            message: 'Dados insuficientes'
        });
    }

    if(!validator.isEmail(email)) {
        return res.status(400).json({
            message: 'Email invalido'
        })
    }

    try {
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    {username: username},
                    {email: email}
                ]},
        })
        if(user) {
            return res.status(400).json({
                message: 'Informações repetidas'
            })
        }

        const hashedPassword = await hashPassword(password);
        
        await User.create({
            email: email,
            username: username,
            password: hashedPassword
        });

        return res.status(201).json({
            message: 'Usuário cadastrado'
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Ocorreu um erro durante o cadastro'
        })
    }

});

module.exports = router;
