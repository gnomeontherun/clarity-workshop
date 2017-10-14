const chalk = require('chalk');
const faker = require('faker');
const fs = require('fs');

// Potential configurations
const accountTypes = [
  { name: 'Checking', type: 'debit' },
  { name: 'Savings', type: 'debit' },
  { name: 'Mastercard', type: 'credit' },
  { name: 'Visa', type: 'credit' },
];
const numCategories = 20;
const numTransactions = 100;
const numDays = 30;

function log(message, color) {
  if (!color) {
    color = 'white';
  }
  console.log(chalk[color](message));
}

const data = {
  user: {
    valid: false,
    email: 'user@vmware.com',
    name: 'Clarity User'
  },
  accounts: [],
  transactions: [],
  categories: []
};

log('Welcome to the data generator!');

// Generate accounts
const accounts = [];
accountTypes.forEach(function(account) {
  const accountId = faker.random.uuid();
  accounts.push(Object.assign({
    id: accountId,
    number: faker.finance.account()
  }, account));
});
data.accounts = accounts;
log('Wrote ' + accounts.length + ' accounts');

// Generate categories
const categories = [];
var categoriesTotal = 0;
while (categoriesTotal < numCategories) {
  const category = {
    id: faker.random.uuid(),
    name: faker.commerce.department(),
    budgeted: 0,
    activity: 0,
    available: 0,
    type: 'credit'
  };
  if (categories.findIndex(function(c) { return category.name === c.name; }) < 0) {
    categories.push(category);
    categoriesTotal++;
  }
}
const income = {
  id: faker.random.uuid(),
  name: 'Income',
  budgeted: 0,
  activity: 0,
  available: 0,
  type: 'debit'
};
categories.push(income);
data.categories = categories;
log('Wrote ' + categories.length + ' categories');

// Generate transactions
const transactions = [];
data.accounts.forEach(function(account) {
  var total = 0;
  for (var i = 0; i < numTransactions; i++) {
    let category = '';
    let amount = 0;
    if (account.type === 'credit') {
      const random = Math.floor(Math.random() * (numCategories));
      category = data.categories[random].id;
      amount = faker.finance.amount(1, 200, 2);
    } else {
      category = income.id;
      amount = faker.finance.amount(1, 500, 2);
    }
    total += parseInt(amount * 100);
    const date = faker.date.between(new Date(Date.now() - 1000 * 60 * 60 * 24 * numDays), new Date());
    const formattedDate = date.getFullYear() + '-' 
    + ((date.getMonth() < 9) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-'
    + ((date.getDate() < 10) ? '0' + (date.getDate()) : (date.getDate()));
    const transaction = {
      id: faker.random.uuid(),
      amount: amount,
      payee: faker.company.companyName(),
      comment: faker.hacker.phrase(),
      date: formattedDate,
      categoryId: category,
      accountId: account.id
    };
    if (account.type === 'credit') {
      const categoryRef = data.categories.find((category) => category.id === transaction.categoryId);
      categoryRef.budgeted = (parseInt(categoryRef.budgeted * 100) + parseInt(transaction.amount * 100)) / 100;
      categoryRef.activity = (parseInt(categoryRef.activity * 100) + parseInt(transaction.amount * 100)) / 100;
    }
    transactions.push(transaction);
  }
  account.balance = total / 100;
});
data.transactions = transactions;
log('Wrote ' + transactions.length + ' transactions');

fs.writeFileSync('./db.json', JSON.stringify(data));

log('Success!');
