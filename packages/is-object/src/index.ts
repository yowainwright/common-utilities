export const isArray = (item: unknown): boolean => Array.isArray(item)

export const isOfObjectType = (item: unknown): boolean => item !== null && typeof item === 'object'

export const isObject = (item: unknown): boolean => isOfObjectType(item) && !isArray(item)
