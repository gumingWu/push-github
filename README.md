# push-github

Create github repository and push code quickly

[![npm](https://img.shields.io/npm/v/push-github?color=green)](https://www.npmjs.com/package/push-github)

## Install

```
npm install -g push-github

yarn add -g push-github

pnpm add -g push-github
```

## Usage

First of all, you must prepare a github token that has the pushing project authentication.

**More creating token steps in <a href="https://juejin.cn/post/7213576339328335929#heading-6" target="_blank">this article</a>  in Chinese**

And then, open the **terminal** and execute the command: `push-github`, or `pg`

If you don't save the github token, it will force you to save token firstly

Just use `pg` and press `Enter`, the github repository will be created！

![image.png](https://s2.loli.net/2023/04/07/pDnTePZsacxH97r.png)


## TODO

- 加上超时机制
- ctrl+c 能取消接口请求并终止流程
- 以上两个步骤是为了解决在提交时网络缓慢的问题