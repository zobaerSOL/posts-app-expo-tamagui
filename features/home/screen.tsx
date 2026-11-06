import { type ReactNode, useState } from 'react'
import { ScrollView, XStack, YStack } from 'tamagui'
import { LogOut } from '../../components/icons'
import { Btn, T } from '../../components/hr/ui'
import { ModalPanel } from '../../components/shell/panels'
import { useShell } from '../../components/shell/shell-context'
import type { EmployeeHome, Punch } from './data'
import { MissedPunchForm } from './missed-punch-form'
import { PunchCard, workedSeconds } from './punch-card'
import {
  Announcements,
  LeaveBalanceCard,
  MonthSummary,
  NextHolidays,
  PendingRequests,
  QuickActions,
} from './sections'
import {
  dhakaParts,
  formatDuration,
  formatLongDate,
  formatShortDay,
  formatTime,
  greeting,
  SHIFT,
} from './time'
import { useNow } from './use-now'

// A grid cell: grows to share the row, wraps onto its own line when narrower than `basis`.
function Cell({ grow, basis, children }: { grow?: number; basis?: number; children: ReactNode }) {
  return (
    <YStack
      flexGrow={grow ?? 1}
      flexShrink={1}
      flexBasis={basis}
      width={basis ? undefined : '100%'}
      minWidth={0}
    >
      {children}
    </YStack>
  )
}

export function HomeScreen({ data }: { data: EmployeeHome }) {
  const { toast, openLayer, closeLayer } = useShell()
  const now = useNow()
  const secOfDay = now == null ? null : dhakaParts(now).secOfDay
  const [punch, setPunch] = useState<Punch>(data.punch)
  const [requests, setRequests] = useState(data.requests)
  const firstName = data.employee.name.split(' ')[0]

  const checkIn = () => {
    if (secOfDay == null) return
    setPunch({ status: 'in', inSec: secOfDay, outSec: null })
    toast({
      title: `Checked in at ${formatTime(secOfDay)}`,
      body: `${data.shift.branch} · office network`,
    })
  }

  const undoCheckOut = () => {
    setPunch((p) => ({ ...p, status: 'in', outSec: null }))
    toast({ title: 'Check-out undone', body: 'You’re still checked in.' })
  }

  const confirmCheckOut = (sec: number) => {
    setPunch((p) => ({ ...p, status: 'done', outSec: sec }))
    closeLayer()
    toast({
      title: `Checked out at ${formatTime(sec)}`,
      body:
        sec < SHIFT.endSec
          ? 'Early Leave recorded. Your manager can see it in team attendance.'
          : undefined,
      action: { label: 'Undo check-out', onPress: undoCheckOut },
    })
  }

  const askCheckOut = () => {
    if (secOfDay == null) return
    const sec = secOfDay
    const early = sec < SHIFT.endSec
    openLayer(
      'modal',
      <ModalPanel
        title={`Check out at ${formatTime(sec)}?`}
        Icon={LogOut}
        tone="warn"
        footer={
          <>
            <Btn onPress={closeLayer}>Keep working</Btn>
            <Btn
              variant="primary"
              Icon={LogOut}
              onPress={() => confirmCheckOut(sec)}
            >
              Check out now
            </Btn>
          </>
        }
      >
        <T c="ink2">
          You’ve worked <T w="700">{formatDuration(workedSeconds(punch, sec))}</T> of your 9h 00m
          shift.
          {early
            ? ' Checking out before 06:00 PM marks today as Early Leave (and Half-Day under 4h 30m) unless a correction is approved.'
            : ''}
        </T>
      </ModalPanel>
    )
  }

  const askMissedPunch = () => {
    openLayer(
      'drawer',
      <MissedPunchForm
        dateLabel={now == null ? '' : formatLongDate(now)}
        onSubmit={(_reason, missing) => {
          setRequests((r) => [
            {
              id: `MP-${Date.now()}`,
              kind: 'punch',
              title: `Missed punch · ${now == null ? 'today' : formatShortDay(now)} (${missing.toLowerCase()})`,
              sub: 'Step 1 of 2 · with Mehedi Hasan',
              status: 'pending',
            },
            ...r,
          ])
          closeLayer()
          toast({
            title: 'Missed-punch request sent',
            body: 'Mehedi Hasan usually responds within a day.',
          })
        }}
      />
    )
  }

  return (
    <ScrollView>
      <YStack
        padding="4 md:5 lg:6"
        gap="4 lg:5"
        maxWidth={1600}
        width="100%"
        alignSelf="center"
      >
        <YStack>
          <T
            s={24}
            lh={32}
            w="600"
            role="heading"
            aria-level={1}
          >
            {secOfDay == null ? 'Hello' : greeting(secOfDay)}, {firstName}
          </T>
          <T c="muted">
            {data.employee.designation} · {data.employee.department} · {data.employee.code}
          </T>
        </YStack>

        <XStack
          flexWrap="wrap"
          gap="4 lg:5"
        >
          <Cell
            grow={2}
            basis={520}
          >
            <PunchCard
              punch={punch}
              shift={data.shift}
              now={now}
              secOfDay={secOfDay}
              onCheckIn={checkIn}
              onCheckOut={askCheckOut}
            />
          </Cell>
          <Cell
            grow={1}
            basis={300}
          >
            <LeaveBalanceCard
              balances={data.leaveBalances}
              leaveYear={data.leaveYear}
            />
          </Cell>
          <Cell>
            <QuickActions onMissedPunch={askMissedPunch} />
          </Cell>
          <Cell
            grow={7}
            basis={420}
          >
            <PendingRequests requests={requests} />
          </Cell>
          <Cell
            grow={5}
            basis={320}
          >
            <MonthSummary month={data.month} />
          </Cell>
          <Cell
            grow={7}
            basis={420}
          >
            <Announcements items={data.announcements} />
          </Cell>
          <Cell
            grow={5}
            basis={320}
          >
            <NextHolidays holidays={data.holidays} />
          </Cell>
        </XStack>
      </YStack>
    </ScrollView>
  )
}
