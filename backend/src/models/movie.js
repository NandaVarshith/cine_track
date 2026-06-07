import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    imdb_id: String,
    title: String,
    poster_url: String,
    overview: String,
    release_year: { type: Number, alias: "releaseYear" },
    rating: Number,
    votes: Number,
    country: String,
    genre: String,
    language: String,
    runtime: Number,
  },
  {
    collection: "movies",
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        ret.releaseYear = ret.releaseYear ?? ret.release_year ?? null;
        delete ret._id;
        delete ret.__v;
        delete ret.release_year;
        return ret;
      },
    },
  }
);

export const Movie = mongoose.model("Movie", movieSchema);
