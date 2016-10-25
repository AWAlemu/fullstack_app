exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL || 'mongodb://shoppinglist:FullStack1@ds011291.mlab.com:11291/mongo';
exports.PORT = process.env.PORT || 8080;