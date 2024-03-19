import React, { useState } from 'react';
import SelectDropdown from './index';

export default {
  title: 'Components/SelectDropdown',
  component: SelectDropdown,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onChange: {
      action: 'changed',
      description: 'Function which will trigger after user selects option',
      table: { type: { summary: 'function' } },
    },
    onBlur: {
      action: 'blurred',
      description:
        'Function which will trigger after user focuses on something else',
      table: { type: { summary: 'function' } },
    },
    onFocus: {
      action: 'focused',
      description:
        'Function which will trigger after user focuses on Select Dropdown',
      table: { type: { summary: 'function' } },
    },
    placeholder: {
      description: 'Text placeholder you want to show',
      table: { type: { summary: 'string' } },
    },
    options: {
      description: 'Array of options objects consisting of label and value',
      table: { type: { summary: 'array' } },
    },
    removeDivider: {
      description: 'Remove default divider.',
      table: { type: { summary: 'boolean' } },
      control: 'boolean',
    },
    removeTheClearCross: {
      description: 'Remove default cross.',
      table: { type: { summary: 'boolean' } },
      control: 'boolean',
    },
    removeTheCursor: {
      description: 'Remove default cursor.',
      table: { type: { summary: 'boolean' } },
      control: 'boolean',
    },
    required: {
      description: 'Make select dropdown required',
      table: { type: { summary: 'boolean' } },
      control: 'boolean',
    },
    disabled: {
      description: 'Disable select dropdown',
      table: { type: { summary: 'boolean' } },
      control: 'boolean',
    },
    searchable: {
      description: 'Make select dropdown searchable',
      table: { type: { summary: 'boolean' } },
      control: 'boolean',
    },
    showLabel: {
      description: 'Show label on dropdown',
      table: { type: { summary: 'boolean' } },
      control: 'boolean',
    },
    styles: {
      description: 'Custom styles to be applied to the component.',
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '{}' },
      },
    },
  },
  tags: ['autodocs'],
};

const Template = (args) => {
  const [selectedValue, setSelectedValue] = useState(null);

  const handleOnChange = (value) => {
    setSelectedValue(value);
    args.onChange(value);
  };

  return (
    <form>
      <div className="form-field w-100 me-3">
        <SelectDropdown
          {...args}
          selectedValue={selectedValue}
          onChange={handleOnChange}
        />
      </div>
    </form>
  );
};

export const SingleSelect = Template.bind({});
SingleSelect.args = {
  placeholder: 'Select an option',
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ],
  removeDivider: true,
  removeTheClearCross: true,
};

export const WithError = Template.bind({});
WithError.args = {
  placeholder: 'Select an option',
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ],
  error: 'This field is required.',
  removeDivider: true,
  removeTheClearCross: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  placeholder: 'Select an option',
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ],
  disabled: true,
  removeDivider: true,
  removeTheClearCross: true,
};
