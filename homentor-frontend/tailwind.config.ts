
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
                // Homentor Brand Colors
                homentor: {
                    blue: '#0074C2',
                    gold: '#F7B500',
                    darkBlue: '#005ea0',
                    lightBlue: '#e6f0f9',
                    darkGold: '#d69e00',
                    lightGold: '#fff8e6',
                    charcoal: '#333333',
                    lightGray: '#f7f9fc',
                },
								// Custom yellow and blue theme colors
								'mentor-yellow': {
									50: '#fefce8',
									100: '#fef9c3',
									200: '#fef08a',
									300: '#fde047',
									400: '#facc15',
									500: '#eab308',
									600: '#ca8a04',
									700: '#a16207',
									800: '#854d0e',
									900: '#713f12',
								},
								'mentor-blue': {
									50: '#eff6ff',
									100: '#dbeafe',
									200: '#bfdbfe',
									300: '#93c5fd',
									400: '#60a5fa',
									500: '#3b82f6',
									600: '#2563eb',
									700: '#1d4ed8',
									800: '#1e40af',
									900: '#1e3a8a',
								}
			},
			'mentor-yellow': {
				50: '#fefce8',
				100: '#fef9c3',
				200: '#fef08a',
				300: '#fde047',
				400: '#facc15',
				500: '#eab308',
				600: '#ca8a04',
				700: '#a16207',
				800: '#854d0e',
				900: '#713f12',
			},
			'mentor-blue': {
				50: '#eff6ff',
				100: '#dbeafe',
				200: '#bfdbfe',
				300: '#93c5fd',
				400: '#60a5fa',
				500: '#3b82f6',
				600: '#2563eb',
				700: '#1d4ed8',
				800: '#1e40af',
				900: '#1e3a8a',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
                // 'float': {
                //     '0%, 100%': { transform: 'translateY(0)' },
                //     '50%': { transform: 'translateY(-5px)' }
                // },
				float: {
					'0%': { transform: 'translateY(200px)' },
					'100%': { transform: 'translateY(0)' },
				  },
				  shake: {
					'0%': { transform: 'rotate(0deg)' },
					'20%': { transform: 'rotate(30deg)' },
					'40%': { transform: 'rotate(-25deg)' },
					'60%': { transform: 'rotate(20deg)' },
					'80%': { transform: 'rotate(-15deg)' },
					'100%': { transform: 'rotate(0deg)' },
				  },
                'pulse-soft': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' }
                },
                'scale-up': {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' }
                }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
                // 'float': 'float 3s ease-in-out infinite',
				float: 'float 0.4s 1s forwards',
        shake: 'shake 1s ease-in-out',

                'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
                'scale-up': 'scale-up 0.3s ease-out'
			},
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Poppins', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'gradient-primary': 'linear-gradient(to right, #0074C2, #2d9cff)',
                'gradient-secondary': 'linear-gradient(to right, #F7B500, #ffcc4d)'
            },
            boxShadow: {
                'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                'hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)'
            }
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
