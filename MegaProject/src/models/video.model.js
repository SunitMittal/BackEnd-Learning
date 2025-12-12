const mongoose = require("mongoose");
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');

const videoSchema = new mongoose.Schema(
  {
    videoFile: {    //actual video hum 3rd party(AWS or cloudinary) par store karenge aur wo jo URL denge wo yaha store karenge
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    duration: {
      type: Number,
    },
    views: {
      type: Number,
      default:0
    },
    isPublished: {
      type: Boolean,
      default:true
    },
  },
  { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema);
