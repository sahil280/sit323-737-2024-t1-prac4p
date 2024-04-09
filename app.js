const express = require('express');
const winston = require('winston');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'calculator-microservice' },
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

app.get('/', (req, res) => {
    res.send('This is my first docker web app');
});

app.get('/add', (req, res) => {
    const { num1, num2 } = req.query;
    if (!num1 || !num2 || isNaN(num1) || isNaN(num2)) {
        logger.error('Invalid parameters for addition endpoint');
        return res.status(400).json({ error: 'Invalid parameters. Both num1 and num2 must be provided as valid numbers.' });
    }
    const result = parseFloat(num1) + parseFloat(num2);
    logger.info(`Addition operation performed: ${num1} + ${num2} = ${result}`);
    res.json({ result });
});

app.get('/subtract', (req, res) => {
    const { num1, num2 } = req.query;
    if (!num1 || !num2 || isNaN(num1) || isNaN(num2)) {
        logger.error('Invalid parameters for subtraction endpoint');
        return res.status(400).json({ error: 'Invalid parameters. Both num1 and num2 must be provided as valid numbers.' });
    }
    const result = parseFloat(num1) - parseFloat(num2);
    logger.info(`Subtraction operation performed: ${num1} - ${num2} = ${result}`);
    res.json({ result });
});

app.get('/multiply', (req, res) => {
    const { num1, num2 } = req.query;
    if (!num1 || !num2 || isNaN(num1) || isNaN(num2)) {
        logger.error('Invalid parameters for multiplication endpoint');
        return res.status(400).json({ error: 'Invalid parameters. Both num1 and num2 must be provided as valid numbers.' });
    }
    const result = parseFloat(num1) * parseFloat(num2);
    logger.info(`Multiplication operation performed: ${num1} * ${num2} = ${result}`);
    res.json({ result });
});

app.get('/divide', (req, res) => {
    const { num1, num2 } = req.query;
    if (!num1 || !num2 || isNaN(num1) || isNaN(num2)) {
        logger.error('Invalid parameters for division endpoint');
        return res.status(400).json({ error: 'Invalid parameters. Both num1 and num2 must be provided as valid numbers.' });
    }
    if (parseFloat(num2) === 0) {
        logger.error('Division by zero');
        return res.status(400).json({ error: 'Invalid parameters. Cannot divide by zero.' });
    }
    const result = parseFloat(num1) / parseFloat(num2);
    logger.info(`Division operation performed: ${num1} / ${num2} = ${result}`);
    res.json({ result });
});

app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
