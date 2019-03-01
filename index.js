const express=require('express')
const path=require('path')
const app=express()

const child_process = require('child_process');
const users=require('./db').users
const userimages=require('./db').userimages
const multer = require('multer');
//const download= require('download');
const fs = require('fs');
const folderPath= './public/usersfolder/global';
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/usersfolder/'+req.params.username)
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname  + Date.now()+'.png')
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
app.use('/api',require('./api'))
app.use('/upload/uploads/',upload.single('photo'),(req,res)=>{
    console.log(req.file)
    res.send("Uploaded Successfully")

})
app.use('/uploads/:username',upload.single('photo'),(req,res)=>{
    console.log(req.file)
    if(req.params.username!='global'){
        userimages.create({
            username:req.params.username,
            imagename:req.file.filename,
            destination:req.file.destination
        })
        .then((data)=>{
            console.log(data)

        })
        .catch((err)=>{
            console.log(err)

        })
    }
    res.send("Uploaded Successfully")
 
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

app.use('/downloads/:username',(req,res)=>{
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
    const folderpath= './public/usersfolder/' + req.params.username;
    child_process.execSync(`zip -r archive *`, {
        cwd: folderpath
      });
      res.download(folderPath +'/archive.zip')
    
  
    
    
})