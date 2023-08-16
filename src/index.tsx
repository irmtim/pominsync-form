import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

const element = document.getElementById('payment-form')
const org = element?.getAttribute('org')
const backLink = element?.getAttribute('back-link')

const root = ReactDOM.createRoot(
  element as HTMLElement
);
root.render(
  <React.StrictMode>
    <App org={org!} backLink={backLink}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
