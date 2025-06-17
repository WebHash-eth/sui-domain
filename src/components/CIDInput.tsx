import React from "react";

interface Props {
  value: string;
  readOnly: boolean;
  onChange: (value: string) => void;
}

const CIDInput: React.FC<Props> = ({ value, readOnly, onChange }) => (
  <div className="mb-4">
    <label className="block mb-2 font-semibold text-gray-400 dark:text-gray-100">IPFS CID</label>
    <input
      type="text"
      className="w-full p-2 rounded-lg bg-white/95 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 text-gray-800 dark:text-gray-100 shadow-sm placeholder-gray-400 dark:placeholder-gray-500 transition"
      value={value}
      readOnly={readOnly}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter IPFS CID"
    />
  </div>
);

export default CIDInput;
