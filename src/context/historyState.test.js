import assert from 'node:assert/strict'
import test from 'node:test'
import { createInitialHistoryState, historyReducer } from './historyState.js'

const apply = (state, type, shapes) => historyReducer(state, { type, shapes })

const draw = { id: 'draw-1', type: 'pen', points: [0, 0, 20, 20], stroke: '#111' }
const rectangle = { id: 'shape-1', type: 'rectangle', x: 20, y: 30, width: 100, height: 60, fill: 'transparent' }
const label = { id: 'text-1', type: 'text', x: 40, y: 50, width: 160, text: 'Plan', fontSize: 18 }
const image = { id: 'image-1', type: 'image', x: 80, y: 90, width: 240, height: 160, src: 'data:image/png;base64,AA==' }

test('history copies nested drawing data and never shares frames with callers', () => {
  const incoming = [draw]
  let state = apply(createInitialHistoryState(), 'COMMIT', incoming)

  incoming[0].points[0] = 999
  assert.deepEqual(state.shapes[0].points, [0, 0, 20, 20])

  state = apply(state, 'COMMIT', shapes => {
    shapes[0].points.push(40, 40)
    return shapes
  })
  state = apply(state, 'UNDO')

  assert.deepEqual(state.shapes[0].points, [0, 0, 20, 20])
  assert.deepEqual(state.redoStack[0][0].points, [0, 0, 20, 20, 40, 40])
})

test('drawing, shape transforms, text, images, and deletion undo and redo in order', () => {
  let state = createInitialHistoryState()
  state = apply(state, 'COMMIT', [draw])
  state = apply(state, 'COMMIT', previous => [...previous, rectangle])
  state = apply(state, 'COMMIT', previous => previous.map(shape => shape.id === rectangle.id ? { ...shape, x: 200, y: 220, width: 180, height: 90 } : shape))
  state = apply(state, 'COMMIT', previous => [...previous, label])
  state = apply(state, 'COMMIT', previous => [...previous, image])
  state = apply(state, 'COMMIT', previous => previous.filter(shape => shape.id !== rectangle.id && shape.id !== label.id))

  assert.deepEqual(state.shapes.map(shape => shape.id), ['draw-1', 'image-1'])

  state = apply(state, 'UNDO')
  assert.equal(state.shapes.find(shape => shape.id === 'shape-1').x, 200)
  assert.equal(state.shapes.find(shape => shape.id === 'shape-1').width, 180)
  assert.equal(state.shapes.find(shape => shape.id === 'text-1').text, 'Plan')

  state = apply(state, 'UNDO')
  assert.equal(state.shapes.some(shape => shape.id === 'image-1'), false)
  state = apply(state, 'REDO')
  state = apply(state, 'REDO')

  assert.deepEqual(state.shapes.map(shape => shape.id), ['draw-1', 'image-1'])
  assert.equal(state.redoStack.length, 0)
})

test('no-op commits do not create entries or discard the redo branch', () => {
  let state = createInitialHistoryState()
  state = apply(state, 'COMMIT', [rectangle])
  state = apply(state, 'COMMIT', previous => [...previous, label])
  state = apply(state, 'UNDO')
  const beforeNoop = state

  state = apply(state, 'COMMIT', previous => previous)
  assert.strictEqual(state, beforeNoop)
  assert.equal(state.redoStack.length, 1)

  state = apply(state, 'REDO')
  assert.deepEqual(state.shapes.map(shape => shape.id), ['shape-1', 'text-1'])
})

test('replacing the board resets history safely and preserves revision semantics', () => {
  let state = createInitialHistoryState()
  state = apply(state, 'COMMIT', [draw])
  const revision = state.revision

  state = apply(state, 'REPLACE', [image])
  assert.deepEqual(state.shapes, [image])
  assert.equal(state.undoStack.length, 0)
  assert.equal(state.redoStack.length, 0)
  assert.equal(state.revision, revision + 1)
  assert.strictEqual(apply(state, 'UNDO'), state)
})
