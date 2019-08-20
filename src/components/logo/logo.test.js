import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { shallowToJson } from 'enzyme-to-json';

import Logo from './logo';

configure({ adapter: new Adapter() });

it('should render correctly', () => {
    const output = shallow(
        <Logo />
    );
    expect(shallowToJson(output)).toMatchSnapshot();
});
