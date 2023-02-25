import HomeProvider from "../contexts/HomeProvider";
import HomeLayout from "../layouts/HomeLayout";
import React from "react";
import {ROUTE_HOME} from "../constants/route";

export function routes(){
    return [
        {
            path: ROUTE_HOME,
            element:<HomeProvider><HomeLayout/></HomeProvider>,
        }
]
}