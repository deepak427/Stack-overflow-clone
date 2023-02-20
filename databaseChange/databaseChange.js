import * as cron from "node-cron";
import User from "../models/auth.js";

export const databaseReset = async () => {
  const allUsers = await User.find();
  try {
    cron.schedule("0 0 * * *", () => {
      allUsers.forEach(async (users) => {
        const maxQuestions = users.subscription === "Silver" ? "5" : "1";
        if (users.subscription !== "Gold") {
          const updatedProfile = await User.findByIdAndUpdate(
            users._id,
            {
              $set: {
                remainingQuestions: maxQuestions,
              },
            },
            { new: true }
          );
        }
      });
    });
  } catch (error) {
    console.log(error.message);
  }
};
