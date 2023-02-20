import Stripe from "stripe";
import User from "../models/auth.js";
import mongoose from "mongoose";

const stripe = new Stripe(
  "sk_test_51MaDXESFuHQsX81wkuGc1wxcr1XUHfrWp5fAGBZh6X00Ela9OoLNVJif6C6tLqQJZWodGXKnF4rynyQlYfyB9KFZ006v90eybH",
  {
    apiVersion: "2020-08-27",
  }
);

const plans = [
  { plan: "Silver", priceId: "price_1MauSKSFuHQsX81wLFxzYNrl" },
  { plan: "Gold", priceId: "price_1MauUKSFuHQsX81w9u1wTLjT" },
];

export const Subscription = async (req, res) => {
  const { id: _id } = req.params;

  const { email, name, payment_method, priceId } = req.body;

  const existinguser = await User.findOne({ email });

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(200).send("User unavalible");
  }

  if (existinguser?.subscriptionId) {
    stripe.subscriptions.del(existinguser.subscriptionId);
  }

  const newPlan =
    priceId === plans[0].priceId
      ? { planName: "Silver", questions: "5" }
      : { planName: "Gold", questions: "Unlimited" };
  try {
    const customer = await stripe.customers.create({
      payment_method: payment_method,
      name,
      email,
      invoice_settings: {
        default_payment_method: payment_method,
      },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan: priceId }],
      expand: ["latest_invoice.payment_intent"],
    });

    const updatedProfile = await User.findByIdAndUpdate(
      _id,
      {
        $set: {
          subscriptionId: subscription.id,
          subscription: newPlan.planName,
          remainingQuestions: newPlan.questions,
        },
      },
      { new: true }
    );

    const status = subscription["latest_invoice"]["payment_intent"]["status"];
    const client_secret =
      subscription["latest_invoice"]["payment_intent"]["client_secret"];

    res.status(200).json({ client_secret, status, updatedProfile });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const SubscriptionFree = async (req, res) => {
  const { email } = req.body;

  const existinguser = await User.findOne({ email });

  if (existinguser?.subscriptionId) {
    stripe.subscriptions.del(existinguser.subscriptionId);
  }

  try {
    const updatedProfile = await User.findByIdAndUpdate(
      existinguser._id,
      {
        $set: {
          subscriptionId: "",
          subscription: "Free",
          remainingQuestions: "1",
        },
      },
      { new: true }
    );

    res.status(200).json({ updatedProfile });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const Webhook = async (req, res) => {
  const event = req.body;
  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log(
          `PaymentIntent for ${paymentIntent.amount} was successful!`
        );
        break;
      case "payment_method.attached":
        const paymentMethod = event.data.object;
        break;
      default:
        console.log(`Unhandled event type ${event.type}.`);
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
