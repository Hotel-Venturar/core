const admin = require('./../inc/admin')(io);
const moment = require('moment');
moment.locale('pt-BR');
async function getUsuario(req, res, next){
  admin.usuarios().then(data => {

    res.render('admin/usuarios', {
        url: req.url,
        user: req.session.user,
        data,
        moment
    });

});

}

async function criarUsuario(req, res, next) {
  admin.usuariosSave(req).then(data => {

    res.send(data);

}).catch(err => {

    res.status(400);
    res.send({
        error: err
    });

});
}

async function alterarSenha(req, res, next) {
  admin.usuariosSenha(req).then(data => {

    res.send(data);

}).catch(err => {

    res.status(400);
    res.send({
        error: err
    });

});
}

async function deleteUsuario(req, res) {
  admin.usuariosDelete(req).then(data => {

    res.send(data);

}).catch(err => {

    res.status(400);
    res.send({
        error: err
    });

});
}



module.exports = {getUsuario, criarUsuario, alterarSenha, deleteUsuario}