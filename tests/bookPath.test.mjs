// node --import ./tests/resolve-hooks.mjs --test tests/bookPath.test.mjs
// (Node 24 spouští .ts přímo — typy se odříznou; hook doplní importy Next/TS)
import assert from 'node:assert/strict'
import { test } from 'node:test'

import { NextRequest } from 'next/server.js'

import { LEGACY_NOONA_SERVICES, resolveBookPath } from '../src/lib/bookPath.ts'
import { config, middleware } from '../src/middleware.ts'

const SERVICE = 'h5dc97zjdpq8lp7tnn6os9h7' // Laminace + úprava tvaru
const MASTER = 'abcdefghijklmnopqrstuvwx'
const HOLD = 'zyxwvutsrqponmlkjihgfe12'

test('platné kroky rezervace projdou beze změny', () => {
  for (const path of [
    `/book/${SERVICE}`,
    `/book/${SERVICE}/extras`,
    `/book/${SERVICE}/any`,
    `/book/${SERVICE}/${MASTER}`,
    `/book/reservation/${HOLD}`,
  ]) {
    assert.equal(resolveBookPath(path), null, path)
  }
})

test('/book a zbytek webu middleware nechá být', () => {
  assert.equal(resolveBookPath('/book'), null)
  assert.equal(resolveBookPath('/cenik'), null)
  assert.equal(resolveBookPath('/booking'), null)
})

test('lomítko na konci → stejná adresa bez lomítka', () => {
  assert.equal(resolveBookPath(`/book/${SERVICE}/`), `/book/${SERVICE}`)
  assert.equal(resolveBookPath(`/book/${SERVICE}/extras//`), `/book/${SERVICE}/extras`)
  assert.equal(resolveBookPath('/book/'), '/book')
})

test('známé ID z Noona → tatáž služba (vstup přes /extras)', () => {
  const target = `/book/${SERVICE}/extras`
  assert.equal(resolveBookPath('/book/7VyNrKG84dgxPEtHNs2nISMk/Burymc257o8NenMbB'), target)
  assert.equal(resolveBookPath('/book/7VyNrKG84dgxPEtHNs2nISMk'), target)
  assert.equal(resolveBookPath('/book/7VyNrKG84dgxPEtHNs2nISMk/extras'), target)
  assert.equal(resolveBookPath('/book/7VyNrKG84dgxPEtHNs2nISMk/'), target)
  assert.equal(
    resolveBookPath('/book/Kadqalp4zBE3by4E6Me0B97j'),
    '/book/qwd3vhlsw6kaxz6yyvlx7myz/extras',
  )
  assert.equal(
    resolveBookPath('/book/eT9fsXB3rL5mt43P4JUYGqGw/any'),
    '/book/d4onu8jnqq3203mn0ximzes5/extras',
  )
})

test('neznámé a rozbité adresy → /book', () => {
  for (const path of [
    '/book/f9zTH1UAwhjGrZznabTp0XZp/Burymc257o8NenMbB', // služba z Noona už neexistuje
    '/book/BvNvjQPya6TNvTWjVdmwcGLb/any',
    '/book/H5DC97ZJDPQ8LP7TNN6OS9H7', // velká písmena
    '/book/abc',
    `/book/${SERVICE}x`, // 25 znaků
    `/book/${SERVICE}/extras/navic`,
    `/book/${SERVICE}/static/chunks/5239-103774fadeca8097.js`,
    '/book/reservation/WSguglrhzNKMXyVhBMR9TYmw', // rezervace z Noona
    '/book/reservation/abc',
    `/book/${SERVICE}/Any`,
    '/book/constructor', // klíč z prototypu objektu
    '/book/__proto__',
    '/book/toString/any',
  ]) {
    assert.equal(resolveBookPath(path), '/book', path)
  }
})

test('mapa Noona: klíče mají velká písmena, cíle jsou platné documentId', () => {
  for (const [noonaId, docId] of Object.entries(LEGACY_NOONA_SERVICES)) {
    assert.match(noonaId, /[A-Z]/, noonaId)
    assert.match(docId, /^[a-z0-9]{24}$/, docId)
    assert.equal(resolveBookPath(`/book/${docId}`), null, docId)
  }
})

const run = (url) => middleware(new NextRequest(url))

test('middleware se spouští jen pod /book/', () => {
  assert.deepEqual(config.matcher, ['/book/:path+'])
})

test('middleware: 301 na /book, query (gclid) zůstane', () => {
  const res = run('https://barbitch.cz/book/abc?gclid=XYZ&utm_source=google')
  assert.equal(res.status, 301)
  assert.equal(res.headers.get('location'), 'https://barbitch.cz/book?gclid=XYZ&utm_source=google')
})

test('middleware: stará reklamní adresa → Laminace', () => {
  const res = run(
    'https://barbitch.cz/book/7VyNrKG84dgxPEtHNs2nISMk/Burymc257o8NenMbB?gad_campaignid=22374474638',
  )
  assert.equal(res.status, 301)
  assert.equal(
    res.headers.get('location'),
    `https://barbitch.cz/book/${SERVICE}/extras?gad_campaignid=22374474638`,
  )
})

test('middleware: platná adresa projde (bez přesměrování)', () => {
  const res = run(`https://barbitch.cz/book/${SERVICE}?v=M`)
  assert.equal(res.status, 200)
  assert.equal(res.headers.get('location'), null)
  assert.equal(res.headers.get('x-middleware-next'), '1')
})

test('middleware: lomítko na konci → 301 bez lomítka', () => {
  const res = run(`https://barbitch.cz/book/${SERVICE}/`)
  assert.equal(res.status, 301)
  assert.equal(res.headers.get('location'), `https://barbitch.cz/book/${SERVICE}`)
})
