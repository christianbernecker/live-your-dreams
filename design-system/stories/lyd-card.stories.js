import '../src/components/lyd-card.js';

export default {
  title: 'LYD Components/Card',
  component: 'lyd-card'
};

export const Default = () => `
  <div style="padding: 20px; max-width: 400px;">
    <lyd-card variant="default">
      <h3 style="margin: 0 0 12px 0; color: #1f2937;">Default Card</h3>
      <p style="margin: 0; color: #6b7280; line-height: 1.6;">
        This is a default card component with standard styling and subtle shadow.
      </p>
    </lyd-card>
  </div>
`;

export const PropertyCard = () => `
  <div style="padding: 20px; max-width: 400px;">
    <lyd-card variant="elevated" hoverable clickable>
      <img class="card-image" src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=200&fit=crop" alt="Luxury Apartment" />
      
      <div class="card-header">
        <h3 style="margin: 0; color: #1f2937; font-size: 20px;">Luxury Apartment Munich</h3>
        <p class="property-meta" style="margin: 4px 0 0 0;">Schwabing • 3.5 Rooms • 120 m²</p>
      </div>
      
      <p style="margin: 0 0 16px 0; color: #4b5563; line-height: 1.6;">
        Beautiful apartment in prime location with modern amenities, balcony, and stunning city views.
      </p>
      
      <div class="card-footer">
        <div>
          <div class="price">€750,000</div>
          <div class="property-meta">€6,250/m²</div>
        </div>
        <lyd-button variant="primary" size="small">View Details</lyd-button>
      </div>
    </lyd-card>
  </div>
`;

export const AllVariants = () => `
  <div style="padding: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
    <lyd-card variant="default">
      <h4 style="margin: 0 0 8px 0; color: #1f2937;">Default Card</h4>
      <p style="margin: 0; color: #6b7280;">Standard card with border and subtle shadow.</p>
    </lyd-card>
    
    <lyd-card variant="elevated">
      <h4 style="margin: 0 0 8px 0; color: #1f2937;">Elevated Card</h4>
      <p style="margin: 0; color: #6b7280;">Elevated card with enhanced shadow depth.</p>
    </lyd-card>
    
    <lyd-card variant="glass">
      <h4 style="margin: 0 0 8px 0; color: #1f2937;">Glass Card</h4>
      <p style="margin: 0; color: #6b7280;">Glassmorphism card with backdrop blur effect.</p>
    </lyd-card>
    
    <lyd-card variant="outlined">
      <h4 style="margin: 0 0 8px 0; color: #1f2937;">Outlined Card</h4>
      <p style="margin: 0; color: #6b7280;">Outlined card with prominent border.</p>
    </lyd-card>
  </div>
`;

export const InteractiveCards = () => `
  <div style="padding: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
    <lyd-card variant="default" hoverable>
      <h4 style="margin: 0 0 8px 0; color: #1f2937;">Hoverable Card</h4>
      <p style="margin: 0; color: #6b7280;">Hover me to see the lift effect!</p>
    </lyd-card>
    
    <lyd-card variant="elevated" hoverable clickable>
      <h4 style="margin: 0 0 8px 0; color: #1f2937;">Clickable Card</h4>
      <p style="margin: 0; color: #6b7280;">Click me for interaction!</p>
    </lyd-card>
  </div>
`;
