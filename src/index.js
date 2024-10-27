const app = require('./app.js');
const mongoose = require('mongoose');

const mongoDB_URL = 'mongodb+srv://lalith-chakradhar:roxiler-transaction-db168@transactionsdb.wd17d.mongodb.net/?retryWrites=true&w=majority&appName=transactionsDB'

mongoose.connect(mongoDB_URL)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => {
        console.error(`MongoDB connection error: ${error}`);
        process.exit(-1);
      });

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
