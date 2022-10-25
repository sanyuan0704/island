# 配置站点

## 创建配置文件

在没有任何配置的情况，页面是非常简陋的，没有导航，也没有侧边栏。但是，通过 `.island/config.ts` 文件，你可以配置并自定义站点的各种信息。

例如，在上一小节创建的初始化项目中，你可以添加配置文件，项目结构如下：

```bash
.
├─ docs
│  ├─ .island
│  │  └─ config.ts
│  └─ index.md
└─ package.json
```

你可以尝试在 `config.ts` 中添加以下配置代码:

```ts
import { defineConfig } from 'islandjs';

export default defineConfig({
  title: 'my-site'
});
```

你也可以显式地通过 --config 命令行选项指定一个配置文件（配置文件仍然需要放在.island路径下）。

另外，关于配置文件有以下两个注意事项:

- 1. Island.js 支持 `.js`、`.ts`、`.mjs`、`.cjs` 文件作为配置文件。但是推荐使用 TypeScript 配置，因为可以使用`defineConfig`获取类型提示。

- 2. 配置文件应该有一个默认导出，即默认导出一个 `SiteConfig` 对象。

在上面的例子中，我们将站点的 `title` 设置为 `my-site`，然后你可以通过 `yarn dev` 运行启动开发服务器。你会看到站点的标题已更改为 `my-site`。这意味着你已经唤醒了你的第一个站点配置，nice!

在下一节中，我们将介绍导航和侧边栏配置，这对于文档站点是相当重要的。

## 导航栏配置

`nav` 字段用来配置导航栏, 举个 🌰:

```ts
import { defineConfig } from 'islandjs';

export default defineConfig({
  themeConfig: {
    nav: [
      {
        text: 'Home',
        link: '/',
        activeMatch: '^/$|^/'
      }
    ]
  }
});
```

`activeMatch` 用于匹配当前路由，当路由匹配 `activeMatch` 规则时，nav 项将会高亮。

## 侧边栏配置

`sidebar` 字段可以用来配置侧边栏，举个 🌰:

```ts
import { defineConfig } from 'islandjs';

export default defineConfig({
  themeConfig: {
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            {
              text: 'Getting Started',
              link: '/guide/getting-started'
            }
          ]
        }
      ]
    }
  }
});
```

当然，还有很多自定义站点的配置，你可以在 [API 页面](/zh/api/index) 中获取更多配置细节。
