declare global {
    interface Window {
        __jsbridge: {
            [id: string]: {
                [key: string]: any;
            };
        };
    }
}

type ThisObject = {
    result?: any;
    error?: any;
};

function generateRandomId() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16);
}

class GoWasmRuntime {
    constructor() {}
}

export class GoWasmInstance {
    private _module: WebAssembly.Module;
    private _id: string;
    private _instance: WebAssembly.Instance | undefined;
    private _runner: Go;
    private _running: boolean;

    private constructor(module: WebAssembly.Module) {
        this._module = module;
        this._id = generateRandomId();
        window.__jsbridge[this._id] = {};
        this._runner = new Go("__jsbridge", this._id);
        this._running = false;
    }

    _isRunning() {
        return this._running && !this._runner.exited;
    }

    static async new<T extends object>(module: WebAssembly.Module): Promise<T> {
        const inst = new GoWasmInstance(module);
        inst._instance = await WebAssembly.instantiate(
            inst._module,
            inst._runner.importObject
        );

        const loop = async () => {
            try {
                if (inst._instance === undefined) {
                    console.error(
                        "Can't (re)run instance because it's undefined."
                    );
                    return;
                }
                // Start execution
                const promise = inst._runner.run(inst._instance);
                inst._running = true;

                // Wait for it to complete
                await promise;
                inst._running = false;

                // Loop again
                //setTimeout(loop);
            } catch (err) {
                console.error("Error occured while running", err);
            }
        };
        loop();

        const proxy = new Proxy(inst, {
            get: (target, prop, receiver) => {
                if (
                    prop in target ||
                    typeof prop === "number" ||
                    typeof prop === "symbol"
                ) {
                    return Reflect.get(target, prop, receiver);
                }
                const func = window.__jsbridge[inst._id][prop] as Function;
                if (typeof func !== "function") {
                    return Reflect.get(target, prop, receiver);
                }

                return async (...args: any[]) => {
                    while (!inst._isRunning()) {
                        await new Promise(requestAnimationFrame);
                    }
                    const thisObj: ThisObject = {};
                    const returnValue = func.apply(thisObj, args);

                    if (thisObj.error) {
                        throw thisObj.error;
                    } else if (thisObj.hasOwnProperty("result")) {
                        return thisObj.result;
                    } else {
                        return returnValue;
                    }
                };
            },
        });

        return (proxy as unknown) as T;
    }
}

if (!window.__jsbridge) {
    window.__jsbridge = {};
}
