const restaurants = require("./user");
const connection = require("./config/connection")


async function main() {
   //create res
 try{ const res1 = await restaurants.create("kaushal","solanki","kaushalsolanki1999@gmail.com","709 summit","jersey city","07306","abcdccc");
 //firstname,lastname,email,address,city, pincode,password
    //console.log('restaurent 1 is created');
    maiarr=res1
    console.log(res1);}
    catch(e){
        console.log(e);
    }
    
    try{
        const db = await connection();
         await db.s.client.close();
      console.log('Done!');}
      catch(e){
          console.log(e);
      }
}


main().catch((error) => {
    console.log(error);
  })