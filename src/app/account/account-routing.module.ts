import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OutletComponent } from './outlet/outlet.component';
import { AccountsComponent } from './accounts/accounts.component';
import { AccountComponent } from './account/account.component';
import { UserGuardService } from '@app/core';

const childRoutes: Routes = [
  { path: '', component: AccountsComponent },
  { path: ':id', component: AccountComponent }
];

const routes: Routes = [
  {
    path: 'accounts',
    component: OutletComponent,
    canActivate: [UserGuardService],
    children: childRoutes
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {}
