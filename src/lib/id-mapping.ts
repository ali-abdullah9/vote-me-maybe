// id-mapping.ts
// This file provides utilities for mapping between Convex IDs and blockchain IDs

// Store mappings in localStorage
const MAPPING_KEY_PREFIX = "id_mapping_";
const REVERSE_MAPPING_KEY_PREFIX = "reverse_id_mapping_";

/**
 * Store a mapping between a Convex ID and a blockchain ID
 * 
 * @param convexId - The Convex ID (string)
 * @param blockchainId - The numeric blockchain ID
 */
export const storeMapping = (convexId: string, blockchainId: number): void => {
  try {
    // Store the mapping in both directions
    localStorage.setItem(`${MAPPING_KEY_PREFIX}${convexId}`, blockchainId.toString());
    localStorage.setItem(`${REVERSE_MAPPING_KEY_PREFIX}${blockchainId}`, convexId);
    
    console.log(`Stored ID mapping: Convex ${convexId} ↔ Blockchain ${blockchainId}`);
  } catch (error) {
    console.error("Error storing ID mapping:", error);
  }
};

/**
 * Get the blockchain ID corresponding to a Convex ID
 * 
 * @param convexId - The Convex ID
 * @returns The blockchain ID, or 0 if not found
 */
export const getBlockchainId = (convexId: string): number => {
  try {
    const blockchainId = localStorage.getItem(`${MAPPING_KEY_PREFIX}${convexId}`);
    if (blockchainId) {
      return parseInt(blockchainId, 10);
    }
    return 0;
  } catch (error) {
    console.error("Error getting blockchain ID:", error);
    return 0;
  }
};

/**
 * Get the Convex ID corresponding to a blockchain ID
 * 
 * @param blockchainId - The blockchain ID
 * @returns The Convex ID, or null if not found
 */
export const getConvexId = (blockchainId: number): string | null => {
  try {
    return localStorage.getItem(`${REVERSE_MAPPING_KEY_PREFIX}${blockchainId}`);
  } catch (error) {
    console.error("Error getting Convex ID:", error);
    return null;
  }
};

/**
 * Clear all ID mappings
 */
export const clearMappings = (): void => {
  try {
    // Get all keys in localStorage
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith(MAPPING_KEY_PREFIX) || key.startsWith(REVERSE_MAPPING_KEY_PREFIX))) {
        keys.push(key);
      }
    }
    
    // Remove all mapping keys
    keys.forEach(key => localStorage.removeItem(key));
    
    console.log(`Cleared ${keys.length} ID mappings`);
  } catch (error) {
    console.error("Error clearing ID mappings:", error);
  }
};