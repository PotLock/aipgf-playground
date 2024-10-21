const { screens, fontFamily, spacing, borderWidth, transitionProperty } = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');

const customSpacing = Object.fromEntries(Object.entries(spacing).filter(([key]) => key !== 'px' && key >= 4));
const customBorderWidth = Object.fromEntries(Object.entries(borderWidth));
const customTransitionProperty = Object.fromEntries(Object.entries(transitionProperty));

module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  corePlugins: {
    preflight: true
  },
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '0.938rem'
      }
    },
    screens: Object.fromEntries(Object.entries(screens).filter(([key]) => key !== '4xl')),
    fontFamily: {
      nunito: 'var(--font-nunito)'
    },
    extend: {
      // screens: {
      //   '3xl': '1600px'
      // },
      // https://nekocalc.com/px-to-rem-converter
      fontSize: {
        none: ['0', '0'],
        hero: ['3.5rem', { lineHeight: '4rem', letterSpacing: '0' }],
        h1: ['4rem', { lineHeight: '5rem', letterSpacing: '0' }], //64/80
        h2: ['3rem', { lineHeight: '3.5rem', letterSpacing: '0' }], //48/56
        h3: ['2.25rem', { lineHeight: '3rem', letterSpacing: '0' }], //36/48
        h4: ['1.875rem', { lineHeight: '2.5rem', letterSpacing: '0' }], //30/40
        h5: ['1.5rem', { lineHeight: '2rem', letterSpacing: '0' }], //24/32
        h6: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '0' }], //20/28
        base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }], // 16/24
        base2: ['0.875rem', { lineHeight: '1.375rem', letterSpacing: '0' }], // 14/22
        caption: ['0.625rem', { lineHeight: '1rem', letterSpacing: '0' }] // 10/16
      },
      letterSpacing: {
        4: '0.04em', // -4%
        3: '0.03em', // -3%
        2: '0.02em', // -2%
        1: '0.01em' // -1%
      },
      lineHeight: {
        0: '0'
      },
      colors: {
        // https://uicolors.app/create
        primary: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#3d3d3d',
          950: '#1e1e1e',
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          50: '#fdfbf6',
          100: '#fbf7ed',
          200: '#f5ead3',
          300: '#eedeb8',
          400: '#e2c583',
          500: '#d5ac4e',
          600: '#c09b46',
          700: '#a0813b',
          800: '#80672f',
          900: '#685426',
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
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
        }
      },
      borderWidth: {
        ...customBorderWidth,
        3: 3,
        5: 5,
        6: 6,
        7: 7
      },
      borderRadius: {
        xl: `calc(var(--radius) + 4px)`,
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)'
      },
      backgroundImage: {
        'gradient-45deg': 'linear-gradient(45deg, var(--tw-gradient-stops))'
      },
      minWidth: { ...customSpacing },
      maxWidth: {
        ...customSpacing,
        '1/2': '50%',
        '2/3': '66.666667%'
      },
      minHeight: { ...customSpacing },
      zIndex: {
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        dropdown: '1000',
        sticky: '1020',
        fixed: '1030',
        drawerBackdrop: '1040',
        drawer: '1045',
        modalBackdrop: '1050',
        modal: '1055',
        popover: '1070',
        tooltip: '1080',
        toast: '1090'
      },
      transitionProperty: {
        ...customTransitionProperty,
        background: 'background',
        width: 'width',
        height: 'height',
        top: 'top',
        border: 'border',
        spacing: 'margin, padding'
      },
      transitionDuration: {
        0: '0ms',
        1500: '1500ms',
        2000: '2000ms'
      },
      transitionTimingFunction: {
        // https://cubic-bezier.com/
        'in-out': 'cubic-bezier(.68,.12,.38,.87)',
        'in-out-back': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)'
      },
      animationDelay: {
        100: '100ms',
        150: '150ms',
        200: '200ms',
        300: '300ms',
        400: '400ms',
        500: '500ms'
      },
      animation: {
        'h-line': 'hLine 200ms ease-in-out infinite',
        'zoom-in': 'zoomIn 6s',
        'zoom-out': 'zoomOut 6s',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'collapsible-down': 'collapsible-down 0.2s ease-out',
        'collapsible-up': 'collapsible-up 0.2s ease-out'
      },
      keyframes: {
        hLine: {
          '0%': { width: '0px' },
          '100%': { width: '100%' }
        },
        zoomIn: {
          '0%': { transform: 'translateY(0) scale(1, 1)' },
          '100%': { transform: 'translateY(-20px) scale(1.3, 1.3)' }
        },
        zoomOut: {
          '0%': { transform: 'translateY(-20px) scale(1.3, 1.3)' },
          '100%': { transform: 'translateY(0) scale(1, 1)' }
        },
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 }
        },
        'collapsible-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-collapsible-content-height)' }
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: 0 }
        }
      },
      typography: theme => ({
        DEFAULT: {
          css: {
            maxWidth: theme('maxWidth.full'),
            color: 'hsl(var(--foreground))',
            '--tw-prose-body': 'hsl(var(--foreground))',
            '--tw-prose-headings': 'hsl(var(--foreground))',
            '--tw-prose-lead': 'hsl(var(--foreground))',
            '--tw-prose-links': 'hsl(var(--foreground))',
            '--tw-prose-bold': 'hsl(var(--foreground))',
            '--tw-prose-counters': 'hsl(var(--foreground))',
            '--tw-prose-bullets': 'hsl(var(--foreground))',
            '--tw-prose-hr': 'hsl(var(--foreground))',
            '--tw-prose-quotes': 'hsl(var(--foreground))',
            '--tw-prose-quote-borders': 'hsl(var(--foreground))',
            '--tw-prose-captions': 'hsl(var(--foreground))',
            '--tw-prose-code': 'hsl(var(--foreground))',
            '--tw-prose-pre-code': 'hsl(var(--foreground))',
            '--tw-prose-pre-bg': 'hsl(var(--foreground))',
            '--tw-prose-th-borders': 'hsl(var(--foreground))',
            '--tw-prose-td-borders': 'hsl(var(--foreground))',
            h2: {
              marginTop: theme('spacing.5'),
              marginBottom: theme('spacing.3')
            },
            h3: {
              marginTop: theme('spacing.4')
            },
            ol: {
              marginTop: theme('spacing.2'),
              marginBottom: theme('spacing.3')
            },
            ul: {
              marginTop: theme('spacing.2'),
              marginBottom: theme('spacing.3')
            },
            li: {
              marginTop: theme('spacing.1'),
              marginBottom: theme('spacing.1')
            },
            p: {
              marginTop: theme('spacing.2'),
              marginBottom: theme('spacing.3')
            },
            figure: {
              marginTop: theme('spacing.2'),
              marginBottom: theme('spacing.2')
            }
          }
        }
      })
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
    plugin(function ({ addUtilities, theme, e }) {
      const animationDelayValues = theme('animationDelay');
      addUtilities(
        Object.entries(animationDelayValues).map(([key, value]) => {
          return {
            [`.${e(`animate-delay-${key}`)}`]: { animationDelay: `${value}` }
          };
        })
      );

      theme('animationDelay');

      addUtilities({
        '.invalid': {
          fontSize: theme('fontSize.xs'),
          color: theme('colors.red[500]'),
          marginTop: theme('spacing.1'),
          fontStyle: 'italic'
        },
        '.overflow-initial': {
          overflow: 'initial'
        },
        '.pointer-events-all': {
          pointerEvents: 'all'
        }
      });
    })
  ]
};
