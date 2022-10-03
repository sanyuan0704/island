import type { PluginOption } from 'vite';
import pluginReact from '@vitejs/plugin-react';
import { pluginSvgr } from './plugin-svgr';
import { pluginIsland } from './plugin-island';
import { pluginRoutes } from './plugin-routes';
import { SiteConfig } from '../shared/types';
import { pluginMdx } from './plugin-mdx';
import babelPluginIsland from './babel-plugin-island';
import { ISLAND_JSX_RUNTIME_PATH } from './constants/index';
import pluginUnocss from 'unocss/vite';
import unocssOptions from './unocss.config';
// import pluginInspect from 'vite-plugin-inspect';

export async function createIslandPlugins(
  config: SiteConfig,
  isServer = false,
  restartServer?: () => Promise<void>
): Promise<PluginOption[]> {
  return [
    pluginUnocss(unocssOptions),
    // pluginInspect({
    //   dev: false,
    //   build: true
    // }),
    // Md(x) compile
    await pluginMdx(config, isServer),
    // For island internal use
    pluginIsland(config, isServer, restartServer),

    // React hmr support
    // In ssr, we will compile .tsx in islandTransform plugin
    isServer && !config.enableSpa
      ? []
      : pluginReact({
          jsxRuntime: 'automatic',
          jsxImportSource:
            isServer && !config.enableSpa ? ISLAND_JSX_RUNTIME_PATH : 'react',
          babel: {
            // Babel plugin for island(mpa) mode
            plugins: [...(config.enableSpa ? [] : [babelPluginIsland])]
          }
        }),
    // Svg component support
    pluginSvgr(),
    // Conventional Route
    pluginRoutes({ prefix: '', root: config.root, ...config.route })
  ];
}
