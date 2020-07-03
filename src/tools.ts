/**
 * Makes a deep copy of the object including a copy of all the children and so on.
 * @param source source object. It can be any type
 * @param fields list of root fields that should be copied. If not sent, it will copy all the fields.
 * Note: the fields only filters the children of the source not the grandchildren.
 */
export function deepCopy<T>(source: T, fields?: string[]): T {
    let target: T = source;
    if (source && (typeof source === 'object' || Array.isArray(source))) {
        if (source instanceof Date)
            return new Date(source.getTime()) as unknown as T;
        target = (Array.isArray(source) ? [] : {}) as any;
        if (!fields)
            for (const field in source)
                target[field] = deepCopy(source[field]);
        else
            fields.forEach(field => (target as any)[field] = deepCopy((source as any)[field]));
    }
    return target;
}
