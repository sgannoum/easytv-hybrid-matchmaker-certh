/**
 * A HTTP POST handler for route /match
 */
var hbmmImpl =  require('../lib/HybridMatchMakerImpl.js').hbmmImpl
var rp = require('request-promise')
var urls = require('./URLs.js')
var msg = require('./Messages.js')


const ContentPersonalization = () => {
	
  const personalize_content = (req, res) => {	
	  
	  
			// Check for user Id
			if (!req.body.user_id) { 
				console.log('A request with missing user_id')
				return res.status(500).json({ code: msg.missing_user_id.msg_code, 
										      msg: msg.missing_user_id.msg_text });
			}
			
			// Check for user profile
			if (!req.body.user_profile) { 
				console.log('A request with missing user_profile')
				return res.status(500).json({ code: msg.missing_user_profile.msg_code, 
											  msg: msg.missing_user_profile.msg_text });
			}
			
			// Check for user profile
			if (!req.body.user_context) { 
				console.log('A request with missing user_context')
				return res.status(500).json({ code: msg.missing_user_context.msg_code, 
					  						  msg: msg.missing_user_context.msg_text });
			}
			
			// Check for user profile
			if (!req.body.user_content) { 
				console.log('A request with missing user_content')
				return res.status(500).json({ code: msg.missing_user_content.msg_code, 
					  						  msg: msg.missing_user_content.msg_text });
			}
			
			console.log('user['+user_id+']: ',' personalize content')
	  
	  
			var stmm_profile;
			var rbmm_profile;
			const user_id = req.body.user_id
			const user_profile = req.body.user_profile
			const user_context = req.body.user_context
			const user_content = req.body.user_content
						 
			var stmm_options = {
				    method: 'POST',
				    uri: urls.STMM_PERSONALIZE_CONTENT,
				    body: user_profile,
				    json: true // Automatically stringifies the body to JSON
			 };
			
			//chained request			 
			rp(stmm_options)
			  .then( function (response) {
					
					if(response == undefined) {
						res.status(500).json({ msg: 'Internal server error' });
						return
					}

					console.log('user['+user_id+']: ',' STMM profile', response)
					
					stmm_profile  = response;
					stmm_options.uri = urls.RBMM_PERSONALIZE_CONTENT
					return rp(stmm_options)
					
			  })
			  .then( function (response) {
					
					if(response == undefined) {
						res.status(500).json({ msg: 'Internal server error' });
						return
					}
					
					console.log('user['+user_id+']: ',' RBMM profile', response)

					rbmm_profile  = response;
					var  hybrid_user_profile = hbmmImpl.personalize_context(user_id, user_profile, user_content, stmm_profile, rbmm_profile)
					return res.status(200).json({user_id: user_id, user_profile: hybrid_user_profile});
			  })
			  .catch(function (err) { 
				  console.log('user['+user_id+']: ',err)
				  res.status(500).json({ msg: 'Internal server error' });
			  }) 
	};
	
	/**
	 * A HTTP GET handler for route /match
	 */
  const get_information =  (req, res) =>  {
	  
    try {
        return res.status(200).json({message: "To personalize context do one of the following: " +
    		"								HTTP POST /personalize/context \r\n" +
    		"								Content-Type: application/json \r\n" +
    		"								\r\n" +
    		"								\r\n" +
    		"								{" +
    		"									\"user_id\": Number," +
    		"									\"user_profile\": user profile json," +
    		"									\"user_content\": user content content," +
    		"								}"});
      } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error' });
      }
	
	};

	
  return {
	  personalize_content,
	  get_information
	  };
};

module.exports = ContentPersonalization;
