import { Document, model, Schema } from "mongoose";

interface Link {
	to: string;
	from: string;
}

type LinkDocument = Link & Document;

const LinkSchema = new Schema<LinkDocument>({
	to: String,
	from: String,
});

export const LinkModel = model<LinkDocument>("Link", LinkSchema);
