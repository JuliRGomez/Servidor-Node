let http = require("http");
let fs = require("fs");
let path= require("path"); 
let mime = require("mime");
const reciveData=["firstName","lastName","Email","Password"];


http.createServer((request,response)=>{
    if(request.method === "GET"){
        switch (request.url) {
            case "/":
                read("/index.html",response)
                break;
            case "/nosotros":
                read("/about.html",response)
                break;
            case "/proyectos":
                read("/projects.html",response)
                break;
            case "/contacto":
                read("/contact.html",response)
                break;
            case "/favicon.ico":
                response.setHeader("Content-Type","image/x-icon");
                read("./favicon.ico",response)
                break;
            default:
                read(request.url,response)
                break;
        }
    }
    else if(request.method === "POST"){
        
        let data = '';
            request.on('data', chunk => {
            data += chunk;
        });
        request.on('end', () => {
            let userobj={firstName:"",lastName:"",Email:"",Password:""};
            reciveData.forEach(element=>{
            let pos=data.search(element);
            let pos2=data.indexOf("-",pos);
            userobj[element]=data.slice(pos+element.length+1,pos2).trim();
        });
            console.log(userobj);
            dataSave("db_usuarios.json",userobj,response)
        });

        request.on('error', error => {
            console.log(error);
        })
    }
    

}).listen(8080);//los servideros web usan regularmente el 8080 o 8000

const dataSave =(db,user,response)=>{
    let previousData;
    fs.readFile(db,(error,content)=>{
        if(!error){
            previousData=JSON.parse(content);
            previousData.push(user);
            fs.writeFile(db,JSON.stringify(previousData), (error) => {
                if(error){
                    console.log(error);
                }
                else{
                response.setHeader("location","/");//redireccion hacia raiz
                response.statusCode=302;//este debe ser el codigo de redirecion
               
                }
            });
            }
    })
}

function read(url,response){
    const urlF=__dirname+url;
    fs.readFile(urlF,(error,content)=>{
        !error?(
                response.setHeader("Content-Type", mime.getType(urlF)),
                response.write(content),
                response.end()):(
                response.statusCode=404,
                response.write("<h1>404 </h1>"),
                    response.end());
    })
}

// const setContentType = (address,response)=>{
//     const ext=path.extname(address)
//     switch (ext) {
//         case ".css":
//             response.setHeader("Content-Type","text/css;charset=utf-8");
//             break;
//         case ".html":
//             response.setHeader("Content-Type","text/html;charset=utf-8");
//             break;
//         default:
//             break;
//     }
// }