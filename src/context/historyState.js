export const MAX_SHAPES = 10000
export const MAX_HISTORY = 200
// Full snapshots are intentionally bounded by total board size. Small boards
// retain the existing 200-step history; large boards degrade undo depth before
// their snapshots can exhaust the browser heap.
export const MAX_HISTORY_SHAPES = 100000
export const MIN_HISTORY = 10

const isPlainObject = value => {
  if (!value || typeof value !== 'object') return false
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

// Canvas shapes are plain data. Clone only arrays/plain records so runtime assets
// such as HTMLImageElement instances remain usable by the renderer.
export function cloneSnapshot(value) {
  if (Array.isArray(value)) return value.map(cloneSnapshot)
  if (isPlainObject(value)) {
    return Object.keys(value).reduce((copy, key) => {
      copy[key] = cloneSnapshot(value[key])
      return copy
    }, {})
  }
  return value
}

export function snapshotsEqual(left, right) {
  if (Object.is(left, right)) return true
  if (Array.isArray(left) && Array.isArray(right)) {
    return left.length === right.length && left.every((value, index) => snapshotsEqual(value, right[index]))
  }
  if (isPlainObject(left) && isPlainObject(right)) {
    const leftKeys = Object.keys(left)
    const rightKeys = Object.keys(right)
    return leftKeys.length === rightKeys.length && leftKeys.every(key => Object.prototype.hasOwnProperty.call(right, key) && snapshotsEqual(left[key], right[key]))
  }
  return false
}

function isValidShapeList(shapes) {
  return Array.isArray(shapes) && shapes.length <= MAX_SHAPES
}

function asSnapshot(shapes) {
  if (!isValidShapeList(shapes)) return null
  return cloneSnapshot(shapes)
}

export function historyLimitForShapeCount(shapeCount) {
  const budgetLimit = Math.floor(MAX_HISTORY_SHAPES / Math.max(1, shapeCount))
  return Math.max(MIN_HISTORY, Math.min(MAX_HISTORY, budgetLimit))
}

function trimUndo(stack, limit) {
  return stack.length > limit ? stack.slice(stack.length - limit) : stack
}

function trimRedo(stack, limit) {
  return stack.length > limit ? stack.slice(0, limit) : stack
}

export function createInitialHistoryState(shapes = []) {
  return {
    shapes: asSnapshot(shapes) ?? [],
    undoStack: [],
    redoStack: [],
    revision: 0,
    error: null,
    historyLimit: historyLimitForShapeCount(Array.isArray(shapes) ? shapes.length : 0),
  }
}

export function historyReducer(state, action) {
  if (action.type === 'COMMIT') {
    // Give updater callbacks their own copy. A callback that mutates its argument
    // therefore cannot mutate the rendered state or any existing history frame.
    const workingCopy = cloneSnapshot(state.shapes)
    const isUpdater = typeof action.shapes === 'function'
    const candidate = isUpdater ? action.shapes(workingCopy) : action.shapes
    // Updaters receive an isolated deep copy. Reuse it as the next snapshot so
    // every normal interaction avoids a second full-board clone. Direct input
    // still gets cloned to protect callers from sharing mutable data with state.
    const next = isUpdater && isValidShapeList(candidate) ? candidate : asSnapshot(candidate)

    if (!next) {
      const rejectedShapeCount = Array.isArray(candidate) ? candidate.length : null
      return state.error === 'shape-limit' && state.rejectedShapeCount === rejectedShapeCount
        ? state
        : { ...state, error: 'shape-limit', rejectedShapeCount }
    }
    if (snapshotsEqual(state.shapes, next)) return state.error ? { ...state, error: null, rejectedShapeCount: null } : state
    const historyLimit = historyLimitForShapeCount(next.length)

    return {
      shapes: next,
      // State and history frames are immutable from the reducer's perspective:
      // every future updater starts from its own clone. Sharing this frame saves
      // a full allocation for every commit without exposing mutable input data.
      undoStack: trimUndo([...state.undoStack, state.shapes], historyLimit),
      redoStack: [],
      revision: state.revision + 1,
      error: null,
      rejectedShapeCount: null,
      historyLimit,
    }
  }

  if (action.type === 'UNDO' && state.undoStack.length) {
    const previous = state.undoStack[state.undoStack.length - 1]
    const historyLimit = historyLimitForShapeCount(previous.length)
    return {
      shapes: previous,
      undoStack: state.undoStack.slice(0, -1),
      redoStack: trimRedo([state.shapes, ...state.redoStack], historyLimit),
      revision: state.revision + 1,
      error: null,
      rejectedShapeCount: null,
      historyLimit,
    }
  }

  if (action.type === 'REDO' && state.redoStack.length) {
    const next = state.redoStack[0]
    const historyLimit = historyLimitForShapeCount(next.length)
    return {
      shapes: next,
      undoStack: trimUndo([...state.undoStack, state.shapes], historyLimit),
      redoStack: state.redoStack.slice(1),
      revision: state.revision + 1,
      error: null,
      rejectedShapeCount: null,
      historyLimit,
    }
  }

  if (action.type === 'REPLACE') {
    const next = asSnapshot(action.shapes)
    if (!next) {
      const rejectedShapeCount = Array.isArray(action.shapes) ? action.shapes.length : null
      return { ...state, error: 'shape-limit', rejectedShapeCount }
    }
    return {
      shapes: next,
      undoStack: [],
      redoStack: [],
      revision: state.revision + 1,
      error: null,
      rejectedShapeCount: null,
      historyLimit: historyLimitForShapeCount(next.length),
    }
  }

  return state
}
