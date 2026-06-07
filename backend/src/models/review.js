import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: String,
    userName: String,
    movieId: String,
    movieTitle: String,
    rating: Number,
    comment: String,
    createdAt: Date,
    updatedAt: Date,
  },
  {
    collection: "reviews",
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Review = mongoose.model("Review", reviewSchema);
