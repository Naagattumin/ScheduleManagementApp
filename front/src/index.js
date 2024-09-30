// index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Tomorrow from './ttt';
import Graph from './Graph';
import reportWebVitals from './reportWebVitals';

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    TextField
  } from "@mui/material";
  
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const root = ReactDOM.createRoot(document.getElementById('root'));
const today = new Date().toLocaleDateString();
root.render(
  <React.StrictMode>
    <Accordion 
        defaultExpanded 
    >
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
                height: '50px', // 閉じた状態の高さを50pxに設定
                display: 'flex',
                justifyContent: 'center', // 中央寄せ
                alignItems: 'center' // 垂直方向に中央寄せ
            }}
        >
            <h2 style={{ textAlign: "center", width: '100%'  }}>{today}のタスク</h2>
        </AccordionSummary>
        <AccordionDetails>
            <App />
        </AccordionDetails>
    </Accordion>

    <Accordion 
        defaultExpanded 
    >
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
                height: '50px', // 閉じた状態の高さを50pxに設定
                display: 'flex',
                justifyContent: 'center', // 中央寄せ
                // alignItems: 'center' // 垂直方向に中央寄せ
            }}
        >
            <h2 style={{ textAlign: "center", width: '100%' }}>明日のタスク</h2>
        </AccordionSummary>
        <AccordionDetails>
            <Tomorrow />
        </AccordionDetails>
    </Accordion>

    <Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
                height: '50px', // 閉じた状態の高さを50pxに設定
                display: 'flex',
                justifyContent: 'center', // 中央寄せ
                alignItems: 'center' // 垂直方向に中央寄せ
            }}
        >
            <h2 style={{ textAlign: "center", width: '100%' }}>履歴</h2>
        </AccordionSummary>
        <AccordionDetails>
            <Graph />
        </AccordionDetails>
    </Accordion>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();