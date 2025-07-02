import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app/app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {MarkdownModule} from 'ngx-markdown';
import {provideHttpClient} from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    ...MarkdownModule.forRoot().providers ?? [],
  ]
})
  .catch((err) => console.error(err));
