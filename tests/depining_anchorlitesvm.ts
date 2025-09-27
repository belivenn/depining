import { fromWorkspace, LiteSVMProvider } from "anchor-litesvm";
import { getProvider, Program } from "@coral-xyz/anchor";
import { Depining } from "../target/types/depining";
import IDL from "../target/idl/depining.json";
import {Keypair, PublicKey, SystemProgram } from "@solana/web3.js";

describe("depining", () => {

  const client = fromWorkspace(".");
  const provider = new LiteSVMProvider(client);

  const program = new Program<Depining>(IDL, provider);

  // Create a new keypair for the sensor
  const sensorId = new Keypair();

  const sensorData = PublicKey.findProgramAddressSync(
    [Buffer.from("sensor"), sensorId.publicKey.toBuffer()],
    program.programId,
  )[0];

  it("Airdrop\n", async () => {
    let clock = client.getClock();
    console.log("SLOT", clock.slot);

    const result = client.airdrop(sensorId.publicKey, 1_000_000_000n);

    console.log("Airdrop result", result.toString());

    // Verificar o balance
    const balance = client.getBalance(sensorId.publicKey);
    console.log("Balance:", balance);
  });

  it("Sensor initialized!", async () => {
    const tx = await program.methods.initializeSensor()
      .accountsPartial({
        sensorId: sensorId.publicKey,
        sensorData: sensorData,
        systemProgram: SystemProgram.programId,
      })
      .signers([sensorId])
      .rpc();
    console.log("Your transaction signature", tx);
  });

  it("Feed sensor data!", async () => {
    client.warpToSlot(1n);
    let clock = client.getClock();
    console.log("SLOT", clock.slot);
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
      .rpc();

    console.log("Your transaction signature", tx);
  });
});