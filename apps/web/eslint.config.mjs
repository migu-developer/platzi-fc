import nextConfig from 'eslint-config-next'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

const config = [
  ...nextConfig,
  ...nextCoreWebVitals,
  {
    rules: {
      // Downgraded — current code uses legitimate hydration (localStorage on mount)
      // and polling (setInterval -> setState) patterns flagged by this rule.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
]

export default config
