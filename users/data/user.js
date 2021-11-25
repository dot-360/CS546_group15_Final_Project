
const mongoCollections = require('./config/collection');
const bcrypt = require('bcrypt');
const ObjectId = require('mongodb').ObjectId
const saltRounds = 10;
const user= mongoCollections.user;
module.exports={

    async create(firstname, lastname,email,address,city, zipcode,password){

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

    async getAllUsers(){
        const mongoColl = await user();
        const insertInfo = await mongoColl.find({}).toArray();
        return insertInfo;
    },
    async getById(id){
        if (!id){
            throw "You must provide an id ";
        }
        const mongoColl = await user();
        const insertInfo = await mongoColl.findOne({ _id: ObjectId(id) });
        if (insertInfo === null){
            throw "No user with that id";
        }
        return insertInfo;
    },
    async userrename(id,firstname,lastname){
        if(!id|!firstname|!lastname){
            throw "enter valid id and name"
        }
        if(!(typeof firstname==='string')|!(typeof lastname ==='string')){
            "enter proper firstname and lastname"
        }
        
        const id2 = ObjectId(id);
        const mongoColl=await user();
        const insertInfo = await mongoColl.findOne({_id:id2})
        if(insertInfo==null){
            throw "the id does not exist"
        }
        const ren={
            firstname: firstname,
            lastname: lastname
        }

        const upinfo= await mongoColl.updateOne(
            {_id:id2},
            {$set:ren}

        );
        if(upinfo.modifiedCount===0){
            throw `could not modified the ${id2} please enter the proper id `
        }
    },
    async removeUser(id){
        if (!id) {
            throw "You must provide an id to search for";
        }
        const id2 = ObjectId(id);
        const mongoColl= await user();
        const delInfo = await mongoColl.removeOne({ _id: id2 });

        if (delInfo.deletedCount == 0) {
        throw `Could not delete user with id of ${id}`;
        }
    },

    async userlocchange(id,naddress,ncity,nzipcode){
        if(!id){
            throw "id should be not empty"
        }
        if(!naddress|!ncity | nzipcode){
            throw "field cannot be empty"
        }
        var pat1=/(^\d{5}$)|(^\d{5}-\d{4}$)/
        if(pat1.test(nzipcode)==false){
            throw "enter a valid zipcode"
        }

        const id2 = ObjectId(id);
        const mongoColl=await user();
        const insertInfo = await mongoColl.findOne({_id:id2})
        if(insertInfo==null){
            throw "the id does not exist"
        }
        const ren={
            address: naddress,
            city: ncity,
            zipcode: nzipcode
        }

        const upinfo= await mongoColl.updateOne(
            {_id:id2},
            {$set:ren}

        );
        if(upinfo.modifiedCount===0){
            throw `could not modified the ${id2} please enter the proper id `
        }

    }


}


