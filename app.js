const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const multer = require('multer');
var fs = require('fs');
const EveryPixel = require('everypixel');
const api = new EveryPixel({
	"username": "IkSJx3qJRPx51EvlQTCcetlH",
	"password": "7oexd27XzHB69HwcVuwixTE47nbQ37nR43TXc2ZaxQBu3jqt"
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
   res.send('hello world')
   // res.send(apiResponse({message: 'File uploaded successfully.'}));

})

app.post('/api/image-upload',upload.single('image'),async(req, res) => {
    
    const image = req.image;
    //get file path
    var filePath =req.file.path; 
    //get host name
    var hostname = req.headers.host;
   //create url for image
   var imageUrl=hostname+"\\"+filePath;
   

    let requesttoeverypixel = await api.keywords({"url": 'https://www.ing.com/static/ingdotcompresentation/static/images/ING_lion_RGB_200x200.png', "num_keywords": 10});
    
    Promise.all([requesttoeverypixel]).then((values) => {
       
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