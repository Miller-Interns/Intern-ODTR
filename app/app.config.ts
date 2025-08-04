
export default defineAppConfig({
    ui: {
        colors: {
            primary: 'primary',
            secondary: 'black',
            tertiary: 'indigo',
            success: 'green',
            warning: 'yellow',
            error: 'red',
            info: 'indigo',
            required: 'red'
        },
        button: {
            defaultVariants: {
                size: 'xl'
            },
            slots: {
                base: 'rounded-lg font-normal'
            },
            compoundVariants: [{
                variant: 'solid',
                class: 'shadow-sm',
            }],
        },
        input: {
            defaultVariants: { size: 'xl' },
        },
        select: {
            defaultVariants: { size: 'xl' },
        },
        selectMenu: {
            defaultVariants: { size: 'xl' },
        },
        textarea: {
            defaultVariants: { size: 'xl' },
        },
        card: {
            slots: {
                root: 'ring-1 ring-gray-200 dark:ring-gray-800 divide-y divide-gray-200 dark:divide-gray-800 rounded-lg shadow-sm bg-white dark:bg-gray-900',
                header: 'px-6 py-4 sm:px-6',
                body: 'px-4 py-5 sm:p-6',
            }
        },
      
        
    }
})