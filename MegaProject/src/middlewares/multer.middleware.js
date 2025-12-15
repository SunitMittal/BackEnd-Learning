// Multer is an express middleware for handling media-parts/form-data, which is how files are sent from forms.      //syntax: multer(options);

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    // const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // cb(null, file.uniqueName);
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });

// cb is the callback fxn nothing more than that

// .diskStorage -> multer method which stores files in disk storage of the system
// destination -> stores loaction where files will be going to store
// filename -> Generates filenames before storing them

/*  flow of how does upload will work
    Client upload a file
            ↓
          Multer
            ↓
    Save that file in given loacation (let say in /public)
            ↓
    file will be upload at Cloudinary
            ↓
    after successfull uploadation Local file deleted
            ↓
    Cloudinary provide a URL which we store in our DB
*/

/*
In routes how does we use multer for files:
route("location", multer_middleware, controller);
eg. app.post("/upload", upload.single("image"), controller);

upload.single("image") -> Accepts only 1 file and HTML field name must be "image"

upload.array("images", 5) -> Accepts upto 5 file
*/
