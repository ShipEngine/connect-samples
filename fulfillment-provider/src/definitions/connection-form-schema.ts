export const jsonSchema:object = {
    "title": "Sample Connect Form Title",
    "description": "Sample Form Description",
    "type": "object",
    "required": [
        "username",
        "password"
    ],
    "properties": {
        "username": {
            "type": "string",
            "title": "User Name:"
        },
        "password": {
            "type": "string",
            "title": "Password:"
        }
    }
};

export const UiSchema:object = {
    "password": {
        "ui:widget": "password",
        "ui:help": "Hint: Make it strong!"
    }
};
