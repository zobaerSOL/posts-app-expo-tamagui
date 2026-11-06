import { Platform } from 'react-native'
import { XStack, YStack } from 'tamagui'
import {
  Building2,
  CalendarClock,
  Clock,
  Globe,
  LogIn,
  LogOut,
  MonitorSmartphone,
  Wifi,
} from '../../components/icons'
import { Btn, Card, Chip, type IconComponent, Overline, T } from '../../components/hr/ui'
import type { EmployeeHome, Punch } from './data'
import { clockParts, formatDuration, formatLongDate, formatTime, SHIFT } from './time'

const DEVICE = Platform.select({ web: 'Web browser', ios: 'iOS app', default: 'Android app' })

export function workedSeconds(punch: Punch, secOfDay: number | null) {
  if (punch.status === 'out' || punch.inSec == null) return 0
  const end = punch.status === 'done' ? punch.outSec : secOfDay
  return Math.max(0, (end ?? punch.inSec) - punch.inSec)
}

function MetaItem({ Icon, text, ok }: { Icon: IconComponent; text: string; ok?: boolean }) {
  return (
    <XStack
      alignItems="center"
      gap={6}
    >
      <Icon
        size={14}
        color={ok ? 'okFg' : 'muted'}
      />
      <T
        s={12}
        lh={16}
        c={ok ? 'okFg' : 'muted'}
      >
        {text}
      </T>
    </XStack>
  )
}

export function PunchCard({
  punch,
  shift,
  now,
  secOfDay,
  onCheckIn,
  onCheckOut,
}: {
  punch: Punch
  shift: EmployeeHome['shift']
  now: number | null
  secOfDay: number | null
  onCheckIn: () => void
  onCheckOut: () => void
}) {
  const clock = secOfDay == null ? null : clockParts(secOfDay)
  const worked = workedSeconds(punch, secOfDay)
  const pct = Math.min(100, (worked / SHIFT.fullDaySec) * 100)
  const left = Math.max(0, SHIFT.fullDaySec - worked)
  const earlyLeave = punch.status === 'done' && (punch.outSec ?? 0) < SHIFT.endSec

  return (
    <Card
      padding={24}
      gap={20}
      aria-label="Attendance punch"
    >
      <XStack
        justifyContent="space-between"
        alignItems="flex-start"
        flexWrap="wrap"
        gap={16}
      >
        <YStack
          gap={6}
          minWidth={0}
        >
          <Overline>{now == null ? '' : `${formatLongDate(now)} · `}Asia/Dhaka (UTC+6)</Overline>
          <XStack
            alignItems="baseline"
            gap={6}
          >
            <T
              s={40}
              lh={44}
              w="600"
              letterSpacing={-0.8}
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {clock ? clock.hm : '--:--'}
            </T>
            <T
              s={16}
              lh={24}
              w="500"
              c="muted"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {clock ? `${clock.s} ${clock.ap}` : '-- --'}
            </T>
          </XStack>
        </YStack>
        {punch.status === 'in' && punch.inSec != null ? (
          <Chip
            tone="ok"
            label={`Checked in · ${formatTime(punch.inSec)}`}
          />
        ) : punch.status === 'done' ? (
          <Chip
            tone="warn"
            label={`Checked out · ${formatTime(punch.outSec ?? 0)}`}
          />
        ) : (
          <Chip
            tone="slate"
            label="Not checked in"
          />
        )}
      </XStack>

      <XStack
        gap={16}
        rowGap={6}
        flexWrap="wrap"
      >
        <XStack
          alignItems="center"
          gap={6}
          flexShrink={1}
        >
          <CalendarClock
            size={16}
            color="ink2"
          />
          <T
            c="ink2"
            flexShrink={1}
          >
            Today’s shift:{' '}
            <T
              c="ink2"
              w="700"
            >{`${shift.name} · ${shift.window}`}</T>
          </T>
        </XStack>
        <XStack
          alignItems="center"
          gap={6}
        >
          <Building2
            size={16}
            color="ink2"
          />
          <T c="ink2">{shift.branch}</T>
        </XStack>
        <XStack
          alignItems="center"
          gap={6}
        >
          <Clock
            size={16}
            color="ink2"
          />
          <T c="ink2">{shift.graceMinutes} min late grace</T>
        </XStack>
      </XStack>

      <YStack gap={8}>
        <XStack
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          columnGap={16}
        >
          <T c="ink2">
            Worked today{' '}
            <T
              w="700"
              style={{ fontVariant: ['tabular-nums'] }}
            >
              {formatDuration(worked, true)}
            </T>
          </T>
          <T
            s={12}
            lh={16}
            c="muted"
          >
            Full day 9h 00m · half day 4h 30m · {formatDuration(left)} left
          </T>
        </XStack>
        <YStack
          role="progressbar"
          aria-label="Hours worked toward the 9 hour full-day threshold"
          aria-valuemin={0}
          aria-valuemax={9}
          aria-valuenow={Number((worked / 3600).toFixed(1))}
          height={10}
          borderRadius={999}
          backgroundColor="subtle"
          overflow="hidden"
        >
          <YStack
            height={10}
            width={`${pct.toFixed(2)}%`}
            borderRadius={999}
            backgroundColor="teal"
          />
        </YStack>
        <XStack justifyContent="space-between">
          <T
            s={12}
            lh={16}
            c="muted"
          >
            09:00 AM
          </T>
          <T
            s={12}
            lh={16}
            c="muted"
          >
            {shift.breakLabel}
          </T>
          <T
            s={12}
            lh={16}
            c="muted"
          >
            06:00 PM
          </T>
        </XStack>
      </YStack>

      {punch.status === 'out' ? (
        <XStack>
          <Btn
            variant="primary"
            size="lg"
            Icon={LogIn}
            minWidth={180}
            onPress={onCheckIn}
          >
            Check In
          </Btn>
        </XStack>
      ) : punch.status === 'in' ? (
        <XStack>
          <Btn
            variant="primary"
            size="lg"
            Icon={LogOut}
            minWidth={180}
            onPress={onCheckOut}
          >
            Check Out
          </Btn>
        </XStack>
      ) : (
        <XStack
          alignItems="center"
          flexWrap="wrap"
          gap={8}
        >
          {earlyLeave ? (
            <Chip
              tone="warn"
              Icon={LogOut}
              label="Early Leave"
            />
          ) : null}
          <T
            s={12}
            lh={16}
            c="muted"
            flexShrink={1}
          >
            {earlyLeave
              ? `Worked ${formatDuration(worked)} of 9h 00m. Talk to your manager if this was planned.`
              : `Worked ${formatDuration(worked)} today.`}
          </T>
        </XStack>
      )}

      <XStack
        flexWrap="wrap"
        columnGap={16}
        rowGap={6}
      >
        <MetaItem
          ok
          Icon={Wifi}
          text="Office network detected · Dhaka HQ"
        />
        <MetaItem
          Icon={Globe}
          text="IP 103.112.54.21 (allow-listed)"
        />
        <MetaItem
          Icon={MonitorSmartphone}
          text={DEVICE}
        />
      </XStack>
    </Card>
  )
}
