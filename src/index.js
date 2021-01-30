import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app';
import '@fortawesome/fontawesome-free/js/all.js';
import Youtube from './service/youtube';
import OAuth from './service/oauth';

const youtube=new Youtube(process.env.REACT_APP_API_KEY);
const oauth=new OAuth(process.env.REACT_APP_CLIENT_ID);
ReactDOM.render(
  <React.StrictMode>
    <App youtube={youtube} oauth={oauth}/>
  </React.StrictMode>,
  document.getElementById('root')
);

