const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const multer = require('multer');
var fs = require('fs');
const EveryPixel = require('everypixel');
const api = new EveryPixel({
	"username": "tuQvWvgXx7nYRRMJaWh4lVZQ",
	"password": "tOZe7IjgnXRG4o2TMEzfOrdjqdNJ4f4lfcqe3DK4eEsWukpF"
});

    
/*------------------------------------------
--------------------------------------------
parse application/json
--------------------------------------------
--------------------------------------------*/
app.use(bodyParser.json());
  
/*------------------------------------------
--------------------------------------------
image upload code using multer
--------------------------------------------
--------------------------------------------*/
var storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, 'uploads');
   },
   filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
   }
});
var upload = multer({ storage: storage });
   
/**
 * Create New Item
 *
 * @return response()
 */

// Add headers before the routes are defined
app.use(function (req, res, next) {

   // Website you wish to allow to connect
   res.setHeader('Access-Control-Allow-Origin', '*');

   // Request methods you wish to allow
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

   // Request headers you wish to allow
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

   // Set to true if you need the website to include cookies in the requests sent
   // to the API (e.g. in case you use sessions)
   res.setHeader('Access-Control-Allow-Credentials', true);

   // Pass to next layer of middleware
   next();
});

// app.use(express.static('uploads')); 
app.use('/uploads', express.static('uploads'));
app.get('/',(req, res) => {
   res.send('hello worldd')
   // res.send(apiResponse({message: 'File uploaded successfully.'}));

})

app.post('/api/image-upload',upload.single('image'),async(req, res) => {
    
    const image = req.image;
    //get file path
    var filePath =req.file.path; 
    //get host name
    var hostname = req.headers.host;
   //create url for image
   var imageUrl='https://'+hostname+"/"+filePath;
   //if you are in local env you can't use imageUrl 
   //you can use var imageUrl=https://library.sportingnews.com/styles/twitter_card_120x120/s3/2022-04/Messi%20PSG%20Training.png?itok=yW1geQa6
   

    let requesttoeverypixel = await api.keywords({"url": imageUrl, "num_keywords": 10});
    
    Promise.all([requesttoeverypixel]).then((values) => {
       //after we are get the response you can delete that image in your server 
       fs.unlinkSync(filePath);
       
       res.send(apiResponse({message: 'File uploaded successfully.', path:imageUrl,tage:values[0].data}));
      });
   //delete the photo
});
  
/**
 * API Response
 *
 * @return response()
 */
function apiResponse(results){
    return JSON.stringify({"status": 200, "error": null, "response": results});
}
  
/*------------------------------------------
--------------------------------------------
Server listening
--------------------------------------------
--------------------------------------------*/
app.listen(3000,() =>{
  console.log('Server started on port 3000...');
});
