import * as fs from "fs";
import * as path from "path";

const lockFile = path.resolve(process.cwd(), ".next", "dev", "lock");

function main() {
  try {
    if (fs.existsSync(lockFile)) {
      fs.unlinkSync(lockFile);
      console.log(`Removed stale dev lock: ${lockFile}`);
    } else {
      console.log("No dev lock found.");
    }
  } catch (err) {
    console.error("Failed to remove dev lock:", err);
    process.exit(1);
  }
}

main();
