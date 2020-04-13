import React from "react";
import Profile from "../../app/models/profile";
import { Form, Button } from "semantic-ui-react";
import { Form as FinalForm, Field } from "react-final-form";
import TextAreaInput from "../../app/common/form/TextAreaInput";
import TextInput from "../../app/common/form/TextInput";

interface Props {
    setEditMode: (val:boolean)=>void,
  profile: Profile;
  submitting: boolean,
  update: (profile:Profile)=>void
}

const UpdateForm = ({ profile, setEditMode, submitting, update }: Props) => {
  return (
    <FinalForm
    initialValues={profile}
    onSubmit={update}
    render={({handleSubmit, invalid, pristine }) => (
      <Form onSubmit={handleSubmit}>
        <Field
          name="displayName"
          placeholder="Display Name"
          value={profile.displayName}
          component={TextInput}
        />
        <Field
          name="bio"
          rows={6}
          placeholder="Tell us about yourself"
          value={profile.bio}
          component={TextAreaInput}
        />
        <Button
                loading={submitting}
                floated="right"
                positive
                type="submit"
                content="Submit"
                disabled={submitting || invalid || pristine}
              />
              <Button
                onClick={()=>setEditMode(false)}
                floated="right"
                type="button"
                content="Cancel"
                disabled={submitting}
              />
              </Form>)}/>
    ) 
}

export default UpdateForm;
