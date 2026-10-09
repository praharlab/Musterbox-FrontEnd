import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { getThemeColor, setThemeColor } from './app/utils/util';

if (environment.production) {
  enableProdMode();
  window.console.log = function () {};
}

const DEFAULT_THEME = environment.defaultColor;

// Each theme is built as its own non-injected stylesheet (see the `styles` entries with
// `inject: false` in angular.json, bundleName = theme name), so load it with a <link>.
// Importing the SCSS from here only worked with the old webpack-only builder.
function loadTheme(name: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = name + '.css';
    link.onload = resolve;
    link.onerror = () => {
      link.remove();
      reject(new Error('theme stylesheet not found: ' + link.href));
    };
    document.head.appendChild(link);
  });
}

function bootstrap(): void {
  platformBrowserDynamic()
    .bootstrapModule(AppModule, { applicationProviders: [provideZoneChangeDetection()], })
    .catch((err) => console.error(err));
}

const color =
  environment.isMultiColorActive || environment.isDarkSwitchActive
    ? getThemeColor()
    : DEFAULT_THEME;

loadTheme(color)
  .then(() => {
    setThemeColor(color);
  })
  .catch(() => {
    // The requested theme could not be resolved - typically a stored theme name
    // that no longer exists, or a dev server whose dynamic-import context was
    // built before the file was added.
    //
    // The previous handler called window.location.reload() here without ever
    // bootstrapping. When the default theme was the one that failed to resolve,
    // that reloaded forever and no stylesheet was ever applied, so the entire
    // app rendered as unstyled HTML. Fall back instead, and always boot.
    console.warn(
      `[theme] "${color}" could not be loaded. Falling back to "${DEFAULT_THEME}".`,
    );
    setThemeColor(null);
    return loadTheme(DEFAULT_THEME).catch(() => {
      console.error(
        `[theme] Default theme "${DEFAULT_THEME}" also failed to load. ` +
          `Starting without a theme stylesheet - the UI will be unstyled. ` +
          `If you are running a dev server, restart it so newly added theme ` +
          `files are picked up.`,
      );
    });
  })
  .then(() => bootstrap());
