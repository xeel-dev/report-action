import { exec } from "child_process";
import { promisify } from "util";
import core from "@actions/core";
const execAsync = promisify(exec);
export async function run() {
    try {
        const args = {
            auth: "github",
            repository: "$GITHUB_REPOSITORY",
            organization: core.getInput("organization", { required: true }),
        };
        core.debug(`Running xeel with args: ${JSON.stringify(args)}`);
        const { stdout } = await execAsync(`npx xeel dependency-debt report ${Object.entries(args)
            .map(([key, value]) => `--${key} ${value}`)
            .join(" ")}`);
        core.info(stdout);
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
        else {
            core.setFailed("An unknown error occurred");
        }
    }
}
