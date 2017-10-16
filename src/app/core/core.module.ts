import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ClarityModule } from 'clarity-angular';

import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AccountsService } from './services/accounts/accounts.service';
import { CategoriesService } from './services/categories/categories.service';
import { TransactionsService } from './services/transactions/transactions.service';
import { UserService } from './services/user/user.service';
import { UserGuardService } from './services/user-guard/user-guard.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    ClarityModule
  ],
  declarations: [HeaderComponent, HomeComponent, LoginComponent],
  providers: [
    AccountsService,
    CategoriesService,
    TransactionsService,
    UserService,
    UserGuardService
  ],
  exports: [HeaderComponent]
})
export class CoreModule {}
