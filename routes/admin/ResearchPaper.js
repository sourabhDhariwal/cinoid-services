const routes = require('express').Router();
let contactDB = require('../../db_model/admin/ResearchPaper.js')({});
var multer = require('multer');
let path = require('path');
let fs = require('fs');
let dist = './uploads';
const csv=require('csvtojson');
var moment = require('moment');

var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		if (!fs.existsSync(dist)) {
			fs.mkdirSync(dist);
		}
		callback(null,dist)
	},
	filename: function(req, file, callback) {
		callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
	}
});


var upload = multer({storage: storage});

function convert(obj) {
  const result = {};
  Object.keys(obj).forEach(function (key) {
    result[key.split(" ").join("_").replace ("/", "")] = obj[key];
  });

  return result;
}


let fileUploadFunctionv = (req, res,next)=>{
	console.log("=================",req.file)
	if(req.file !="" && req.file!=undefined){
		let csvFilePath = req.file.destination +'/'+ req.file.filename
		csv()
		.fromFile(csvFilePath)
		.then((jsonObj)=>{
		    console.log("===jsonObj===",jsonObj.length);
		    if(jsonObj.length>0){
	    	    var result = jsonObj.map(function (o) {
				    return convert(o);
				});

	   			console.log("===Result======",result.length);
	   			insertFileData(result,(err,resp)=>{
	   				if(resp){
	   					res.status(200).json({ 
							status:true,
							dispMessage:"upload successfully."
						});
	   				}else{
   						res.status(200).json({ 
							status:false,
							dispMessage:"Error in upload."
						});
	   				}
	   			})
			    
		    }else{
		    	 res.status(200).json({ 
					status:false,
					dispMessage:"No data available for insert."
				 });
		    }
		})
	}else{
		res.status(404).json({ 
				status:false,
				dispMessage:"Bed Request."
			 });
	}
};

let insertFileData =(insertData,callback)=>{
	let publisherName = insertData[0]['PUBLISHER'].toLowerCase();
	getPublisherId(publisherName,(err,publisherId)=>{
		if(publisherId){
			var rCount = 0;
			
			let	insertPaperData = ()=>{
				console.log(publisherId,"insertData=============",rCount)
					let insertObj =insertData[rCount];
					insertObj.publisher_id= publisherId;
					 let countryName =insertObj['COUNTRIES'];
					 let regionName =insertObj['REGIONS'];
				 	getContyAndRegionId('region',regionName,'name','region_id',"",(errRId,respRId)=>{
				 		if(respRId){
				 			insertObj.region_id= respRId;	
		 				 	getContyAndRegionId('countries',countryName,'country_name','country_id',respRId,(errCId,respCId)=>{
						 		if(respRId){
						 			insertObj.country_id= respCId;
				 					let subCatName =insertObj['SUB-CATEGORY'];
				 					console.log("_----------------respSubCId///////",subCatName)
				 					getContyAndRegionId('sub_category',subCatName,'sub_category_name','sub_category_id',"",(errSubCId,respSubCId)=>{
				 						if(respSubCId){
				 							console.log("_----------------respSubCId///////",respSubCId)
				 							insertObj.sub_category_id= respSubCId;

						 					insertResearchPaper(insertObj,(insErr,inrtResp)=>{
						 						if(inrtResp){
						 							console.log("_----------------iNSet successfully///////")
													let catName =insertObj['CATEGORY'];
													getCategoryID(inrtResp,catName,(catErr,catId)=>{
														if(catId){
															if(rCount !=(insertData.length-1)){
																rCount =rCount+1;
																insertPaperData();
															}else{
																callback(null,true)
															}
														}
													})
						 						}
						 					})
				 						}
				 					})
				 				
						 		}
				 			})

				 		}
				 	})

			};
			insertPaperData();

		}
	})
}

let insertResearchPaper =(insertObj,callback)=>{
	if(insertObj){
		console.log("insertObj['PUBLICATION_DATE']===",moment(insertObj['PUBLICATION_DATE']).format('YYYY-MM-DD'))
		let tableName ="research_paper",
		insertParam ={
			publisher_id:insertObj['publisher_id'],
			publication_name:insertObj['PUBLICATION_NAMETITLE'],
			publication_type:insertObj['PUBLICATION_TYPE'],
			publication_date:moment(insertObj['PUBLICATION_DATE'],'DD-MM-YYYY').format('YYYY-MM-DD'),
			country_id:insertObj['country_id'],
			region_id: insertObj['region_id'],
			description:(insertObj['DESCRIPTION_ABSTRACT']!=""?insertObj['DESCRIPTION_ABSTRACT']:"N/A"),
			companies_covered:(insertObj['COMPANIES_COVERED']!=""?insertObj['COMPANIES_COVERED']:"N/A"),
			pages:(insertObj['PAGES']!=""?insertObj['PAGES']:"N/A"),
			enterprise_license:(insertObj['ENTERPRISE_LICENSE']!=""?insertObj['ENTERPRISE_LICENSE']:"N/A"),
			keywords:(insertObj['KEYWORDS']!=""?insertObj['KEYWORDS']:"N/A"),
			sub_category_id:insertObj['sub_category_id']
		};	
		contactDB.insert(tableName,insertParam,(inErr,inResp)=>{
			if(inResp){
				callback(null,inResp)
			}
		})
	}

}

