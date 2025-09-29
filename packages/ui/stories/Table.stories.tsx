import type { Meta, StoryObj } from '@storybook/react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHeader,
    TableHeaderCell,
    TableRow
} from '../src/components/table/Table';

const meta = {
  title: 'Design System/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Table Component

Professional data table component using Design System classes.

## Design System Integration

- Uses \`.api-table\` from the Design System (not \`.lyd-table\`)
- Supports striped, bordered, and size variants
- Includes sortable headers and action buttons
- Fully accessible with proper ARIA labels

## Usage Guidelines

- Use TableContainer for responsive scrolling
- Use TableHeaderCell for column headers with optional sorting
- Use TableCell with variants for different data types
- Keep table data scannable and well-structured
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
];

export const Default: Story = {
  render: () => (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Role</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sampleData.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <span className="luxury-badge">{user.role}</span>
              </TableCell>
              <TableCell>
                <span className={`luxury-badge ${user.status === 'Active' ? 'success' : 'warning'}`}>
                  {user.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="table-actions">
                  <button className="lyd-button ghost icon-only" title="Edit">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button className="lyd-button ghost icon-only" title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="m19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                    </svg>
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ),
};

export const Striped: Story = {
  render: () => (
    <TableContainer>
      <Table variant="striped">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Product</TableHeaderCell>
            <TableHeaderCell>Price</TableHeaderCell>
            <TableHeaderCell>Stock</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>MacBook Pro</TableCell>
            <TableCell variant="numeric">$2,499</TableCell>
            <TableCell variant="numeric">12</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>iPhone 15</TableCell>
            <TableCell variant="numeric">$999</TableCell>
            <TableCell variant="numeric">45</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>AirPods Pro</TableCell>
            <TableCell variant="numeric">$249</TableCell>
            <TableCell variant="numeric">78</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  ),
};

export const Bordered: Story = {
  render: () => (
    <TableContainer>
      <Table variant="bordered">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Feature</TableHeaderCell>
            <TableHeaderCell>Basic</TableHeaderCell>
            <TableHeaderCell>Pro</TableHeaderCell>
            <TableHeaderCell>Enterprise</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Storage</TableCell>
            <TableCell>10GB</TableCell>
            <TableCell>100GB</TableCell>
            <TableCell>Unlimited</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Users</TableCell>
            <TableCell>5</TableCell>
            <TableCell>25</TableCell>
            <TableCell>Unlimited</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  ),
};

export const WithSorting: Story = {
  render: () => {
    const handleSort = (column: string) => {
      console.log('Sort by:', column);
    };

    return (
      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell 
                sortable 
                sortDirection="asc" 
                onSort={() => handleSort('name')}
              >
                Name
              </TableHeaderCell>
              <TableHeaderCell 
                sortable 
                onSort={() => handleSort('date')}
              >
                Date
              </TableHeaderCell>
              <TableHeaderCell 
                sortable 
                sortDirection="desc"
                onSort={() => handleSort('amount')}
              >
                Amount
              </TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Project Alpha</TableCell>
              <TableCell>2024-01-15</TableCell>
              <TableCell variant="numeric">$15,420</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Project Beta</TableCell>
              <TableCell>2024-01-18</TableCell>
              <TableCell variant="numeric">$8,750</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  },
};

