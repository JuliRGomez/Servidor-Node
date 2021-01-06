let http = require("http");
let fs = require("fs");

function read(path,response){
    fs.readFile(path,(error,content)=>{
        !error?(response.write(content),
                response.end()):(
        response.write("<h1>404 </h1>"),
        response.end());
    })
}

http.createServer((request,response)=>{
    response.setHeader("Content-Type","text/html;charset=utf-8");
    switch (request.url) {
        case "/":
            read("./index.html",response)
            break;
        case "/nosotros":
            read("./about.html",response)
            break;
        case "/proyectos":
            read("./projects.html",response)
            break;
        case "/contacto":
            read("./contact.html",response)
            break;
        case "/favicon.ico":
            response.setHeader("Content-Type","image/x-icon");
            read("./favicon.ico",response)
            break;
        default:
            read("./404.html",response)
            break;
    }

}).listen(8080);//los servideros web usan regularmente el 8080 o 8000