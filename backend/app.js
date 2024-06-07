require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors'); // install cors
const cookieParser = require('cookie-parser'); // install cookie-parser
const { PORT = 3000 } = process.env;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
})); // use cors
app.use(cookieParser()); // use cookie-parser
app.use(morgan('dev'));
app.use(express.json());

const authRouter = require('./routes/auth.routes');
app.use('/api/v1/auth', authRouter);

app.listen(PORT, () => console.log('Listening on port', PORT));