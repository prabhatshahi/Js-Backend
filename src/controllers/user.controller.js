import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'

import{User} from '../models/user.model.js'

import {uploadToCloudinary} from '../utils/cloudinary.js'

import { ApiResponse } from '../utils/ApiResponse.js'


const registerUser = asyncHandler(async (req, res) => {
            // get user deatail from fronend
            // validation - not empty
            // check if user already exist: username, email
            // check for images, check for avatar
            // upload them on cloudinary, avtar

            //create user object- create entry in db
            // remove password and refresh token field from response
            //check fro user creation
            // return response
            
            const {fullname, email, username, password}=req.body
          //  console.log("email: ", email)


            if(
                [fullname, email, username, password].some((field)=>field.trim()==="")
            ){
                throw new ApiError(400, "All fields are required")
            }


           const existedUser= await User.findOne({
                $or:[ {username },{ email }]
            })

            if(existedUser){
                throw new ApiError(409, "User with Username & Email already exists")
            }

            const avatarLocalPath = req.files?.avatar[0]?.path;

            // const coverImageLocalPath=req.files?.coverImage[0]?.path;

            let coverImageLocalPath;
            if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage >0){
              coverImageLocalPath = req.files.coverImage[0].path;
            }

            if(
                !avatarLocalPath
            ){
                throw new ApiError(400, "Avatar is required")
            }

            const avatar =await uploadToCloudinary(avatarLocalPath, "avatars")

           const coverImage = await uploadToCloudinary(coverImageLocalPath, "coverImages")
           
            if(!avatar){
                throw new ApiError(400, "Avatar is required")
            }
            
            const user = await User.create({
                fullname,
                avatar:avatar.url,
                coverImage:coverImage?.url || "",
                email,
                password,
                username: username.toLowerCase()
            })

            const createdUser=await User.findById(user._id).select(
                "-password -refreshToken"
            )
        
            if(!createdUser){
                throw new ApiError(500, "Something went wrong while registering a user")
            }   
            
            return res.status(201).json(
                new ApiResponse(
                    // true,
                    201,
                    "User registered successfully",
                    createdUser
                )
            )

            // const user = await User.create({
            //     fullname,
            //     email,
            //     password,
            //     username: username.toLowerCase()
            // }
        
        
        
        
        
        
        
        }
)

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!email && !username) {
        throw new ApiError(400, "Email or Username is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

   const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

    const options ={
        httpOnly:true,
        secure:true,
    }

    return res.
    status(200).cookie
    ("accessToken", accessToken, options
    ).cookie("refreshToken", refreshToken, options).json(new ApiResponse(
        200,
        {
            user: loggedInUser, accessToken, refreshToken
        },
        "User logged in Successfuly"
    ))

    

    
    
});
const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})



export {registerUser}
export {loginUser}  
export