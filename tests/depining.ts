import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Depining } from "../target/types/depining";
const commitment: anchor.web3.Commitment = "confirmed";

describe("depining", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.depining as Program<Depining>;

  // Create a new keypair for the sensor
  const sensorId = new anchor.web3.Keypair();

  const sensorData = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("sensor"), sensorId.publicKey.toBuffer()],
    program.programId,
  )[0];

  it("Airdrop\n", async () => {
    // Request airdrop for the Sensor
    const signature = await anchor.getProvider().connection.requestAirdrop(
      sensorId.publicKey,
      .05 * anchor.web3.LAMPORTS_PER_SOL
    ).then(confirmTx);

    console.log("Transaction signature", signature);

  });

  it("Sensor initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initializeSensor()
      .accountsPartial({
        sensorId: sensorId.publicKey,
        sensorData: sensorData,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([sensorId])
      .rpc();
    console.log("Your transaction signature", tx);
  });

  it("Feed sensor data!", async () => {
    // Add your test here.
    const tx = await program.methods.feedData(
      5,
      10,
      100,
      1550,
      1111
    )
      .accountsPartial({
        sensorId: sensorId.publicKey,
        sensorData: sensorData
      })
      .signers([sensorId])
      .rpc({ skipPreflight: true });
      
    console.log("Your transaction signature", tx);
  });

  // Helper function to confirm a transaction
  const confirmTx = async (signature: string) => {
    const latestBlockhash = await anchor.getProvider().connection.getLatestBlockhash();
    await anchor.getProvider().connection.confirmTransaction(
      {
        signature,
        ...latestBlockhash,
      },
      commitment
    )
  }
});