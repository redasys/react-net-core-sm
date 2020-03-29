import React, { useContext } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { Form, Button, Header } from "semantic-ui-react";
import TextInput from "../../app/common/form/TextInput";
import { RootStoreContext } from "../../app/stores/rootStore";
import { UserFormValues } from "../../app/models/user";
import { FORM_ERROR } from "final-form";
import { combineValidators, isRequired } from "revalidate";
import ErrorMessage from "../../app/common/form/ErrorMessage";


const validate = combineValidators({
  email: isRequired("email"),
  password: isRequired("password")
});
const LoginForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { login } = rootStore.userStore;  
  return (
    <FinalForm
      validate={validate}
      onSubmit={(values: UserFormValues) =>
        login(values).catch(error => ({ [FORM_ERROR]: error }))
      }
      render={({
        handleSubmit,
        submitting,
        submitError,
        invalid,
        dirtySinceLastSubmit,
        pristine
      }) => (
        <Form onSubmit={handleSubmit} error>
          <Header as='h2' content='Log in' color='teal' textAlign='center'/>
          <Field name="email" component={TextInput} placeholder="Email" />
          <Field
            name="password"
            component={TextInput}
            placeholder="Password"
            type="password"
            value="Pa$$w0rd"
          />
          {submitError && !dirtySinceLastSubmit && (
            <ErrorMessage
            error={submitError}
            text='Invalid email or password'
          />
          )}
          <br />
          <Button
            loading={submitting}
            color='teal'
            content='Login'
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            fluid
            
          />          
        </Form>
      )}
    />
  );
};

export default LoginForm;
