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

// app.use(express.static('uploads')); 
app.use('/uploads', express.static('uploads'));

app.post('/api/image-upload',upload.single('image'),async(req, res) => {
    
    const image = req.image;
    //get file path
    var filePath =req.file.path; 
    //get host name
    var hostname = req.headers.host;
   //create url for image
   varimageUrl=hostname+"\\"+filePath;
   

    let requesttoeverypixel = await api.keywords({"url": "https://library.sportingnews.com/styles/twitter_card_120x120/s3/2022-04/Messi%20PSG%20Training.png?itok=yW1geQa6", "num_keywords": 10});
    
    Promise.all([requesttoeverypixel]).then((values) => {
       
       fs.unlinkSync(filePath);
       res.send(apiResponse({message: 'File uploaded successfully.', path:varimageUrl,tage:values[0].data}));
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