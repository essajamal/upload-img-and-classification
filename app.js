const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const multer = require('multer');
   
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
//  app.post('/api/image-upload', upload.single('image'),(req, res) => {

app.post('/api/image-upload',upload.single('image'),(req, res) => {
    
    const image = req.image;
    res.send(apiResponse({message: 'File uploaded successfully.', path:req.file.path}));
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