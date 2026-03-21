import { Options, TestOptions, MonitorOptions } from '../types';
/**
 * Returns a shallow clone of the original `options` object with any
 * plugin-specific configuration injected.
 */
export declare function buildPluginOptions(options: Options & (TestOptions | MonitorOptions)): Promise<Options & (TestOptions | MonitorOptions)>;
