export function extractStringValues(errorObject: {[key: string]: string[]}): string[] {
    const stringValues: string[] = [];

    Object.values(errorObject).forEach((valueArray) => {
      stringValues.push(...valueArray);
    });

    return stringValues;
}
