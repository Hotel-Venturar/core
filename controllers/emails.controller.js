const admin = require('./../inc/admin')(io);

async function getEmails(req, res, next){
  admin.emails().then(data => {

    res.render('admin/emails', {
        url: req.url,
        user: req.session.user,
        data
    });

});
}

async function deleteEmails(req, res, next){
  admin.emailsDelete(req).then(data => {

    res.send(data);

}).catch(err => {

    res.status(400);
    res.send({
        error: err
    });

});
}


module.exports = {getEmails, deleteEmails}