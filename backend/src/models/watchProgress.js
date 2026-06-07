import mongoose from "mongoose";

const watchProgressSchema = new mongoose.Schema(
  {
    userId: String,
    movieId: String,
    progressPercent: Number,
    updatedAt: Date,
  },
  {
    collection: "progress",
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

export const WatchProgress = mongoose.model("WatchProgress", watchProgressSchema);
