import { DIRECTIVE_TYPES } from '../../constants';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

export const remarkPluginTip: Plugin = () => {
  return (tree: any) => {
    visit(tree, (node) => {
      if (node.type === 'containerDirective') {
        const name = DIRECTIVE_TYPES.includes(node.name)
          ? node.name
          : DIRECTIVE_TYPES[0];
        const data = node.data || (node.data = {});
        const children = node.children;

        data.hName = 'div';
        data.hProperties = {
          class: `island-directive ${name}`
        };

        node.children = [
          {
            type: 'paragraph',
            data: {
              hProperties: {
                class: 'island-directive-title'
              }
            },
            children: [{ type: 'text', value: name.toLocaleUpperCase() }]
          },
          {
            type: 'element',
            data: {
              hProperties: { class: 'island-directive-content' }
            },
            children
          }
        ];
      }
    });
  };
};
