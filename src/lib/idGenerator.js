let count = 0
export const newId = () => `shape-${Date.now().toString(36)}-${(++count).toString(36)}`
