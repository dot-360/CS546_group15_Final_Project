
const mongoCollections = require('./config/collection');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const user= mongoCollections.user;
module.exports={

    async create(firstname,lastname,email,address,city, zipcode,password){

        if(!(firstname)|(!(lastname))|!(email)|(!(address))|(!(city))|(!(zipcode))|!(password)){
            throw 'there should be a valid input of the values'
          }
        if(typeof firstname ==='boolean'|typeof lastname ==='boolean'|typeof email ==='boolean'|typeof address ==='boolean'|typeof city ==='boolean'|typeof zipcode ==='boolean'|typeof password ==='boolean'){
              throw "input cannot be a boolean"
          }
        if(typeof firstname === 'string'&typeof lastname === 'string'&typeof email === 'string'&typeof address === 'string'&typeof city === 'string'&typeof zipcode === 'string'&typeof password === 'string'){
              if(firstname.trim()==""|lastname.trim()==""|email.trim()==""|address.trim()==""|city.trim()==""|zipcode.trim()==""|password.trim()==""){
                  throw " it should not be an empty string"
              }
        }else{throw "firstname, lastname, email, website, priceRange should be a string"}
          
        var validator = require("email-validator");
        if( validator.validate(email)==false){
            throw "enter a valid email address"
        }
        var pat1=/(^\d{5}$)|(^\d{5}-\d{4}$)/
        if(pat1.test(zipcode)==false){
            throw "enter a valid zipcode"
        }
        if(password.length<6) throw "Password should have atleast 6 characters"
        
        const hash = await bcrypt.hash(password, saltRounds);
        const hashpassword=hash



        const mongoColl = await user()

        let newres={
            firstname: firstname,
            lastname: lastname,
            email: email,
            address:address,
            city:city,
            zipcode:zipcode,
            password:hashpassword,
            rating:{},
            comment:{}
        }
        const insertInfo = await mongoColl.insertOne(newres)
        if(insertInfo.length=0){
            throw "There has been some server issue"
        }
    },




    async update(firstname,lastname,email,address,city, zipcode,password){

        























    }

}


