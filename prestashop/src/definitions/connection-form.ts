import { ReactForm } from '@shipengine/connect-order-source-api/lib';

export const ConnectionFormSchema: ReactForm = {
  JsonSchema: {
    type: 'object',
    title: 'Login',
    description: 'Connect to your account',
    required: ['api_key'],
    properties: {
      api_key: {
        type: 'string',
        title: 'API Key',
      },
    },
  },
  UiSchema: {
    api_key: {},
  },
};
