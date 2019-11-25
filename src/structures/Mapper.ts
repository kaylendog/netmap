import { MapperStoreModel } from "../models/MapperStore";
import { logger } from "../util/logging";
import { ping } from "../util/ping";

export interface MapperConfig {
	/**
	 * The starting/current lookup address of the mapper.
	 */
	position: number[];
	/**
	 * Determines by how much each mapper should increment its lookup address per cycle.
	 */
	incr: number[];
}

/**
 * Represents a mapper making and recording the paths of requests.
 */
export class Mapper {
	public id: number;
	public config: MapperConfig;

	public loop: NodeJS.Timer;

	constructor(id: number, config: MapperConfig) {
		this.id = id;
		this.config = config;
	}

	handleResult() {}

	/**
	 * Save the current state of the mapper to the database.
	 */
	async saveCurrentState() {
		return await MapperStoreModel.findOneAndUpdate(
			{ _id: this.id },
			{ incr: this.config.incr, position: this.config.position },
			{ upsert: true }
		);
	}

	/**
	 * Start the mapper.
	 */
	async start() {
		while (true) {
			await this.lookupCurrentAddr();
			let overflow = [0, 0, 0, 0];

			this.config.position = this.config.position.map((pos, i) => {
				if (pos + this.config.incr[i] + overflow[i] > 255) {
					overflow[i - 1] = 1;
					return pos + this.config.incr[i] + overflow[i] - 255;
				} else {
					console.log(pos + this.config.incr[i] + overflow[i]);
					return pos + this.config.incr[i] + overflow[i];
				}
			});

			console.log(overflow);
		}
	}

	/**
	 * Lookup the current address.
	 */
	async lookupCurrentAddr() {
		const addr = this.config.position.join(".");
		logger.info(`[${this.id}][${addr}] Ping...`);

		const pingable = await ping(addr);

		if (!pingable.success) {
			logger.info(`[${this.id}][${addr}] Ping failed`);
			return;
		}
		return;
	}
}
