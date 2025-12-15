// Cloudinary is only a servive which stores files. like AWS do, we can use any service, precess is same for all whether it is Cloudinary, AWS, or any other 3rd party

// generally hum file upload kaa code ekk seperate file me hii rakhte hai kyuki code same hi rehta hai, phir chahe file image ho, video ho, pdf ho, ya koi aur type ki file ho. aur generally iss code ko hum sabhi jagah use kar sakte hai kyuki ye kind of generalized code hai, bus hum apni convienince ke according iss code me minor se modifications kar lenge, par mota-moti code same hii rahega

// clodinary directly user se file lekar upload nahi karega, iska kaam kewal file ko store karna hai, yaha kaam aayega multer, multer kee through hum user see file lenge aur phir cloudinary par store karenge.
// hum chahe to directly multer ke through file lekar cloudinary par upload kara skate hai, but hum aisa karenge nahii, hum 2 step process se chalege(industry practise and more than that safety purpose):
// step1: hum multer see file upload karwa kar file ko ek baar upne local server par store karwayenge
// step2: phir  local server se usse cloudinary par bhejenge
// aisa isliye kyuki hum file kaa backup rakhne chahte hai, jab tak ki wo successfully cloudinary par upload naa jaye, kyuki kai baar aisa possible hai kii maybe connection issue, internet issue, ya any other issue kii vajah se file properly cloudinary par upload na hoo ya during uplod process kisi reason se uploading fail ho jaye, toh aan aise case hum user see wapas file upload kee liye nahi bol sakte, isiliye hum apne local server par file ka backup lenge ki agar kisi issue ki vajah se file upload nahii ho payii toh local server se cloudinary par vapas file ko reupload kiya jaa sake, aur ek baar cloudinary par file successfully upload ho jayegi hum apne local server par se usse delete kar denge, aur user jab bhi request karega hum usse wo file directly cloudinary se fetch karwa kar de denge

const cloudinary = require("cloudinary").v2; //Imports Cloudinary SDK (v2 API)
const fs = require("fs"); //fs means file system an in-built nodejs library which is used to interact with files like read, write, delete, etc

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath)
        return null;

    // uploader.upload() -> Uploads a file from local server(disk, buffer, or URL) to Cloudinary servers, here 'uploader' is module present in cloudinary SDk which handle uploads and contains a fxn 'upload' that uploads the file
    // syntax: cloudinary.uploader.upload(location, options)
    // few options which we can pass like resource_type are:
    // {public_id: "user_123_avatar"} to give custom filename
    // {overwrite: true} will overwrite the existing file
    // {transformation: [{width: 30,height: 30}]}    //image dimensions
    // {tags: ["profile", "user"]}  Tags for searching


    const uploadFile = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",    //this is to specify the file type whehter it's an image(jpg, png, webp), video(mp4, mov) or raw(pdf, zip), assigning value 'auto' means Cloudinary decides on its own
    });
    console.log("File uploaded on cloudinary successfully", uploadFile.url);
    return uploadFile;
  } catch (err) {
    fs.unlinkSync(localFilePath); //remove the files saved in local storage(disk storage) as the operation got failed, this will prevent junk files filling our server/system
    return null;
  }
};

module.exports = uploadOnCloudinary;
// localFilePath --> path_location where multer stored the files on disk & now from disk the files will be uploaded/stored in cloudinary (eg. uploads/avatar123.png, public/temp/abc.mp4, etc)

// after succesfull uploadation, cloudinary returns an object containing many things (here as we store it uploadFile variable) like: asset_id, public_id, version, resource_type, secure_url, url, width, height, format, created_at, etc
//  the most things from that object which we might need are secure_url, resource_type, format, public_id(Needed to delete/update file)
