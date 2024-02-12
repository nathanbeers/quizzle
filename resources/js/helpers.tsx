export function extractStringValues(errorObject: {[key: string]: string[]}): string[] {
    const stringValues: string[] = [];

    Object.values(errorObject).forEach((valueArray) => {
      stringValues.push(...valueArray);
    });

    return stringValues;
}

export function truncateString(str: string, num: number): string {
    if (str.length <= num) {
        return str;
    }
    return str.slice(0, num) + '...';
}
