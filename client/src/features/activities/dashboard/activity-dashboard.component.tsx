import React from 'react'
import { Grid } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import { ActivityList } from './activity-list.component'
import { ActivityDetail } from '../details/activity-detail.component'
import { ActivityForm } from '../form/activity-form.component'

interface Props {
    activities: IActivity[],
    selectActivity: (id: string) => void,
    selectedActivity: IActivity | null,
    editMode: boolean,
    setEditMode: (editMode: boolean) => void,
    setSelectedActivity: (activity: IActivity | null) => void,
    createActivity: (x: IActivity) => void,
    editActivity: (x: IActivity) => void,
    deleteActivity: (id: string) => void
    //test changeset
}

export const ActivityDashboard: React.FC<Props> = ({ activities, selectActivity, selectedActivity, editMode, setEditMode, setSelectedActivity, createActivity, editActivity, deleteActivity }) => {
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList activities={activities}
                    selectActivity={selectActivity}
                    deleteActivity={deleteActivity}
                />
            </Grid.Column>
            <Grid.Column width={6}>
                {selectedActivity && !editMode && <ActivityDetail activity={selectedActivity} setEditMode={setEditMode} setSelectedActivity={setSelectedActivity} />}
                {editMode && <ActivityForm key={selectedActivity === null ? 0 : selectedActivity.id}
                    activity={selectedActivity}
                    setEditMode={setEditMode}
                    createActivity={createActivity}
                    editActivity={editActivity}
                />
                }
            </Grid.Column>
        </Grid>
    )
}

