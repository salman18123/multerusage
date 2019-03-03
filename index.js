const express=require('express')
const path=require('path')
const app=express()

const child_process = require('child_process');
const users=require('./db').users
const userimages=require('./db').userimages
const multer = require('multer');
const mkdirp=require('mkdirp')
const cloudinary = require('cloudinary').v2
cloudinary.config({
  cloud_name: 'dyy09oknk',
  api_key: '215971343167646',
  api_secret: 'x71a4aoldIafMwTzx79bKNEINBM'
})
//const download= require('download');
const fs = require('fs');
const folderPath= './public/usersfolder/globalising';
var storage = multer.diskStorage({
    destination: function (req, file, cb) { 
        if(req.params.username=='globalise'){
            if(!fs.existsSync('./public/usersfolder/globalise')){
                mkdirp('./public/usersfolder/globalise',(err,data)=>{
                    console.log("created directory for user")  
                })

            }

        }
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
    if(req.params.username!='globalising'){
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

    const uniqueFilename = new Date().toISOString() 
    const path = req.file.path
    cloudinary.uploader.upload(
        path,
        { public_id: `${req.params.username}/${uniqueFilename}`, tags: `${req.params.username}` }, // directory and tags are optional
        function(err, image) {
          if (err) return res.send(err)
          console.log('file uploaded to Cloudinary')
          // remove file from server
          const fs = require('fs')
          fs.unlinkSync(path)
          // return image details
          console.log(image)
          userimages.create({
            username:req.params.username,
            imagename:req.file.filename,
            destination:req.file.destination,
            url:image.url
        })
        .then((data)=>{
            console.log(data)

        })
        .catch((err)=>{
            console.log(err)

        })
          res.send("Uploaded Successfully")
        }
      )
    
    //res.send("Uploaded Successfully")
 
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
    console.log(folderpath)
    child_process.execSync(`zip -r archive *`, {
        cwd: folderpath
      });
      res.download(folderpath +'/archive.zip')
    
  
    
    
})