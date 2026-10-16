// A tiny browser-based data store for the demo.
// Records live in localStorage; uploaded files (PDFs, photos) live in IndexedDB.
// To go live, swap these functions for calls to a real backend (see README).
import { useEffect, useState } from 'react'
import { seed } from '../data/site'

const PREFIX = 'techsix:v1:'
const listeners = new Set()
const notify = (key) => listeners.forEach((fn) => fn(key))

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

export function getAll(name) {
  try {
    const raw = localStorage.getItem(PREFIX + name)
    if (raw) return JSON.parse(raw)
  } catch {}
  return seed[name] ? seed[name]() : []
}

export function setAll(name, items) {
  try {
    localStorage.setItem(PREFIX + name, JSON.stringify(items))
  } catch (e) {
    alert('Could not save: browser storage is full or blocked.')
    throw e
  }
  notify(name)
}

export function addItem(name, item) {
  const record = { id: uid(), createdAt: new Date().toISOString(), ...item }
  setAll(name, [record, ...getAll(name)])
  return record
}

export function updateItem(name, id, patch) {
  setAll(name, getAll(name).map((r) => (r.id === id ? { ...r, ...patch } : r)))
}

export function removeItem(name, id) {
  const rec = getAll(name).find((r) => r.id === id)
  if (rec?.fileId) deleteFile(rec.fileId).catch(() => {})
  setAll(name, getAll(name).filter((r) => r.id !== id))
}

export async function resetDemo() {
  Object.keys(seed).forEach((k) => localStorage.removeItem(PREFIX + k))
  await clearFiles().catch(() => {})
  Object.keys(seed).forEach(notify)
}

export function useCollection(name) {
  const [items, setItems] = useState(() => getAll(name))
  useEffect(() => {
    const onChange = (key) => key === name && setItems(getAll(name))
    const onStorage = (e) => e.key === PREFIX + name && setItems(getAll(name))
    listeners.add(onChange)
    window.addEventListener('storage', onStorage)
    return () => {
      listeners.delete(onChange)
      window.removeEventListener('storage', onStorage)
    }
  }, [name])
  return items
}

// ─── Files (IndexedDB) ───────────────────────────────────────────────────────
const DB_NAME = 'techsix-files'
const STORE = 'files'
let dbPromise

function db() {
  dbPromise ??= new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  return dbPromise
}

async function run(mode, op) {
  const d = await db()
  return new Promise((resolve, reject) => {
    const tx = d.transaction(STORE, mode)
    const req = op(tx.objectStore(STORE))
    tx.oncomplete = () => resolve(req.result)
    tx.onerror = () => reject(tx.error)
  })
}

export const saveFile = async (file) => {
  const id = 'f_' + uid()
  await run('readwrite', (s) => s.put({ blob: file, name: file.name, type: file.type }, id))
  return id
}
export const getFile = (id) => run('readonly', (s) => s.get(id))
export const deleteFile = (id) => run('readwrite', (s) => s.delete(id))
export const clearFiles = () => run('readwrite', (s) => s.clear())

export function useFileUrl(fileId) {
  const [url, setUrl] = useState(null)
  useEffect(() => {
    if (!fileId) return
    let objectUrl
    let alive = true
    getFile(fileId).then((f) => {
      if (alive && f) setUrl((objectUrl = URL.createObjectURL(f.blob)))
    })
    return () => {
      alive = false
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [fileId])
  return url
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export const formatSize = (bytes) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`

// ─── Dates ───────────────────────────────────────────────────────────────────
const parse = (s) => new Date(s.length === 10 ? s + 'T00:00:00' : s)
export const fmtDate = (s, opts = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  parse(s).toLocaleDateString('en-IN', opts)
export const isNew = (s, days = 7) => Date.now() - parse(s).getTime() < days * 864e5
export const isPast = (s) => parse(s).getTime() < new Date().setHours(0, 0, 0, 0)
export const toDate = parse
