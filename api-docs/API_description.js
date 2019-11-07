module.exports = {
  openapi: '3.0.1',
  info: {
    version: '1.3.0',
    title: 'EasyTV Personalization API',
    description: 'Description of EasyTV Personalization API'
  },
  servers: [
    {
      url: 'https://hp-api.easytv.eng.it/',
      description: 'Production server'
    }
  ],
  tags: [
    {
      name: 'Personalize profile'
    },
    {
      name: 'Personalize context'
    },
    {
      name: 'Personalize content'
    }
  ],
   paths: {
    '/EasyTV_HBMM_Restful_WS/personalize/profile': {
	  post: {
        tags: ['Personalize profile'],
        description: 'Presonalize a user profile.',
        requestBody: {
            content: {
                'application/json': {
                  schema: {
                	  $ref: '#/components/schemas/personalize_profile'
                  },
                  example: {
                		    "user_id": 1,
                			"user_profile": {
                				"user_preferences": {
                					"default": {"preferences": {
                		                        "http://registry.easytv.eu/common/volume": 90,
                		                        "http://registry.easytv.eu/common/contrast": 100,
                		                        "http://registry.easytv.eu/application/control/voice": true,
                		                        "http://registry.easytv.eu/application/cs/audio/track": "ca",
                		                        "http://registry.easytv.eu/application/cs/ui/language": "en",
                		                        "http://registry.easytv.eu/application/cs/audio/volume": 33,
                		                        "http://registry.easytv.eu/application/cs/ui/text/size": "20",
                		                        "http://registry.easytv.eu/application/tts/audio/speed": 0,
                		                        "http://registry.easytv.eu/application/tts/audio/voice": "male",
                		                        "http://registry.easytv.eu/application/cs/audio/eq/bass": -4,
                		                        "http://registry.easytv.eu/application/cs/audio/eq/mids": 5,
                		                        "http://registry.easytv.eu/application/tts/audio/volume": 90
                					}}
                				}
                		  }
                		
                    }
                }
              },
          required: true
        },
        responses: {
          '200': {
            description: 'Return a personalized user profile.',
            content: {
                'application/json': {
                    schema: {
                  	  $ref: '#/components/schemas/personalize_profile'
                   }
                }
             }
          },
          '400': {
              description: 'Error messages',
              content: {
                  'application/json': {
                      schema: {
                    	  $ref: '#/components/schemas/error_message'
                     }
                  }
               }
            }
        }
      }
    },
  '/EasyTV_HBMM_Restful_WS/personalize/context': {
  	  post: {
          tags: ['Personalize context'],
          description: 'Presonalize a user profile in relation to a specific context',
          requestBody: {
              content: {
                  'application/json': {
                    schema: {
                  	  $ref: '#/components/schemas/personalize_context'
                    },
				    example: {
				    	"user_id": 1,
				    	"user_context": {
				    			"http://registry.easytv.eu/context/location": "gr",
				    			"http://registry.easytv.eu/context/time": "12:00:00"
				    		},
				    	"user_profile": {
				    		"user_preferences": {"default": {"preferences": {
				                            "http://registry.easytv.eu/common/volume": 90,
				                            "http://registry.easytv.eu/common/contrast": 100,
				                            "http://registry.easytv.eu/application/control/voice": true,
				                            "http://registry.easytv.eu/application/cs/audio/track": "ca",
				                            "http://registry.easytv.eu/application/cs/ui/language": "en",
				                            "http://registry.easytv.eu/application/cs/audio/volume": 33,
				                            "http://registry.easytv.eu/application/cs/ui/text/size": "20",
				                            "http://registry.easytv.eu/application/tts/audio/speed": 0,
				                            "http://registry.easytv.eu/application/tts/audio/voice": "male",
				                            "http://registry.easytv.eu/application/cs/audio/eq/bass": -4,
				                            "http://registry.easytv.eu/application/cs/audio/eq/mids": 5,
				                            "http://registry.easytv.eu/application/tts/audio/volume": 90
				    				}		
				    			},
				    			"conditional": [{
				    				"name": "Morning subtitles color contrast",
				    				"preferences": {				 	
				    					"http://registry.easytv.eu/common/volume": 90,
				    					"http://registry.easytv.eu/application/cs/cc/subtitles/font/color": "#ffffff"
				    				},	
				    				"conditions": [{
				    					"operands": [
				    						{
				    							"operands": [
				    								"http://registry.easytv.eu/context/time",
				    								"08:00:00"
				    							],
				    							"type": "gt"
				    						},
				    						{
				    							"operands": [
				    								"http://registry.easytv.eu/context/time",
				    								"15:00:00"
				    							],
				    							"type": "lt"
				    						}
				    					],
				    					"type": "and"
				    				}]
				    			}]
				    		}
				    	}
				    }
                  }
                },
            required: true
          },
          responses: {
            '200': {
              description: 'Return a personalization context',
              content: {
                  'application/json': {
                      schema: {
                    	  $ref: '#/components/schemas/personalize_profile'
                     }
                  }
               }
            },
            '400': {
                description: 'Error messages',
                content: {
                    'application/json': {
                        schema: {
                      	  $ref: '#/components/schemas/error_message'
                       }
                    }
                 }
              }
          }
        }
     },
     '/EasyTV_HBMM_Restful_WS/personalize/content': {
     	  post: {
             tags: ['Personalize content'],
             description: 'Presonalize a user profile in relation to a specific content',
             requestBody: {
                 content: {
                     'application/json': {
                       schema: {
                     	  $ref: '#/components/schemas/personalize_content'
                       }
                     }
                   },
               required: true
             },
             responses: {
               '200': {
                 description: 'Return a personalization content',
                 content: {
                     'application/json': {
                         schema: {
                       	  $ref: '#/components/schemas/personalize_content'
                        },
    				    example: {
    				    	"user_id": 1,
    				    	"user_context": {
    				    			"http://registry.easytv.eu/context/location": "gr",
    				    			"http://registry.easytv.eu/context/time": "12:00:00"
    				    		},
    				    	"user_content": {
    				    			"media": "Com_si_fos_ahir",
    				    			"episonde": "com_si_fos_ahir_capitol_427"
    				    	},
    				    	"user_profile": {
    				    		"user_preferences": {"default": {"preferences": {
    				                            "http://registry.easytv.eu/common/volume": 90,
    				                            "http://registry.easytv.eu/common/contrast": 100,
    				                            "http://registry.easytv.eu/application/control/voice": true,
    				                            "http://registry.easytv.eu/application/cs/audio/track": "ca",
    				                            "http://registry.easytv.eu/application/cs/ui/language": "en",
    				                            "http://registry.easytv.eu/application/cs/audio/volume": 33,
    				                            "http://registry.easytv.eu/application/cs/ui/text/size": "20",
    				                            "http://registry.easytv.eu/application/tts/audio/speed": 0,
    				                            "http://registry.easytv.eu/application/tts/audio/voice": "male",
    				                            "http://registry.easytv.eu/application/cs/audio/eq/bass": -4,
    				                            "http://registry.easytv.eu/application/cs/audio/eq/mids": 5,
    				                            "http://registry.easytv.eu/application/tts/audio/volume": 90
    				    				}		
    				    			},
    				    			"conditional": [{
    				    				"name": "Morning subtitles color contrast",
    				    				"preferences": {				 	
    				    					"http://registry.easytv.eu/common/volume": 90,
    				    					"http://registry.easytv.eu/application/cs/cc/subtitles/font/color": "#ffffff"
    				    				},	
    				    				"conditions": [{
    				    					"operands": [
    				    						{
    				    							"operands": [
    				    								"http://registry.easytv.eu/context/time",
    				    								"08:00:00"
    				    							],
    				    							"type": "gt"
    				    						},
    				    						{
    				    							"operands": [
    				    								"http://registry.easytv.eu/context/time",
    				    								"15:00:00"
    				    							],
    				    							"type": "lt"
    				    						}
    				    					],
    				    					"type": "and"
    				    				}]
    				    			}]
    				    		}
    				    	}
    				    }
                     }
                  }
               },
             '400': {
                 description: 'Error messages',
                 content: {
                     'application/json': {
                         schema: {
                       	  $ref: '#/components/schemas/error_message'
                        }
                     }
                  }
               }
             }
           }
         }
  },
  components: {
    schemas: {
      user_id: {
        type: 'integer',
        description: 'The user id, taken from the login'
      },
      user_context: {
    	  type: 'object',
          properties: {
        	 "http://registry.easytv.eu/context/device": {
        		 type: "string",
        		 description: 'Device type, one of mobile, tablet or PC' 
          },
          	"http://registry.easytv.eu/context/light":{
          		 type: "string",
        		 description: 'The ambient light level (illumination) in lx' 
           },
         	"http://registry.easytv.eu/context/proximity":{
         		 type: "string",
        		 description: 'Measures the proximity of an object in cm relative to the view screen of a device' 
         	},
         	"http://registry.easytv.eu/context/location":{
        		 type: "string",
        		 description: 'The location as country code' 
        	},
         	"http://registry.easytv.eu/context/time":{
         		type: "string",
         		description: 'Current time in HH:MM:SS form' 
         	}
          }
      },
      user_content: {
    	  type: 'object',
          properties: {
        	 media: {
        		 type: "string"
          },
          	episonde:{
          		 type: "string"
           }
          }
      },
      preferences: {
          type: "object",
          properties: {
        	  "http://registry.easytv.eu/application/control/csGazeAndGestureControlCursorGuiLanguage":{
        		  type: "string",description: "The gaze and gesture control interface lanugage"
        		 },
        		 "http://registry.easytv.eu/application/control/csGazeAndGestureControlCursorGuiTextSize":{
        		  type: "string",description: "The gaze and gesture control interface lanugage text size"
        		 },
        		 "http://registry.easytv.eu/application/control/csGazeAndGestureControlType":{
        		  type: "string",description: "The control type "
        		 },
        		 "http://registry.easytv.eu/application/control/voice":{
        		  type: "string",description: "Enable/disable voice control"
        		 },
        		 "http://registry.easytv.eu/application/cs/accessibility/audio/description":{
        		  type: "string",description: "Enable/disable audio description"
        		 },
        		 "http://registry.easytv.eu/application/cs/accessibility/detection/character":{
        		  type: "string",description: "Enable/disable character recognition"
        		 },
        		 "http://registry.easytv.eu/application/cs/accessibility/detection/sound":{
        		  type: "string",description: "Enable/disable sound detection"
        		 },
        		 "http://registry.easytv.eu/application/cs/accessibility/detection/text":{
        		  type: "string",description: "Enable/disable text detection"
        		 },
        		 "http://registry.easytv.eu/application/cs/accessibility/enhancement/image/type":{
        		  type: "string",description: "Image ehancement type "
        		 },
        		 "http://registry.easytv.eu/application/cs/accessibility/magnification/scale":{
        		  type: "string",description: "Image mangnification scale"
        		 },
        		 "http://registry.easytv.eu/application/cs/accessibility/sign/language":{
        		  type: "string",description: "Enable/disable text detection"
        		 },
        		 "http://registry.easytv.eu/application/cs/audio/eq/bass":{
        		  type: "string",description: "Equalizer bass level"
        		 },
        		 "http://registry.easytv.eu/application/cs/audio/eq/highs":{
        		  type: "string",description: "Equalizer  high level"
        		 },
        		 "http://registry.easytv.eu/application/cs/audio/eq/mids":{
        		  type: "string",description: "Equalizer  mild level"
        		 },
        		 "http://registry.easytv.eu/application/cs/audio/track":{
        		  type: "string",description: "Audio content language"
        		 },
        		 "http://registry.easytv.eu/application/cs/audio/volume":{
        		  type: "string",description: "Audio content volume level"
        		 },
        		 "http://registry.easytv.eu/application/cs/cc/audio/subtitle":{
        		  type: "string",description: "Enable/disable audio subtitles"
        		 },
        		 "http://registry.easytv.eu/application/cs/cc/subtitles/background/color":{
        		  type: "string",description: "Subtitle background color"
        		 },
        		 "http://registry.easytv.eu/application/cs/cc/subtitles/font/color":{
        		  type: "string",description: "Subtitle font color"
        		 },
        		 "http://registry.easytv.eu/application/cs/cc/subtitles/font/size":{
        		  type: "string",description: "Subtitle font size"
        		 },
        		 "http://registry.easytv.eu/application/cs/cc/subtitles/language":{
        		  type: "string",description: "subtitile language"
        		 },
        		 "http://registry.easytv.eu/application/cs/ui/audioAssistanceBasedOnTTS":{
        		  type: "string",description: "Enable/disable TTs reader of cs app interface"
        		 },
        		 "http://registry.easytv.eu/application/cs/ui/language":{
        		  type: "string",description: "Cs app interface lanugage"
        		 },
        		 "http://registry.easytv.eu/application/cs/ui/text/magnification/scale":{
        		  type: "string",description: "Enable/disable zoom text field"
        		 },
        		 "http://registry.easytv.eu/application/cs/ui/text/size":{
        		  type: "string",description: "Cs app interface text size"
        		 },
        		 "http://registry.easytv.eu/application/cs/ui/vibration/touch":{
        		  type: "string",description: "Enable/disable touch vibration"
        		 },
        		 "http://registry.easytv.eu/application/tts/audio/language":{
        		  type: "string",description: "TTs language"
        		 },
        		 "http://registry.easytv.eu/application/tts/audio/quality":{
        		  type: "string",description: "TTs audio quality"
        		 },
        		 "http://registry.easytv.eu/application/tts/audio/speed":{
        		  type: "string",description: "TTs speed"
        		 },
        		 "http://registry.easytv.eu/application/tts/audio/voice":{
        		  type: "string",description: "TTs voice"
        		 },
        		 "http://registry.easytv.eu/application/tts/audio/volume":{
        		  type: "string",description: "TTs volume level"
        		 },
        		 "http://registry.easytv.eu/common/content/audio/language":{
        		  type: "string",description: "General language"
        		 },
        		 "http://registry.easytv.eu/common/display/screen/enhancement/cursor/color":{
        		  type: "string",description: "Cursor color"
        		 },
        		 "http://registry.easytv.eu/common/display/screen/enhancement/cursor/Size":{
        		  type: "string",description: "Cursor size"
        		 },
        		 "http://registry.easytv.eu/common/volume":{
        		  type: "string",description: "Volume level"
        		 }
          }
      },
      default: {
    	  type: 'object',
          properties: {
          preferences: {
            $ref: '#/components/schemas/preferences'
          }
        }
      },
      
      operand:{
          type: 'string',
      },
      operands:{
          type: "array",
          items: {
            $ref: "#/components/schemas/operand"
          }
      },
      condition:{
    	  type: 'object',
          properties: {
	          type: {
	        	  type: 'string'
	          },
	          operands: {
		        $ref: '#/components/schemas/operands'
	       }
        }
      },
      conditions:{
          type: "array",
          items: {
            $ref: "#/components/schemas/condition"
          }
      },
      conditional:{
    	  type: 'object',
          properties: {
           name: {
        	   type: 'string'
           },
           conditions: {
	        $ref: '#/components/schemas/conditions'
	       },
	       preferences:{
	    	   $ref: '#/components/schemas/preferences'
	       }
        }
      },
      conditionals:{
          type: "array",
          items: {
            $ref: "#/components/schemas/conditional"
          }
      },
      user_preferences: {
    	  type: 'object',
          properties: {
          default: {
            $ref: '#/components/schemas/default'
          },
          conditional:{
  		    $ref: '#/components/schemas/conditionals'
          }
        }
      },     
      error_message:{
    	  type: 'object',
          properties: {
              user_id: {
           	   type: 'integer'
              },
              msg: {
            	  type: 'string'
	   	       }
           }
      },
      user_profile: {
          type: 'object',
          properties: {
        	  user_preferences: {
              $ref: '#/components/schemas/user_preferences'
            }
          }
      },
      personalize_profile: {
        type: 'object',
        properties: {
        	user_id: {
            $ref: '#/components/schemas/user_id'
          },
          user_profile: {
            $ref: '#/components/schemas/user_profile'
          }
        }
      },
      personalize_context: {
          type: 'object',
          properties: {
          	user_id: {
              $ref: '#/components/schemas/user_id'
            },
            user_profile: {
              $ref: '#/components/schemas/user_profile'
            },
            user_context: {
                $ref: '#/components/schemas/user_context'
            }
          }
       },
       personalize_content: {
           type: 'object',
           properties: {
           	user_id: {
               $ref: '#/components/schemas/user_id'
             },
             user_profile: {
               $ref: '#/components/schemas/user_profile'
             },
             user_context: {
                 $ref: '#/components/schemas/user_context'
             },
             user_content: {
                 $ref: '#/components/schemas/user_content'
             }
           }
        }
    }
  }
};