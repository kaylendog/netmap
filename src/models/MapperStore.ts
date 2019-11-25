import { Document, model, Schema } from "mongoose";

import { MapperConfig } from "../structures/Mapper";

interface MapperStore extends MapperConfig {
	_id: number;
}

type MapperStoreDocument = MapperStore & Document;

const MapperStoreSchema = new Schema<MapperStoreDocument>({
	_id: Number,
	offset: [Number],
	position: [Number],
	incr: [Number],
});

export const MapperStoreModel = model<MapperStoreDocument>(
	"MapperStore",
	MapperStoreSchema
);
