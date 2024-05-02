export function hrTimeMs() {
    const raw = process.hrtime.bigint();
    return raw / 1000000n;
}
