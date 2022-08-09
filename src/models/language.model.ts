export class LanguageModel {
  id: number;
  name: string; // 语言名称 node
  version: string; // 语言版本 v16.13.1
  image: string; // 镜像名 node
  fileName: string; // 保存文件名 index.js
  beforInjectionCodeCmd: string; // 注入代码前cmd命令 创建项目/文件夹等
  afterInjectionCodeCmd: string; // 注入代码后cmd命令 编译/有运行等
  timeout: number; // 运行超时时间 秒 60
  memory: number; // 分配容器内存大小 MB 100
  cpuset: string; // 允许容器使用CPU核心 0-4 或者 1,2,4
  captureCode: string; // 数据收集代码 运行时长，占用内存等
  initialCode: string; // 初始代码
}
