//same like auth.middleware.js 
//here we will decode the admin provided token and find that loggedInuser is admin or not

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"


export const verifyAdminJWT = asyncHandler(async (req, res, next) => {
    const token =req.cookies?.adminAccessToken || req.body.adminAccessToken;

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET);
    if (decodedToken.email !== process.env.ADMIN_EMAIL){
        throw new ApiError(401, "Unauthorized request");
    }

    

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid token");
  }
});