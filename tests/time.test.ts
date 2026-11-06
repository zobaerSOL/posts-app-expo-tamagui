import { describe, expect, it } from 'vitest'
import {
  clockParts,
  dhakaParts,
  formatDuration,
  formatLongDate,
  formatTime,
  greeting,
} from '../features/home/time'

describe('home time helpers', () => {
  it('shifts UTC to Asia/Dhaka (UTC+6) and rolls the date over', () => {
    // 2026-11-05 20:30:15 UTC is already 6 Nov in Dhaka
    const ms = Date.UTC(2026, 10, 5, 20, 30, 15)
    expect(dhakaParts(ms)).toMatchObject({ year: 2026, month: 10, day: 6, weekday: 5 })
    expect(dhakaParts(ms).secOfDay).toBe(2 * 3600 + 30 * 60 + 15)
    expect(formatLongDate(ms)).toBe('Friday, 06 Nov 2026')
  })

  it('formats a 12 hour clock, including midnight and noon', () => {
    expect(clockParts(0)).toEqual({ hm: '12:00', s: '00', ap: 'AM' })
    expect(clockParts(12 * 3600)).toEqual({ hm: '12:00', s: '00', ap: 'PM' })
    expect(clockParts(11 * 3600 + 42 * 60 + 8)).toEqual({ hm: '11:42', s: '08', ap: 'AM' })
    expect(formatTime(18 * 3600 + 5 * 60)).toBe('06:05 PM')
  })

  it('formats durations and clamps negatives to zero', () => {
    expect(formatDuration(3725, true)).toBe('01:02:05')
    expect(formatDuration(3725)).toBe('1h 02m')
    expect(formatDuration(-30, true)).toBe('00:00:00')
  })

  it('greets by time of day', () => {
    expect(greeting(8 * 3600)).toBe('Good morning')
    expect(greeting(13 * 3600)).toBe('Good afternoon')
    expect(greeting(20 * 3600)).toBe('Good evening')
  })
})
