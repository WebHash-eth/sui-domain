import { SuinsDomain } from "../types/suins";

import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';

const SUINS_STRUCT_TYPE =
  '0xd22b24490e0bae52676651b4f56660a5ff8022a2576e0089f79b3c88d44e08f0::suins_registration::SuinsRegistration';

// Fetch SUINS domains owned by an address using Sui JSON-RPC
export async function fetchSuinsDomains(owner: string): Promise<SuinsDomain[]> {
  const suiClient = new SuiClient({ url: 'https://suins-rpc.mainnet.sui.io' });
  const resp = await suiClient.getOwnedObjects({
    owner,
    filter: { StructType: SUINS_STRUCT_TYPE },
    options: { showContent: true, showDisplay: true },
  });

  return (resp.data || []).map((obj: any) => {
    const fields = obj.data?.content?.fields;
    return {
      name: fields?.domain_name || '', // for display
      address: obj.data?.objectId || '', // for value
      metadata: fields,
    };
  });
}



// Live on-chain update of SUINS domain's IPFS record
import { Transaction } from '@mysten/sui/transactions';
import { SuinsClient } from '@mysten/suins';


/**
 * Updates the IPFS record (contentHash) of a SUINS domain on-chain.
 * @param domain The SUINS domain object (from fetchSuinsDomains)
 * @param cid The IPFS CID to set as the contentHash
 * @param signer The wallet adapter (from walletKit)
 */
export async function updateSuinsDomainCID(
  domain: SuinsDomain & { version?: number; digest?: string },
  cid: string,
  signer: any // expects walletKit's signAndExecuteTransactionBlock
): Promise<{ success: boolean; txDigest?: string; error?: string }> {
  try {
    // Sui client for mainnet
    const suiClient = new SuiClient({ url: 'https://suins-rpc.mainnet.sui.io' });

    // --- HARDCODED CONSTANTS (from suins.io MoveCall) ---
    // Controller shared object (Input 0)
    const CONTROLLER_OBJECT_ID = '0x6e0ddefc0ad98889c04bab9639e512c21766c5e6366f89e696956d9be6952871';
    const CONTROLLER_INITIAL_SHARED_VERSION = 13;
    // SUI system state shared object (Input 4)
    const SUI_SYSTEM_STATE_OBJECT_ID = '0x0000000000000000000000000000000000000000000000000000000000000006';
    const SUI_SYSTEM_STATE_INITIAL_SHARED_VERSION = 1;

    // --- DOMAIN OBJECT (Input 1) ---
    // Only pass the domain objectId as an owned object reference
    if (!domain.address) {
      throw new Error('Domain objectId (address) is required');
    }

    // Prepare transaction block
    const tx = new Transaction();
    tx.moveCall({
      target: '0x71af035413ed499710980ed8adb010bbf2cc5cacf4ab37c7710a4bb87eb58ba5::controller::set_user_data',
      arguments: [
        // Input 0: controller shared object
        tx.sharedObjectRef({
          objectId: CONTROLLER_OBJECT_ID,
          initialSharedVersion: CONTROLLER_INITIAL_SHARED_VERSION,
          mutable: true,
        }),
        // Input 1: domain object (owned NFT)
        tx.object(domain.address),
        // Input 2: key ('content_hash')
        tx.pure.string('content_hash'),
        // Input 3: value (IPFS CID)
        tx.pure.string(cid),
        // Input 4: SUI system state shared object
        tx.sharedObjectRef({
          objectId: SUI_SYSTEM_STATE_OBJECT_ID,
          initialSharedVersion: SUI_SYSTEM_STATE_INITIAL_SHARED_VERSION,
          mutable: false,
        }),
      ],
    });

    // Sign and execute transaction
    const { digest } = await signer.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      options: { showEffects: true },
    });

    return { success: true, txDigest: digest };
  } catch (error: any) {
    return { success: false, error: error.message || String(error) };
  }
}

