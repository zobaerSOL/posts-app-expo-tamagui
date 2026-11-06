// Sample data for the employee home screen (from docs/local/employee-home.html). A real backend
// would return the same shape from the loader.
export type PunchStatus = 'out' | 'in' | 'done'

export type Punch = {
  status: PunchStatus
  // Seconds since midnight in Asia/Dhaka
  inSec: number | null
  outSec: number | null
}

export type LeaveBalance = {
  type: 'Casual' | 'Sick' | 'Earned'
  allocated: number
  used: number
  pending: number
  color: 'chart1' | 'chart2' | 'chart4'
}

export type RequestItem = {
  id: string
  kind: 'leave' | 'punch'
  title: string
  sub: string
  status: 'pending' | 'approved'
}

export type Announcement = {
  id: string
  tone: 'blue' | 'teal' | 'violet'
  icon: 'file-text' | 'wifi' | 'flag'
  title: string
  body: string
  meta: string
  file: string
}

export type Holiday = {
  id: string
  name: string
  when: string
  kind: 'national' | 'religious' | 'company'
}

export type EmployeeHome = {
  employee: { name: string; designation: string; department: string; code: string }
  shift: { name: string; window: string; branch: string; graceMinutes: number; breakLabel: string }
  punch: Punch
  leaveBalances: LeaveBalance[]
  leaveYear: string
  requests: RequestItem[]
  month: {
    label: string
    daysPresent: number
    workingDays: number
    late: number
    overtime: string
    regularized: number
    policy: string
  }
  announcements: Announcement[]
  holidays: Holiday[]
}

export const sampleEmployeeHome: EmployeeHome = {
  employee: {
    name: 'Nusrat Jahan',
    designation: 'Senior QA Engineer',
    department: 'QA Automation',
    code: 'SOL-2023-0142',
  },
  shift: {
    name: 'General',
    window: '09:00 AM – 06:00 PM',
    branch: 'Dhaka HQ (Gulshan)',
    graceMinutes: 10,
    breakLabel: '01:00 PM · 60 min break',
  },
  punch: { status: 'in', inSec: 9 * 3600 + 2 * 60, outSec: null },
  leaveBalances: [
    { type: 'Casual', allocated: 10, used: 4, pending: 2, color: 'chart1' },
    { type: 'Sick', allocated: 14, used: 2, pending: 0, color: 'chart2' },
    { type: 'Earned', allocated: 18, used: 10, pending: 0, color: 'chart4' },
  ],
  leaveYear: 'Leave year 2026 · resets 01 Jan',
  requests: [
    {
      id: 'LV-2026-0412',
      kind: 'leave',
      title: 'Casual leave · 2 days',
      sub: '10 Nov – 11 Nov 2026 · Step 1 of 2 · with Mehedi Hasan',
      status: 'pending',
    },
    {
      id: 'MP-2026-0088',
      kind: 'punch',
      title: 'Missed punch · 26 Oct (check-out)',
      sub: 'Correction to 06:05 PM · approved 28 Oct, before the October lock',
      status: 'approved',
    },
  ],
  month: {
    label: 'November 2026 · to date',
    daysPresent: 5,
    workingDays: 5,
    late: 1,
    overtime: '1h 30m',
    regularized: 1,
    policy: 'Every 3 late days in a month count as 1 absent day',
  },
  announcements: [
    {
      id: 'a1',
      tone: 'blue',
      icon: 'file-text',
      title: 'Leave Policy 2027 is published',
      body: 'Earned leave now carries forward up to 30 days. Read the summary before your December planning.',
      meta: 'HR & Admin · 04 Nov 2026',
      file: 'Leave_Policy_2027.pdf · 412 KB',
    },
    {
      id: 'a2',
      tone: 'teal',
      icon: 'wifi',
      title: 'Web check-in now works only on office Wi-Fi',
      body: 'From 01 Nov, the Check In button works on the Dhaka HQ and Chattogram office networks. Use the gate reader if you are elsewhere.',
      meta: 'Admin · 28 Oct 2026',
      file: 'Web_Punch_FAQ.pdf · 96 KB',
    },
    {
      id: 'a3',
      tone: 'violet',
      icon: 'flag',
      title: 'Victory Day holiday — Wed, 16 Dec 2026',
      body: 'All branches closed. Staff asked to work that day get holiday overtime at the Labour Act rate.',
      meta: 'HR & Admin · 01 Nov 2026',
      file: 'Holiday_Calendar_2026.pdf · 96 KB',
    },
  ],
  holidays: [
    { id: 'h1', name: 'Victory Day', when: 'Wednesday, 16 Dec 2026', kind: 'national' },
    { id: 'h2', name: 'Christmas Day', when: 'Friday, 25 Dec 2026', kind: 'religious' },
    {
      id: 'h3',
      name: 'Shaheed Day & International Mother Language Day',
      when: 'Sunday, 21 Feb 2027',
      kind: 'national',
    },
  ],
}
