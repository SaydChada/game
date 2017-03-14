module.exports = function (err, request, response, next) {
    console.log('--- HTTP ERROR HANDLING ---');
    console.log(' ERROR : ', request.statusCode);
    console.log(' DETAIL : ', err.toString());
    switch (request.statusCode) {
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
}



