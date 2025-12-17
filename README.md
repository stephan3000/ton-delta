# TonDelta: The Legacy DEX, Reimagined for TON

**Bringing the first successful decentralized exchange model to The Open Network.**

---

## 🚀 Mission
**TonDelta** is a pioneering initiative to port the core logic of EtherDelta—Ethereum’s first fully decentralized exchange—to the TON blockchain. By rewriting this foundational DeFi protocol in **Tact**, we are proving that complex, order-book based financial primitives can thrive in TON's asynchronous, actor-based architecture.

We are building the bridge between the history of DeFi and its future on Telegram.

## 💡 The Problem
While AMMs (Automated Market Makers) dominate modern DeFi, they suffer from impermanent loss and lack the precision of order books. 
-   **Order Book Gap**: Truly decentralized, on-chain order books are rare on TON due to the complexity of managing state in an asynchronous environment.
-   **Developer Barrier**: Porting Solidity logic to TON's TVM is historically difficult, creating a barrier for Ethereum veterans entering the ecosystem.

## 🛠 The Solution: TonDelta
TonDelta is a fully functional, trustless exchange smart contract written in **Tact**. It stays true to the original EtherDelta design while adapting to TON's unique capabilities.

### Key Features
-   **Trustless Order Book**: Makers place orders on-chain; Takers fill them directly. No off-chain matching engine required.
-   **Native & Jetton Support**: Seamlessly trade TON and any Jetton (Top-20, Memecoins, Stablecoins).
-   **Censorship Resistant**: No admin keys, no pause functionality, fully immutable logic.
-   **Tact Native**: Written in the modern, type-safe Tact language, serving as a reference implementation for complex DeFi logic.

## 🏗 Technical Architecture
TonDelta overcomes significant technical challenges to bring this model to life:
-   **Asynchronous Settlement**: Handles Maker/Taker trade flows across shardchains without locking liquidity.
-   **Optimized Storage**: Utilizes `map<Address, Int>` with custom SHA256-based address derivation to efficiently store order books and user balances without `Cell underflow` limits.
-   **Gas Efficiency**: Streamlined logic ensures low-cost order placement and execution.

## 🗺 Roadmap

### Phase 1: Core Protocol (✅ Completed)
-   [x] **Smart Contract Port**: Full reimplementation of `Deposit`, `Withdraw`, `Order`, and `Trade` in Tact.
-   [x] **Unit Testing**: Comprehensive test suite verifying all economic flows in the Sandbox environment.
-   [x] **Security Hardening**: Resolved serialization and underflow edge cases.

### Phase 2: User Experience (In Progress)
-   [ ] **Telegram Mini App (TWA)**: A "trading terminal in your pocket." Full DEX UI embedded directly in Telegram.
-   [ ] **TON Connect Integration**: One-click login and signing for 900M+ Telegram users.
-   [ ] **Push Notifications**: Real-time alerts for order fills via Telegram bot.

### Phase 3: Ecosystem Growth
-   [ ] **Mainnet Launch**: Deploying the immutable contract to TON Mainnet.
-   [ ] **Liquidity Program**: Incentives for early market makers.
-   [ ] **SDK Release**: TypeScript SDK for bots and aggregators to plug into TonDelta liquidity.

## 💰 Why Support TonDelta?
(For TON Grant Committee)

1.  **Technical Showcase**: TonDelta serves as a powerful case study for porting Solidity applications to Tact, lowering the barrier for EVM developers.
2.  **DeFi Diversity**: It brings a classic Order Book model to the TON DeFi ecosystem, offering an alternative to AMMs.
3.  **Telegram-First**: Designed from day one to live inside a Telegram Mini App, leveraging TON's biggest competitive advantage.

---

*Built with ❤️ on TON.*
