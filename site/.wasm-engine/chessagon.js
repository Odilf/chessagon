import * as wasm from "./chessagon_bg.wasm";
import { __wbg_set_wasm } from "./chessagon_bg.js";
__wbg_set_wasm(wasm);
export * from "./chessagon_bg.js";
