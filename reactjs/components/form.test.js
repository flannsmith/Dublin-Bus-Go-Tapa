import React from 'react';
import { shallow } from 'enzyme';
import Form from './form';
import JourneySearchInput from "./journeyPlannerSearchInput";
import Calendar from "../components/calendar"
import "isomorphic-fetch"

describe('<Form />', () => {
    it('renders the journey planner form', () => {
        const form = shallow(<Form />);
        expect(form.find('form').length).toEqual(1);
    });

    it('renders the form options', () => {
        const form = shallow(<Form />);
        expect(form.find('div.form-group').length).toEqual(4);
    });

    it('renders the JourneySearchInput component', () => {
        const form = shallow(<Form />);
        expect(form.find(JourneySearchInput).length).toEqual(2);
    });

    it('renders the Calendar component', () => {
        const form = shallow(<Form />);
        expect(form.find(Calendar).length).toEqual(1);
    });

    it('renders the submit button', () => {
        const form = shallow(<Form />);
        expect(form.find('button').length).toEqual(1);
    });
});
