export const MAX_SHAPES = 10000
export const MAX_HISTORY = 200

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

function asSnapshot(shapes) {
  if (!Array.isArray(shapes) || shapes.length > MAX_SHAPES) return null
  return cloneSnapshot(shapes)
}

function trimUndo(stack) {
  return stack.length > MAX_HISTORY ? stack.slice(stack.length - MAX_HISTORY) : stack
}

function trimRedo(stack) {
  return stack.length > MAX_HISTORY ? stack.slice(0, MAX_HISTORY) : stack
}

export function createInitialHistoryState(shapes = []) {
  return {
    shapes: asSnapshot(shapes) ?? [],
    undoStack: [],
    redoStack: [],
    revision: 0,
  }
}

export function historyReducer(state, action) {
  if (action.type === 'COMMIT') {
    // Give updater callbacks their own copy. A callback that mutates its argument
    // therefore cannot mutate the rendered state or any existing history frame.
    const workingCopy = cloneSnapshot(state.shapes)
    const candidate = typeof action.shapes === 'function' ? action.shapes(workingCopy) : action.shapes
    const next = asSnapshot(candidate)

    if (!next || snapshotsEqual(state.shapes, next)) return state

    return {
      shapes: next,
      undoStack: trimUndo([...state.undoStack, cloneSnapshot(state.shapes)]),
      redoStack: [],
      revision: state.revision + 1,
    }
  }

  if (action.type === 'UNDO' && state.undoStack.length) {
    const previous = state.undoStack[state.undoStack.length - 1]
    return {
      shapes: cloneSnapshot(previous),
      undoStack: state.undoStack.slice(0, -1),
      redoStack: trimRedo([cloneSnapshot(state.shapes), ...state.redoStack]),
      revision: state.revision + 1,
    }
  }

  if (action.type === 'REDO' && state.redoStack.length) {
    const next = state.redoStack[0]
    return {
      shapes: cloneSnapshot(next),
      undoStack: trimUndo([...state.undoStack, cloneSnapshot(state.shapes)]),
      redoStack: state.redoStack.slice(1),
      revision: state.revision + 1,
    }
  }

  if (action.type === 'REPLACE') {
    const next = asSnapshot(action.shapes)
    if (!next) return state
    return {
      shapes: next,
      undoStack: [],
      redoStack: [],
      revision: state.revision + 1,
    }
  }

  return state
}
