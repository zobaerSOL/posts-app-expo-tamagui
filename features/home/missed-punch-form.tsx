import { useState } from 'react'
import { Input, TextArea, XStack, YStack } from 'tamagui'
import { useShell } from '../../components/shell/shell-context'
import { DrawerPanel } from '../../components/shell/panels'
import { Btn, Field, Seg, T } from '../../components/hr/ui'
import { Send } from '../../components/icons'

const MISSING = ['Check in', 'Check out', 'Both'] as const
type Missing = (typeof MISSING)[number]

const inputProps = {
  height: 44,
  borderWidth: 1,
  borderColor: 'lineStrong',
  borderRadius: 6,
  backgroundColor: 'surface',
  color: 'ink',
  fontSize: 16,
  paddingHorizontal: 12,
  placeholderTextColor: 'muted',
  focusStyle: { borderColor: 'brandFill' },
} as const

export function MissedPunchForm({
  dateLabel,
  onSubmit,
}: { dateLabel: string; onSubmit: (reason: string, missing: Missing) => void }) {
  const { closeLayer } = useShell()
  const [date, setDate] = useState(dateLabel)
  const [missing, setMissing] = useState<Missing>('Check out')
  const [checkIn, setCheckIn] = useState('09:00 AM')
  const [checkOut, setCheckOut] = useState('06:00 PM')
  const [reason, setReason] = useState('')
  const [error, setError] = useState(false)

  const submit = () => {
    if (reason.trim().length < 10) {
      setError(true)
      return
    }
    onSubmit(reason.trim(), missing)
  }

  return (
    <DrawerPanel
      title="Request missed-punch correction"
      subtitle="Goes to Mehedi Hasan, then HR Admin"
      footer={
        <>
          <Btn onPress={closeLayer}>Cancel</Btn>
          <Btn
            variant="primary"
            Icon={Send}
            onPress={submit}
          >
            Send request
          </Btn>
        </>
      }
    >
      <Field
        label="Date"
        help="Only open months can be corrected. October 2026 is locked."
      >
        <Input
          {...inputProps}
          value={date}
          onChangeText={setDate}
        />
      </Field>
      <Field label="Which punch is missing?">
        <Seg
          label="Missing punch"
          options={MISSING}
          value={missing}
          onChange={setMissing}
        />
      </Field>
      <XStack gap={16}>
        <YStack flex={1}>
          <Field label="Correct check-in">
            <Input
              {...inputProps}
              value={checkIn}
              onChangeText={setCheckIn}
            />
          </Field>
        </YStack>
        <YStack flex={1}>
          <Field label="Correct check-out">
            <Input
              {...inputProps}
              value={checkOut}
              onChangeText={setCheckOut}
            />
          </Field>
        </YStack>
      </XStack>
      <Field
        label="Reason"
        required
        error={error ? 'Tell your manager what happened (at least 10 characters).' : undefined}
      >
        <TextArea
          {...inputProps}
          height={undefined}
          minHeight={88}
          paddingVertical={10}
          borderColor={error ? 'danger' : 'lineStrong'}
          aria-invalid={error}
          placeholder="e.g. Gate 2 reader was down; I signed the security register at 08:58 AM"
          value={reason}
          onChangeText={(v) => {
            setReason(v)
            if (error && v.trim().length >= 10) setError(false)
          }}
        />
      </Field>
      <YStack
        padding={12}
        borderRadius={10}
        borderWidth={1}
        borderColor="line"
        backgroundColor="infoBg"
      >
        <T c="ink2">
          Your original punches stay on record next to the correction. You can request up to 3
          corrections a month; this is your 2nd for November.
        </T>
      </YStack>
    </DrawerPanel>
  )
}
