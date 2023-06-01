import { jsonSchema, UiSchema } from './connection-form-schema';
import { join } from 'path';
import { FulfillmentProviderDefinition } from '@shipengine/connect-fulfillment-provider-api';

export const brandTwo: FulfillmentProviderDefinition = {
    Id: 'eae8ec69-7cdf-475c-ab81-01a2e5870965',
    Name: 'Brand Two',
    Description: '',
    AccountModals: {
        RegistrationFormSchema: {
            JsonSchema: { 
                ...jsonSchema, 
                title: 'Brand Two Title Registration', 
                description: 'Brand Two Description' 
            },
            UiSchema,
        },
        SettingsFormSchema: {
            JsonSchema: { 
                ...jsonSchema, 
                Title: 'Brand Two Title Settings', 
                Description: 'Brand Two Description' 
            },
            UiSchema,
        },
    },
    FulfillmentServices: [
        { Id: "2-1", Code: "BRAND-TWO-S", Name: 'Brand Two Standard', Abbreviation: 'Standard' },
        { Id: "2-2", Code: "BRAND-TWO-F", Name: 'Brand Two First Class', Abbreviation: 'First Class' },
    ],
    Images: {
        LogoUrl: join(__dirname, '../../assets/brand-two/logo.svg'),
        IconUrl: join(__dirname, '../../assets/brand-two/icon.svg'),
    }
};
