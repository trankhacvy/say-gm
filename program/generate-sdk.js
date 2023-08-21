const path = require("path");
const {
  rustbinMatch,
  confirmAutoMessageConsole,
} = require("@metaplex-foundation/rustbin");
const { spawn } = require("child_process");
const { Solita } = require("@metaplex-foundation/solita");
const { writeFile } = require("fs/promises");

const PROGRAM_NAME = "demo_anchor";
const PROGRAM_ID = "EH9Nibp4mjdnTeU14aVV9q4xBmoRwcpZvqF93s9tFwRx";

// const programDir = path.join(__dirname, "programs", "demo-anchor");
// const cargoToml = path.join(programDir, "Cargo.toml");
// const generatedIdlDir = path.join(__dirname, "target", "idl");
// const generatedSDKDir = path.join(__dirname, "js", "src", "generated");
// const rootDir = path.join(__dirname, ".crates");

const programDir = path.join(__dirname, "programs", "demo-anchor");
const cargoToml = path.join(programDir, "Cargo.toml");
const idlDir = path.join(__dirname, "target", "idl");
const sdkDir = path.join(__dirname, "js", "src", "generated");
const binaryInstallDir = path.join(__dirname, ".crates");

// const _rustbinConfig = {
//   idlGenerator: "anchor",
//   programName: "demo_anchor",
//   idlDir,
//   sdkDir,
//   binaryInstallDir,
//   programDir,
//   removeExistingIdl: false,
// };

const rustbinConfig = {
  rootDir: binaryInstallDir,
  binaryName: 'anchor',
  binaryCrateName: 'anchor-cli',
  libName: 'anchor-lang',
  dryRun: false,
  cargoToml,
}

async function main() {
  console.log("rustbinConfig", rustbinConfig);

  const { fullPathToBinary: anchorExecutable } = await rustbinMatch(
    rustbinConfig,
    confirmAutoMessageConsole
  );
  console.log("fullPathToBinary", anchorExecutable);
  // const anchor = spawn(anchorExecutable, ["build", "--idl", generatedIdlDir], {
  //   cwd: programDir,
  // })
  //   .on("error", (err) => {
  //     console.error(err);
  //     // @ts-ignore this err does have a code
  //     if (err.code === "ENOENT") {
  //       console.error(
  //         "Ensure that `anchor` is installed and in your path, see:\n  https://project-serum.github.io/anchor/getting-started/installation.html#install-anchor\n"
  //       );
  //     }
  //     process.exit(1);
  //   })
  //   .on("exit", () => {
  //     console.log(
  //       "IDL written to: %s",
  //       path.join(idlDir, `${PROGRAM_NAME}.json`)
  //     );
  //     generateTypeScriptSDK();
  //   });

  // anchor.stdout.on("data", (buf) => console.log(buf.toString("utf8")));
  // anchor.stderr.on("data", (buf) => console.error(buf.toString("utf8")));
}

async function generateTypeScriptSDK() {
  console.error("Generating TypeScript SDK to %s", sdkDir);
  const generatedIdlPath = path.join(idlDir, `${PROGRAM_NAME}.json`);

  const idl = require(generatedIdlPath);
  if (idl.metadata?.address == null) {
    idl.metadata = { ...idl.metadata, address: PROGRAM_ID };
    await writeFile(generatedIdlPath, JSON.stringify(idl, null, 2));
  }
  const gen = new Solita(idl, { formatCode: true });
  await gen.renderAndWriteTo(sdkDir);

  console.error("Success!");

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
