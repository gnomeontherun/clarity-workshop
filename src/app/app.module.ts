import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule } from 'clarity-angular';

import {
  CoreModule,
  UserService,
  UserInitFactory,
  HomeComponent,
  LoginComponent,
} from '@app/core';
import { AccountModule } from '@app/account';
import { BudgetModule } from '@app/budget';

import { AppComponent } from './app.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ClarityModule,
    CoreModule,
    AccountModule,
    BudgetModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      deps: [UserService],
      multi: true,
      useFactory: UserInitFactory
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
