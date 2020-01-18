
module.exports=()=>{

const options = {
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'cinoid'
    }
};	
 return  knex = require('knex')(options);
}

