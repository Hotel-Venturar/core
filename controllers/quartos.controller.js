const admin = require('./../inc/admin')(io);

async function renderQuarto(req, res, next){

  admin.quartos().then(data => {

   
    admin.quartos().then(data => {

      res.render('admin/quartos', {
          url: req.url,
          user: req.session.user,
          data
      });

  });

});

}

async function criarQuarto(req, res, next){

  admin.quartosSave(req).then(data => {

    res.send(data);

}).catch(err => {

    res.status(400);
    res.send({
        error: err
    });

});

}

async function deleteQuarto(req, res, next){
  admin.quartosDelete(req).then(data => {

    res.send(data);

}).catch(err => {

    res.status(400);
    res.send({
        error: err
    });

});
}


module.exports = {renderQuarto, criarQuarto, deleteQuarto}