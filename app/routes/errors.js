/**
 * TODO Fix that middleware errorHandling
 * NOT USED ANYMORE
 * @param err
 * @param request
 * @param response
 * @param next
 */
module.exports = function (err, request, response, next) {
    console.log('--- HTTP ERROR HANDLING ---');
    console.log(' ERROR : ', response.statusCode);
    console.log(' DETAIL : ', err.toString());
    switch (response.statusCode) {
        case 404:
            console.log('render 404');
            response.status(404).render("static/404");
            break;
        case 500:
            console.log('render 500');
            response.status(500).render("static/500");
            break;
    }
    next();
};



