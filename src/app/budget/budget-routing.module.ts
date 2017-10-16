import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserGuardService } from '@app/core';

import { BudgetComponent } from './budget/budget.component';

const routes: Routes = [
  {
    path: 'budget',
    component: BudgetComponent,
    canActivate: [UserGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetRoutingModule {}
