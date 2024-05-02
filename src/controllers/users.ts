import { NextFunction, Request, Response } from "express";
import { sendJSONError } from "../errorHandler.js";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";

export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const usernames = await User.find({}, "username").lean();
    res.status(200).json(usernames.map((u) => u.username));
  } catch (error) {
    sendJSONError(res, 500, `Internal error retrieving users: ${error}`);
  }
}

export async function getUserByUsername(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await User.findOne(
      { username: req.params.uname },
      "-passwordHash"
    );
    if (!user) {
      return sendJSONError(res, 404, `User ${req.params.uname} not found`);
    }
    res.status(200).json(user);
  } catch (error) {
    sendJSONError(res, 500, `Internal error retrieving user: ${error}`);
  }
}

// Function to create a new user
export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Extract user data from request body
    const userData = req.body;

    // Create a new user instance
    const newUser = new User(userData);

    // Save the user to the database
    await newUser.save();

    // Return the newly created user in the response
    res.status(201).json(newUser);
  } catch (error) {
    // Handle errors
    sendJSONError(res, 500, `Internal error creating user: ${error}`);
  }
}

// Function to update a user by Username
export async function updateUserByUsername(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Extract username from request parameters
    const usernameToUpdate = req.params.username;

    // Extract updated user data from request body
    const updatedUserData = req.body;

    // Check if password field is present in updated data
    if (updatedUserData.password) {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(updatedUserData.password, 10);

      // Update the password in the updated data with the hashed password
      updatedUserData.password = hashedPassword;
    }

    // Find the user by username and update it
    const updatedUser = await User.findOneAndUpdate(
      { username: usernameToUpdate }, // Query by username
      updatedUserData,
      { new: true }
    );

    // If user does not exist, return 404 Not Found
    if (!updatedUser) {
      return sendJSONError(
        res,
        404,
        `User with username ${usernameToUpdate} not found`
      );
    }

    // Return the updated user in the response
    res.status(200).json(updatedUser);
  } catch (error) {
    // Handle errors
    sendJSONError(
      res,
      500,
      `Internal error updating user by username: ${error}`
    );
  }
}

// TODO: Check for security vulnerabilities in this function
// Function to delete a user by ID
export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Extract the user ID from request parameters
    const usernameToDelete = req.params.uname;

    // Find the user by ID
    const user = await User.findOne({ username: usernameToDelete });

    // If user does not exist, return 404 Not Found
    if (!user) {
      return sendJSONError(res, 404, `User ${usernameToDelete} not found`);
    }

    // Delete the user
    await User.deleteOne({ _id: usernameToDelete });

    // Return success message
    res.status(200).json({
      message: `User ${usernameToDelete} has been deleted successfully`,
    });
  } catch (error) {
    // Handle errors
    sendJSONError(res, 500, `Internal error deleting user: ${error}`);
  }
}
