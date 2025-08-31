import type { Meta, StoryObj } from '@storybook/react';
import { LdsCard, LdsCardHeader, LdsCardTitle, LdsInput, LdsSelect, LdsButton } from '@lifeyourdreams/design-system-react';

// Property Form Recipe
function PropertyForm() {
  return (
    <LdsCard className="max-w-2xl">
      <LdsCardHeader>
        <LdsCardTitle>Neue Immobilie anlegen</LdsCardTitle>
      </LdsCardHeader>
      
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LdsInput 
            label="Objekttitel" 
            placeholder="z.B. Moderne 3-Zimmer-Wohnung" 
            required 
          />
          <LdsSelect
            label="Objektart"
            options={[
              { value: 'wohnung', label: 'Eigentumswohnung' },
              { value: 'haus', label: 'Einfamilienhaus' },
              { value: 'reihenhaus', label: 'Reihenhaus' },
              { value: 'doppelhaus', label: 'Doppelhaushälfte' }
            ]}
            placeholder="Bitte wählen"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <LdsInput 
            label="Kaufpreis" 
            type="number" 
            placeholder="800000"
            hint="Preis in Euro"
            required 
          />
          <LdsInput 
            label="Wohnfläche" 
            type="number" 
            placeholder="85"
            hint="Quadratmeter"
            required 
          />
          <LdsInput 
            label="Zimmer" 
            type="number" 
            placeholder="3"
            hint="Anzahl Zimmer"
            required 
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <LdsButton variant="outline">
            Abbrechen
          </LdsButton>
          <LdsButton variant="primary" type="submit">
            Immobilie anlegen
          </LdsButton>
        </div>
      </form>
    </LdsCard>
  );
}

const meta: Meta<typeof PropertyForm> = {
  title: 'Recipes/Property Form',
  component: PropertyForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
