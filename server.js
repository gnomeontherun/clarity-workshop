const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const db = router.db;

server.use(jsonServer.defaults());
server.use(jsonServer.bodyParser);

var validUser = false;
var password = 'vmware';

function add(one, two) {
  return parseFloat(Number((parseInt(one * 100) + parseInt(two * 100)) / 100).toFixed(2));
}
function subtract(one, two) {
  return parseFloat(Number((parseInt(one * 100) - parseInt(two * 100)) / 100).toFixed(2));
}

server.use(function (req, res, next) {
  var user = db.get('user').value();
  if (user.valid || req.path === '/login') {
    next();
  } else {
    res.status(401).json({
      status: 401,
      message: 'Unauthorized'
    });
  }
});

server.get('/user', function (req, res) {
  var user = db.get('user').value();
  res.json(user);
});

server.post('/login', function (req, res) {
  var user = db.get('user').value();
  if (req.body.password === password && req.body.email === user.email) {
    db.set('user.valid', true).write();
    res.status(200).json(user);
  } else {
    res.status(400).json({
      message: 'The email and password provided are not valid'
    });
  }
});

server.post('/logout', function (req, res) {
  db.set('user.valid', false).write();
  res.status(200).send({});
});

// Intercept category save to calculate new available value
server.put('/categories/:id', function (req, res, next) {
  var category = req.body;
  req.body.available = subtract(category.budgeted, category.activity);
  next();
});

// Intercept category delete to check if transactions remain
server.delete('/categories/:id', function (req, res, next) {
  var transactions = db.get('transactions')
    .find({categoryId: req.params.id})
    .size()
    .value();
  if (transactions > 0) {
    res.status(409).json({
      message: 'Cannot delete a category that has transactions attached'
    });
  } else {
    next();
  }
});

// Intercept transaction creation to calculate new category balances
server.post('/transactions', function (req, res, next) {
  var transaction = req.body;
  var category = db.get('categories')
    .find({id: transaction.categoryId})
    .value();
  category.activity = add(category.activity, transaction.amount);
  category.available = subtract(category.budgeted, category.activity);
  next();
});

// Intercept transaction edit to calculate new category balances
server.put('/transactions/:id', function (req, res, next) {
  var newTransaction = req.body;
  var oldTransaction = db.get('transactions')
    .find({id: newTransaction.id})
    .value();
  var newCategory = db.get('categories')
    .find({id: newTransaction.categoryId})
    .value();
  var oldCategory = db.get('categories')
    .find({id: oldTransaction.categoryId})
    .value();
  
  // Put the money back in the old category
  oldCategory.activity = subtract(oldCategory.activity, oldTransaction.amount);
  oldCategory.available = add(oldCategory.available, oldTransaction.amount);
  // Save old category
  db.get('categories')
    .find({id: oldCategory.id})
    .assign({
      activity: oldCategory.activity,
      available: oldCategory.available
    })
    .write();

  // Credit the new category with the new amount
  newCategory.activity = add(newCategory.activity, newTransaction.amount);
  newCategory.available = subtract(newCategory.budgeted, newCategory.activity);
  // Save new category
  db.get('categories')
  .find({id: newCategory.id})
  .assign({
    activity: newCategory.activity,
    available: newCategory.available
  })
  .write();

  next();
});

server.use(router);

server.listen(5000, function() {
  console.log('API server is running on port 5000');
});
