export const measureExecTime = (callback: () => void): number => {
    const startTime = performance.now();
    callback();
    const endTime = performance.now();

    return endTime - startTime;
}