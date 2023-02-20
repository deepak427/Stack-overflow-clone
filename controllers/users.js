import mongoose from "mongoose";
import User from "../models/auth.js";

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    const allUsersDetails = [];
    allUsers.forEach((users) => {
      allUsersDetails.push({
        _id: users._id,
        name: users.name,
        about: users.about,
        tags: users.tags,
        joinedOn: users.joinedOn,
        remainingQuestions: users.remainingQuestions,
        subscription: users.subscription,
        friendRequests: users.friendRequests,
        friends: users.friends,
        sentRequests: users.sentRequests,
      });
    });

    res.status(200).json(allUsersDetails);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const { id: _id } = req.params;
  const { name, about, tags } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(200).send("Question unavalible");
  }

  try {
    const updatedProfile = await User.findByIdAndUpdate(
      _id,
      { $set: { name: name, about: about, tags: tags } },
      { new: true }
    );
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(405).json({ message: error.message });
  }
};

export const addFriend = async (req, res) => {
  const { id: _id } = req.params;
  const { friendId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(200).send("User unavalible");
  }

  if (!mongoose.Types.ObjectId.isValid(friendId)) {
    return res.status(200).send("User unavalible");
  }

  try {
    const user = await User.findById(_id);
    user.sentRequests.push(friendId);

    const friend = await User.findById(friendId);
    friend.friendRequests.push({ friendId: _id, friendName: user.name });

    await User.findByIdAndUpdate(_id, user);
    await User.findByIdAndUpdate(friendId, friend);
    res.status(200).json({ message: "Successfully added new friend..." });
  } catch (error) {
    res.status(405).json({ message: error.message });
  }
};

export const acceptFriend = async (req, res) => {
  const { id: _id } = req.params;
  const { friendId, acceptance } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(200).send("User unavalible");
  }

  if (!mongoose.Types.ObjectId.isValid(friendId)) {
    return res.status(200).send("User unavalible");
  }

  try {
    var user = await User.findById(_id);
    var userBy = await User.findById(friendId);

    const userFriends = user.friendRequests.filter((friend) => {
      friend.friendId !== friendId;
    });

    user = await User.findByIdAndUpdate(
      _id,
      {
        $set: { friendRequests: userFriends },
      },
      { new: true }
    );

    const sentBy = userBy.sentRequests.filter((friend) => {
      friend !== _id;
    });

    userBy = await User.findByIdAndUpdate(
      friendId,
      {
        $set: { sentRequests: sentBy },
      },
      { new: true }
    );

    if (acceptance) {
      user.friends.push({ friendId, friendName: userBy.name });

      userBy.friends.push({ friendId: _id, friendName: user.name });

      await User.findByIdAndUpdate(_id, user);
      await User.findByIdAndUpdate(friendId, userBy);
    }

    res.status(200).json({ message: "Successfully added new friend..." });
  } catch (error) {
    res.status(405).json({ message: error.message });
  }
};

export const deleteFriend = async (req, res) => {
  const { id: _id } = req.params;
  const { friendId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(200).send("User unavalible");
  }

  if (!mongoose.Types.ObjectId.isValid(friendId)) {
    return res.status(200).send("User unavalible");
  }
  try {
    const user = await User.findById(_id);
    const userBy = await User.findById(friendId);

    const userFriends = user.friends.filter((friend) => {
      friend.friendId !== friendId;
    });

    const userByFriends = userBy.friends.filter((friend) => {
      friend.friendId != _id;
    });

    await User.findByIdAndUpdate(
      _id,
      {
        $set: { friends: userFriends },
      },
      { new: true }
    );

    await User.findByIdAndUpdate(
      friendId,
      {
        $set: { friends: userByFriends },
      },
      { new: true }
    );

    res.status(200).json({ message: "Successfully deleted friend..." });
  } catch (error) {
    res.status(405).json({ message: error.message });
  }
};
