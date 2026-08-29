import { getStorage } from './browser'
import { sanitizeShape } from './geometry'

const STORAGE_KEY = 'diagram-board-v1'
const BOARDS_KEY = 'diagram-board-boards-v1'
const ACTIVE_BOARD_KEY = 'diagram-board-active-v1'
const TRASH_KEY = 'diagram-board-trash-v1'
const MAX_STORAGE_STRIP_IMAGES = 2 * 1024 * 1024
const MAX_SHAPES = 10000

const fallbackId = () => `board-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

export function createBoardId() {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return `board-${crypto.randomUUID()}`
  } catch (_error) {}
  return fallbackId()
}

function sanitizeShapes(items) {
  if (!Array.isArray(items) || items.length > MAX_SHAPES) return []
  return items.reduce((valid, shape) => {
    try {
      const clean = sanitizeShape(shape)
      if (clean) valid.push(clean)
    } catch (_error) {}
    return valid
  }, [])
}

function validateShapes(items) {
  if (!Array.isArray(items) || items.length > MAX_SHAPES) return null
  try {
    const clean = items.map(shape => sanitizeShape(shape))
    return clean.every(Boolean) ? clean : null
  } catch (_error) {
    return null
  }
}

function serializeRecord(record) {
  try {
    const payload = JSON.stringify(record)
    const parsed = JSON.parse(payload)
    if (!parsed || !Array.isArray(parsed.shapes) || typeof parsed.boardId !== 'string' || typeof parsed.fileName !== 'string') return null
    return payload
  } catch (_error) {
    return null
  }
}

function normalizeRecord(value, boardId) {
  if (!value || typeof value !== 'object' || !Array.isArray(value.shapes)) return null
  return {
    boardId: typeof value.boardId === 'string' && value.boardId ? value.boardId : boardId,
    shapes: sanitizeShapes(value.shapes),
    fileName: typeof value.fileName === 'string' && value.fileName ? value.fileName : 'Untitled board',
    savedAt: Number.isFinite(value.savedAt) ? value.savedAt : undefined,
    createdAt: Number.isFinite(value.createdAt) ? value.createdAt : value.savedAt,
  }
}

function readStore(storage) {
  try {
    const raw = storage.getItem(BOARDS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object' && parsed.boards && typeof parsed.boards === 'object') {
        const boards = Object.fromEntries(Object.entries(parsed.boards).map(([id, value]) => {
          const record = normalizeRecord(value, id)
          return record ? [record.boardId, record] : null
        }).filter(Boolean))
        return { boards, activeBoardId: typeof parsed.activeBoardId === 'string' ? parsed.activeBoardId : null }
      }
    }
  } catch (_error) {}

  try {
    const legacy = normalizeRecord(JSON.parse(storage.getItem(STORAGE_KEY) || 'null'), 'board-default')
    if (legacy) return { boards: { [legacy.boardId]: legacy }, activeBoardId: legacy.boardId }
  } catch (_error) {}
  return { boards: {}, activeBoardId: null }
}

function writeStore(storage, store) {
  storage.setItem(BOARDS_KEY, JSON.stringify(store))
}

function activeId(storage, store) {
  const persisted = storage.getItem(ACTIVE_BOARD_KEY)
  if (persisted && store.boards[persisted]) return persisted
  if (store.activeBoardId && store.boards[store.activeBoardId]) return store.activeBoardId
  return Object.keys(store.boards)[0] || null
}

export function activateBoard(boardId) {
  try {
    const storage = getStorage()
    if (!storage || !boardId) return false
    const store = readStore(storage)
    if (!store.boards[boardId]) return false
    store.activeBoardId = boardId
    writeStore(storage, store)
    storage.setItem(ACTIVE_BOARD_KEY, boardId)
    return true
  } catch (_error) {
    return false
  }
}

export function loadDiagram(boardId) {
  try {
    const storage = getStorage()
    if (!storage) return null
    const store = readStore(storage)
    const id = boardId || activeId(storage, store)
    return id && store.boards[id] ? normalizeRecord(store.boards[id], id) : null
  } catch (_error) {
    return null
  }
}

export function saveDiagram(shapes, fileName, boardId) {
  const validatedShapes = validateShapes(shapes)
  if (!validatedShapes) return false
  const id = boardId || createBoardId()
  const savedAt = Date.now()
  const safeName = typeof fileName === 'string' && fileName ? fileName : 'Untitled board'
  const announceSaved = () => { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('diagram:saved', { detail: { savedAt, boardId: id } })) }
  const build = items => serializeRecord({ boardId: id, shapes: items, fileName: safeName, savedAt })
  const payload = build(validatedShapes)
  if (!payload) return false

  const write = items => {
    const storage = getStorage()
    if (!storage) return false
    const store = readStore(storage)
    const previous = store.boards[id]
    const record = { boardId: id, shapes: items, fileName: safeName, savedAt, createdAt: previous?.createdAt || savedAt }
    const boardPayload = JSON.stringify({ boards: { ...store.boards, [id]: record }, activeBoardId: id })
    JSON.parse(boardPayload)
    storage.setItem(BOARDS_KEY, boardPayload)
    storage.setItem(ACTIVE_BOARD_KEY, id)
    storage.setItem(STORAGE_KEY, build(items))
    return true
  }

  try {
    if (!write(validatedShapes)) return false
    announceSaved()
    return true
  } catch (error) {
    if (!error || (error.name !== 'QuotaExceededError' && error.code !== 22)) return false
    const items = validatedShapes.map(shape => ({ ...shape }))
    while (true) {
      let largest = -1
      let largestIndex = -1
      for (let i = 0; i < items.length; i++) {
        const size = items[i].type === 'image' && typeof items[i].src === 'string' ? items[i].src.length : 0
        if (size > largest) { largest = size; largestIndex = i }
      }
      if (largestIndex < 0) return false
      items[largestIndex] = { ...items[largestIndex], src: undefined }
      const strippedPayload = build(items)
      if (!strippedPayload || strippedPayload.length > MAX_STORAGE_STRIP_IMAGES) continue
      try {
        if (!write(items)) return false
        announceSaved()
        console.warn('Board was too large for full save; some embedded images were omitted. Vector shapes were preserved.')
        return true
      } catch (_error) {}
    }
  }
}

export function createBoard(shapes = [], fileName = 'Untitled board') {
  const boardId = createBoardId()
  const savedAt = Date.now()
  const saved = saveDiagram(shapes, fileName, boardId)
  return saved ? { boardId, shapes, fileName, savedAt } : null
}

export function clearDiagram(boardId) {
  try {
    const storage = getStorage()
    if (!storage) return false
    const store = readStore(storage)
    const id = boardId || activeId(storage, store)
    if (!id) return false
    const boards = { ...store.boards }
    delete boards[id]
    const nextId = Object.keys(boards)[0] || null
    writeStore(storage, { boards, activeBoardId: nextId })
    if (nextId) storage.setItem(ACTIVE_BOARD_KEY, nextId)
    else storage.removeItem(ACTIVE_BOARD_KEY)
    storage.removeItem(STORAGE_KEY)
    return true
  } catch (_error) {
    return false
  }
}

function readTrash(storage) {
  try {
    const parsed = JSON.parse(storage.getItem(TRASH_KEY) || '[]')
    if (Array.isArray(parsed)) return parsed
    if (parsed && Array.isArray(parsed.items)) return parsed.items
    if (parsed && Array.isArray(parsed.shapes)) return [{ ...parsed, boardId: parsed.boardId || createBoardId() }]
  } catch (_error) {}
  return []
}

export function moveDiagramToTrash(shapes, fileName, boardId) {
  const validatedShapes = validateShapes(shapes)
  if (!validatedShapes) return false
  try {
    const storage = getStorage()
    if (!storage) return false
    const store = readStore(storage)
    const id = boardId || activeId(storage, store) || createBoardId()
    const trashItem = { boardId: id, shapes: validatedShapes, fileName: fileName || 'Untitled board', deletedAt: Date.now() }
    const payload = JSON.stringify([...readTrash(storage).filter(item => item.boardId !== id), trashItem])
    JSON.parse(payload)
    storage.setItem(TRASH_KEY, payload)
    return clearDiagram(id)
  } catch (_error) {
    return false
  }
}
