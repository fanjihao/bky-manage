import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css';
import App from './app/App';
import * as serviceWorker from './serviceWorker';
import 'antd/dist/antd.css';
import {
    BrowserRouter as Router
} from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'

moment.locale('zh-cn');

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>,
    document.getElementById('root')
);


serviceWorker.unregister();