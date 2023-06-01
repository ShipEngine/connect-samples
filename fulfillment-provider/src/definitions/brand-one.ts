import { jsonSchema, UiSchema } from './connection-form-schema';
import { join } from 'path';
import { FulfillmentProviderDefinition } from '@shipengine/connect-fulfillment-provider-api';

export const brandOne: FulfillmentProviderDefinition = {
    Id: '272b97fc-fcef-4203-95e0-da22a5e4a392',
    Name: 'Brand Two',
    Description: '',
    AccountModals: {
        RegistrationFormSchema: {
            JsonSchema: { 
                ...jsonSchema, 
                Title: 'Brand One Title Registration', 
                Description: 'Brand One Description' 
            },
            UiSchema,
        },
        SettingsFormSchema: {
            JsonSchema: { 
                ...jsonSchema, 
                Title: 'Brand One Title Settings', 
                Description: 'Brand One Description' 
            },
            UiSchema,
        },
    },
    FulfillmentServices: [
        { Id: "1-1", Code: "BRAND-ONE-S", Name: 'Brand Two Standard', Abbreviation: 'Standard' },
        { Id: "1-2", Code: "BRAND-ONE-S", Name: 'Brand Two First Class', Abbreviation: 'First Class' },
    ],
    Images: {
        LogoUrl: join(__dirname, '../../assets/brand-two/logo.svg'),
        IconUrl: join(__dirname, '../../assets/brand-two/icon.svg'),
    }
};
