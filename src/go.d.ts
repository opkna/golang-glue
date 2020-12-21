declare class Go {
    constructor(...args: string[]);
    importObject: Record<string, Record<string, WebAssembly.ImportValue>>;
    argv: string[];
    mem: DataView;
    exited: boolean;
    run(instance: WebAssembly.Instance): Promise<void>;
    exit(code: number): void;
}
