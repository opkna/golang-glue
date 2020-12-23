import { GoWasmModule } from "../src/index";
import { wasmPath, WasmBounce, WasmMath } from "./common";

describe("Should be able to instantiate wasm modules", () => {
    it("Modules can instantiate", async () => {
        // Compile module
        const module = new GoWasmModule(fetch(wasmPath("empty.wasm")));
        await module.waitForCompile();
        expect(module.isReady()).toBeTrue();

        // Instantiate
        const inst = await module.createInstance<{}>();

        // Test
        expect(inst).not.toBeFalsy();
    });
    it("Can call function on instance and get return value", async () => {
        // Compile module
        const module = new GoWasmModule(fetch(wasmPath("bounce.wasm")));
        await module.waitForCompile();
        expect(module.isReady()).toBeTrue();

        // Instantiate
        const inst = await module.createInstance<WasmBounce>();

        // Test
        expect(await inst.bounce(1)).toBe(1);
        expect(await inst.bounce("test")).toBe("test");
        expect(await inst.bounce({})).toEqual({});
        expect(await inst.bounce({ prop: "value" })).toEqual({ prop: "value" });
        expect(await inst.bounce([0, 1, "test"])).toEqual([0, 1, "test"]);
    });
    it("Functions can calculate return value", async () => {
        const module = new GoWasmModule(fetch(wasmPath("math.wasm")));
        await module.waitForCompile();
        expect(module.isReady()).toBeTrue();
        const inst = await module.createInstance<WasmMath>();
        expect(await inst.add(1, 2)).toBe(3);
        expect(await inst.add(-2, 1)).toBe(-1);
    });
    it("Instances proxy returns non-exported properties from target", async () => {
        // Compile module
        const module = new GoWasmModule(fetch(wasmPath("empty.wasm")));
        await module.waitForCompile();
        expect(module.isReady()).toBeTrue();

        // Instantiate
        const inst = await module.createInstance<{}>();

        // Test
        expect(inst["doesnotexist"]).toBeUndefined();
        expect(inst[1234]).toBeUndefined();
        expect(inst[Symbol("doesnotexist")]).toBeUndefined();
    });
});
