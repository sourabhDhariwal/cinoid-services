module.exports = function () {
  return function (req, res, next) {
  	console.log(( req.headers['content-type'].includes('multipart/form-data')))
		if( (typeof(req.headers['content-type'])!=undefined && 
					req.headers['content-type']=='application/vnd.cinoid-dashboard') || ( req.headers['content-type'].includes('multipart/form-data'))){
			if(req.method!='GET' && req.method!='DELETE'){
				 let body =(req.body).toString();
    				req.body =body;
    				next();
			}else{
			next();	
			}
	}else{
		console.log(req.headers['content-type'])	
	 next(createError(400));	
	} 
  }
}