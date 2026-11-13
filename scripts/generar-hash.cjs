const argon2 = require("argon2");

let input = Buffer.alloc(0);

process.stdin.on("data", chunk => {
  input = Buffer.concat([input, chunk]);
});

process.stdin.on("end", async () => {
  try {
    let password;

    if (input.includes(0)) {
      password = input.toString("utf16le").replace(/\0+$/, "").replace(/[\r\n]+$/, "");
    } else {
      password = input.toString("utf8").replace(/[\r\n]+$/, "");
    }

    if (password.length < 14 || password.length > 128) {
      throw new Error("La contraseña debe tener entre 14 y 128 caracteres.");
    }

    const hash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1
    });

    console.log("\nHASH ARGON2ID:\n");
    console.log(hash);
    password = "";
  } catch (error) {
    console.error("Error:", error.message);
    process.exitCode = 1;
  }
});
