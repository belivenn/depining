import { LiteSVM } from "litesvm";
import { Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
const programId = new PublicKey("H5bdVxHZQ7m9jELoocVRAjvBzS9D4i5hJNNSc8G58yDx");

describe("depining", () => {
  const svm = new LiteSVM();

  // Load the program with the right public key
  const program = svm.addProgramFromFile(programId, "target/deploy/depining.so");

  // Create a new keypair for the sensor
  const sensorId = new Keypair();

  svm.setAccount(sensorId.publicKey, {
    lamports: 1_000_000_000,
    data: Buffer.alloc(0),
    owner: SystemProgram.programId,
    executable: false,
  });

  // Get all the information about an account (data, lamports, owner, ...)
  const sensorInfo = svm.getAccount(sensorId.publicKey);
  console.log("Sensor info", sensorInfo);

  // Get the lamport balance of an account
  const sensorBalance = svm.getBalance(sensorId.publicKey);
  console.log("Sensor balance", sensorBalance);

  const sensorData = PublicKey.findProgramAddressSync(
    [Buffer.from("sensor"), sensorId.publicKey.toBuffer()],
    programId,
  )[0];


  it("Sensor initialized!", async () => {

    const tx = new Transaction();


    // Add the latest blockhash
    tx.recentBlockhash = svm.latestBlockhash();

    const instruction = new TransactionInstruction({
      programId: programId,
      keys: [
        { pubkey: sensorId.publicKey, isSigner: true, isWritable: true },
        { pubkey: sensorData, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data: Buffer.from([0]) // discriminator para initialize_sensor
    });

    tx.add(instruction);
    tx.sign(sensorId);

    const result = svm.sendTransaction(tx);

    console.log("Your transaction signature", result.toString());
  });

  // it("Feed sensor data!", async () => {
  //   // Add your test here.
  //   const tx = await program.methods.feedData(
  //     5,
  //     10,
  //     100,
  //     1550,
  //     1111
  //   )
  //     .accountsPartial({
  //       sensorId: sensorId.publicKey,
  //       sensorData: sensorData
  //     })
  //     .signers([sensorId])
  //     .rpc({ skipPreflight: true });

  //   console.log("Your transaction signature", tx);
  // });

});