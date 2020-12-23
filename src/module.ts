import { GoWasmInstance } from "./instance";

export class GoWasmModule {
    private _module: WebAssembly.Module | undefined;
    private _initPromise: Promise<void> | undefined;

    constructor(url: string | URL);
    constructor(request: Promise<Response>);
    constructor(arg: unknown) {
        let request: Promise<Response>;
        if (typeof arg === "string") {
            request = fetch(arg);
        } else if (arg instanceof URL) {
            request = fetch(arg.href);
        } else if (arg instanceof Promise) {
            request = arg;
        } else {
            throw new Error(
                "GoWasmModule.constructor: Argument have to be string, URL or Promise<Response>"
            );
        }
        this._initPromise = this._init(request);
    }

    private async _init(request: Promise<Response>) {
        try {
            this._module = await WebAssembly.compileStreaming(request);
        } catch (err) {
            console.error("Compilation of wasm failed", err);
            this._module = undefined;
            this._initPromise = undefined;
        }
    }

    async waitForCompile() {
        // Check if this._initPromise has not yet been resolved
        if (this._initPromise instanceof Promise) {
            await this._initPromise;
            this._initPromise = undefined;
        }
    }

    isReady() {
        return this._initPromise === undefined && this._module !== undefined;
    }

    async createInstance<T extends object>() {
        // Check if this._initPromise has not yet been resolved
        if (this._initPromise instanceof Promise) {
            await this._initPromise;
            this._initPromise = undefined;
        }

        // If this._module is still undefined, a error has occured while compiling
        if (this._module === undefined) {
            throw new Error(
                "GoWasmModule.createInstance: Can't instantiate because fetching or compilation of module failed"
            );
        }

        return GoWasmInstance.new<T>(this._module);
    }
}
