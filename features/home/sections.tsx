import { useState } from 'react'
import Svg, { Circle } from 'react-native-svg'
import { useTheme, XStack, YStack } from 'tamagui'
import {
  CalendarDays,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  FileDown,
  FileText,
  Flag,
  History,
  Hourglass,
  CircleCheck,
  Building2,
  ClockAlert,
  PencilLine,
  Sparkles,
  Wifi,
  CalendarOff,
} from '../../components/icons'
import type { Tone } from '../../components/hr/tokens'
import {
  Btn,
  Card,
  CardBody,
  CardFoot,
  CardHead,
  Chip,
  type IconComponent,
  IconTile,
  T,
} from '../../components/hr/ui'
import { useNotBuilt } from '../../components/shell/shell-context'
import type { Announcement, EmployeeHome, Holiday, LeaveBalance, RequestItem } from './data'

function Ring({
  avail,
  allocated,
  color,
}: { avail: number; allocated: number; color: LeaveBalance['color'] }) {
  const theme = useTheme()
  const r = 26
  const c = 2 * Math.PI * r
  const frac = allocated ? Math.max(0, avail) / allocated : 0
  return (
    <YStack
      position="relative"
      width={64}
      height={64}
      alignItems="center"
      justifyContent="center"
    >
      <Svg
        width={64}
        height={64}
        viewBox="0 0 64 64"
        style={{ position: 'absolute' }}
      >
        <Circle
          cx={32}
          cy={32}
          r={r}
          fill="none"
          stroke={theme.subtle.get()}
          strokeWidth={7}
        />
        <Circle
          cx={32}
          cy={32}
          r={r}
          fill="none"
          stroke={theme[color].get()}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={`${(c * frac).toFixed(1)} ${c.toFixed(1)}`}
          rotation={-90}
          origin="32, 32"
        />
      </Svg>
      <T
        s={16}
        lh={20}
        w="600"
        aria-label={`${avail} of ${allocated} days available`}
      >
        {avail}
      </T>
    </YStack>
  )
}

export function LeaveBalanceCard({
  balances,
  leaveYear,
}: { balances: LeaveBalance[]; leaveYear: string }) {
  const notBuilt = useNotBuilt()
  return (
    <Card>
      <CardHead
        title="Leave balance"
        right={
          <T
            s={12}
            lh={16}
            w="600"
            c="brand"
            role="button"
            cursor="pointer"
            onPress={() => notBuilt('My Leave')}
          >
            View all
          </T>
        }
      />
      <CardBody paddingTop={4}>
        {balances.map((b, i) => {
          const avail = b.allocated - b.used - b.pending
          return (
            <XStack
              key={b.type}
              alignItems="center"
              gap={14}
              paddingVertical={14}
              borderTopWidth={i === 0 ? 0 : 1}
              borderTopColor="line"
            >
              <Ring
                avail={avail}
                allocated={b.allocated}
                color={b.color}
              />
              <YStack
                flex={1}
                minWidth={0}
              >
                <T w="600">{b.type}</T>
                <T
                  s={12}
                  lh={16}
                  c="muted"
                >
                  {`${b.allocated} allocated · ${b.used} used${b.pending ? ` · ${b.pending} pending` : ''}`}
                </T>
              </YStack>
              <YStack alignItems="flex-end">
                <T
                  s={20}
                  lh={28}
                  w="600"
                >
                  {avail}
                </T>
                <T
                  s={12}
                  lh={16}
                  c="muted"
                >
                  available
                </T>
              </YStack>
            </XStack>
          )
        })}
      </CardBody>
      <CardFoot>
        <T
          s={12}
          lh={16}
          c="muted"
          flexShrink={1}
        >
          {leaveYear}
        </T>
        <Btn
          size="sm"
          Icon={CalendarPlus}
          onPress={() => notBuilt('Apply Leave')}
        >
          Apply Leave
        </Btn>
      </CardFoot>
    </Card>
  )
}

