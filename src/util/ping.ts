import { exec } from "child_process";

interface Ping {
	success: boolean;
	addr: string;
	delta: number;
}

/**
 * Ping an address.
 * @param addr
 * @param expire
 */
export const ping = (addr: string, expire = 1e3): Promise<Ping> =>
	new Promise((resolve, reject) => {
		const start = Date.now();
		let didFinish = false;

		const timeout = setTimeout(() => {
			if (!didFinish) {
				resolve({
					addr,
					delta: -1,
					success: false,
				});
			}
		}, expire);

		exec(`ping -c 1 -s 8 ${addr}`, (err, stout) => {
			clearTimeout(timeout);
			if (err) {
				return resolve({
					addr,
					delta: -1,
					success: false,
				});
			}
			return resolve({
				addr,
				delta: Date.now() - start,
				success: true,
			});
		});
	});
