import { NextFunction, Request, Response } from 'express';
import { sendJSONError } from '../errorHandler.js';
import { User } from '../models/User.js';
import { Horse } from '../models/Horse.js';

export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const usernames = await User.find({}, 'username').lean();
    res.status(200).json(usernames.map((u) => u.username));
  } catch (error) {
    sendJSONError(res, 500, `Internal error retrieving users: ${error}`);
  }
}

export async function getUserByUsername(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await User.findOne(
      { username: req.params.uname },
      '-passwordHash',
    )
      .populate('profile.betLog.gameId')
      .populate('profile.betLog.horseId')
      .populate('profile.favoriteHorses');
    if (!user) {
      return sendJSONError(res, 404, `User ${req.params.uname} not found`);
    }
    res.status(200).json(user);
  } catch (error) {
    sendJSONError(res, 500, `Internal error retrieving user: ${error}`);
  }
}

// Function to update a user by ID
export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // Extract user ID from request parameters
    const userIdToUpdate = req.params.userId;

    // Extract updated user data from request body
    const updatedUserData = req.body;

    // Find the user by ID and update it
    const updatedUser = await User.findByIdAndUpdate(
      userIdToUpdate,
      updatedUserData,
      { new: true },
    );

    // If user does not exist, return 404 Not Found
    if (!updatedUser) {
      return sendJSONError(res, 404, `User ${userIdToUpdate} not found`);
    }

    // Return the updated user in the response
    res.status(200).json(updatedUser);
  } catch (error) {
    // Handle errors
    sendJSONError(res, 500, `Internal error updating user: ${error}`);
  }
}

// TODO: Check for security vulnerabilities in this function
// Function to delete a user by ID
export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction,
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

export async function getUserFavoriteHorses(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const horses = await User.findOne({ username: req.params.uname })
      .populate('profile.favoriteHorses')
      .select('profile.favoriteHorses');
    res.status(200).json(horses);
  } catch (error) {
    sendJSONError(res, 500, `Internal error retrieving horses: ${error}`);
  }
}

export async function addUserFavoriteHorses(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.params.uname !== req.body.jwtPayload.username) {
    return sendJSONError(
      res,
      401,
      `Cannot modify other user's favorite horses`,
    );
  }

  try {
    await User.updateOne(
      { username: req.params.uname },
      {
        'profile.favoriteHorses': {
          $addToSet: req.body.horseId,
        },
      },
    );
  } catch (error) {
    sendJSONError(res, 500, `Internal error when updating horses: ${error}`);
  }
}

export async function removeUserFavoriteHorse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.params.uname !== req.body.jwtPayload.username) {
    return sendJSONError(
      res,
      401,
      `Cannot modify other user's favorite horses`,
    );
  }

  try {
    await User.updateOne(
      { username: req.params.uname },
      {
        'profile.favoriteHorses': {
          $pull: req.body.horseId,
        },
      },
    );
  } catch (error) {
    sendJSONError(res, 500, `Internal error when updating horses: ${error}`);
  }
}
