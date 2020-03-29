import React, { useContext, Fragment } from "react";
import { Container, Segment, Header, Button, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { RootStoreContext } from "../../app/stores/rootStore";
import LoginForm from "../User/LoginForm";
import RegisterForm from "../User/RegisterForm";

export const HomePage = () => {
  const rootStore = useContext(RootStoreContext);
  const { isLoggedIn, user } = rootStore.userStore;
  const {show} = rootStore.modalStore;

  return (
    <Segment inverted textAlign="center" vertical className="masthead">
      <Container text>
        <Header as="h1" inverted>
          <Image
            size="massive"
            src="/assets/logo.png"
            alt="logo"
            style={{ marginBottom: 12 }}
          />
          Assbook
        </Header>
        {isLoggedIn && user ?
          (<Fragment>
          <Header as="h2" inverted content={`Welcome back ${user.displayName}`} />
          <Button as={Link} to="/assbook" size="huge" inverted>
            Let's go!
          </Button>
        </Fragment>):
        (<Fragment>
        <Header as="h2" inverted content={`Welcome to the assbook!`} />
        <Button onClick={()=>show(<LoginForm />)} size="huge" inverted>
            Login
        </Button>
        <Button onClick={()=>show(<RegisterForm />)} size="huge" inverted>
            Register
        </Button>
      </Fragment>)}
      </Container>
    </Segment>
  );
};
