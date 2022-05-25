const express = require('express'); //! Kairat Talantbekov большая тебе благодарность за твои замечания и рекомендации я их проработаю и изучу!!!
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { PORT = 3000 } = process.env;
const { userRoutes } = require('./routes/users');
const { cardRoutes } = require('./routes/cards');

const app = express();

app.use((req, _, next) => {
  req.user = {
    _id: '628d6e65f60e1fdd870f6540',
  };

  next();
});

app.use(helmet());
app.use(express.json());
app.use('/users', userRoutes);
app.use('/cards', cardRoutes);
app.use((_, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  app.listen(PORT, () => {
    // eslint-disable-next-line
    console.log(`Поключён ${PORT} порт`);
  });
}

main();
