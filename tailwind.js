tailwind.config = {
    darkMode: 'class',
    theme: {
    extend: {
        animation: {
        fade: 'fadeIn 0.6s ease-out',
        float: 'float 4s ease-in-out infinite'
        },
        keyframes: {
        fadeIn: {
            '0%': { opacity: '0', transform: 'translateY(8px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        float: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-6px)' }
        }
        }
    }
    }
}