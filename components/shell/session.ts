// Sample session and notifications for the pilot; a real app would load these per user.
export const session = {
  name: 'Nusrat Jahan',
  role: 'Employee (ESS)',
  company: 'Silicon Orchard Ltd.',
}

export type NotificationCategory = 'Approvals' | 'General' | 'Payroll'

export type Notification = {
  id: string
  icon: 'circle-check' | 'hourglass' | 'megaphone' | 'lock' | 'file-down'
  tone: 'ok' | 'warn' | 'blue' | 'slate' | 'teal'
  title: string
  body: string
  time: string
  unread: boolean
  category: NotificationCategory
}

export const sampleNotifications: Notification[] = [
  {
    id: 'n1',
    icon: 'circle-check',
    tone: 'ok',
    title: 'Missed-punch correction approved',
    body: 'Mehedi Hasan approved your 02 Nov correction (in-time 09:14 AM → 09:00 AM).',
    time: '18 min ago',
    unread: true,
    category: 'Approvals',
  },
  {
    id: 'n2',
    icon: 'hourglass',
    tone: 'warn',
    title: 'Leave request waiting',
    body: 'Casual leave 10–11 Nov is with Mehedi Hasan (step 1 of 2).',
    time: '2 hours ago',
    unread: true,
    category: 'Approvals',
  },
  {
    id: 'n3',
    icon: 'megaphone',
    tone: 'blue',
    title: 'New announcement: Leave Policy 2027',
    body: 'HR & Admin published a policy update. 1 PDF attached.',
    time: 'Yesterday, 04:30 PM',
    unread: true,
    category: 'General',
  },
  {
    id: 'n4',
    icon: 'lock',
    tone: 'slate',
    title: 'October attendance is locked',
    body: 'HR locked October 2026 for payroll. Contact HR if something is wrong.',
    time: '03 Nov, 10:00 AM',
    unread: false,
    category: 'General',
  },
  {
    id: 'n5',
    icon: 'file-down',
    tone: 'teal',
    title: 'Your October 2026 payslip is published',
    body: 'Open My Payslips to view or download it.',
    time: '01 Nov, 09:00 AM',
    unread: false,
    category: 'Payroll',
  },
]
