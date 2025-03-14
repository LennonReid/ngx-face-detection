import Long from 'long';

declare module '@tensorflow/tfjs-core/dist/hash_util' {
  export function hexToLong(hex: string): Long;
  export function fingerPrint64(s: Uint8Array, len?: number): Long;
}
