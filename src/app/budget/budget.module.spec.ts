import { BudgetModule } from './budget.module';

describe('BudgetModule', () => {
  let budgetModule: BudgetModule;

  beforeEach(() => {
    budgetModule = new BudgetModule();
  });

  it('should create an instance', () => {
    expect(budgetModule).toBeTruthy();
  });
});
