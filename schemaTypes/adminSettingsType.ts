export const adminSettingsType = {
    name: 'adminSettings',
    title: 'Admin Settings',
    type: 'document',
    fields: [
        {
            name: 'email',
            title: 'Admin Email',
            type: 'string',
        },
        {
            name: 'password',
            title: 'Admin Password',
            type: 'string', // Plain text for now as per request
            description: 'WARNING: This is stored as plain text.'
        }
    ]
}
