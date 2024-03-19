/** @type { import('@storybook/react').Preview } */
import React from 'react';
import '@fortawesome/fontawesome-svg-core/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/styles/Global/Global.scss';
import '../src/styles/Global/Variable.scss';
import '../src/styles/index.css';
import { MemoryRouter } from 'react-router-dom';

const preview = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