let getCategoryID =(paper_id ,catName,callback)=>{
	let tableName = "categories";
	let category_name =catName.split(',');
	console.log("category_name --getCategoryID---",category_name)
			for(let i=0;i<category_name.length;i++){
					var condition ={
				whereLike:{
					columnValue:category_name[i],
					columnName:"category_name"
				}
			} 
			   contactDB.selectIDs(tableName,condition,(err,resp)=>{
			   	if(resp&& resp.length>0){
			   		let insertParam2 ={
			   			category_id:resp[0].category_id,
			   			paper_id:paper_id
			   		}
			   		contactDB.insert('category_research_paper_mapping',insertParam2,(err,insertId)=>{
			   			if(insertId){
			   				if(i==(category_name.length-1)){
			   					callback(null,true)
			   				}
			   			}
			   		})
			   	}else{
			   		let insertParam ={
			   			category_name:category_name[i]
			   		}
			   		contactDB.insert(tableName,insertParam,(err,insertId)=>{
			   			if(insertId){
			   				let insertParam1 ={
						   			category_id:insertId,
						   			paper_id:paper_id
						   		}
						   		contactDB.insert('category_research_paper_mapping',insertParam1,(err,insertId)=>{
						   			if(insertId){
						   				if(i==(category_name.length-1)){
						   					callback(null,true)
						   				}
						   			}
						   		})
			   				}
			   			})
			   		}

			   })
			}	
		}


let getContyAndRegionId =(tableName,name,clmName,idName,rId,callback)=>{
	let	condition ={
			whereLike:{
				columnValue:name,
				columnName:clmName
			}
		} 
   contactDB.selectIDs(tableName,condition,(err,resp)=>{
   	if(resp&& resp.length>0){
   		callback(null,resp[0][idName])
   	}else{
   		let insertParam ={
   			[clmName]:name
   		}
   		if(rId!=""){
   			insertParam.region_id =rId;
   		}
   		contactDB.insert(tableName,insertParam,(err,insertId)=>{
   			if(insertId){
   				callback(null,insertId)
   			}
   		})
   	}

   })
}

let getPublisherId =(publisherName,callback)=>{
	var tableName = "publisher";
		condition ={
			whereLike:{
				columnValue:publisherName,
				columnName:"name"
			}
		} 
   contactDB.selectIDs(tableName,condition,(err,resp)=>{
   	if(resp&& resp.length>0){
   		callback(null,resp[0].publisher_id)
   	}else{
   		let insertParam ={
   			name:publisherName
   		}
   		contactDB.insert(tableName,insertParam,(err,insertId)=>{
   			if(insertId){
   				callback(null,insertId)
   			}
   		})
   	}

   })
}

let GestResearchPaperList =(req,res,next)=>{
console.log("list Body---",req.body);
	let body =req.body;
	if(body!=""){
		let reqParam = JSON.parse(body);
		selectResearchPaper(reqParam,(err,resp)=>{
			if(resp && resp.length>0){
				res.status(200).json({ 
							status:true,
							listView:resp,
							dispMessage:"Fetach research paper list succssfully."
						 });
			}else{
				res.status(200).json({ 
					status:false,
					listView:[],
					dispMessage:"Fetach research paper list succssfully."
				 });
			}
		})
	}else{
		res.status(404).json({ 
				status:false,
				listView:[],	
				dispMessage:"Invalid format of body."
			 });
	}
}

let selectResearchPaper =(reqParam,callback)=>{
	contactDB.select(reqParam,(err,resp)=>{
		callback(err,resp)
	})
}

let DoLogin =(req,res,next)=>{
		res.status(200).json({ 
				status:true,
				user_id:1,
				username:"sourabh",
				dispMessage:"Loggedin succssfully."
			 });

}
routes.post('/file-upload',upload.single('research_paper'),fileUploadFunctionv)

routes.post('/get-list',GestResearchPaperList)

routes.post('/dologin',DoLogin)


module.exports = routes;

