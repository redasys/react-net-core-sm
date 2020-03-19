import React, { useState, FormEvent } from 'react'
import { Form, Segment, Button } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import {v4 as uuid} from 'uuid'


interface Props {
    activity: IActivity | null,
    setEditMode: (editMode: boolean) => void,
    createActivity: (x: IActivity) => void,
    editActivity: (x: IActivity) => void
}

export const ActivityForm: React.FC<Props> = ({ activity: initialActivity, setEditMode, createActivity, editActivity }) => {
    const init = () => {
        if (initialActivity) return initialActivity;
        return {
            id: '',
            title: '',
            category: '',
            description: '',
            date: '',
            city: '',
            venue: ''
        };
    }

    const [activity, setActivity] = useState<IActivity>(init);

    const handleSubmit=()=>{
        if(activity.id.length){
            editActivity(activity);
            return;
        }
        let newActivity = {
            ...activity,
            id: uuid()
        }
        createActivity(newActivity);
        
    }

    const handleInputChange = (event: FormEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        const { name, value } = event.currentTarget;
        setActivity({ ...activity, [name]: value });
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input onChange={handleInputChange} name='title' placeholder='Title' value={activity.title}></Form.Input>
                <Form.TextArea onChange={handleInputChange} name='description' rows={2} placeholder='Description' value={activity.description}></Form.TextArea>
                <Form.Input onChange={handleInputChange} name='category' placeholder='Category' value={activity.category}></Form.Input>
                <Form.Input onChange={handleInputChange} name='date' type='datetime-local' placeholder='Date' value={activity.date}></Form.Input>
                <Form.Input onChange={handleInputChange} name='city' placeholder='City' value={activity.city}></Form.Input>
                <Form.Input onChange={handleInputChange} name='venue' placeholder='Venue' value={activity.venue}></Form.Input>
                <Button floated='right' positive type='submit' content='Submit' />
                <Button onClick={() => setEditMode(false)} floated='right' type='button' content='Cancel' />
            </Form>
        </Segment>
    )
}
