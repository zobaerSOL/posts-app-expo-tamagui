// Clock helpers for the punch card. The office runs on Asia/Dhaka (UTC+6, no DST), so the offset
// is applied by hand instead of relying on Intl time zone support in every runtime.
const DHAKA_OFFSET_MS = 6 * 3600 * 1000

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const SHIFT = {
  startSec: 9 * 3600,
  endSec: 18 * 3600,
  fullDaySec: 9 * 3600,
  halfDaySec: 4.5 * 3600,
}

const pad = (n: number) => String(n).padStart(2, '0')

export function dhakaParts(ms: number) {
  const d = new Date(ms + DHAKA_OFFSET_MS)
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth(),
    day: d.getUTCDate(),
    weekday: d.getUTCDay(),
    secOfDay: d.getUTCHours() * 3600 + d.getUTCMinutes() * 60 + d.getUTCSeconds(),
  }
}

// 'Thursday, 05 Nov 2026'
export function formatLongDate(ms: number) {
  const p = dhakaParts(ms)
  return `${DAYS[p.weekday]}, ${pad(p.day)} ${MONTHS[p.month]} ${p.year}`
}

// '05 Nov'
export function formatShortDay(ms: number) {
  const p = dhakaParts(ms)
  return `${pad(p.day)} ${MONTHS[p.month]}`
}

// Seconds since midnight -> { hm: '11:42', s: '08', ap: 'AM' }
export function clockParts(secOfDay: number) {
  const h24 = Math.floor(secOfDay / 3600) % 24
  return {
    hm: `${pad(h24 % 12 || 12)}:${pad(Math.floor(secOfDay / 60) % 60)}`,
    s: pad(secOfDay % 60),
    ap: h24 >= 12 ? 'PM' : 'AM',
  }
}

// Seconds since midnight -> '09:02 AM'
export function formatTime(secOfDay: number) {
  const c = clockParts(secOfDay)
  return `${c.hm} ${c.ap}`
}

// 3725 -> '01:02:05' (withSeconds) or '1h 02m'
export function formatDuration(totalSec: number, withSeconds = false) {
  const sec = Math.max(0, Math.floor(totalSec))
  const h = Math.floor(sec / 3600)
  const m = Math.floor(sec / 60) % 60
  return withSeconds ? `${pad(h)}:${pad(m)}:${pad(sec % 60)}` : `${h}h ${pad(m)}m`
}

export function greeting(secOfDay: number) {
  if (secOfDay < 12 * 3600) return 'Good morning'
  if (secOfDay < 17 * 3600) return 'Good afternoon'
  return 'Good evening'
}
