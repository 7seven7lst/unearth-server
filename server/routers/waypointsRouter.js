var dbHelpers = require('../database/dbHelpers.js');

module.exports = function(app, authController) {

  // Authenticates with a user's token
  // Sends pack an object of waypoints
  app.get('/', authController.tokenAuth, function(request, response) {

    // TODO: Sanitize. Expect starting waypoint id default to 0

    dbHelpers.getUser(request.unearth.token, 'token', function(error, user) {
      if (error) {
        response.status(500).json({error: error});
        return;
      }
      if (!user) {
        response.status(409).json({error: 'This isn\'t an existing user!' });
        return;
      }

      dbHelpers.getWaypoints(user.user_id, function(error, waypoints) {
        if (error) {
          response.status(500).json({error: error});
          return;
        }
        response.status(200).json({waypoints: waypoints});
      });
    });
  });

  // Authenticates with a user's token
  // Posts an array of new waypoints to the database
  app.post('/', authController.tokenAuth, function(request, response) {

    // TODO: Sanititze, Expect {waypoints:[]}

    dbHelpers.getUser(request.unearth.token, 'token', function(error, user) {
      if (error) {
        response.status(500).json({error: error});
        return;
      }
      if(!request.body.waypoints || request.body.waypoints.length < 1 ) {
        response.status(409).json({error: 'There are no waypoints!'});
        return;
      }
      dbHelpers.addWaypoints(user.user_id, request.body.waypoints, function(error) {
        if (error) {
          response.status(500).json({error: error});
          return;
        }
        if (!user) {
          response.status(409).json({error: 'This isn\'t an existing user!'});
          return;
        }
        response.status(200).json({success: 'Waypoints have been posted!'});
      });
    });
  });
};
