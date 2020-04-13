import React, { Fragment, useContext, useEffect } from "react";
import { Segment, Header, Form, Button, Comment } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../../app/stores/rootStore";
import { Form as FinalForm, Field } from "react-final-form";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import { formatDistance } from "date-fns";
import { parseISO } from "date-fns/esm";

const ActivityDetailedChat = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    activity,
    createHubConnection,
    closeHubConnection,
    addComment,
  } = rootStore.activityStore;

  useEffect(() => {
    createHubConnection(activity!.id);

    return () => {
      closeHubConnection();
    };
  }, [createHubConnection, closeHubConnection, activity]);
  return (
    <Fragment>
      <Segment
        textAlign="center"
        attached="top"
        inverted
        color="teal"
        style={{ border: "none" }}
      >
        <Header>Chat about this event</Header>
      </Segment>
      <Segment attached>
        <Comment.Group>
          {activity &&
            activity.comments.map((x) => (
              <Comment key={x.id}>
                <Comment.Avatar src={x.image || "/assets/user.png"} />
                <Comment.Content>
                  <Comment.Author as="a">{x.userName}</Comment.Author>
                  <Comment.Metadata>
                    <div>{formatDistance(parseISO(x.createdDt.toString()), new Date())}</div>
                  </Comment.Metadata>
                  <Comment.Text>{x.body}</Comment.Text>                  
                </Comment.Content>
              </Comment>
            ))}
          <FinalForm
            onSubmit={addComment}
            render={({ handleSubmit, submitting, form }) => (
              <Form onSubmit={() => handleSubmit()!.then(() => form.reset())}>
                <Field
                  name="body"
                  component={TextAreaInput}
                  rows={6}
                  placeholder="Add your comment"
                />
                <Button
                  content="Add Reply"
                  labelPosition="left"
                  icon="edit"
                  primary
                  loading={submitting}
                />
              </Form>
            )}
          />
        </Comment.Group>
      </Segment>
    </Fragment>
  );
};

export default observer(ActivityDetailedChat);
