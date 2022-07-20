module.exports = (io) => {

    let moment = require('moment');
    let admin = require('./../inc/admin')(io);
    let express = require('express');
    let router = express.Router();

    moment.locale('pt-BR');

    router.use((req, res, next) => {

        if (['/login'].indexOf(req.url) === -1 && (req.session && !req.session.user)) {

            res.redirect('/admin/login');

        } else {

            next();

        }

    });

    router.get('/', (req, res, next) => {

        admin.home().then(data => {

            res.render('admin/index', {
                url: req.url,
                user: req.session.user,
                data
            });

        });

    });

    router.get('/stats', (req, res, next) => {

        admin.home().then(data => {

            res.send(data);

        });

    });

    router.get('/login', (req, res, next) => {

        res.render('admin/login', {
            error: null
        });

    });

    router.post('/login', (req, res, next) => {

        let render = (error) => {

            res.render('admin/login', {
                error
            });

        };

        admin.login(req).then(user => {

            res.redirect('/admin');

        }).catch(err => {

            render(err);

        });

    });

    router.get('/contatos', (req, res, next) => {

        admin.contatos().then(data => {

            res.render('admin/contatos', {
                url: req.url,
                user: req.session.user,
                data
            });

        });

    });

    router.delete('/contatos/:id', (req, res, next) => {

        admin.contatosDelete(req).then(data => {

            res.send(data);

        }).catch(err => {

            res.status(400);
            res.send({
                error: err
            });

        });

    });

    router.get('/quartos', (req, res, next) => {

        admin.quartos().then(data => {

            res.render('admin/quartos', {
                url: req.url,
                user: req.session.user,
                data
            });

        });

    });

    router.post('/quartos', (req, res, next) => {

        admin.quartosSave(req).then(data => {

            res.send(data);

        }).catch(err => {

            res.status(400);
            res.send({
                error: err
            });

        });

    });

    router.delete('/quartos/:id', (req, res, next) => {

        admin.quartosDelete(req).then(data => {

            res.send(data);

        }).catch(err => {

            res.status(400);
            res.send({
                error: err
            });

        });

    });

    router.get('/reservas', (req, res, next) => {

        req.query.start = (req.query.start) ? moment(req.query.start).format('YYYY-MM-DD') : moment().subtract(1, 'year').format('YYYY-MM-DD');
        req.query.end = (req.query.end) ? moment(req.query.end).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');

        admin.reservas(req.query).then(pagination => {
            res.render('admin/reservas', {
                url: req.url,
                user: req.session.user,
                pagination,
                moment,
                date: {
                    start: req.query.start,
                    end: req.query.end
                }
            });
        });
    });


    router.get('/reservas/chart', (req, res, next) => {

        req.query.start = (req.query.start) ? moment(req.query.start).format('YYYY-MM-DD') : moment().subtract(1, 'year').format('YYYY-MM-DD');
        req.query.end = (req.query.end) ? moment(req.query.end).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');

        admin.reservasChart(req.query).then(chartData => {

            res.send(chartData);

        });

    });

    router.post('/reservas', (req, res, next) => {

        admin.reservasSave(req).then(data => {

            res.send(data);

        }).catch(err => {

            res.status(400);
            res.send({
                error: err
            });

        });

    });

    router.delete('/reservas/:id', (req, res, next) => {

        admin.reservasDelete(req).then(data => {

            res.send(data);

        }).catch(err => {

            res.status(400);
            res.send({
                error: err
            });

        });

    });

    router.get('/usuarios', (req, res, next) => {

        admin.usuarios().then(data => {

            res.render('admin/usuarios', {
                url: req.url,
                user: req.session.user,
                data,
                moment
            });

        });

    });

    router.post('/usuarios', (req, res, next) => {

        admin.usuariosSave(req).then(data => {

            res.send(data);

        }).catch(err => {

            res.status(400);
            res.send({
                error: err
            });

        });

    });

    router.post('/usuarios/senha', (req, res, next) => {

        admin.usuariosSenha(req).then(data => {

            res.send(data);

        }).catch(err => {

            res.status(400);
            res.send({
                error: err
            });

        });

    });

    router.delete('/usuarios/:id', (req, res, next) => {

        admin.usuariosDelete(req).then(data => {

            res.send(data);

        }).catch(err => {

            res.status(400);
            res.send({
                error: err
            });

        });

    });

    router.get('/emails', (req, res, next) => {

        admin.emails().then(data => {

            res.render('admin/emails', {
                url: req.url,
                user: req.session.user,
                data
            });

        });

    });

    router.delete('/emails/:id', (req, res, next) => {

        admin.emailsDelete(req).then(data => {

            res.send(data);

        }).catch(err => {

            res.status(400);
            res.send({
                error: err
            });

        });

    });

    router.get('/logout', (req, res, next) => {

        delete req.session.user;

        res.redirect('/admin/login');

    });

    return router;

};