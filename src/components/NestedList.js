import * as React from 'react';
import List from '@mui/material/List';


export default function NestedList({children}) {
    return (
        <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="nested-list-subheader"

        >
            {children}
        </List>
    );
}