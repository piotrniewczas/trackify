import { AnalyticsDriverConstructor, AnalyticsDriverToken } from '../interfaces/analytics-driver'
import { TRACKIFY_DEBUG, TRACKIFY_GTM, TRACKIFY_USERCOM, TRACKIFY_SYNERISE, TRACKIFY_TRADEDOUBLER,  } from '../tokens'
import { isBrowser } from '../helpers/fns'

export const analyticsDrivers: Map<AnalyticsDriverToken, () => Promise<AnalyticsDriverConstructor>> = new Map<AnalyticsDriverToken, () => Promise<AnalyticsDriverConstructor>>(
  [
    [
      TRACKIFY_DEBUG,
      () => isBrowser() ? import('./debug.browser-driver').then(module => module.default)
        : import('./debug.server-driver').then(module => module.default)
    ],
    [
      TRACKIFY_GTM,
      () => isBrowser() ? import('./gtm.browser-driver').then(module => module.default)
        : import('./gtm.server-driver').then(module => module.default)
    ],
    [
      TRACKIFY_USERCOM,
      () => isBrowser() ? import('./usercom.browser-driver').then(module => module.default)
        : import('./usercom.server-driver').then(module => module.default)
    ],
    [
      TRACKIFY_SYNERISE,
      () => isBrowser() ? import('./synerise.browser-driver').then(module => module.default)
        : import('./synerise.server-driver').then(module => module.default)
    ],
    [
      TRACKIFY_TRADEDOUBLER,
      () => isBrowser() ? import('./tradedoubler.browser-driver').then(module => module.default)
        : import('./tradedoubler.server-driver').then(module => module.default)
    ]
  ])
