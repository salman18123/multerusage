const Sequelize=require('sequelize')

var db;
if(process.env.DATABASE_URL){
db=new Sequelize(process.env.DATABASE_URL,{
    dialect:'postgres',
    protocol:'postgres',
    logging:false
})
}
else{
db=new Sequelize('multer','multer','multer',{
    host:'localhost',
    dialect:'mysql',
    pool:{
        max:5,
        min:5
    },
   
})
}
const users=db.define('users',{
    userid:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    username:{
        type:Sequelize.STRING,
        unique:true,
        allowNull:false
    },
    password:{
      type:Sequelize.STRING,
      allowNull:false


    }
})
const userimages=db.define('userimages',{
    imageid:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    username:{
     type:Sequelize.STRING,
     
     
    },
    imagename:{
        type:Sequelize.STRING,


    },
    destination:{
        type:Sequelize.STRING
    },
    url:{
     type:Sequelize.STRING,
     allowNull:false   
    }
})
    

db.sync()
.then(()=>{
    console.log("synced successfully")
})

exports=module.exports={
    users,userimages
}