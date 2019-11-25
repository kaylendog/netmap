import { connect } from "mongoose";

import { MapperStoreModel } from "../models/MapperStore";
import * as env from "../util/env";
import { logger } from "../util/logging";
import { Mapper, MapperConfig } from "./Mapper";

interface ManagerConfig {
	mapperCount: number;
}

/**
 * Represents the manager overseeing the mappers.
 */
export class Manager {
	public config: ManagerConfig;

	public mappers: Mapper[];

	constructor(config: ManagerConfig) {
		this.config = config;
		this.mappers = [];
	}

	/**
	 * Start the manager and its child mappers.
	 */
	async start() {
		logger.info("Initializing...");

		await connect(env.databaseURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
		}).catch((err) => {
			logger.error(err.message);
			logger.error("Failed to connect to the database.");
		});

		logger.success("Connected to Mongo.");

		await this.createMappers();
		this.mappers.forEach((mapper) => mapper.start());
	}

	private async createMappers() {
		let config = await MapperStoreModel.find({});

		if (config.length === 0) {
			logger.info("Creating", this.config.mapperCount, "mappers...");
			for (let i = 0; i < this.config.mapperCount; i++) {
				this.mappers.push(
					new Mapper(i, {
						incr: [0, 0, 0, this.config.mapperCount],
						position: [11, 0, 0, i],
					})
				);
			}

			logger.info("Saving mapper state to databse...");
			await Promise.all(
				this.mappers.map((mapper) => mapper.saveCurrentState())
			);
			return logger.info("Done.");
		}

		if (config.length !== this.config.mapperCount) {
			logger.warn(
				"Specified mapper count does not match up with previous runs."
			);
		}

		config.forEach((conf, id) => this.createMapperFromConfig(id, conf));
	}

	private createMapperFromConfig(id: number, config: MapperConfig) {
		this.mappers.push(new Mapper(id, config));
	}
}
