let dbObj = require('../DbConnection')({});


let reSearchPaper=()=>{
	return {
		select:(tableName,what,callback)=>{
			let query =dbObj.select(what)
						.from(tableName)
						query.where({
							't1.is_active':1,
							't1.is_deleted':0
						})
			// if(condition.limit && condition.limit){
			// 	query.where({'limit':condition.limit,'offset':condition.offset})
			// }
			// if(condition.filterArray.length>0){
				// query.where({'limit':condition.limit,'offset':condition.offset})
			// }
			query.leftJoin('research_paper_price_list as t2', 't1.paper_id', '=', 't2.reseach_paper_id')
				query.then((rows)=>{
				callback(null,rows)
			}).catch((err)=>{
				console.log("Get Research Paper list::::",err)
			})
		},
		getConfig:(tableName,what,condition,callback)=>{
					let query =dbObj.select(what)
						.from(tableName)
						query.where(condition)
				query.then((rows)=>{
				callback(null,rows)
			}).catch((err)=>{
				console.log("getConfig:::",err)
			})
		}

	}
}

module.exports =reSearchPaper;