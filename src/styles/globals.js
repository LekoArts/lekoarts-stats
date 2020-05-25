import { css } from 'linaria'

export const globals = css`
  :global() {
    :root {
      --color-primary: #3643a3;
      --color-white: white;
      --color-black: black;
      --color-gray-50: #ffffff;
      --color-gray-100: #e0e5eb;
      --color-gray-200: #b9c1ca;
      --color-gray-300: #99a1b0;
      --color-gray-400: #7d8796;
      --color-gray-500: #60687c;
      --color-gray-600: #454c60;
      --color-gray-700: #35384d;
      --color-gray-800: #25293e;
      --color-gray-900: #191b2c;
      --color-blue-50: #9f9f9f;
      --color-blue-100: #cfeaff;
      --color-blue-200: #9cc6ff;
      --color-blue-300: #70a0f5;
      --color-blue-400: #6182ed;
      --color-blue-500: #4c5eca;
      --color-blue-600: #3643a3;
      --color-blue-700: #29357f;
      --color-blue-800: #1d275a;
      --color-blue-900: #121d3b;
    }
    html {
      box-sizing: border-box;
      font-family: 'IBM Plex Mono', monospace;
      font-weight: 500;
      font-size: 18px;
    }
    body {
      border: none;
      margin: 0;
      padding: 0;
      color: var(--color-gray-700);
    }
    a {
      color: var(--color-black);
      text-decoration: none;
      font-style: italic;
      transition: all 0.3s ease-in-out;
      &:hover {
        text-decoration: underline;
        color: var(--color-primary);
      }
    }
    h1, h2, h3, h4, h5, h6 {
      color: var(--color-black);
    }
    *,
    *:before,
    *:after {
      box-sizing: inherit;
    }
    *::selection {
      color: var(--color-white);
      background: var(--color-primary);
    }
  }
`
