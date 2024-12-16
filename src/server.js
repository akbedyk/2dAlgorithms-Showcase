const http = require("http");
const fs = require("fs");
const port = 1995
   
http.createServer(function(request, response){
    let filePath = request.url.substring(1);
    if(filePath == "") filePath = "index.html";
    fs.readFile(filePath, function(error, data){
        if(error){
            response.statusCode = 404;
            response.end("request.url: " + request.url
                + "\nResourse not found: " + filePath);
        }   
        else{
            if(filePath.endsWith(".js")) response.setHeader("Content-Type", "text/javascript");
            response.end(data);
        }
    });
}).listen(port, function(){
    console.log("Server started at port", port);
});