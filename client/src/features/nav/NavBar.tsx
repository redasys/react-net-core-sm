import React from 'react';
import { Menu, Container, Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
  return (
    <Menu fixed='top' inverted>
      <Container>
        <Menu.Item header exact as={NavLink} to='/'>
            <img src="/assets/logo.png" alt="logo" style={{marginRight: 10}}/>
            Assbook
        </Menu.Item>
        <Menu.Item name='Activities' as={NavLink} to='/assbook'/>
        <Menu.Item>
            <Button as={NavLink} to='/create' positive content='Create Activity'  />
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default NavBar;
