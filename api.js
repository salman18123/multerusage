const route=require('express').Router()
const users=require('./db').users
const userimages=require('./db').userimages
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/images')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+'.jpg')
    }
  })
   
const upload = multer({ storage: storage })
const mkdirp=require('mkdirp')
const usersfolder='./public/usersfolder'



route.post('/newuser',(req,res)=>{


    users.create(req.body)
    .then((data)=>{
        mkdirp(usersfolder+`/`+req.body.username,(err,data)=>{
            console.log("created directory for user")
            

        })
        res.send({user:data,message:'success'})
    })
   .catch((err)=>{
       res.send({error:err})
   })
})
route.post('/existinguser',(req,res)=>{
    
    
        users.find({
            where:{
                username:req.body.username,
                password:req.body.password
            }
        })
        .then((data)=>{
            if(data!=null){
                res.send({user:data,message:'success'})
            }
            
        
        })
       .catch((err)=>{
           res.send({error:err})
       })
    })

route.post('/userdetails',(req,res)=>{
    users.find({
        where:{
            username:req.body.username
        
        }
    })
    .then((data)=>{
        res.send({user:data,message:'success'})
    })
    .catch((err)=>{
        res.send({error:err})
    })

})

route.post('/userimages',(req,res)=>{
    userimages.findAll({
        where:{
            username:req.body.username
        }
    })
    .then((data)=>{
        res.send({images:data,message:'success'})
            

        })
    

})

exports=module.exports=route
