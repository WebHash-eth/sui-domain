import React from "react";

interface Props {
  txDigest: string;
  onClose: () => void;
  children?: React.ReactNode;
}

const Confirmation: React.FC<Props> = ({ txDigest, onClose, children }) => (
  <div className="p-6 rounded-xl shadow-lg bg-white/60 dark:bg-gray-900/70 backdrop-blur border border-green-300 dark:border-green-700 mb-4 flex flex-col items-center">
    <div className="font-bold mb-2 text-green-700 dark:text-green-400 text-lg">Success!</div>
    {children}
    <div className="mb-2 text-gray-800 dark:text-gray-100">Transaction sent:</div>
    <div className="mb-2 break-all text-xs font-mono text-gray-700 dark:text-gray-300 bg-white/60 dark:bg-gray-800/60 px-2 py-1 rounded">
      {txDigest}
    </div>
    <button
      className="mt-3 px-5 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-700 dark:from-green-600 dark:to-green-800 text-white font-semibold shadow hover:from-green-600 hover:to-green-800 dark:hover:from-green-700 dark:hover:to-green-900 transition"
      onClick={onClose}
    >
      Close
    </button>
  </div>
);

export default Confirmation;
