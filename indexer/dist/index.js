"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
const USDC_ADDRESS = process.env.USDC_ADDRESS;
const DISTRIBUTOR = process.env.DISTRIBUTOR_ADDRESS.toLowerCase();
const PORT = 8787;
const client = (0, viem_1.createPublicClient)({
    chain: chains_1.base,
    transport: (0, viem_1.http)(process.env.BASE_RPC),
});
// 🧠 In-memory store
const leaderboard = {};
// 🔹 Load seed.csv (ONE TIME)
function loadSeed() {
    const file = path_1.default.join(process.cwd(), "seed.csv");
    const lines = fs_1.default.readFileSync(file, "utf8").trim().split("\n");
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
    const transferEvent = (0, viem_1.parseAbiItem)("event Transfer(address indexed from, address indexed to, uint256 value)");
    console.log("🚀 Listening for new rewards...");
    client.watchEvent({
        address: USDC_ADDRESS,
        event: transferEvent,
        onLogs: (logs) => {
            for (const log of logs) {
                const from = log.args.from.toLowerCase();
                const to = log.args.to.toLowerCase();
                const value = log.args.value;
                if (from !== DISTRIBUTOR)
                    continue;
                leaderboard[to] = (leaderboard[to] || 0n) + value;
                console.log(`💸 New reward → ${to} : ${(0, viem_1.formatUnits)(value, 6)} USDC`);
            }
        },
    });
}
// 🌐 API
const server = http_1.default.createServer((req, res) => {
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
        const total = Object.values(leaderboard).reduce((a, b) => a + Number(b), 0);
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
