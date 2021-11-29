const express=require('express')
const router = express.Router()
var xss = require('xss');
var validator = require("email-validator");
const userdata=require('../data')
const userdata2=userdata.user
const ObjectId = require('mongodb').ObjectId;
const { user } = require('../data');

router.get('/login',async(req,res) =>{
    try{
       let a = "login page"
       res.render('pages/login', { title: 'login page' })

    }catch(e){
        res.status(404).json({message:e})
    }

})

router.post('/login',async(req,res) =>{
    try{
        let a = "logined page"
        const ul = req.body;
        email=xss(ul.email)
        password=xss(ul.password)
        if(!email) throw "enter email"
        if(!password) throw "enter password"
        if(password.length<6)   throw "password should be more then 6 letters"
        if( validator.validate(email)==false){
            throw "enter a valid email address"
        }
        emaillow=email.toLowerCase()
        logininfo= await userdata2.chkuser( emaillow,password )
        //logininfo={_id: ObjectId, firstname: 'kam', lastname: 'kim', email: 'ad1@gmail.com', address: '709 summit', …}
        const id2 = ObjectId(logininfo._id);
        req.session.user = { id:id2,firstName: logininfo.firstname, lastname:logininfo.lastname , email: logininfo.email, 
                            address: logininfo.address,city: logininfo.city,zipcode: logininfo.zipcode} 
        if( logininfo.authenticated==false){
            throw "there is some server issue"
        }
        res.json(a)

    }catch(e){
        res.render('pages/login', { title: 'login page',message:e })
    }

})


router.get('/signup',async(req,res) =>{
    try{
        res.render('pages/signup', { title: 'signup page' })

    }catch(e){
        res.status(404).json({message:e})
    }

})
router.post('/signup',async(req,res)=>{
       try{  
            chk=false
            const us = req.body;
            email=xss(us.email)
            firstname=xss(us.firstname)
            lastname=xss(us.lastname)
            zipcode=xss(us.zipcode)
            address=xss(us.address)
            password=xss(us.password)
            city=xss(us.city)
            //const { firstname, lastname,email,address,city, zipcode,password } = us; 
            pass=password
            if(!firstname) throw "enter first name"
            if(!lastname) throw "Enter last name"
            if(!pass) throw "Enter password"
            if(!email) throw "enter email id"
            if(!address) throw "enter address"
            if(!city) throw "enter city"
            if(!zipcode) throw "enter zipcode"

            var pat1=/(^\d{5}$)|(^\d{5}-\d{4}$)/
            if(pat1.test(zipcode)==false){
            throw "enter a valid zipcode"
            }
            
            if( validator.validate(email)==false){ throw "enter a valid email address"}
            if(us.length<4) throw "username should be 4 characters long"
            if(/\s/g.test(pass)==true) throw "password cannot have empty space"
            if(pass.length<6) throw "Password should have atleast 6 characters"

            signupinfo= await userdata2.create( firstname, lastname,email,address,city, zipcode,password )

            if(signupinfo==false){
                throw "user has not created backend issue"
            }else{res.render('pages/login', { title: 'login page' })}

       }
        catch(e){
            res.render('pages/signup', { title: 'signup page',message:e, user:req.body })
        }
})

router.get('/profile',async(req,res) =>{
    try{
       let a = "profile"
        const user=req.session.user
       
        res.render('pages/profile', user);

    }catch(e){
        res.status(404).json({message:e})
    }
})

router.post('/profile',async(req,res) =>{
    try{
       let a = "profile"
        const user=req.session.user
       
        res.render('pages/updateprofile', user);

    }catch(e){
        res.status(404).json({message:e})
    }
})

router.post('/profile/:id',async(req,res) =>{
    try{
        const id = req.params.id;
        const us = req.body;
        id2=xss(id)
        firstname=xss(us.firstname)
        lastname=xss(us.lastname)
        zipcode=xss(us.zipcode)
        address=xss(us.address)
        city=xss(us.city)
        if(!id2) throw "The id is not valid"
        if(!firstname) throw "enter first name"
        if(!lastname) throw "Enter last name"
        if(!address) throw "enter address"
        if(!city) throw "enter city"
        if(!zipcode) throw "enter zipcode"
        var pat1=/(^\d{5}$)|(^\d{5}-\d{4}$)/
        if(pat1.test(zipcode)==false) throw "enter a valid zipcode"
        proinfo= await userdata2.userupdate( id2,firstname, lastname,address,city, zipcode)
        req.session.user = { id:id2,firstName: proinfo.firstname, lastname:proinfo.lastname , email: proinfo.email, 
            address: proinfo.address,city: proinfo.city,zipcode: proinfo.zipcode} 
        req.method = 'GET'    
        res.redirect('/users/profile');
    }catch(e){
        res.status(404).json({message:e})
    }
})

router.get('/test',async(req,res) =>{
    try{
      res.json("test page")

    }catch(e){
        res.status(404).json({message:e})
    }
})


module.exports = router;