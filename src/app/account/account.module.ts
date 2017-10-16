import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClarityModule } from 'clarity-angular';
import { CoreModule } from '../core/core.module';

import { AccountRoutingModule } from './account-routing.module';
import { AccountsComponent } from './accounts/accounts.component';
import { OutletComponent } from './outlet/outlet.component';
import { AccountComponent } from './account/account.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    ClarityModule,
    AccountRoutingModule
  ],
  declarations: [AccountsComponent, OutletComponent, AccountComponent],
  providers: []
})
export class AccountModule {}
