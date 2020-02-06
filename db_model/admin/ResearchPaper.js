let dbObj = require('../../DbConnection')({});

let adminResearchPaper=()=>{
	return {
			select:(reqParam,callback)=>{
				let query =dbObj.select([
						't1.*',
						't2.price',
						't4.country_name',
						't4.country_code',
						't3.name as publisher_name',
						// 't15.category_name',
						't6.sub_category_name'

						])
						.from('research_paper as t1')
						.leftJoin('research_paper_price_list as t2','t1.paper_id','t2.reseach_paper_id')
						.innerJoin('publisher as t3','t1.publisher_id','t3.publisher_id')
						.innerJoin('countries as t4','t1.country_id','t4.country_id')
						// .innerJoin('categories as t5','t5.category_id','t1.paper_id')
						.innerJoin('sub_category as t6','t6.sub_category_id','t1.sub_category_id')
						.innerJoin('region as t7','t7.region_id','t1.region_id')
						query.where({
							't1.is_active':1,
							't1.is_deleted':0,
						})
						if(typeof(reqParam.publisher_id)!=undefined && reqParam.publisher_id!=""){ //do
							query.where({'t1.publisher_id':reqParam.publisher_id})
						 }
						 console.log("-------",query.toString())
						query.then((rows)=>{
							callback(null,rows)
					}).catch((err)=>{
						console.log("Get Research Paper list::::",err)
				})
			},
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
			});
		},
		selectIDs:(tableName,conditions,callback)=>{
			let query = dbObj.select(['*'])
					.from(tableName);
					if(conditions && conditions.whereLike){
						query.where(conditions.whereLike.columnName, 'like', '%'+conditions.whereLike.columnValue+'%')	
					}
					query.then((row)=>{
						callback(null,row)
					}).catch((error)=>{
						console.log(error)
					});
			}
		}
	}

	module.exports =adminResearchPaper;