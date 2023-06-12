<div align="center">
  <img width="256px" height="256px" src="src-tauri/icons/128x128%402x.png" />
</div>

# Zeri (Early Development)

Play music, even when you're offline.

- Zeri's app size is just lower than 20mb.

- Zeri doesn't use your internet connection unless you want it to.

- Zeri is built with `TypeScript`, `Vue`, `Tauri`, `Vite` and `TailwindCSS`.

# Build your own Zeri app

If you want to build Zeri by yourself:

- Install Tauri [prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites).
- Install pnpm (recommended package manager) `npm i -g pnpm` or follow this [guide](https://pnpm.io/installation).
- Install packages `pnpm i`
- Build the app `pnpm tauri build`
- After that you can find executable in `src-tauri/target` folder. The installer is available at `src-tauri/target/release/bundle`

# Contributing

If you want to contribute, feel free to clone this repository and open a pull request.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) + [Rust Analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer).

## Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

Enable [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669):

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.
