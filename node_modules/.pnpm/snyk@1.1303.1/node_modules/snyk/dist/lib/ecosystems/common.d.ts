import { Ecosystem, PluginResponse } from './types';
import { Options } from '../types';
export declare function isUnmanagedEcosystem(ecosystem: Ecosystem): boolean;
export declare function filterDockerFacts(pluginResponse: PluginResponse, ecosystem: Ecosystem, options: Options): Promise<PluginResponse>;
