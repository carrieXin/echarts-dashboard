import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// services
import { LoaderService } from '../../../services/loader.service';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private http: HttpClient,
    public localStorage: LocalStorageService,
    public loaderService: LoaderService,
  ) { }

  ngOnInit() {
  }

  public submit() {
    const apiKey = 'authByCode';
    const apiKey1 = 'helpDocumentation';
    const data = {
      cellphone: '15920089431',
      verify_code: '695125',
      verify_id: 5,
      expire_day: 5
    };

    this.http.post(apiKey1, {}).subscribe(
      res => {
        console.log(res);
        this.localStorage.setItem('authToken', 'ULmywJZjNxAlXf5FR9tjI4IjM5kzNjZTO0QjY2IGMwkzM4EWYlRnI6cjOztnOyoTYwATMiojN6M3OiQWafRnbldWYioDO6M3OiADMwATMioTN6M3OiQWaf1wAlXf5FR3EDMyYTMzAmMilTYwYDM1MWMmZzNNg==');
        this.localStorage.setItem('helpDoc', res);
        this.router.navigate(['panel']);
      },
      err => {
        console.log(err);
      }
    );
  }
}
