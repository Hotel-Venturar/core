module.exports = (io) => {

  let conn = require('./../inc/db');
  let express = require('express');
  let formidable = require('formidable');
  // let Pagination = require('./Pagination');
  let router = express.Router();

  let defaults = {
    title: 'Hotel Ventura',
    headerIndex: false
  };

  let defaultsReservas = {
    title: 'Reserva - Hotel Ventura',
    header: {
      background: 'images/img_bg_2.jpg',
      title: 'Reserve um quarto!'
    },
    body: {}
  };

  let defaultContato = {
    title: 'Contato - Hotel Ventura',
    header: {
      background: 'images/img_bg_3.jpg',
      title: 'Diga um oi!'
    },
    body: {}
  };

  let defaultLogin = {
    title: 'Contato - Hotel Ventura',
    header: {
      background: 'images/img_bg_4.jpg',
      title: 'Faça seu Login!'
    },
    body: {}
  };

  let defaultServicos = {
    title: 'Serviços - Hotel Ventura',
    header: {
      background: 'images/img_bg_1.jpg',
      title: 'É um prazer poder servir!'
    },
    body: {}
  };

  router.get('/', (req, res, next) => {

    conn.query(
      "SELECT * FROM tb_quartos ORDER BY nome_quarto",
      (err, results, fields) => {

        res.render('index', Object.assign({}, defaults, {
          title: 'Hotel Ventura',
          quartos: results,
          headerIndex: true
        }));

      }
    );

  });

  router.get('/contatos', (req, res, next) => {

    res.render('contatos', Object.assign({}, defaults, defaultContato));

  });

  router.post('/contatos', (req, res, next) => {

    let render = (error, success) => {

      res.render('contatos', Object.assign({}, defaults, defaultContato, {
        body: req.body,
        success,
        error
      }));

    };

    if (!req.body.nome) {

      render('Preencha o campo Nome.');

    } else if (!req.body.email) {

      render('Preencha o campo E-mail.');

    } else if (!req.body.mensagem) {

      render('Preencha o campo Mensagem.');

    } else {

      conn.query(
        "INSERT INTO tb_contatos (nome, email, mensagem) VALUES(?, ?, ?)",
        [
          req.body.nome,
          req.body.email,
          req.body.mensagem
        ],
        (err, results) => {

          if (err) {
            render(err);
          } else {

            io.emit('reservations update', req.body);

            req.body = {};

            render(null, 'Contato enviado com sucesso!');

          }

        }
      );

    }

  });

  router.get('/quartos', (req, res, next) => {

    conn.query(
      "SELECT * FROM tb_quartos ORDER BY nome_quarto",
      (err, results, fields) => {

        res.render('quartos', Object.assign({}, defaults, {
          title: 'Quartos - Hotel Ventura',
          header: {
            background: 'images/img_bg_1.jpg',
            title: 'Contemple nossas acomodações!'
          },
          quartos: results
        }));

      });

  });

  router.get('/reservas', (req, res, next) => {
  
    conn.query(
      "SELECT * FROM tb_quartos ORDER BY nome_quarto",
      (err, results, fields) => {
        res.render('reservas', Object.assign({}, defaults, defaultsReservas, {
          quartos: results
        }));
    });
  });

  router.post('/reservas', (req, res, next) => {

    let render = (error, success) => {

      conn.query(
        "SELECT * FROM tb_quartos ORDER BY nome_quarto",
        (err, results, fields) => {
          res.render('reservas', Object.assign({}, defaults, defaultsReservas, {
            quartos: results,
            body: req.body,
            success,
            error        
          }));
      });
    };

    console.log(req.body);

    if (!req.body.nome) {

      render('Preencha o campo Nome.');

    } else if (!req.body.email) {

      render('Preencha o campo E-mail.');

    } else if (!req.body.qt_hospedes) {

      render('Selecione a quantidade de pessoas.');

    } else if (!req.body.data_inicio.trim()) {

      render('Selecione a data de inicio da reserva.');

    } else if (!req.body.data_fim.trim()) {

      render('Selecione a data fim da reserva.');

    } else {

      conn.query(
        " INSERT INTO tb_reservas (nome, email, qt_hospedes, data_inicio, data_fim, fk_id_quarto, status_reserva ) VALUES(?, ?, ?, ?, ?, ?, ?)",
        [
          req.body.nome,
          req.body.email,
          req.body.qt_hospedes,
          req.body.data_inicio,
          req.body.data_fim,
          parseInt(req.body.fk_id_quarto),
          req.body.status_reserva
        ],
        (err, results) => {

          if (err) {
            render(err);
          } else {

            io.emit('reservations update', req.body);

            req.body = {};

            render(null, 'Reserva realizada com sucesso!');

          }

        }
      );

    }

  });

  router.post('/subscribe', (req, res, next) => {

    let form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {

      if (!fields.email) {

        res.status(400);
        res.send({
          error: 'Preencha o campo e-mail.'
        });

      } else {

        conn.query(
          "INSERT INTO tb_emails (email) VALUES(?)",
          [
            fields.email
          ],
          (err, results) => {

            if (err) {

              res.status(400);
              res.send({
                error: err
              });

            } else {

              io.emit('reservations update', fields);

              res.send(results);

            }

          }
        );

      }

    });

  });

  router.get('/servicos', (req, res, next) => {

    res.render('servicos', Object.assign({}, defaults, defaultServicos));

  });

  router.get('/login', (req, res, next) => {

    res.render('login', Object.assign({}, defaults, defaultLogin));

  });

  return router;

};