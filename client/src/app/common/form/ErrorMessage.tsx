import React from "react";
import { Message } from "semantic-ui-react";
import { AxiosResponse } from "axios";

interface Props {
  error: AxiosResponse;
  text?: string;
}

const ErrorMessage: React.FC<Props> = ({ error, text }) => {
  return (
    <Message error>
      <Message.Header>{error.statusText}</Message.Header>
      {error.data && Object.keys(error.data.errors).length > 0 && (
        <Message.List>
          {Object.values(error.data.errors).flat().map((e, i)=>(
            <Message.Item key={i}>{e}</Message.Item>
          ))}
        </Message.List>
      )}
      {text && <Message.Content content={text} />}
      <p></p>
    </Message>
  );
};

export default ErrorMessage;
