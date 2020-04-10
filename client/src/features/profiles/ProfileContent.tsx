import React from 'react'
import { Tab } from 'semantic-ui-react'
import ProfilePhotos from './profilePhotos'

const panes = [
    {menuItem:'About', render:()=><Tab.Pane>About </Tab.Pane>},
    {menuItem:'Photos', render:()=><Tab.Pane><ProfilePhotos /></Tab.Pane>},
    {menuItem:'Activities', render:()=><Tab.Pane>Activity content </Tab.Pane>},
    {menuItem:'Followers', render:()=><Tab.Pane>Followers Content </Tab.Pane>},
    {menuItem:'Following', render:()=><Tab.Pane>Following content </Tab.Pane>}
]

const ProfileContent = () => {
    return (
        <Tab 
        menu={{fluid: true, vertical: true}}
        menuPosition='right'
        panes={panes}
        activeIndex={1} />
    )

}


export default ProfileContent
