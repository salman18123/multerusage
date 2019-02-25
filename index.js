const express=require('express')
const path=require('path')
const app=express()
const child_process = require('child_process');
const multer = require('multer');
const download= require('download');
const fs = require('fs');
const folderPath= './uploads/images';
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/images')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+'.jpg')
    }
  })
   
  var upload = multer({ storage: storage })

const SERVER_PORT=process.env.PORT||8000
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/', express.static(path.join(__dirname, 'public')))
//app.use('/api',require('./api'))
app.listen(SERVER_PORT,()=>{
    console.log("started the base")
})
app.use('/upload',upload.single('photo'),(req,res)=>{
    console.log(req.file)
    res.send({message:'success'})

})
const homedir=require('os').homedir()
console.log(homedir)
app.use('/import',(req,res)=>{
    fs.readdirSync(folderPath).forEach((filename)=>{
        console.log(filename)
        //console.log(homedir)
        fs.copyFile(`./uploads/images/${filename}`,`${homedir}/images/${filename}`,(err)=>{
            console.log(err)
        })
        
    })
    
    
    res.send({message:'success'})

})

app.use('/download',(req,res)=>{
    // fs.readdir('./uploads/images').forEach((filename)=>{
    //     console.log(filename)
    //  res.download(`./uploads/images/${filename}`)

    // })
    // fs.readdir('./uploads/images',(err,data)=>{
    //     data.forEach((filename)=>{
    //         setTimeout(function() {
    //             res.download(`./uploads/images/${filename}`)  
    //         }, 3000);
            
    //     })
    // })
    //const folderPath= './uploads/images';
    child_process.execSync(`zip -r archive *`, {
        cwd: folderPath
      });
      res.download(folderPath +'/archive.zip')
  
    
    
})