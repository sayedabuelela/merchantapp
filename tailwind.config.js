/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                // Brand Colors
                "brand-primary": "#001F5F",
                "brand-secondary": "#254177",
                // Primary Colors
                primary: "#001F5F",
                secondary: "#254177",
                danger: "#A50017",
                success: "#4AAB4E",
                warning: "#FEA71C",
                tertiary: "#F5F6F6",
                'light-gray': "#839090",
                //content
                "placeholder-color": "#B3BBBB",

                // Content (Text) Colors
                "content-primary": "#202020",
                "content-secondary": "#556767",
                "content-disabled": "#919C9C",
                "content-hint": "#697979",

                // Surface (Background) Colors
                "surface-primary": "#FFFFFF",      // Main background color
                "surface-secondary": "#FDFDFD",    // Secondary background, like cards
                "surface-tertiary": "#F5F6F6",    // Third-level backgrounds
                "surface-input": "#FBFBFB",        // Input field backgrounds
                "surface-disabled": "#E6E8E8",     // Disabled component backgrounds

                // Stroke (Border) Colors
                "stroke-main": "#F5F6F6",       // Default borders
                "stroke-default": "#D5D9D9",       // Default borders
                "stroke-emphasis": "#202020",      // Emphasized borders
                "stroke-divider": "#E6E8E8",       // Divider lines
                "stroke-input": "#E6E8E8",         // Input field borders
                "stroke-disabled": "#919C9C",      // Disabled borders
                "stroke-danger": "#A50017",      // feedback border danger
                "stroke-feedback-danger": "#FFBBC4",      // feedback border danger
                "stroke-success": "#1A541D",      // feedback border danger

                // Feedback States
                "feedback-success-bg": "#D1FFD3",
                "feedback-success-text": "#1A541D",
                "feedback-success-bg": "#F3FFF4",
                "feedback-warning-bg": "#FFF7E8",
                "feedback-warning-text": "#513500",
                "feedback-error-bg": "#FFEAED",
                "feedback-error": "#A50017",
            },
            fontFamily: {
                // Head Fonts - RTL
                'head-medium-rtl': ['Cairo-Medium'],
                'head-regular-rtl': ['Cairo-Regular'],
                'head-bold-rtl': ['Cairo-Bold'],
                'head-semi-rtl': ['Cairo-SemiBold'],

                // Head Fonts - LTR
                'head-medium-ltr': ['Outfit-Medium'],
                'head-regular-ltr': ['Outfit-Regular'],
                'head-bold-ltr': ['Outfit-Bold'],
                'head-semi-ltr': ['Outfit-SemiBold'],

                // Body Fonts - RTL
                'body-medium-rtl': ['NotoNaskhArabic-Medium'],
                'body-regular-rtl': ['NotoNaskhArabic-Regular'],
                'body-bold-rtl': ['NotoNaskhArabic-Bold'],
                'body-semi-rtl': ['NotoNaskhArabic-SemiBold'],

                // Body Fonts - LTR
                'body-medium-ltr': ['NotoSans-Medium'],
                'body-regular-ltr': ['NotoSans-Regular'],
                'body-bold-ltr': ['NotoSans-Bold'],
                'body-semi-ltr': ['NotoSans-SemiBold'],
            },
            boxShadow: {
                custom: {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 4,
                },
            },
            // fontSize: {
            //     'xs': '12px',
            //     'sm': '14px',
            //     'base': '16px',
            //     'lg': '18px',
            //     'xl': '20px',
            //     '2xl': '24px',
            //     '3xl': '30px',
            //     '4xl': '36px',
            //     '5xl': '48px',
            //     '6xl': '60px',
            // },
        },
    },
    safelist: [
        // Head Fonts - RTL
        'font-head-medium-rtl',
        'font-head-regular-rtl',
        'font-head-bold-rtl',
        'font-head-semi-rtl',

        // Head Fonts - LTR
        'font-head-medium-ltr',
        'font-head-regular-ltr',
        'font-head-bold-ltr',
        'font-head-semi-ltr',

        // Body Fonts - RTL
        'font-body-medium-rtl',
        'font-body-regular-rtl',
        'font-body-bold-rtl',
        'font-body-semi-rtl',

        // Body Fonts - LTR
        'font-body-medium-ltr',
        'font-body-regular-ltr',
        'font-body-bold-ltr',
        'font-body-semi-ltr',
    ],
    plugins: [],

}
