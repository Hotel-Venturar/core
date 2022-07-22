const admin = require('./../inc/admin')(io);
const moment = require('moment');
moment.locale('pt-BR');

async function getReserva(req, res, next){
  req.query.start = (req.query.start) ? moment(req.query.start).format('YYYY-MM-DD') : moment().subtract(1, 'year').format('YYYY-MM-DD');
        req.query.end = (req.query.end) ? moment(req.query.end).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
    
        admin.reservas(req.query).then(pagination => {
            console.log(pagination)
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

}

async function getReservaGrafico(req, res, next){
  req.query.start = (req.query.start) ? moment(req.query.start).format('YYYY-MM-DD') : moment().subtract(1, 'year').format('YYYY-MM-DD');
  req.query.end = (req.query.end) ? moment(req.query.end).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');

  admin.reservasChart(req.query).then(chartData => {

      res.send(chartData);

  });

}

async function criarReserva(req, res, next) {
  admin.reservasSave(req).then(data => {

    res.send(data);

}).catch(err => {

    res.status(400);
    res.send({
        error: err
    });

});
}
async function deleteReserva(req, res, next) {
  admin.reservasDelete(req).then(data => {

    res.send(data);

}).catch(err => {

    res.status(400);
    res.send({
        error: err
    });

});
}


module.exports = {getReserva, getReservaGrafico, criarReserva, deleteReserva}