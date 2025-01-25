import {Routes} from '@angular/router';
import {ContactViewComponent} from './views/contact-view/contact-view.component';
import {AboutViewComponent} from './views/about-view/about-view.component';

export const routes: Routes = [
  { path: '', component: ContactViewComponent, data: { animation: 'work' } },
  { path: 'about', component: AboutViewComponent, data: { animation: 'about' } },
  { path: 'contact', component: ContactViewComponent, data: { animation: 'contact' } },
  { path: '**', redirectTo: '/work', pathMatch: 'full' }
];
