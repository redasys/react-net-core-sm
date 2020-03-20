import React, { SyntheticEvent } from "react";
import { Item, Button, Label, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";

interface Props {
  activities: IActivity[];
  selectActivity: (id: string) => void;
  deleteActivity: (event: SyntheticEvent<HTMLButtonElement>, id: string) => void;
  submitting: string;
}

export const ActivityList: React.FC<Props> = ({
  activities,
  selectActivity,
  deleteActivity,
  submitting
}) => {
  return (
    <Segment clearing>
      <Item.Group divided>
        {activities.map(
          ({ id, title, date, description, city, venue, category }) => (
            <Item key={id}>
              <Item.Content>
                <Item.Header as="a">{title}</Item.Header>
                <Item.Meta>{date}</Item.Meta>
                <Item.Description>
                  <div>{description}</div>
                  <div>
                    {city}, {venue}
                  </div>
                </Item.Description>
                <Item.Extra>
                  <Button
                    floated="right"
                    content="View"
                    color="blue"
                    onClick={() => selectActivity(id)}
                  />
                  <Button
                    name={id}
                    loading={submitting===id}
                    floated="right"
                    content="Delete"
                    color="red"
                    onClick={(e) => deleteActivity(e, id)}
                  />
                  <Label basic content={category} />
                </Item.Extra>
              </Item.Content>
            </Item>
          )
        )}
      </Item.Group>
    </Segment>
  );
};
