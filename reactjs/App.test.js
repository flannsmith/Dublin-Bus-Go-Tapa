import React from 'react';
import ReactDOM from 'react-dom';
import Main from './containers/main';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Main />, div);
});