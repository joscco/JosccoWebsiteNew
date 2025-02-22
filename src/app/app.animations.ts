import {animate, group, query, state, style, transition, trigger} from '@angular/animations';

export const fadeInAndOutAnimations = trigger('fadeInAndOutAnimations', [
  transition('contact => work, contact => about, about => work', [
    query(':enter, :leave',
    style({ position: 'fixed',  width: '100%' }),
    { optional: true }),
    group([
      query(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.5s ease-in-out',
          style({ transform: 'translateX(0%)' }))
      ], { optional: true }),
      query(':leave', [
        style({ transform: 'translateX(0%)' }),
        animate('0.5s ease-in-out',
          style({ transform: 'translateX(100%)' }))
      ], { optional: true }),
    ])
  ]),
  transition('work => about, work => contact, about => contact', [
    query(':enter, :leave',
      style({ position: 'fixed',  width: '100%' }),
      { optional: true }),
    group([
      query(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('0.5s ease-in-out',
          style({ transform: 'translateX(0%)' }))
      ], { optional: true }),
      query(':leave', [
        style({ transform: 'translateX(0%)' }),
        animate('0.5s ease-in-out',
          style({ transform: 'translateX(-100%)' }))
      ], { optional: true }),
    ])
  ])
]);

export const resizeImage = trigger('resize', [
  state('hidden', style({
    opacity: 0,
    transform: 'scale(0)'
  })),
  state('shown', style({
    opacity: 1,
    transform: 'scale(1)'
  })),
  transition('hidden => shown', [
      animate('0.2s ease-out')
  ]),
])
