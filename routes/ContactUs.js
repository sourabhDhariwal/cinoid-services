let contactDB = require('../db_model/Contact.js')({});

module.exports = function(socket) {
socket.on('addContactUsForm',(data)=>{
	console.log(data);
	let insertParam ={
			first_name:data.first_name,
			last_name:data.last_name,
			email:data.email,
			subject:data.subject,
			message:data.message
	};
	contactDB.insert('contact_us',insertParam,(err,resp)=>{
		if(resp && resp.length>0){
			socket.emit('responseContactUs',{
				status:true,
				dispMessage:'Request Submitted Successfully.'
			})
		}else{
			socket.emit('responseContactUs',{
				status:false,
				dispMessage:'Failed to submit request.'
			})
		}

	})
})
};