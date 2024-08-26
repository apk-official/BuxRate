import { useState, useEffect } from "react";
import "./index.css";
import "./query.css";
import { ArrowsLeftRight, GithubLogo } from "@phosphor-icons/react";
import { LineWave } from "react-loader-spinner";

const currency_expansion = [
  {
    currency: "GBP",
    fullName: "Great Britain Pound",
  },
  {
    currency: "INR",
    fullName: "Indian Rupee",
  },
  {
    currency: "USD",
    fullName: "US Dollar",
  },
  {
    currency: "EUR",
    fullName: "Euro",
  },
  {
    currency: "AED",
    fullName: "United Arab Emirates Dirham",
  },
  {
    currency: "JPY",
    fullName: "Japanese Yen",
  },
];

export default function App() {
  return (
    <div className="app">
      <NavBar />
      <Main />
    </div>
  );
}

function NavBar() {
  return (
    <nav className="nav-bar">
      <p className="logo">BuxRate</p>
      <button className="github-btn">
        <GithubLogo size={20} color="#222222" />
        Star {20}
      </button>
    </nav>
  );
}
function Main() {
  return (
    <>
      <div className="heading-container">
        <h1>Convert Currencies Instantly</h1>
        <p className="hero-para">
          Easily switch between currencies with real-time exchange rates.
        </p>
      </div>
      <CurrencyConverter />
    </>
  );
}

function CurrencyConverter() {
  const [fromCurrency, setFromCurrency] = useState("GBP");
  const [toCurrency, setToCurrency] = useState("INR");
  const [fromCurrencyFullName, setFromCurrencyFullName] = useState(
    "Great Britain Pound"
  );
  const [toCurrencyFullName, setToCurrencyFullName] = useState("Indian Rupee");
  const [inputAmount, setInputAmount] = useState("1");
  const [outputAmount, setOutputAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [date, setDate] = useState("");

  function handleSwitch() {
    const temp_currency = toCurrency;
    setToCurrency(fromCurrency);
    setFromCurrency(temp_currency);
  }
  function Loader() {
    return (
      <LineWave
        visible={true}
        height="100"
        width="100"
        color="#222222"
        ariaLabel="line-wave-loading"
        wrapperStyle={{}}
        wrapperClass=""
        firstLineColor=""
        middleLineColor=""
        lastLineColor=""
      />
    );
  }
  function Error({ message }) {
    return <p className="error">{message}</p>;
  }
  useEffect(
    function () {
      function currencyFullname(cur) {
        const matchingCurrency = currency_expansion.find(
          (currency) => currency.currency === cur
        );
        return matchingCurrency.fullName;
      }
      setFromCurrencyFullName(currencyFullname(fromCurrency));
      setToCurrencyFullName(currencyFullname(toCurrency));
    },
    [fromCurrency, toCurrency]
  );

  useEffect(
    function () {
      async function fetchCurrencyRate() {
        setIsLoading(true);
        try {
          const res = await fetch(
            `https://${process.env.REACT_APP_HOST}/latest?amount=${inputAmount}&from=${fromCurrency}&to=${toCurrency}`
          );
          if (!res.ok)
            throw new Error(
              "Sorry...Currency Exchange Rate not available right now!"
            );
          const data = await res.json();
          setOutputAmount(data.rates[toCurrency]);
          function formatDate(dateString) {
            const date = new Date(dateString);
            const options = { day: "numeric", month: "long", year: "numeric" };
            return date.toLocaleDateString("en-US", options);
          }
          setDate(formatDate(data.date));
          setIsLoading(false);
        } catch (err) {
          setError(err.message);
        }
      }
      if (fromCurrency === toCurrency) return setOutputAmount(inputAmount);
      fetchCurrencyRate();
    },
    [fromCurrency, inputAmount, toCurrency]
  );
  return (
    <div className="curr-conv-container">
      <div className="currency-amount">
        <div className="amount">
          <input
            type="number"
            className="amount-input"
            placeholder="Enter amount"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
          />
        </div>
        <div className="currency-select">
          <div className="from-currency">
            <img
              src={`/${fromCurrency}.png`}
              alt="Flag of GBP"
              className="flag"
            />
            <select
              name="currency-from"
              id="currency-from"
              className="currency"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="AED">AED</option>
              <option value="JPY">JPY</option>
            </select>
          </div>

          <div className="switch" onClick={handleSwitch}>
            <ArrowsLeftRight size={32} className="arrow-icon" />
          </div>
          <div className="to-currency">
            <img
              src={`/${toCurrency}.png`}
              alt="Flag of GBP"
              className="flag"
            />

            <select
              name="currency-to"
              id="currency-to"
              className="currency"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="AED">AED</option>
              <option value="JPY">JPY</option>
            </select>
          </div>
        </div>
      </div>
      <div className="converted-amount">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <p className="conv-from">{`${inputAmount} ${fromCurrencyFullName}`}</p>
            <p className="conv-to">
              {outputAmount} {`${toCurrencyFullName}`}
            </p>
            <div className="date">{date}</div>
          </>
        )}
      </div>
    </div>
  );
}
