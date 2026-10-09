// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { UserRole } from '../app/shared/auth.roles';

export const environment = {
  production: false,
  buyUrl: 'https://1.envato.market/6NV1b',
  SCARF_ANALYTICS: false,
  adminRoot: '/app',

  apiUrl: 'http://localhost:3210/',
  biometricApiUrl: 'http://localhost:3510/',
  appUrl: 'http://localhost:4200/#/user/preboarding/',
  appUrl1: 'http://localhost:4200/#/user/submitform/',
  appUrl2: 'http://localhost:4200/#/user/jobPosting/',
  appUrl3: 'http://localhost:4200/#/user/applyJob/',
  chatUrl: 'http://localhost:3210',
  appLoginUrl: 'http://localhost:4200/',
  defaultMenuType: 'menu-default',
  subHiddenBreakpoint: 1440,
  menuHiddenBreakpoint: 768,
  themeColorStorageKey: 'hrms-themecolor-v2',
  isMultiColorActive: false,
  mediumDateFormat: 'mediumDate',
  permission: [],
  /*
  Color Options:
  'light.blueyale', 'light.blueolympic', 'light.bluenavy', 'light.greenmoss',
  'light.greenlime', 'light.yellowgranola', 'light.greysteel', 'light.orangecarrot',
'light.redruby', 'light.purplemonster'

  'dark.blueyale', 'dark.blueolympic', 'dark.bluenavy', 'dark.greenmoss',
  'dark.greenlime', 'dark.yellowgranola', 'dark.greysteel', 'dark.orangecarrot',
  'dark.redruby', 'dark.purplemonster'
  */
  defaultColor: 'light.tealslate',
  isDarkSwitchActive: true,
  defaultDirection: 'ltr',
  themeRadiusStorageKey: 'vien-themeradius',
  isAuthGuardActive: true,
  defaultRole: UserRole.Admin,
  secretKeyForEncoding: '8d8e2f43a6dbcc7281e2b1f9c8463ab243dfa9ecb541a12a38c9c5671f876c22',
  firebase: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: '',
  },
};
