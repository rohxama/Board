import test from 'node:test'
import assert from 'node:assert/strict'
import { friendlyErrorMessage } from './userMessages.js'

test('import errors become plain actionable messages', () => {
  const result = friendlyErrorMessage(new Error('The diagram file is not valid JSON.'), 'Import Failed — This file isn’t supported or appears to be corrupted. Try another file.')
  assert.equal(result, 'Import Failed — This file isn’t supported or appears to be corrupted. Try another file.')
})

test('image errors become plain actionable messages', () => {
  const result = friendlyErrorMessage(new Error('Use a PNG, JPG, SVG, or WEBP image.'), 'Image upload failed — This file isn’t supported or couldn’t be processed. Try another image.')
  assert.equal(result, 'Image upload failed — This file isn’t supported or couldn’t be processed. Try another image.')
})
