import React from 'react';
import { shallow } from 'enzyme';
import Main from './main';
import "isomorphic-fetch"

describe('<Main />', () => {
    it('renders a main containing content area', () => {
        const main = shallow(<Main />);
        expect(main.find('div.fullHeight').length).toEqual(2);
    });

    it('renders a naviation sidebar', () => {
        const main = shallow(<Main />);
        expect(main.find('Nav').length).toEqual(1);
    });
});
