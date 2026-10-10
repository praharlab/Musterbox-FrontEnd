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
    apiKey: 'AIzaSyCubT5Fbflw-cq8gIjT68SKcQmypts4DB',
    authDomain: 'musterbox-9685a.firebaseapp.com',
    databaseURL: 'https://musterbox-9685a-default-rtdb.firebaseio.com/',
    projectId: 'musterbox-9685',
    storageBucket: 'musterbox-9685a.firebasestorage.app',
    messagingSenderId: '583700609297',
    appId: '1:583700609297:web:30b78255b48b8cc3f234b0',
    measurementId: 'G-Z5YEMT23VD',
  },
};
