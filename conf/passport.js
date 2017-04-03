'use strict';

module.exports = {
    serializeStrategy : function(user, done) {
        user = {
            username: user.username,
            email: user.email,
            _id: user._id,
            status: user.status,
            games: user.games,
            socketId: user.socketId,
            created: user.created
        };
        done(null, user);
    }
};