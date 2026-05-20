import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Amplify } from 'aws-amplify';
import { AuthProvider as LocalAuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

const authorityParts = import.meta.env.VITE_COGNITO_AUTHORITY?.split('/') || [];
const userPoolId = authorityParts[authorityParts.length - 1];

if (userPoolId) {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId,
        userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
        signUpVerificationMethod: 'code',
        loginWith: {
          email: true,
          phone: false,
          username: true
        }
      }
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LocalAuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </LocalAuthProvider>
  </React.StrictMode>,
)
