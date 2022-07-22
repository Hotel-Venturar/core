const admin = require('./../inc/admin')(io);


async function getHome(req, res, _next){
  admin.home().then(data => {

    res.render('admin/index', {
        url: req.url,
        user: req.session.user,
        data
    });

});
}

module.exports = {getHome}