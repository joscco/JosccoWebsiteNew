import {Routes} from '@angular/router';
import {ContactViewComponent} from './views/contact-view/contact-view.component';
import {AboutViewComponent} from './views/about-view/about-view.component';
import {MainViewComponent} from './views/main-view/main-view.component';
import {MarkdownPageComponent} from './views/markdown-page/markdown-page.component';
import {NotFoundViewComponent} from './views/not-found-view/not-found-view.component';

export const routes: Routes = [
  {path: '', component: MainViewComponent, data: {animation: 'work'}},
  {path: 'about', component: AboutViewComponent, data: {animation: 'about'}},
  {path: 'contact', component: ContactViewComponent, data: {animation: 'contact'}},
  {path: 'posts/:slug', component: MarkdownPageComponent, data: {animation: 'post'}},
  {path: 'not-found', component: NotFoundViewComponent, data: {animation: 'error'}},
  {path: '**', redirectTo: '', pathMatch: 'full'}
];
