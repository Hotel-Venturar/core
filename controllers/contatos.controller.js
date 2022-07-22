const admin = require('./../inc/admin')(io);

async function renderPaginaContatos(req, res, next){
  admin.contatos().then(data => {

    res.render('admin/contatos', {
        url: req.url,
        user: req.session.user,
        data
    });

});
}

async function deleteContato(req, res, next) {
  admin.contatosDelete(req).then(data => {

    res.send(data);

}).catch(err => {

    res.status(400);
    res.send({
        error: err
    });

});
}


module.exports = {renderPaginaContatos, deleteContato}