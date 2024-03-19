import Button from './Button';

export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },

  tags: ['autodocs'],
};

export const button = {
  args: {
    children: 'Button',
    loading: true,
    className: 'btn btn-primary',
  },
};
