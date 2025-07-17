import { createGlobalStyle } from 'styled-components';

export const colors = {
  background: '#121212',
  card: '#1e1e1e',
  text: '#f1f1f1',
  textSecondary: '#6b7280',
  primary: '#4a90e2',
  primaryHover: '#357abd',
  danger: '#e57373',
  dangerHover: '#c62828',
};

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: ${colors.background};
    color: ${colors.text};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 16px;
  }

.select-cust {
  background-color: #1e1e1e; /* card */
  color: #f1f1f1;            /* text */
  border-radius: 8px;
}

.select-cust .MuiOutlinedInput-notchedOutline {
  border-color: #4a90e2; /* primary */
}

.select-cust:hover .MuiOutlinedInput-notchedOutline {
  border-color: #357abd; /* primaryHover */
}

.select-cust.Mui-focused .MuiOutlinedInput-notchedOutline {
  border-color: #4a90e2; /* primary */
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.select-cust .MuiSelect-icon {
  color: #f1f1f1; /* dropdown arrow */
}

.select-cust .MuiInputBase-input {
  color: #f1f1f1; /* text inside input */
}

.inputLabel-cust {
  color: #4a90e2 !important;
  font-size: 14px;
  transition: all 0.2s ease;
}


.MuiPaper-root {
  background-color: #1e1e1e !important;
  color: #f1f1f1 !important;
}

.MuiMenuItem-root {
  color: #f1f1f1 !important;
}

.MuiMenuItem-root:hover {
  background-color: #2a2a2a !important;
}


  @keyframes slideIn {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes scale {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
`;