import React from "react";
import { Container } from "semantic-ui-react";
import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <Container style={{ marginTop: "7em" }}>
      <h1>
        <Link to={"assbook"}>Assbook!</Link>
      </h1>
    </Container>
  );
};
