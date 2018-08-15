import React from 'react';
import { shallow } from 'enzyme';
import Calendar from './calendar';
import "isomorphic-fetch"
import DateTime from 'react-datetime';

describe('<Calendar />', () => {
    it('renders the calendar container div', () => {
        const calendar = shallow(<Calendar />);
        expect(calendar.find('div').length).toEqual(1);
    });

    it('renders the datetime component', () => {
        const calendar = shallow(<Calendar />);
        expect(calendar.find(DateTime).length).toEqual(1);
    });
});
