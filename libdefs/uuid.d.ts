// Type definitions for uuid v2.0.3
// Project: https://github.com/defunctzombie/node-uuid
// Definitions by: Oliver Hoffmann <https://github.com/iamolivinius/>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

// Definition is being loaded outside NPM as the Original copy pulls in node typings which break the browser environment

declare module 'uuid' {
    interface V1Options {
        node?: number[];
        clockseq?: number;
        msecs?: number | Date;
        nsecs?: number;
    }

    type V4Options = { random: number[] } | { rng: () => number[]; }

    interface UuidStatic {
        (options?: V4Options): string;
        (options: V4Options | null, buffer: number[], offset?: number): number[];

        v1(options?: V1Options): string;
        v1(options: V1Options | null, buffer: number[], offset?: number): number[];
        v4: UuidStatic;
        parse(id: string): number[];
        parse(id: string, buffer: number[], offset?: number): number[];
        unparse(buffer: number[], offset?: number): string;
    }


    const uuid: UuidStatic;
    export = uuid;
}
