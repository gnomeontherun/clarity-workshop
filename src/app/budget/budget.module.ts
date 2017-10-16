import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from 'clarity-angular';
import { CoreModule } from '@app/core';

import { BudgetRoutingModule } from './budget-routing.module';
import { BudgetComponent } from './budget/budget.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    ClarityModule,
    BudgetRoutingModule
  ],
  declarations: [BudgetComponent]
})
export class BudgetModule {}
