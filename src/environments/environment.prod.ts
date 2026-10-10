// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { UserRole } from '../app/shared/auth.roles';

export let environment: {
  defaultMenuType: string;
  subHiddenBreakpoint: number;
  defaultRole: UserRole;
  production: boolean;
  buyUrl: string;
  defaultDirection: string;
  themeColorStorageKey: string;
  mediumDateFormat: string;
  firebase: {
    storageBucket: string;
    apiKey: string;
    messagingSenderId: string;
    appId: string;
    projectId: string;
    measurementId: string;
    databaseURL: string;
    authDomain: string;
  };
  menuHiddenBreakpoint: number;
  isDarkSwitchActive: boolean;
  themeRadiusStorageKey: string;
  defaultColor: string;
  apiUrl: string;
  chatUrl: string;
  isAuthGuardActive: boolean;
  adminRoot: string;
  isMultiColorActive: boolean;
  SCARF_ANALYTICS: boolean;
  permission: [];
  appUrl: any;
  appUrl1: any;
  appUrl2: any;
  appUrl3: any;
  biometricApiUrl: string;
  appLoginUrl: string;
  secretKeyForEncoding: string;
};
environment = {
  production: true,

  buyUrl: 'https://1.envato.market/6NV1b',
  SCARF_ANALYTICS: false,
  adminRoot: '/app',

  apiUrl: 'https://apiMusterBox.MusterBox.co.in/',
  biometricApiUrl: '',
  chatUrl: 'https://chat.MusterBox.co.in',
  appUrl: 'https://MusterBox.co.in/#/user/preboarding/',
  appUrl1: 'https://MusterBox.co.in/#/user/submitform/',
  appUrl2: '',
  appUrl3: '',
  appLoginUrl: '',
  defaultMenuType: 'menu-default',
  subHiddenBreakpoint: 1440,
  menuHiddenBreakpoint: 768,
  themeColorStorageKey: 'hrms-themecolor-v2',
  isMultiColorActive: false,
  defaultColor: 'light.tealslate',
  isDarkSwitchActive: true,
  defaultDirection: 'ltr',
  themeRadiusStorageKey: 'vien-themeradius',
  isAuthGuardActive: false,
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
  mediumDateFormat: 'mediumDate',
  permission: [],
};
