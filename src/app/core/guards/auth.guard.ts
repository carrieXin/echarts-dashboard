import { Injectable } from '@angular/core';
import { Router, CanActivate, CanLoad } from '@angular/router';

import { LocalStorageService } from '../../services/local-storage.service';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
    constructor(
        private router: Router,
        private local: LocalStorageService
    ) { }


    canActivate(): boolean {
        const res = this.ifLogin();
        return res;
    }

    canLoad(): boolean {
        const res = this.ifLogin();
        return res;
    }

    private ifLogin() {
        const token = this.local.getItem('auth-token');
        if (token) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}
