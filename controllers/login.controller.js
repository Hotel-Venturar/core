const admin = require('./../inc/admin')(io);

async function renderPaginaLogin(req, res, next){

  res.render('admin/login', {
      error: null
  });

}

async function loginUsuario(req, res, next){
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


}

async function logout(req, res) {
  delete req.session.user;

  res.redirect('/admin/login');
}

module.exports = {renderPaginaLogin, loginUsuario, logout}