let contactDB = require('../db_model/ResearchPaper.js')({});
const paginate = require('jw-paginate');	
module.exports = function(socket) {
	/***
	* getFilterData function used to get filter value 
	***/
	socket.on('getFilterData',()=>{
		getConfig((err,resp)=>{

		})
	})

	/***
	* getResearchPaperList function used to get list of research paper 
	***/
	socket.on('getResearchPaperList',(filterData)=>{
 			console.log(filterData);
 			let tableName='research_paper as t1';
 				what=['t1.*','t2.price'];
 			contactDB.select(tableName,what,(err,resp)=>{
 				if(resp && resp.length>0){
 					 const items = resp;
					    if(items.length>0){
					    	 // get page from query params or default to first page
							    const page = parseInt(filterData.page) || 1;
							    // get pager object for specified page
							     const pageSize = 12
							     const maxPages  =5
							   const pager = paginate(items.length, page,pageSize,maxPages);
							    // get page of items from items array
							    const pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);
							    // return pager object and current page of items
							    // return res.send({ pager, pageOfItems });
							    console.log( pager)
							    socket.emit('responseResearchList',{
			 						status:true,
			 						listView:{ pager, pageOfItems,pager},
			 						dispMessage:"get research paper list succssfully."
			 					})
					    }else{
					    	socket.emit('responseResearchList',{
			 						status:true,
			 						listView:{ pager, pageOfItems },
			 						dispMessage:"get research paper list succssfully."
			 					})
					    }
 				}else{
	 					socket.emit('responseResearchList',{
	 						status:false,
	 						listView:[],
	 						dispMessage:"No data available."
	 					})
 				}
 			}) 	
	})

}

let getConfig =(callback)=>{
	let tableName='config',
			what=['*'],
			condition ={
				is_active:1,
				is_deleted:0
			}
		contactDB.getConfig(tableName,what,condition,(err,resp)=>{
			if(resp && resp.length>0){
				console.log("resp get Config::::",resp)
				callback(null,resp)
			}else{
				callback(err,[])
			}
		})
}