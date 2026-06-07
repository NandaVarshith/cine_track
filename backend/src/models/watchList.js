import mongoose from "mongoose";

const allowedStatuses = ["WATCHED", "PLANNED", "DROPPED"];

const watchListSchema = new mongoose.Schema(
  {
    userId: String,
    movieId: String,
    status: { type: String, enum: allowedStatuses, default: "PLANNED" },
    updatedAt: Date,
  },
  {
    collection: "wishlist",
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

export const WatchList = mongoose.model("WatchList", watchListSchema);
export { allowedStatuses };
