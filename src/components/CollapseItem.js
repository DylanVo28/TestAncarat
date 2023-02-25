import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Collapse, List } from "@mui/material";
import * as React from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

export default function CollapseItem({ name, children, open, handleClick }) {
    return (
        <>
            <ListItemButton onClick={handleClick}>
                <ListItemText primary={name} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {children}
                </List>
            </Collapse>
        </>
    );
}
