# TabShow 2.4 Chrome Web Store copy: Simplified Chinese

Status: release-candidate copy. This file does not confirm submission or publication. Use screenshots of the final Simplified Chinese package and verify every described feature before publishing.

## Title

TabShow：标签页实时预览

## Summary

在侧边栏搜索已打开的 Chrome 标签页，悬停即可预览实际页面。移出侧边栏返回预览前的页面，点击即可选定。

## Detailed description

标签页开得多，也能找到想要的页面。

TabShow 将已打开的 Chrome 标签页列在可搜索的侧边栏中。将鼠标停在当前窗口的某个标签页上，即可查看实际页面。将鼠标移出侧边栏，就会返回预览前的页面；点击即可选定。

搜索已打开的标签页

按页面标题、网址或域名搜索。打开侧边栏后直接输入，用方向键选择结果，按 Enter 选定。键盘焦点在侧边栏内时，按 Esc 返回预览前的标签页并关闭侧边栏。使用方向键选择结果时，页面不会切换，直到你按下 Enter。悬停预览后，将鼠标移出侧边栏即可返回；点击搜索框可继续使用键盘操作。

按需保持侧边栏打开

默认情况下，选定标签页后 TabShow 会关闭侧边栏。在设置中开启“选择标签页后保持侧边栏打开”，即可让列表继续显示在页面旁边。在当前窗口选中的标签页，会成为下一次预览的返回位置。

打开 TabShow 时，列表会显示当前标签页所在位置。你选择的排序方式也会保留。

控制悬停预览

实时预览默认开启。调整“悬停预览延迟”，可避免鼠标经过时意外切换页面。也可以关闭“悬停时预览标签页”，只浏览列表，再通过点击或按 Enter 切换。无论是否开启预览，都可以搜索标签页。

跨窗口查找

选择“当前窗口”或“所有窗口”，查看同一 Chrome 个人资料中的标签页。不同的工作和个人资料相互独立。其他窗口中的标签页需要点击或按 Enter 才会切换，悬停不会改变窗口焦点。

查看标签页状态

• 按当前顺序、最近使用、最近添加（大致顺序）、域名或标签页分组排序。
• 显示已有分组，以及固定、播放音频、静音、休眠和重复状态。
• 在侧边栏中关闭单个标签页。
• 搜索时仍可查看标签页和窗口总数。
• 选择浅色、深色或跟随系统外观，以及不同配色。“跟随系统”只跟随浅色或深色外观，不会复制 Chrome 自定义主题的配色。
• 查看本地计算的标签页杂乱度，以及根据当前标签页给出的整理建议。

标签页数据保留在浏览器中

无需账号，无广告，无扩展使用分析，也没有 TabShow 后端。扩展不请求网站访问权限，也不读取网页正文。TabShow 使用 Chrome 提供的标签页信息，完成列表显示、搜索、排序、预览、切换和关闭操作。设置和杂乱度历史记录保存在浏览器本地。

所有功能免费。通过 Buy Me a Coffee 支持开发完全自愿。

2.4 更新内容

新增可选的侧边栏保持打开模式和悬停预览开关。排序方式会保留，打开侧边栏时会显示当前标签页所在位置。标签页在窗口间移动后，列表也会正确更新。设置中新增版本信息、帮助和更新内容入口，原有默认操作方式保持不变。

TabShow 支持英语、德语、简体中文和繁体中文，并跟随 Chrome 的界面语言。侧边栏、设置、欢迎页和扩展内的更新说明均已翻译；网站及链接到的外部帮助页面仍为英文。

更新记录：https://tab.show/changelog
隐私说明：https://tab.show/privacy
帮助：https://tab.show/support
反馈：https://narsheek.featurebase.app/

## Localized gallery headings and captions

| Image | Heading | Caption |
|---|---|---|
| 1. Live page preview | 先看页面，再选标签页 | 悬停预览实际页面，移出侧边栏即可返回。 |
| 2. Search | 按标题或网址查找 | 输入关键词，从已打开的标签页中找到所需页面。 |
| 3. Keyboard and current tab | 用键盘选择标签页 | ↑↓ 选择，Enter 选定，Esc 返回并关闭。打开侧边栏即可看到当前标签页。 |
| 4. All windows | 查找其他窗口的标签页 | “所有窗口”显示当前 Chrome 个人资料中的窗口。点击标签页即可切换。 |
| 5. Panel and hover controls | 选择后保持侧边栏打开 | 在设置中开启保持打开，也可调整悬停延迟或关闭预览。 |

## Release checks

- Title: 15 characters, within the 75-character limit.
- Summary: 54 characters, within the 132-character limit.
- Setting names match `public/_locales/zh_CN/messages.json`.
- Localized screenshots must show the released interface and the behavior described above.
- This copy does not claim pinyin search, mobile support, verified Edge compatibility, or reliable Chrome Web Store access on every mainland-China network.
