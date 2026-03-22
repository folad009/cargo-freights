/// <reference types="node" />
import { Writable } from 'stream';
import { DepGraphData } from '@snyk/dep-graph';
import { Options } from '../types';
import { ContainerTarget, GitTarget } from '../project-metadata/types';
import { ProblemError } from '@snyk/error-catalog-nodejs-public';
import { FailedProjectScanError } from '../plugins/get-multi-plugin-result';
export declare function assembleQueryString(options: any): {
    org: string;
    severityThreshold?: boolean | undefined;
    ignorePolicy?: boolean | undefined;
} | null;
export declare enum SEVERITY {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
export declare const SEVERITIES: Array<{
    verboseName: SEVERITY;
    value: number;
}>;
export declare function colorTextBySeverity(severity: string, textToColor: string): string;
export declare enum FAIL_ON {
    all = "all",
    upgradable = "upgradable",
    patchable = "patchable"
}
export type FailOn = 'all' | 'upgradable' | 'patchable';
export declare const RETRY_ATTEMPTS = 3;
export declare const RETRY_DELAY = 500;
/**
 * printDepGraph writes the given dep-graph and target name to the destination
 * stream as expected by the `depgraph` CLI workflow.
 */
export declare function printDepGraph(depGraph: DepGraphData, targetName: string, destination: Writable): Promise<void>;
export declare function shouldPrintDepGraph(opts: Options): boolean;
/**
 * printEffectiveDepGraph writes the given, possibly pruned dep-graph and target file to the destination
 * stream as a JSON object containing both depGraph, normalisedTargetFile and targetFile from plugin.
 * This allows extracting the effective dep-graph which is being used for the test.
 */
export declare function printEffectiveDepGraph(depGraph: DepGraphData, normalisedTargetFile: string, targetFileFromPlugin: string | undefined, target: GitTarget | ContainerTarget | null | undefined, destination: Writable): Promise<void>;
/**
 * printEffectiveDepGraphError writes an error output for failed dependency graph resolution
 * to the destination stream in a format consistent with printEffectiveDepGraph.
 * This is used when --print-effective-graph-with-errors is set but dependency resolution failed.
 */
export declare function printEffectiveDepGraphError(root: string, failedProjectScanError: FailedProjectScanError, destination: Writable): Promise<void>;
/**
 * Checks if either --print-effective-graph or --print-effective-graph-with-errors is set.
 */
export declare function shouldPrintEffectiveDepGraph(opts: Options): boolean;
/**
 * shouldPrintEffectiveDepGraphWithErrors checks if the --print-effective-graph-with-errors flag is set.
 * This is used to determine if the effective dep-graph with errors should be printed.
 */
export declare function shouldPrintEffectiveDepGraphWithErrors(opts: Options): boolean;
/**
 * getOrCreateErrorCatalogError returns a ProblemError instance for consistent error catalog usage.
 * This helper is used to ensure errors are wrapped in a ProblemError so they can be reported in a standardized way,
 * especially when converting thrown errors from plugins and flows to error catalog format.
 */
export declare function getOrCreateErrorCatalogError(failedProjectScanError: FailedProjectScanError): ProblemError;
