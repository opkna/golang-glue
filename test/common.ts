export function wasmPath(filename: string) {
    return `/base/test/util/compiled/${filename}`;
}

export interface WasmBounce {
    bounce<T>(arg: T): Promise<T>;
}

export interface WasmMath {
    add(a: number, b: number): Promise<number>;
}
