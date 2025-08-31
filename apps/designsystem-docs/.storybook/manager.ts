import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

addons.setConfig({ 
  theme: create({ 
    base: 'light', 
    brandTitle: 'Life Your Dreams – Design System', 
    colorPrimary: '#3366CC', 
    colorSecondary: '#000066' 
  }) 
});
