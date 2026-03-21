export interface GoCommandResult {
    exitCode: number;
    stdout: string;
    stderr: string;
}
/**
 * Executes a subcommand on the Go CLI binary and returns the result.
 *
 * The Go binary path is read from the SNYK_INTERNAL_CLI_EXECUTABLE_PATH environment
 * variable, which is set by the Go wrapper when it spawns the TypeScript CLI.
 *
 * The promise always resolves with a {@link GoCommandResult} containing the
 * exitCode, stdout, and stderr — even for non-zero exit codes. This allows
 * consumers to inspect the result and decide how to handle failures.
 *
 * The promise only rejects for infrastructure/environment errors:
 * - SNYK_INTERNAL_CLI_EXECUTABLE_PATH is not set
 * - The child process fails to spawn (e.g., binary not found)
 * - stdout exceeds the maximum buffer size
 *
 * @param args - The arguments to pass to the Go Snyk CLI binary (e.g., ['depgraph', '--file=uv.lock'])
 * @param options - Optional settings for the child process
 * @returns A result object with the exitCode, stdout, and stderr
 * @throws If SNYK_INTERNAL_CLI_EXECUTABLE_PATH is not set, or the process fails to spawn
 */
export declare function execGoCommand(args: string[], options?: {
    cwd?: string;
}): Promise<GoCommandResult>;
