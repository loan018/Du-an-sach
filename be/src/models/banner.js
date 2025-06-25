import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String, 
    required: true,
  },
  link: {
    type: String, 
  },
  startDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,  
  versionKey: false,
});

const Banner = mongoose.model("Banner", bannerSchema);
export default Banner;
