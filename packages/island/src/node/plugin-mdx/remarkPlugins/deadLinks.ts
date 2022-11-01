import { isProduction } from '../../constants';
import { normalizeRoutePath } from '../../plugin-routes/RouteService';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import { routeService } from '../../plugin-routes';
import checkLinks from 'check-links';
import ora from 'ora';
import { MarkdownOptions } from 'shared/types/index';

const checkedLinks = new Map();
/**
 * Remark plugin to normalize a link href
 */
export const remarkCheckDeadLinks: Plugin<
  [{ checkLink: MarkdownOptions['checkLink'] }]
> = ({ checkLink }) => {
  if (!checkLink?.enable) {
    return;
  }

  const { exclude = [], timeout = 10000 } = checkLink || {};

  return async (tree) => {
    const externalLinks: string[] = [];
    const internalLinks: string[] = [];

    visit(tree, 'link', (node: { url: string }) => {
      const url = node.url;
      if (!url) {
        return;
      }
      if (
        internalLinks.includes(url) ||
        externalLinks.includes(url) ||
        checkedLinks.has(url)
      ) {
        return;
      }

      if (
        exclude &&
        exclude.some((skipPattern: string | RegExp) =>
          new RegExp(skipPattern).test(url)
        )
      ) {
        return;
      }

      if (!url.startsWith('http') && !url.startsWith('https')) {
        const normalizeUrl = normalizeRoutePath(url?.split('#')[0]);
        internalLinks.push(normalizeUrl);
        checkedLinks.set(normalizeUrl, true);
        return;
      }

      // skip local links
      if (/^(http?:\/\/)(localhost|127\.0\.0\.1)(:\d+)?/.test(url)) {
        return;
      }
      externalLinks.push(url);
      checkedLinks.set(url, true);
    });

    const errorInfos: string[] = [];
    internalLinks.map((link) => {
      if (!routeService.isExistRoute(link)) {
        errorInfos.push(`Internal link to ${link} is dead`);
      }
    });
    // If the timeout is set too short, some links will be judged as dead links
    const results = await checkLinks(externalLinks, {
      timeout
    });
    Object.keys(results).forEach((url) => {
      const result = results[url];
      if (result.status !== 'dead') {
        return;
      }
      if (!externalLinks.includes(url)) {
        return;
      }
      errorInfos.push(`External link to ${url} is dead`);
    });

    // output error info
    if (errorInfos.length > 0) {
      errorInfos?.forEach((err) => ora().fail(err));
      isProduction() && process.exit();
    }
  };
};