export function QuickActions({ onMissedPunch }: { onMissedPunch: () => void }) {
  const notBuilt = useNotBuilt()
  const actions: { label: string; Icon: IconComponent; onPress: () => void }[] = [
    { label: 'Apply Leave', Icon: CalendarPlus, onPress: () => notBuilt('Apply Leave') },
    { label: 'Request Missed Punch', Icon: History, onPress: onMissedPunch },
    { label: 'View Payslip', Icon: FileText, onPress: () => notBuilt('My Payslips') },
    { label: 'View Attendance', Icon: CalendarDays, onPress: () => notBuilt('My Attendance') },
  ]
  return (
    <Card>
      <CardHead title="Quick actions" />
      <CardBody>
        <XStack
          flexWrap="wrap"
          gap={12}
        >
          {actions.map((a) => (
            <YStack
              key={a.label}
              role="button"
              onPress={a.onPress}
              flexGrow={1}
              flexBasis={150}
              minWidth={0}
              minHeight={92}
              padding={14}
              gap={10}
              alignItems="flex-start"
              borderWidth={1}
              borderColor="line"
              borderRadius={10}
              cursor="pointer"
              backgroundColor="surface hover:brandTint press:brandTint"
            >
              <IconTile Icon={a.Icon} />
              <T w="600">{a.label}</T>
            </YStack>
          ))}
        </XStack>
      </CardBody>
    </Card>
  )
}

const REQUEST_ICON: Record<RequestItem['kind'], IconComponent> = {
  leave: CalendarOff,
  punch: History,
}

export function PendingRequests({ requests }: { requests: RequestItem[] }) {
  const notBuilt = useNotBuilt()
  return (
    <Card>
      <CardHead
        title="My pending requests"
        right={
          <T
            s={12}
            lh={16}
            w="600"
            c="brand"
            role="button"
            cursor="pointer"
            onPress={() => notBuilt('My Leave')}
          >
            View all
          </T>
        }
      />
      <CardBody>
        {requests.length === 0 ? (
          <YStack
            alignItems="center"
            gap={8}
            padding={24}
          >
            <T
              s={16}
              lh={24}
              w="600"
            >
              Nothing waiting on anyone
            </T>
            <T
              c="muted"
              textAlign="center"
            >
              Requests you submit show here until they’re approved or rejected.
            </T>
          </YStack>
        ) : (
          requests.map((r, i) => (
            <XStack
              key={r.id}
              role="button"
              onPress={() => notBuilt('Request detail')}
              alignItems="center"
              gap={12}
              paddingVertical={12}
              paddingTop={i === 0 ? 0 : 12}
              borderTopWidth={i === 0 ? 0 : 1}
              borderTopColor="line"
              cursor="pointer"
            >
              <IconTile
                Icon={REQUEST_ICON[r.kind]}
                tone="slate"
                iconSize={18}
              />
              <YStack
                flex={1}
                minWidth={0}
              >
                <T w="600">{r.title}</T>
                <T
                  s={12}
                  lh={16}
                  c="muted"
                >
                  {r.sub}
                </T>
              </YStack>
              {r.status === 'pending' ? (
                <Chip
                  tone="warn"
                  Icon={Hourglass}
                  label="Pending"
                />
              ) : (
                <Chip
                  tone="ok"
                  Icon={CircleCheck}
                  label="Approved"
                />
              )}
              <ChevronRight
                size={16}
                color="muted"
              />
            </XStack>
          ))
        )}
      </CardBody>
    </Card>
  )
}

export function MonthSummary({ month }: { month: EmployeeHome['month'] }) {
  const notBuilt = useNotBuilt()
  const stat = (label: string, value: string, suffix?: string, first?: boolean) => (
    <YStack
      flex={1}
      minWidth={0}
      paddingHorizontal={16}
      paddingLeft={first ? 0 : 16}
      paddingVertical={4}
      borderLeftWidth={first ? 0 : 1}
      borderLeftColor="line"
    >
      <T
        s={12}
        lh={16}
        c="muted"
      >
        {label}
      </T>
      <T
        s={24}
        lh={32}
        w="600"
      >
        {value}
        {suffix ? (
          <T
            s={16}
            lh={32}
            w="500"
            c="muted"
          >
            {suffix}
          </T>
        ) : null}
      </T>
    </YStack>
  )
  return (
    <Card>
      <CardHead
        title="This month"
        right={
          <T
            s={12}
            lh={16}
            c="muted"
          >
            {month.label}
          </T>
        }
      />
      <CardBody>
        <XStack>
          {stat('Days present', String(month.daysPresent), ` / ${month.workingDays}`, true)}
          {stat('Late', String(month.late))}
          {stat('OT hours', month.overtime)}
        </XStack>
        <XStack
          marginTop={16}
          gap={8}
          flexWrap="wrap"
        >
          <Chip
            tone="ok"
            Icon={CircleCheck}
            label="Present"
          />
          <Chip
            tone="warn"
            Icon={ClockAlert}
            label={`${month.late} × Late`}
          />
          <Chip
            tone="blue"
            Icon={PencilLine}
            label={`${month.regularized} × Regularized`}
          />
        </XStack>
      </CardBody>
      <CardFoot>
        <T
          s={12}
          lh={16}
          c="muted"
          flexShrink={1}
        >
          {month.policy}
        </T>
        <T
          s={12}
          lh={16}
          w="600"
          c="brand"
          role="button"
          cursor="pointer"
          onPress={() => notBuilt('My Attendance')}
        >
          Open calendar
        </T>
      </CardFoot>
    </Card>
  )
}

