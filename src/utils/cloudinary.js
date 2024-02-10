import { v2 as cloudinary} from "cloudinary";
import { log } from "console";

import fs from "fs";


          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});


const upoadOnCloudinary =async (localFilePath) => {
    try {
        if(!localFilePath ) return null

        //!upload file on cloudniray

      const response =await  cloudinary.uploader.upload(localFilePath, {resource_type  :"auto"})

        //!file have been successfully uploaded

        console.log("file uploaded successfully on cloudinary",response.url)  
        return response 

    } catch (error)
     {
            fs.unlinkSync(localFilePath) //! remove the locally saved temp file as the upload operation get failed
        return null
    }
}

export default upoadOnCloudinary;


/*cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
  { public_id: "olympic_flag" }, 
  function(error, result) {console.log(result); });*/