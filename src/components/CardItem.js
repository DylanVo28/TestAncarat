import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import "./CardItem.sass";
export default function CardItem({ name, description, image, date, price, onClick }) {
    const stDate = new Date(date);
    const formattedDate = `${stDate.getDate()}/${
        stDate.getMonth() + 1
    }/${stDate.getFullYear()}`;

    return (
        <Card sx={{ maxWidth: 345 }} className={"card-item"} onClick={onClick}>
            <Box className={"card-item__media"}>
                <CardMedia component="img" height="300" image={image} alt={name} />
            </Box>

            <CardContent>
                <Typography variant="h6">{name}</Typography>
                <Typography component={"strong"} variant="h6">
                    {description}
                </Typography>
                <Box>
                    <Typography component={"span"}>{formattedDate}</Typography>
                </Box>
                <Typography component={"strong"} variant="h6">
                    {price} TBNB
                </Typography>

            </CardContent>
        </Card>
    );
}
