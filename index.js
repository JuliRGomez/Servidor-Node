let http = require("http");
let fs = require("fs");
let path= require("path"); 
let mime = require("mime");


function read(url,response){
    const urlF=__dirname+url;
    fs.readFile(urlF,(error,content)=>{
        !error?(setContentType(urlF,response),
                response.write(content),
                response.end()):(
        response.write("<h1>404 </h1>"),
        response.end());
    })
}

http.createServer((request,response)=>{
    if(request.method === "GET"){
        switch (request.url) {
            case "/":
                read("/index.html",response)
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
                response.statusCode=404;
                read("./404.html",response)
                break;
        }
    }
    else if(request.method === "POST"){
        
        let previousData="";
        let data = '';
        
        request.on('data', chunk => {
             //console.log("entrando");
            //console.log(chunk);
            data += chunk;
        });
        request.on('end', () => {
            //data=decodeURIComponent(escape(data))
        
          narray=data.split(" ");
          console.log(narray[0]);     
            let dataSplit=data.split("&");
            let completeString=`Nombre: ${dataSplit[0]}
Apellidos: ${dataSplit[1]}
Email: ${dataSplit[2]}
Contraseña: ${dataSplit[3]}`
            //console.log(completeString);
            //console.log(data.toString());
            //console.log("Fin del stream")
            fs.readFile("db_usuarios.txt",(error,content)=>{
                if(!error){
                    previousData=content;
                }
            })
            fs.writeFile("db_usuarios.txt",previousData+completeString, (error) => {
                if(error){
                    console.log(error);
                }
                else{
                   // response.setHeader("Content-Type","text/html");
                  //  response.write("<h1>Datos guardado</h1>")
                  response.setHeader("location","/");//redireccion hacia raiz
                  response.statusCode=302;//este debe ser el codigo de redirecion
                  response.end();
                }
            });
        });

        request.on('error', error => {
            console.log(error);
        })
    }
    

}).listen(8080);//los servideros web usan regularmente el 8080 o 8000

const setContentType = (address,response)=>{
    const ext=path.extname(address)
    switch (ext) {
        case ".css":
            response.setHeader("Content-Type","text/css;charset=utf-8");
            break;
        case ".html":
            response.setHeader("Content-Type","text/html;charset=utf-8");
            break;
        default:
            break;
    }
}