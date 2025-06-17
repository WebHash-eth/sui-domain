# SUI SUINS IPFS Linker

A Web3 application to link IPFS CIDs with SUINS domains on the Sui blockchain. Built with React, TypeScript, and TailwindCSS.

> **Developed by the Webhash team to empower decentralized websites built using the Webhash no-code decentralized website builder.**

## 🚀 Features
- Connect to Sui wallet
- Fetch and select SUINS domains
- Input or prefill IPFS CID from URL
- Update SUINS domain with IPFS CID
- Confirmation and feedback UI

## 🛠 Tech Stack
- [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [@mysten/wallet-kit](https://github.com/MystenLabs/sui/tree/main/sdk/wallet-kit)
- [@mysten/sui.js](https://github.com/MystenLabs/sui/tree/main/sdk/sui.js)
- Sui Devnet/Testnet

## ⚡ Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/WebHash-eth/sui-domain.git
   cd your-repo-name
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the app:**
   ```bash
   npm run dev
   ```

## 📖 Usage
- Open the app in your browser (usually http://localhost:5173 or similar).
- Connect your Sui wallet.
- Select a SUINS domain you own.
- Enter or paste your IPFS CID.
- Link the CID to your domain and confirm the transaction.

## 📁 Folder Structure
```
src/
  components/   # UI components
  hooks/        # Custom React hooks
  utils/        # Utility functions
  types/        # TypeScript types
  pages/        # Main pages
```

## 🤝 Contributing
Contributions are welcome! Please open issues or submit pull requests for new features, bug fixes, or suggestions.

## 📄 License
This project is licensed under the MIT License.

## 🙏 Acknowledgements
- [Mysten Labs](https://mystenlabs.com/) for Sui blockchain tools
- [IPFS](https://ipfs.tech/) for decentralized storage
- [React](https://reactjs.org/), [TailwindCSS](https://tailwindcss.com/) and the open-source community
