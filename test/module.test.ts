import { GoWasmModule } from "../src/index";
import { wasmPath } from "./common";

describe("GoWasmModule", () => {
    it("Modules can compile", async () => {
        const module = new GoWasmModule(fetch(wasmPath("empty.wasm")));
        await module.waitForCompile();
        expect(module.isReady()).toBeTrue();
    });
});
