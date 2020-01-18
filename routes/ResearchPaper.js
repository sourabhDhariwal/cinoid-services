let contactDB = require('../db_model/ReseachPaper.js')({});

module.exports = function(socket) {

	socket.on('getResearchPaperList',(filterData)=>{
 			console.log(filterData);
 			let tableName='research_paper as t1';
 				what=['t1.*','t2.price'];
 			contactDB.select(tableName,filterData,what,(err,resp)=>{
 				if(resp && resp.length>0){
 						socket.emit('responseResearchList',{
 						status:true,
 						listView:resp,
 						dispMessage:"get research paper list succssfully."
 					})
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