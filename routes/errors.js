function errorHandling(request, response, next) {

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

module.exports = errorHandling;

