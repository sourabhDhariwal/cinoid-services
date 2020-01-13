let dbObj = require('../DbConnection.js')({});


let reSearchPaper=()=>{
	return {
		insert:(tableName,insertParams,callback)=>{
			let query = dbObj(tableName)
			.insert(insertParams)
			.returning('id');
			// console.log("----------",query.toString());
			query.then((row)=>{
				// console.log("----------",row);
				callback(null,row)
			}).catch((error)=>{
				console.log(error)
			})

		}

	}
}

module.exports =reSearchPaper;