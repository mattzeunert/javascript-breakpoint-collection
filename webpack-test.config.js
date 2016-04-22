var context = require.context('./tests', true, /-spec\.jsx?$/);
context.keys().forEach(context);
