/// <reference types="node" />
export declare function createIacDir(): void;
export declare function extractBundle(response: NodeJS.ReadableStream): Promise<void>;
export declare function isValidBundle(wasmPath: string, dataPath: string): boolean;
export declare function computeCustomRulesBundleChecksum(): string | undefined;
/**
 * makeFileAndDirectoryGenerator is a generator function that helps walking the directory and file structure of this pathToScan
 * @param root
 * @param maxDepth? - An optional `maxDepth` argument can be provided to limit how deep in the file tree the search will go.
 * @param isExcluded - Function to skip specific paths
 * @returns {Generator<object>} - a generator which yields an object with directories or paths for the path to scan
 */
export declare function makeFileAndDirectoryGenerator(root?: string, maxDepth?: number, isExcluded?: ExclusionMatcher): Generator<any, void, any>;
export type ExclusionMatcher = (pathToCheck: string) => boolean;
/**
 * Creates a path matcher function from a comma-separated string of basenames.
 * @param rawExcludeFlag - Comma-separated basenames: "node_modules,temp"
 * @returns A function that takes a path and returns true if it should be excluded.
 */
export declare function createPathExclusionMatcher(rawExcludeFlag: string): ExclusionMatcher;
