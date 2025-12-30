import "dotenv/config";
import http from "http";
import fs from "fs";
import path from "path";
import {
  createPublicClient,
  http as viemHttp,
  parseAbiItem,
  formatUnits,
} from "viem";
import { base } from "viem/chains";

const USDC_ADDRESS = process.env.USDC_ADDRESS as `0x${string}`;
const DISTRIBUTOR = process.env.DISTRIBUTOR_ADDRESS!.toLowerCase();
const PORT = 8787;

const client = createPublicClient({
  chain: base,
  transport: viemHttp(process.env.BASE_RPC),
});

// 🧠 In-memory store
const leaderboard: Record<string, bigint> = {};

// 🔹 Load seed.csv (ONE TIME)
function loadSeed() {
  const file = path.join(process.cwd(), "seed.csv");
  const lines = fs.readFileSync(file, "utf8").trim().split("\n");

  for (let i = 1; i < lines.length; i++) {
    const [address, amount] = lines[i].split(",");
    leaderboard[address.toLowerCase()] =
      BigInt(Math.floor(Number(amount) * 1e6));
  }

  console.log(`🌱 Seed loaded: ${Object.keys(leaderboard).length} users`);
}

// 🔹 Live indexer (future tx only)
async function startIndexer() {
  loadSeed();

  const transferEvent = parseAbiItem(
    "event Transfer(address indexed from, address indexed to, uint256 value)"
  );

  console.log("🚀 Listening for new rewards...");

  client.watchEvent({
    address: USDC_ADDRESS,
    event: transferEvent,
    onLogs: (logs) => {
      for (const log of logs) {
        const from = (log.args.from as string).toLowerCase();
        const to = (log.args.to as string).toLowerCase();
        const value = log.args.value as bigint;

        if (from !== DISTRIBUTOR) continue;

        leaderboard[to] = (leaderboard[to] || 0n) + value;

        console.log(
          `💸 New reward → ${to} : ${formatUnits(value, 6)} USDC`
        );
      }
    },
  });
}

// 🌐 API
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  if (req.url === "/leaderboard") {
    const sorted = Object.entries(leaderboard)
      .map(([address, amount]) => ({
        address,
        usdc: Number(amount) / 1e6,
      }))
      .sort((a, b) => b.usdc - a.usdc);

    res.end(JSON.stringify(sorted));
    return;
  }

  if (req.url === "/total") {
    const total = Object.values(leaderboard).reduce(
      (a, b) => a + Number(b),
      0
    );

    res.end(JSON.stringify({ totalUSDC: total / 1e6 }));
    return;
  }

  if (req.url === "/health") {
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: "Not found" }));
});

// ▶️ Start
startIndexer();
server.listen(PORT, () => {
  console.log(`🌐 API running at http://localhost:${PORT}`);
});
