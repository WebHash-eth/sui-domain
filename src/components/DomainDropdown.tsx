import React from "react";
import { SuinsDomain } from "../types/suins";

interface Props {
  domains: SuinsDomain[];
  selected: string;
  onChange: (domain: string) => void;
}

import React, { Fragment } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { FiChevronDown, FiSearch } from "react-icons/fi";

const DomainDropdown: React.FC<Props> = ({ domains, selected, onChange }) => {
  const [query, setQuery] = React.useState("");
  const filtered =
    query === ""
      ? domains
      : domains.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()));

  const selectedDomain = domains.find((d) => d.address === selected) || null;

  return (
    <div className="mb-4 w-full">
      <label className="block mb-2 font-semibold text-gray-400 dark:text-gray-100">
        Select SUINS Domain
      </label>
      <Combobox value={selectedDomain} onChange={(d) => onChange(d.address)}>
        <div className="relative">
          <Combobox.Button as="div" className="relative w-full cursor-pointer overflow-hidden rounded-lg bg-white/90 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 text-left shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 sm:text-sm transition group">
            <Combobox.Input
              className="w-full border-none bg-transparent py-2 pl-10 pr-8 text-gray-800 dark:text-gray-100 focus:ring-0 placeholder-gray-400 dark:placeholder-gray-500 group-hover:bg-white group-hover:dark:bg-gray-700"
              displayValue={(domain: any) => domain?.name || ""}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search or select domain..."
            />
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400 dark:text-blue-300">
              <FiSearch />
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
              <FiChevronDown className="h-5 w-5 text-blue-400 dark:text-blue-300" aria-hidden="true" />
            </span>
          </Combobox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white/95 dark:bg-gray-800/95 py-1 text-base shadow-lg ring-1 ring-black/10 dark:ring-white/10 focus:outline-none sm:text-sm backdrop-blur-lg border border-gray-200 dark:border-gray-700">
              {filtered.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 rounded">
                  No domains found
                </div>
              ) : (
                filtered.map((domain) => (
                  <Combobox.Option
                    key={domain.address}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 rounded transition ${
                        active
                          ? "bg-blue-50 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100"
                          : "text-gray-800 dark:text-gray-100 bg-white/95 dark:bg-gray-800/95"
                      }`
                    }
                    value={domain}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${selected ? "font-semibold" : "font-normal"}`}
                        >
                          {domain.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400`}
                          >
                            <FiSearch className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};

export default DomainDropdown;
