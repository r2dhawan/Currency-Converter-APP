import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, MenuItem, Button, FormControl, InputLabel } from '@material-ui/core';
import './App.css';

const API_KEY = '4a8a683995613c356671daed454f8947';
const BASE_URL = `http://data.fixer.io/api/latest?access_key=${API_KEY}`;

const supportedCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'INR', 'CNY', 'RUB', 'BRL', 'KRW'];

const CurrencySelect = ({ label, value, onChange }) => {
  return (
    <FormControl variant="outlined" className="currency-select">
      <InputLabel htmlFor={`select-${label}`}>{label}</InputLabel>
      <Select
        label={label}
        value={value}
        onChange={onChange}
        inputProps={{
          name: label.toLowerCase(),
          id: `select-${label}`,
        }}
      >
        {supportedCurrencies.map(currency => (
          <MenuItem key={currency} value={currency}>
            {currency}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const App = () => {
  const [fromCurrency, setFromCurrency] = useState('JPY');
  const [toCurrency, setToCurrency] = useState('AUD');
  const [amount, setAmount] = useState(1000);
  const [conversionRates, setConversionRates] = useState({});
  const [convertedAmount, setConvertedAmount] = useState('');

  useEffect(() => {
    axios.get(BASE_URL)
      .then(response => {
        setConversionRates(response.data.rates);
      })
      .catch(error => console.error('Error fetching currency rates:', error));
  }, []);

  const handleFromCurrencyChange = (event) => {
    setFromCurrency(event.target.value);
  };

  const handleToCurrencyChange = (event) => {
    setToCurrency(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleConvert = () => {
    if (conversionRates && fromCurrency && toCurrency) {
      const rateFrom = conversionRates[fromCurrency];
      const rateTo = conversionRates[toCurrency];
      const convertedAmount = ((amount / rateFrom) * rateTo).toFixed(2);
      setConvertedAmount(convertedAmount);
    }
  };

  return (
    <div className="App">
      <h1>Currency Converter</h1>
      <div className="converter">
        <CurrencySelect
          label="From Currency"
          value={fromCurrency}
          onChange={handleFromCurrencyChange}
        />
        <CurrencySelect
          label="To Currency"
          value={toCurrency}
          onChange={handleToCurrencyChange}
        />
        <FormControl>
          <InputLabel htmlFor="amount">Amount</InputLabel>
          <Select
            label="Amount"
            value={amount}
            onChange={handleAmountChange}
            inputProps={{
              name: 'amount',
              id: 'amount',
            }}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={100}>100</MenuItem>
            <MenuItem value={1000}>1000</MenuItem>
            {/* Add more options as needed */}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleConvert}>
          Convert
        </Button>
      </div>
      {convertedAmount && (
        <div className="result">
          <p>{`${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`}</p>
        </div>
      )}
    </div>
  );
};

export default App;
