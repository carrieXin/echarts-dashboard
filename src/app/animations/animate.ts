import { trigger, state, style, transition, animate, keyframes, group } from '@angular/animations';

export const rotateIn = trigger('rotateIn', [
    state('in', style({ display: 'none' })),
    transition(':enter', [
        animate(1000, keyframes([
            style({ opacity: 0, transformOrigin: 'center', transform: 'rotate3d(0, 0, 1, -200deg)', offset: 0 }),
            style({ opacity: 1, transformOrigin: 'center', transform: 'rotate3d(0, 0, 1, 0deg)', offset: 1 })
        ]))
    ]),
    transition(':leave', [
        animate(1000, keyframes([
            style({ opacity: 0, transformOrigin: 'center', transform: 'rotate3d(0, 0, 1, -200deg)', offset: 0 }),
            style({ opacity: 1, transformOrigin: 'center', transform: 'rotate3d(0, 0, 1, 0deg)', offset: 1 })
        ]))
    ])
]);

export const bounceIn = trigger('bounceIn', [
    state('in', style({ display: 'none' })),
    transition(':enter', [
        animate(300, keyframes([
            style({ opacity: 0, transform: 'scale3d(.3, .3, .3)', offset: 0 }),
            style({ transform: 'scale3d(1.1, 1.1, 1.1)', offset: 0.2 }),
            style({ transform: 'scale3d(.9, .9, .9)', offset: 0.4 }),
            style({ transform: 'scale3d(1.03, 1.03, 1.03)', offset: 0.6 }),
            style({ transform: 'scale3d(.97, .97, .97)', offset: 0.8 }),
            style({ opacity: 1, transform: 'scale3d(1, 1, 1)', offset: 1 })
        ]))
    ]),
    transition(':leave', [
        animate(300, keyframes([
            style({ transform: 'scale3d(.9, .9, .9)', offset: 0.2 }),
            style({ opacity: 1, transform: 'scale3d(1.1, 1.1, 1.1)', offset: 0.5 }),
            style({ opacity: 0, transform: 'scale3d(.3, .3, .3)', offset: 1 }),
        ]))
    ]),
]);
