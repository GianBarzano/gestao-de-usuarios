import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AuthModule } from './auth/auth.module';
import { ApiService } from './api/api.service';
import { LocalStorageService } from './localstorage/localstorage.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthModule,
    HttpClientModule
  ],
  exports: [
    AuthModule
  ],
  providers: [
    ApiService,
    LocalStorageService
  ]
})
export class CoreModule { }
