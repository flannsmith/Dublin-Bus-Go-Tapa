import React from 'react';
import { shallow } from 'enzyme';
import Nav from './nav';
import Form from "./form";
import QuickTimes from "./quickTimes"
import Timetables from "./timetables"
import "isomorphic-fetch"

describe('<Nav />', () => {
    it('renders the navigation menu', () => {
        const wrapper = shallow(<Nav />);
        expect(wrapper.find('nav').length).toEqual(1);
    });

    it('renders the logo in nav', () => {
        const wrapper = shallow(<Nav />);
        expect(wrapper.find('img').length).toEqual(1);
    });
    
    it('renders the navigation button container', () => {
        const wrapper = shallow(<Nav />);
        expect(wrapper.find('div.panel').length).toEqual(1);
    });

    it('renders the navigation buttons', () => {
        const wrapper = shallow(<Nav />);
        expect(wrapper.find('div.panel-heading').length).toEqual(4);
    });

});
