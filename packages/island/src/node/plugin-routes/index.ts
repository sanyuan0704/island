import path from 'path';
import { PageModule } from '@shared/types';
import type { Plugin } from 'vite';
import { normalizePath } from 'vite';
import { RouteService } from './RouteService';
import type { ComponentType } from 'react';
import { RouteOptions } from 'shared/types/index';

export const DEFAULT_EXCLUDE = ['**/node_modules/**', '**/.*', '**/dist/**'];

/**
 * How does the conventional route work?
 * Essentially, it turns files into route object, e.g. src/pages/index.tsx -> { path: '/', element: <Index /> }
 * Implementation details:
 * 1. Find all files under src/pages (or the configured directory)
 * 2. Convert the file path to a route object
 * 3. Merge the route objects and generate route module code
 */
export interface Route {
  path: string;
  element: React.ReactElement;
  filePath: string;
  preload: () => Promise<PageModule<ComponentType<unknown>>>;
}

export const CONVENTIONAL_ROUTE_ID = 'virtual:routes';

export const DEFAULT_PAGE_EXTENSIONS = ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'];

// It is convenient for other plugins to obtain route information
export let routeService: RouteService;

let pageExtensionsReg: RegExp;

export function pluginRoutes(options: RouteOptions = {}): Plugin {
  const { root = 'src' } = options;
  let scanDir: string;
  return {
    name: 'island:vite-plugin-routes',
    async configResolved() {
      scanDir = path.isAbsolute(root)
        ? path.join(root)
        : path.join(process.cwd(), root);
      routeService = new RouteService(normalizePath(scanDir), options);
      await routeService.init();
      pageExtensionsReg = new RegExp(
        `\\.(${routeService.getExtensions().join('|')})$`
      );
    },

    resolveId(id: string) {
      if (id === CONVENTIONAL_ROUTE_ID) {
        // This tells Vite that this is a virtual module
        return '\0' + CONVENTIONAL_ROUTE_ID;
      }
    },
    load(id: string, options) {
      if (id === '\0' + CONVENTIONAL_ROUTE_ID) {
        return {
          code: routeService.generateRoutesCode(options?.ssr),
          moduleSideEffects: false
        };
      }
    },

    configureServer(server) {
      const fileChange = () => {
        const virtualRouteMod = server.moduleGraph.getModuleById(
          `\0${CONVENTIONAL_ROUTE_ID}`
        );
        if (virtualRouteMod) {
          server.moduleGraph.invalidateModule(virtualRouteMod!);
          server.ws.send({
            type: 'full-reload'
          });
        }
      };
      server.watcher
        .add(scanDir)
        .on('add', async (file) => {
          if (file.startsWith(scanDir) && pageExtensionsReg.test(file)) {
            await routeService.addRoute(file);
            fileChange();
          }
        })
        .on('unlink', async (file) => {
          if (file.startsWith(scanDir) && pageExtensionsReg.test(file)) {
            await routeService.removeRoute(file);
            fileChange();
          }
        });
    }
  };
}

export { normalizeRoutePath } from './RouteService';
