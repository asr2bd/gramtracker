var api = require('instagram-node').instagram();

var redirect_uri = 'http://localhost:3000/handleauth';

exports.authorize_user = function(req, res) {
  api.use({
    client_id: process.env.INSTAGRAM_CLIENT_ID,
    client_secret: process.env.INSTAGRAM_CLIENT_SECRET
  });

  res.redirect(api.get_authorization_url(redirect_uri, { scope: ['basic', 'relationships'] }));
};

exports.handleauth = function(req, res) {
  api.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.log(err);
      res.send("Didn't work" + err);
    } else {
      console.log("Successfully logged in " + result);
      exports.getFollows(req, res, result);
    }
  });
};

exports.index = function(req, res){
  res.render('index');
};

exports.getFollows = function(req, res, result){
  var allFollowers = [];
  var followers = function(err, users, pagination, limit){
   allFollowers = allFollowers.concat(users);
   console.log(users);
   if(pagination && pagination.next) {
    pagination.next(followers); // Will get second page results
   }
   else {
    res.send(allFollowers);
   }
  };

  api.user_followers(result.user.id, followers);
};