const ANN_ICON: Record<Announcement['icon'], IconComponent> = {
  'file-text': FileText,
  wifi: Wifi,
  flag: Flag,
}

export function Announcements({ items }: { items: Announcement[] }) {
  const [idx, setIdx] = useState(0)
  const notBuilt = useNotBuilt()
  const step = (d: number) => setIdx((i) => (i + d + items.length) % items.length)
  const a = items[idx % items.length]
  if (!a) return null
  const Icon = ANN_ICON[a.icon]

  return (
    <Card>
      <CardHead
        title="Announcements"
        right={
          <XStack>
            <Btn
              variant="ghost"
              size="sm"
              Icon={ChevronLeft}
              aria-label="Previous announcement"
              onPress={() => step(-1)}
            />
            <Btn
              variant="ghost"
              size="sm"
              Icon={ChevronRight}
              aria-label="Next announcement"
              onPress={() => step(1)}
            />
          </XStack>
        }
      />
      <CardBody>
        <XStack
          gap={16}
          alignItems="flex-start"
          aria-live="polite"
        >
          <IconTile
            Icon={Icon}
            tone={a.tone}
            size={72}
            iconSize={32}
          />
          <YStack
            flex={1}
            minWidth={0}
            gap={6}
          >
            <T
              s={12}
              lh={16}
              c="muted"
            >
              {a.meta}
            </T>
            <T
              s={16}
              lh={24}
              w="600"
            >
              {a.title}
            </T>
            <T c="ink2">{a.body}</T>
            <XStack
              marginTop={4}
              alignItems="center"
              gap={12}
              paddingVertical={10}
              paddingHorizontal={12}
              borderWidth={1}
              borderColor="line"
              borderRadius={6}
              backgroundColor="surface"
            >
              <FileDown
                size={18}
                color="ink2"
              />
              <T
                flex={1}
                minWidth={0}
                s={12}
                lh={16}
                w="600"
                numberOfLines={1}
              >
                {a.file}
              </T>
              <Btn
                variant="ghost"
                size="sm"
                onPress={() => notBuilt('The PDF viewer')}
              >
                Open
              </Btn>
            </XStack>
          </YStack>
        </XStack>
        <XStack
          marginTop={14}
          gap={6}
          alignItems="center"
        >
          {items.map((it, i) => (
            <YStack
              key={it.id}
              role="button"
              aria-label={`Announcement ${i + 1}`}
              aria-current={i === idx}
              onPress={() => setIdx(i)}
              width={i === idx ? 20 : 8}
              height={8}
              borderRadius={4}
              cursor="pointer"
              backgroundColor={i === idx ? 'brandFill' : 'lineStrong'}
            />
          ))}
        </XStack>
      </CardBody>
    </Card>
  )
}

const HOLIDAY: Record<Holiday['kind'], { tone: Tone; Icon: IconComponent; label: string }> = {
  national: { tone: 'info', Icon: Flag, label: 'National' },
  religious: { tone: 'violet', Icon: Sparkles, label: 'Religious' },
  company: { tone: 'teal', Icon: Building2, label: 'Company' },
}

export function NextHolidays({ holidays }: { holidays: Holiday[] }) {
  const notBuilt = useNotBuilt()
  return (
    <Card>
      <CardHead
        title="Next holidays"
        right={
          <T
            s={12}
            lh={16}
            w="600"
            c="brand"
            role="button"
            cursor="pointer"
            onPress={() => notBuilt('Holidays')}
          >
            Calendar
          </T>
        }
      />
      <CardBody>
        {holidays.map((h, i) => {
          const k = HOLIDAY[h.kind]
          return (
            <XStack
              key={h.id}
              alignItems="center"
              gap={12}
              paddingVertical={12}
              paddingTop={i === 0 ? 0 : 12}
              borderTopWidth={i === 0 ? 0 : 1}
              borderTopColor="line"
            >
              <IconTile
                Icon={k.Icon}
                tone={k.tone}
                iconSize={18}
              />
              <YStack
                flex={1}
                minWidth={0}
              >
                <T w="600">{h.name}</T>
                <T
                  s={12}
                  lh={16}
                  c="muted"
                >
                  {h.when} · Dhaka HQ
                </T>
              </YStack>
              <Chip
                tone={k.tone}
                label={k.label}
              />
            </XStack>
          )
        })}
      </CardBody>
    </Card>
  )
}
