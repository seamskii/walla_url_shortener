import mongoose, { Schema, Document, Model } from 'mongoose';
import shortid from 'shortid'; 

interface IUrl extends Document {
  code: string;
  url: string;
  clicked: number;
}

const UrlSchema: Schema<IUrl> = new Schema({
  code: {
    type: String,
    unique: true,
    default: shortid.generate, 
  },
  url: { type: String, required: true },
  clicked: { type: Number, default: 0 },
});

const Urls: Model<IUrl> = mongoose.models.Urls || mongoose.model<IUrl>('Urls', UrlSchema);

export default Urls;
