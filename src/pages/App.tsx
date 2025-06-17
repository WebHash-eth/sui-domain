import React, { useEffect, useState } from "react";
import { WalletKitProvider, ConnectButton, useWalletKit } from "@mysten/wallet-kit";
import { FiSun, FiMoon, FiLogOut } from "react-icons/fi";
import { FaUserAstronaut } from "react-icons/fa6";

import { fetchSuinsDomains, updateSuinsDomainCID } from "../utils/suins";
import { SuinsDomain } from "../types/suins";
import { useQueryParam } from "../hooks/useQueryParam";
import DomainDropdown from "../components/DomainDropdown";
import CIDInput from "../components/CIDInput";
import Confirmation from "../components/Confirmation";

// Robust IPFS CID validation: CIDv0 (Qm...), CIDv1 (bafy...), base32, base58btc, length check
function isValidCID(cid: string) {
  // CIDv0: Qm... base58btc, length 46
  if (/^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(cid)) return true;
  // CIDv1: base32 (bafy...), length 59, lowercase
  if (/^bafy[a-z2-7]{56,}$/i.test(cid)) return true;
  // Accept any CID that parses as base32 or base58btc and is at least 46 chars
  if (/^[a-z0-9]{46,}$/.test(cid)) return true;
  return false;
}

const TX_EXPLORER = "https://suivision.xyz/txblock/";

const MainApp: React.FC = () => {
  const { signAndExecuteTransactionBlock, disconnect } = useWalletKit();
  const { currentAccount } = useWalletKit();
  const [domains, setDomains] = useState<SuinsDomain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [cid, setCID] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cidFromUrl = useQueryParam("cid");
  const isCIDReadOnly = !!cidFromUrl;

  useEffect(() => {
    if (cidFromUrl) setCID(cidFromUrl);
  }, [cidFromUrl]);

  useEffect(() => {
    if (currentAccount?.address) {
      fetchSuinsDomains(currentAccount.address).then(setDomains);
    }
  }, [currentAccount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedDomain) {
      setError("Please select a domain.");
      return;
    }
    if (!cid) {
      setError("Please enter a CID.");
      return;
    }
    if (!isValidCID(cid)) {
      setError("Invalid IPFS CID format.");
      return;
    }
    setLoading(true);
    const domain = domains.find((d) => d.address === selectedDomain)!;
    const result = await updateSuinsDomainCID(domain, cid, { signAndExecuteTransactionBlock });
    setLoading(false);
    if (result.success) {
      setConfirmation(result.txDigest || "");
    } else {
      setError(result.error || "Failed to update domain");
    }
  };

  if (!currentAccount)
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#232946] via-[#1a1a2e] to-[#0f3460] transition-colors duration-300">
        <div className="mb-6 text-2xl font-bold text-gray-100">SUI SUINS IPFS Linker</div>
        <ConnectButton />
      </div>
    );

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#232946] via-[#1a1a2e] to-[#0f3460] dark:from-[#181a23] dark:via-[#13141a] dark:to-[#0a0a13] transition-colors duration-300">
      <div className="absolute top-4 right-4 z-10">
        {currentAccount && (
          <button
            className="px-2 py-1 rounded bg-gray-200 text-sm text-gray-900 shadow-md flex items-center gap-1 hover:bg-gray-300 transition"
            onClick={() => disconnect()}
            title="Disconnect Wallet"
          >
            <FiLogOut className="inline-block" />
            Disconnect
          </button>
        )}
      </div>
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-lg bg-[#1a1a2e]/90 border border-white/20 flex flex-col items-center relative animate-glow">
        {/* Avatar/icon */}
        <div className="flex items-center justify-center mb-4 bg-[#232946]/80 rounded-full shadow-lg w-20 h-20 -mt-16 border-4 border-blue-400 backdrop-blur-lg">
          <FaUserAstronaut className="text-4xl text-blue-400" />
        </div>
        <div className="mb-2 text-3xl font-bold text-center text-white drop-shadow-lg font-sans">
          SUI domain IPFS Linker
        </div>
        <div className="mb-6 text-center text-gray-300 text-base font-medium">
          Instantly link your SUINS domain to IPFS content on Sui Mainnet.
        </div>
        {confirmation ? (
          <div className="flex flex-col items-center">
            <Confirmation txDigest={confirmation} onClose={() => setConfirmation(null)}>
              {(() => {
                const domainObj = domains.find((d) => d.address === selectedDomain);
                if (domainObj) {
                  // Remove any trailing .sui from domain name (if present)
                  const cleanName = domainObj.name.replace(/\.sui$/, "");
                  return (
                    <div className="mt-2 text-center text-blue-700 dark:text-blue-400 text-base font-semibold">
                      Visit your decentralized website at{' '}
                      <a
                        href={`https://${cleanName}.sui.id`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-blue-700 dark:text-blue-300 underline hover:text-blue-900 hover:dark:text-blue-200 transition"
                      >
                        {cleanName}.sui.id
                      </a>
                    </div>
                  );
                }
                return null;
              })()}
            </Confirmation>
            <a
              href={`${TX_EXPLORER}${confirmation}?network=mainnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 underline text-center mt-2"
            >
              View on SuiVision
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full">
            <DomainDropdown
              domains={domains}
              selected={selectedDomain}
              onChange={setSelectedDomain}
            />
            <CIDInput
              value={cid}
              readOnly={isCIDReadOnly}
              onChange={setCID}
            />
            {error && (
              <div className="mb-2 text-red-600 text-sm text-center font-semibold drop-shadow">{error}</div>
            )}
            <button
              type="submit"
              className="w-full py-2 px-4 mt-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-white transition disabled:opacity-50 flex items-center justify-center"
              disabled={!selectedDomain || !cid || loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
              ) : null}
              {loading ? "Updating..." : "Update Domain"}
            </button>
          </form>
        )}
        {/* Footer/credit */}
        <div className="w-full flex justify-center mt-8 mb-2">
          <span className="text-xs text-gray-400 font-mono">Made with ❤️ on Sui by webhash.com</span>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <WalletKitProvider>
    <MainApp />
  </WalletKitProvider>
);

export default App;
