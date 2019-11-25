import { bold } from "colors/safe";
import { connect } from "mongoose";

import { Manager } from "./structures/Manager";
import * as env from "./util/env";
import { logger } from "./util/logging";

console.log(bold(`netmap v${require("../package.json").version}`));

const manager = new Manager({ mapperCount: 16 });
manager.start();
