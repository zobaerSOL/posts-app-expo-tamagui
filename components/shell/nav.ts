import type { Href } from 'expo-router'
import {
  CalendarClock,
  CalendarDays,
  CalendarOff,
  FileText,
  House,
  LayoutDashboard,
  ShoppingBag,
  UserRound,
  Wallet,
} from '../icons'
import type { IconComponent } from '../hr/ui'

export type NavItem = {
  label: string
  Icon: IconComponent
  // Items without an href are screens that are not built yet; pressing one shows a toast.
  href?: Href
  isActive?: (pathname: string) => boolean
}

export type NavGroup = { label: string; items: NavItem[] }

const under = (prefix: string) => (p: string) => p === prefix || p.startsWith(`${prefix}/`)

export const NAV: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', Icon: LayoutDashboard, href: '/', isActive: (p) => p === '/' }],
  },
  {
    label: 'Me',
    items: [
      { label: 'My Attendance', Icon: CalendarClock },
      { label: 'My Leave', Icon: CalendarOff },
      { label: 'My Payslips', Icon: Wallet },
      { label: 'My Profile', Icon: UserRound },
      { label: 'Holidays', Icon: CalendarDays },
    ],
  },
  // The pilot's original API-backed screens (JSONPlaceholder posts, DummyJSON products).
  {
    label: 'Demo APIs',
    items: [
      { label: 'Posts', Icon: FileText, href: '/posts', isActive: under('/posts') },
      { label: 'Products', Icon: ShoppingBag, href: '/products', isActive: under('/products') },
    ],
  },
]

// Mobile bottom tabs (tablet/desktop use the sidebar).
export const TABS: NavItem[] = [
  { label: 'Home', Icon: House, href: '/', isActive: (p) => p === '/' },
  { label: 'Attendance', Icon: CalendarClock },
  { label: 'Leave', Icon: CalendarOff },
  { label: 'Payslips', Icon: Wallet },
]

export function routeMeta(pathname: string): { title: string; crumbs: string[] } {
  if (pathname === '/') return { title: 'Home', crumbs: ['Overview'] }
  if (pathname === '/posts') return { title: 'Posts', crumbs: ['Demo APIs'] }
  if (pathname.startsWith('/posts/')) return { title: 'Post', crumbs: ['Demo APIs', 'Posts'] }
  if (pathname === '/products') return { title: 'Products', crumbs: ['Demo APIs'] }
  if (pathname.startsWith('/products/'))
    return { title: 'Product', crumbs: ['Demo APIs', 'Products'] }
  if (pathname.startsWith('/user/')) return { title: 'User', crumbs: ['Demo APIs', 'Posts'] }
  return { title: 'Not found', crumbs: [] }
}
