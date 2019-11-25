import * as colors from "colors/safe";
import { EventEmitter } from "events";
import { resolve } from "path";

type LogLevel = "info" | "error" | "success" | "warn";

interface LogEvent {
	type: LogLevel;
	message: any[];
}

interface LoggerOptions {
	outputFile?: string;
	outputDirectory?: string;
	rotate: boolean;
}

const DefaultLoggerOptions: LoggerOptions = {
	outputFile: resolve(process.cwd(), "logs"),
	rotate: true,
};

export declare interface Logger {
	on(eventName: "log", listener: (ev: LogEvent) => any): this;
}

export class Logger extends EventEmitter {
	public options: LoggerOptions;

	public static logLevelColorMap = {
		success: "green",
		info: "blue",
		error: "red",
		warn: "yellow",
	};

	constructor(opts: LoggerOptions = DefaultLoggerOptions) {
		super();
		this.options = Object.assign({}, DefaultLoggerOptions, opts);
	}

	/**
	 * Success log message
	 * @param msg
	 */
	success(...msg: any[]) {
		this.createLogEvent("success", ...msg);
	}

	/**
	 * Info log message
	 * @param msg
	 */
	info(...msg: any[]) {
		this.createLogEvent("info", ...msg);
	}

	/**
	 * Error log message
	 * @param msg
	 */
	error(...msg: any[]) {
		this.createLogEvent("error", ...msg);
	}

	/**
	 * Warn log message
	 * @param msg
	 */
	warn(...msg: any[]) {
		this.createLogEvent("warn", ...msg);
	}

	private createLogEvent(type: LogLevel, ...message: any[]) {
		const logEvent = {
			type,
			message,
		} as LogEvent;

		console.log(colors[Logger.logLevelColorMap[type]](type), ...message);
		this.emit("log", logEvent);
	}
}

/**
 * Default logger.
 */
export const logger = new Logger();
