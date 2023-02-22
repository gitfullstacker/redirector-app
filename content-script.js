function(request, sender, sendResponse) {
    if (request.linkUrl){

        pathArray = request.linkUrl.split( '/' );
        protocol = pathArray[0];
        host = pathArray[2];
        url = protocol + '//' + host;

        sendResponse({host: host});
    }
};