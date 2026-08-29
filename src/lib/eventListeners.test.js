import assert from 'node:assert/strict'
import test from 'node:test'
import { addEventListenerOnce, removeEventListenerIfPresent } from './eventListeners.js'

function createTarget() {
  return {
    listeners: new Map(),
    addEventListener(type, handler, options) {
      const key = `${type}:${String(options)}`
      const handlers = this.listeners.get(type) || new Set()
      handlers.add(handler)
      this.listeners.set(type, handlers)
    },
    removeEventListener(type, handler, options) {
      const handlers = this.listeners.get(type)
      if (!handlers) return
      handlers.delete(handler)
      if (handlers.size === 0) this.listeners.delete(type)
    },
    getListenerCount(type) {
      return this.listeners.get(type)?.size || 0
    }
  }
}

test('addEventListenerOnce keeps a single listener per handler and removes stale listeners before re-binding', () => {
  const target = createTarget()
  const handler = () => {}

  const detachA = addEventListenerOnce(target, 'pointermove', handler)
  const detachB = addEventListenerOnce(target, 'pointermove', handler)

  assert.equal(target.getListenerCount('pointermove'), 1)
  detachA()
  assert.equal(target.getListenerCount('pointermove'), 0)
  detachB()
  assert.equal(target.getListenerCount('pointermove'), 0)
})

test('removeEventListenerIfPresent clears the callback without leaving a stale listener behind', () => {
  const target = createTarget()
  const first = () => {}
  const second = () => {}

  target.addEventListener('keydown', first)
  target.addEventListener('keydown', second)
  assert.equal(target.getListenerCount('keydown'), 2)

  removeEventListenerIfPresent(target, 'keydown', first)
  assert.equal(target.getListenerCount('keydown'), 1)

  removeEventListenerIfPresent(target, 'keydown', second)
  assert.equal(target.getListenerCount('keydown'), 0)
})
