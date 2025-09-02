import '../src/components/lyd-input.js';

export default {
  title: 'LYD Components/Input',
  component: 'lyd-input'
};

export const Default = () => `
  <div style="padding: 20px; max-width: 400px;">
    <lyd-input 
      label="Property Title" 
      placeholder="Enter property title..."
    ></lyd-input>
  </div>
`;

export const RealEstateInputs = () => `
  <div style="padding: 20px; max-width: 400px; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <h3 style="margin: 0 0 20px 0; color: #0066ff; font-family: Inter, sans-serif;">Property Search</h3>
    
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <lyd-input 
        variant="search"
        label="Location" 
        placeholder="Search properties in Munich..."
      ></lyd-input>
      
      <lyd-input 
        variant="currency"
        label="Maximum Price" 
        placeholder="750000"
        type="number"
      ></lyd-input>
      
      <lyd-input 
        variant="area"
        label="Minimum Size" 
        placeholder="120"
        type="number"
      ></lyd-input>
      
      <lyd-input 
        label="Contact Email" 
        placeholder="your@email.com"
        type="email"
        required
      ></lyd-input>
    </div>
  </div>
`;

export const AllVariants = () => `
  <div style="padding: 20px; display: flex; flex-direction: column; gap: 20px; max-width: 500px;">
    <lyd-input label="Default Input" placeholder="Enter text..."></lyd-input>
    <lyd-input variant="search" label="Search Input" placeholder="Search properties..."></lyd-input>
    <lyd-input variant="currency" label="Price Input" placeholder="450000" type="number"></lyd-input>
    <lyd-input variant="area" label="Area Input" placeholder="120" type="number"></lyd-input>
    <lyd-input label="Disabled Input" placeholder="Cannot edit" disabled></lyd-input>
    <lyd-input variant="error" label="Error Input" placeholder="This has an error"></lyd-input>
  </div>
`;
