'use strict';

/**
 * Handle routing errors
 * @param err
 * @param request
 * @param response
 * @param next
 */
module.exports = function (err, request, response, next) {
    console.log('--- HTTP ERROR HANDLING ---');
    console.log(' ERROR : ', response.statusCode);
    console.log(' DETAIL : ', err.toString());

    response.statusCode = response.statusCode || 404;
    response.status(response.statusCode).render("static/" + response.statusCode);
    next();
};



