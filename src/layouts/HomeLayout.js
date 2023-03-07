import {Box, Button, Checkbox, Grid, Modal, Typography} from "@mui/material";
import NestedList from "../components/NestedList";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import CollapseItem from "../components/CollapseItem";
import CardItem from "../components/CardItem";
import * as React from "react";
import TheCoinDesk from "../services/TheCoinDesk";
import { useHomeContext } from "../contexts/HomeProvider";
import { useEffect, useState } from "react";
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
export default function HomeLayout() {
    const { items, attributes, selectedItems, setSelectedItems,defaultAccount,userBalance,itemSelected,setItemSelected,sendTransaction } =
        useHomeContext();
    const [selectedIndex, setSelectedIndex] = useState({
        open: false,
        index: -1,
    });
    const [selectedFilters, setSelectedFilter] = useState([]);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleSendTransaction=async()=>{
        await sendTransaction()
        handleClose()
    }
    useEffect(() => {
        if (selectedFilters.length !== 0) {
            let filterItems = [...items];
            filterItems = filterItems
                .map((item) => {
                    if (
                        item.attributes.find((attribute) =>
                            selectedFilters.find(
                                (filter) =>
                                    filter.trait_type === attribute.trait_type &&
                                    filter.value === attribute.value
                            )
                        )
                    ) {
                        return item;
                    }
                })
                .filter((item) => item !== undefined);
            setSelectedItems(filterItems);
        }
    }, [selectedFilters]);
    const handleClick = (index) => {
        let selected = {};
        if (!selectedIndex.open) {
            selected = {
                open: true,
                index: index,
            };
        } else if (selectedIndex.open && selectedIndex.index === index) {
            selected = {
                open: false,
                index: index,
            };
        } else if (selectedIndex.open && selectedIndex.index !== index) {
            selected = {
                open: true,
                index: index,
            };
        }
        setSelectedIndex((prev) => ({
            ...prev,
            open: selected.open,
            index: selected.index,
        }));
    };

    const handleFilter = (traitType, value) => {
        //handle filters click
        let filters = [...selectedFilters];
        if (
            filters.find(
                (item) => item.trait_type === traitType && item.value === value
            )
        ) {
            filters = filters.filter(
                (item) => item.trait_type === traitType && item.value !== value
            );
        } else {
            filters.push({ trait_type: traitType, value: value });
        }
        setSelectedFilter(filters);
    };

    const handleFilterByMyItems = async () => {
        let filterItems = [...items];
        const res = await TheCoinDesk.getMe();
        filterItems = res.items
            .map((item) => {
                return filterItems.find((filterItem) => filterItem.edition === item.id);
            })
            .filter((item) => item !== undefined);
        setSelectedItems(filterItems);
        setSelectedFilter([]);
    };

    const handleAFilterAll = () => {
        let filterItems = [...items];
        setSelectedItems(filterItems);
        setSelectedFilter([]);
    };
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={2}>
                <NestedList>
                    <ListItemButton onClick={() => handleAFilterAll()}>
                        <ListItemText primary={"All"} />
                    </ListItemButton>
                    <ListItemButton onClick={() => handleFilterByMyItems()}>
                        <ListItemText primary={"My items"} />
                    </ListItemButton>
                    {attributes.map((attribute, index) => (
                        <CollapseItem
                            name={`${attribute.trait_type} (${attribute.values.length})`}
                            key={index}
                            open={selectedIndex.index === index && selectedIndex.open}
                            handleClick={() => handleClick(index)}
                        >
                            {attribute.values.map((item, index) => (
                                <ListItemButton
                                    sx={{ pl: 4 }}
                                    key={index}
                                    onClick={() => handleFilter(attribute.trait_type, item.value)}
                                >
                                    <ListItemText primary={`${item.value} (${item.count})`} />
                                    <Checkbox
                                        edge="start"
                                        checked={
                                            selectedFilters.find(
                                                (filter) =>
                                                    filter.trait_type === attribute.trait_type &&
                                                    filter.value === item.value
                                            )
                                                ? true
                                                : false
                                        }
                                        tabIndex={-1}
                                        disableRipple
                                        onClick={() =>
                                            handleFilter(attribute.trait_type, item.value)
                                        }
                                    />
                                </ListItemButton>
                            ))}
                        </CollapseItem>
                    ))}
                </NestedList>
            </Grid>
            <Grid item xs={12} sm={10}>
                <Grid container spacing={2}>
                    {selectedItems.map((item, index) => (
                        <Grid item xs={6} sm={3} key={index}>
                            <CardItem
                                image={`sources${item.image}`}
                                name={item.name}
                                description={item.description}
                                date={item.date}
                                price={item.price}
                                onClick={()=>{setOpen(true)
                                setItemSelected(item)}}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Địa chỉ {defaultAccount}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Số dư {userBalance} TBNB
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Thanh toán {itemSelected.price} TBNB
                    </Typography>
                    <Button onClick={()=>
                        handleSendTransaction()
                    }>Chuyển</Button>
                </Box>
            </Modal>
        </Grid>
    );
}
