var api = require('instagram-node').instagram();
var _ = require('underscore');

var redirect_uri = 'http://localhost:3000/handleauth';

exports.index = function(req, res){
  res.render('index');
};

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
      exports.getFollowData(req, res, result);
    }
  });
};

exports.getFollowData = function(req, res, result){
  var allFollowers = [];
  var allFollowing = [];

  var followersHandler = function(err, users, pagination){
    allFollowers = allFollowers.concat(users);
    if(pagination && pagination.next) {
      pagination.next(followersHandler);
    }
    else {
      api.user_follows(result.user.id, followingHandler);
    }
  };

  var followingHandler = function(err, users, pagination){
    allFollowing = allFollowing.concat(users);
    if(pagination && pagination.next) {
      pagination.next(followingHandler);
    }
    else {
      //Refactor out into separate stats route
      var followingDiff = _.difference(_.pluck(allFollowing, 'username'), _.pluck(allFollowers, 'username'))
      var followerDiff = _.difference(_.pluck(allFollowers, 'username'), _.pluck(allFollowing, 'username'))

      var hydratedFollowingDiff = _.filter(allFollowing, function(user){ return _.contains(followingDiff, user.username); });
      var hydratedFollowerDiff = _.filter(allFollowers, function(user){ return _.contains(followerDiff, user.username); });

      console.log(JSON.stringify(hydratedFollowerDiff));
       exports.set_relationship('35276099', 'follow');
      res.render('index', {noFollow: hydratedFollowingDiff, noFollowing: hydratedFollowerDiff});
    }
  };

  api.user_followers(result.user.id, followersHandler);
};

exports.set_relationship = function(id, new_relation){
  api.set_user_relationship(id, new_relation, function(err, result, limit) {
    console.log(result);
    //res.send(result);
  });
}