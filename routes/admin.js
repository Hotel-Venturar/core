const { getReserva } = require('../controllers/reservas.controller');

module.exports = (io) => {
    const admin = require('./../inc/admin')(io);
    const express = require('express');
    const router = express.Router();
    const AdminController = require('../controllers/admin.controller');
    const LoginController = require('../controllers/login.controller');
    const ContatosController = require('../controllers/contatos.controller');
    const QuartoController = require('../controllers/quartos.controller');
    const ReservaController = require('../controllers/reservas.controller');
    const UsuarioController = require('../controllers/usuarios.controller');
    const EmailController = require('../controllers/emails.controller');

    router.use((req, res, next) => {

        if (['/login'].indexOf(req.url) === -1 && (req.session && !req.session.user)) {

            res.redirect('/admin/login');

        } else {

            next();

        }

    });

    router.get('/', AdminController.getHome);

    router.get('/login', LoginController.renderPaginaLogin);

    router.post('/login', LoginController.loginUsuario);

    router.get('/contatos', ContatosController.renderPaginaContatos);

    router.delete('/contatos/:id', ContatosController.deleteContato);

    router.get('/quartos', QuartoController.renderQuarto);

    router.post('/quartos', QuartoController.criarQuarto);

    router.delete('/quartos/:id', QuartoController.deleteQuarto);

    router.get('/reservas', ReservaController.getReserva);

    router.get('/reservas/chart', ReservaController.getReservaGrafico);

    router.post('/reservas', ReservaController.criarReserva);
    
    router.post('/reservas/status', ReservaController.alterarStatus);

    router.delete('/reservas/:id', ReservaController.deleteReserva);

    router.get('/usuarios', UsuarioController.getUsuario);

    router.post('/usuarios', UsuarioController.criarUsuario);

    router.post('/usuarios/senha', UsuarioController.alterarSenha);

    router.delete('/usuarios/:id', UsuarioController.deleteUsuario);

    router.get('/emails', EmailController.getEmails);

    router.delete('/emails/:id', EmailController.deleteEmails);

    router.get('/logout', LoginController.logout);

    return router;

};