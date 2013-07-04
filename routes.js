var api = require('instagram-node').instagram();

var redirect_uri = 'http://localhost:3000/handleauth';

exports.authorize_user = function(req, res) {
  api.use({
    client_id: process.env.INSTAGRAM_CLIENT_ID,
    client_secret: process.env.INSTAGRAM_CLIENT_SECRET
  });

  res.redirect(api.get_authorization_url(redirect_uri, { scope: ['basic', 'relationships'], state: 'a state' }));
};

exports.handleauth = function(req, res) {
  api.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.log(err);
      res.send("Didn't work" + err);
    } else {
      api.user_follows(result.user.id, function(err, users, pagination, limit) {
        console.log(pagination.next_url);
        res.send(users);
      });
    }
  });
};

exports.index = function(req, res){
  res.render('index');
};