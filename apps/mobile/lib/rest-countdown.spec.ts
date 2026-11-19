import { describe, expect, it } from 'vitest'
import { formatRest, getRemainingRestSeconds } from './rest-countdown'

describe('getRemainingRestSeconds', () => {
  it('returns the whole rest at its start', () => {
    const now = 1_000_000
    const restEndsAt = now + 90_000 // repos de 1:30

    expect(getRemainingRestSeconds(restEndsAt, now)).toBe(90)
  })
  it('rounds up, like the notification countdown', () => {
    const now = 1_000_000
    const restEndsAt = now + 89_200 // 800 ms après le début d'un repos de 1:30

    expect(getRemainingRestSeconds(restEndsAt, now)).toBe(90)
  })
  it('never goes below zero once the rest is over', () => {
    const now = 1_000_000
    const restEndsAt = now - 2_000 // repos fini depuis 2 s

    expect(getRemainingRestSeconds(restEndsAt, now)).toBe(0)
  })
})

describe('formatRest', () => {
  it('formats seconds as m:ss', () => {
    expect(formatRest(90)).toBe('1:30')
  })
  it('pads seconds to two digits', () => {
    expect(formatRest(65)).toBe('1:05')
    expect(formatRest(0)).toBe('0:00') // fin du repos, comme la notif
  })
})
