// A small settings form made of real components. The scenes drive its state frame by frame.
import { Button, Checkbox, InputField, SegmentedControl, Slider, Switch, Text, Toast } from '@halo-ds/react';

export interface SettingsState {
  name: string;
  billing: string;
  seats: number;
  updates: boolean;
  terms: boolean;
  saving: boolean;
  saved: number;
}

export const finalState: SettingsState = { name: 'John Carter', billing: 'yearly', seats: 12, updates: true, terms: true, saving: false, saved: 1 };

const noop = () => {};

export function SettingsCard({ state }: { state: SettingsState }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 640 }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
          padding: 40,
          borderRadius: 24,
          border: '1px solid var(--halo-border-secondary)',
          background: 'var(--halo-surface-primary)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <h3 style={{ margin: 0, font: '600 28px/36px var(--halo-font-family-heading)', color: 'var(--halo-text-primary)' }}>Team plan</h3>
          <Text color="secondary">Choose a plan and who it's for.</Text>
        </div>
        <div data-target="name">
          <InputField label="Full name" placeholder="John" value={state.name} onChange={noop} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Text weight="semibold" size="sm">
            Billing
          </Text>
          <div style={{ display: 'flex' }}>
            <SegmentedControl
              aria-label="Billing"
              value={state.billing}
              onValueChange={noop}
              options={[
                { value: 'monthly', label: <span data-target="monthly">Monthly</span> },
                { value: 'yearly', label: <span data-target="yearly">Yearly</span> },
              ]}
            />
          </div>
        </div>
        <Slider label="Seats" showValue min={1} max={20} value={state.seats} onValueChange={noop} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* The targets go on the controls themselves, so the cursor clicks the switch and the box, not the label */}
          <Switch data-target="updates" label="Email me product updates" checked={state.updates} onCheckedChange={noop} />
          <Checkbox data-target="terms" label="I agree to the terms" checked={state.terms} onCheckedChange={noop} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <Button variant="secondary">Cancel</Button>
          <span data-target="save" style={{ display: 'flex' }}>
            <Button loading={state.saving}>Save changes</Button>
          </span>
        </div>
      </div>
      <div style={{ height: 88, opacity: state.saved, transform: `translateY(${(1 - state.saved) * 16}px)` }}>
        {state.saved > 0 && <Toast type="success" title="Changes saved" description="Your team plan is up to date." onClose={noop} />}
      </div>
    </div>
  );
}
