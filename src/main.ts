import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

import {registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeEn from '@angular/common/locales/en';
import localeIt from '@angular/common/locales/it';

// the second parameter 'fr-FR' is optional
registerLocaleData(localeFr, 'fr');
registerLocaleData(localeEn, 'en');
registerLocaleData(localeIt, 'it');

if (environment.production) {
	enableProdMode();
}

//TODO use scroll bar correct
platformBrowserDynamic().bootstrapModule(AppModule)
	.catch(err => console.error(err));
