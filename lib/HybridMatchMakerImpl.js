
const STMM_HOST = 'http://' + process.env.STMM_HOST || 'http://localhost';
const RBMM_HOST = 'http://' + process.env.RBMM_HOST || 'http://localhost';

const STMM_PORT = process.env.STMM_PORT || "8077";
const RBMM_PORT = process.env.RBMM_PORT || "8080";

const STMM_URL = STMM_HOST + ":" + STMM_PORT + "/EasyTV_STMM_Restful_WS";
const RBMM_URL = RBMM_HOST + ":" + RBMM_PORT + "/EasyTV_RBMM_Restful_WS";

const STMM_PERSONALIZATION_URL = STMM_URL + "/match";
const RBMM_PERSONALIZATION_URL = RBMM_URL + "/match";
const STMM_CONTENT_ADAPTATION_URL = STMM_URL + "/content";
const RBMM_CONTENT_ADAPTATION_URL = RBMM_URL + "/content";

const STMM_http_request = require('request');
const RBMM_http_request = require('request');
const MPD_http_request = require('request');


// process.env.DB_NAME

class HBMMImpl {
	
	constructor(dimensions, weigths) {
		this._dimensions = dimensions
		this._weigths = weigths
		
		console.log('connect to STMM on url: ' + STMM_URL);
		console.log('connect to RBMM on url: ' + RBMM_URL);
	}
	
	/**
	 * Combine both preferences
	 */
	hybridPreferences (stmmRes, rbmmRes, user_profile) {
		var new_user_profile = JSON.parse(JSON.stringify(user_profile))
		var stmmPrefs = stmmRes.user_preferences.default.preferences
		var rbmmPrefs = rbmmRes.user_preferences.default.preferences	
		var newPrefs = new_user_profile.user_preferences.default.preferences
		
		
		for(var [key, value] of this._dimensions) {
			console.log(key)

			if(key in stmmPrefs && key in rbmmPrefs) {
				//combine both preferences based on these weights
				newPrefs[key] = value.combine(stmmPrefs[key], rbmmPrefs[key], this._weigths)
			}
			else if(key in stmmPrefs) {
				newPrefs[key] = stmmPrefs[key]
			}
			else {
				newPrefs[key] = rbmmPrefs[key]
			}
		}
		
		//add RBMM recommanded preferences
		if("recommanded_preferences" in rbmmRes){
			new_user_profile["recommanded_preferences"] = rbmmRes["recommanded_preferences"]
			
		}
		
		return JSON.stringify(new_user_profile, null, 4);
	}
	
	/**
	 * A method that return a STMM request handler function
	 */
	STMM_RequestHandlerCreator (hbmm_res, responses, user_profile) {
		var instance = this
		return (err, res, body) => {

			var stmm_profile  = body;
			
			if(!("user_preferences" in stmm_profile))
					return 		
			//store the body of the first request
			responses.push(stmm_profile)
			
			//when two responses are obtained...process the results
			if(responses.length == 2) {
				var hybridProfile = instance.hybridPreferences(body, responses[0], user_profile)
				hbmm_res.status(200).json(hybridProfile);
			}
		}
	}
	
	/**
	 * A method that return a RBMM request handler function
	 */
	RBMM_RequestHandlerCreator (hbmm_res, responses, user_profile) {
		var instance = this
		return (err, res, body) => {

			var rbmm_profile  = body;
			
			if(!("user_preferences" in rbmm_profile))
					return 
			
			//store the body of the first request
			responses.push(rbmm_profile)
			
			//when two responses are obtained...process the results
			if(responses.length == 2) {
				var hybridProfile = instance.hybridPreferences(responses[0], body, user_profile)
				hbmm_res.status(200).json(hybridProfile);
			}
		}
	}
	
	
	/**
	 * Handle MPD file content
	 */
	MPD_RequestHandlerCreator (hbmm_req, hbmm_res, user_profile) {
		var instance = this
		return (err, res, body) => {		
			
			//parse the MPD file content
			var contentAccessibilityServices = {};
			var parser = require('xml2json');
			var json = parser.toJson(body)
			var mpdObj = JSON.parse(json);
			var periods = mpdObj['MPD']['Period'];

			//convert to array
			if(!Array.isArray(periods)) 
					periods = [periods]

			//check for audio and language subtitles
			for(var i = 0; i < periods.length; i++) {
				var period = periods[i]
				var periodId = period["duration"] + ' ' + period["start"]
				
				if(!contentServices[periodId])
					contentServices[periodId] = {'audioLanguage': [], 
												 'subtitilesLanguage': []}
				
				var adaptationSets = period['AdaptationSet'];
				if(!Array.isArray(adaptationSets)) 
						adaptationSets = [adaptationSets]
				
				for(var j = 0; j < adaptationSets.length; j++) {
					var adaptationSet = adaptationSets[j]
					var lang =  adaptationSet['lang'];
					
					if(lang) {
						var type =  adaptationSet['mimType'];
						if(type.startsWith('audio/')) 
							contentServices[periodId]['audioLanguage'].push(lang);
						else 
							contentServices[periodId]['subtitilesLanguage'].push(lang);
					}
				}
			}

			//check accessibility services
			var access_services = mpdObj['MPD']['access_services'];
			if(access_services) {
				if(access_services['face_detection'])
					contentAccessibilityServices['face_detection'] = true
					
				if(access_services['text_detection'])
					contentAccessibilityServices['text_detection'] = true
					
				if(access_services['sound_detection'])
					contentAccessibilityServices['sound_detection'] = true
					
				if(access_services['character_recognition'])
					contentAccessibilityServices['character_recognition'] = true
			}
			
			
			var responses = [];
			STMM_http_request.post(STMM_CONTENT_ADAPTATION_URL, { json: user_profile }, this.STMM_RequestHandlerCreator(hbmm_res, responses, user_profile));
			RBMM_http_request.post(RBMM_CONTENT_ADAPTATION_URL, { json: user_profile }, this.RBMM_RequestHandlerCreator(hbmm_res, responses, user_profile));
		}
	}

	
	/**
	 * Hybrid inference for profile matching
	 */
	hybridInference (hbmm_req, hbmm_res, user_profile) {
		var responses = []

		STMM_http_request.post(STMM_PERSONALIZATION_URL, { json: user_profile }, this.STMM_RequestHandlerCreator(hbmm_res, responses, user_profile));
		RBMM_http_request.post(RBMM_PERSONALIZATION_URL, { json: user_profile }, this.RBMM_RequestHandlerCreator(hbmm_res, responses, user_profile));
	}
	
	
	/**
	 * Hybrid inference for content adaptation
	 */
	hybridContentAdaptation (hbmm_req, hbmm_res, user_profile) {

		//get MPD file content
		MPD_http_request.get(user_profile.content,  this.MPD_RequestHandlerCreator(hbmm_req, hbmm_res, user_profile));

	}
}


//Export these functions
module.exports.HBMMImpl = HBMMImpl