import { Document, model, Schema } from "mongoose";

interface Node {
	ip: string;
	links: number;
}

type NodeDocument = Node & Document;

const NodeSchema = new Schema<NodeDocument>({
	ip: String,
	links: Number,
});

export const NodeModel = model<NodeDocument>("Node", NodeSchema);
