import {createContext, useContext, useEffect, useState} from "react";
import TheCoinDesk from "../services/TheCoinDesk";

const Context=createContext()

export default function HomeProvider({children}){
    const [items, setItems] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [selectedItems,setSelectedItems]=useState([])

    useEffect(() => {
        async function fetchItems() {
            let items = [];
            let attributes = [];
            for (let i = 0; i < 19; i++) {
                const item = await TheCoinDesk.getItems(`sources/${i + 1}.json`);
                items.push(item);
                attributes = attributes.concat(item.attributes);
            }
            const result = {};
            attributes.forEach((item) => {
                if (!result[item.trait_type]) {
                    result[item.trait_type] = { trait_type: item.trait_type, values: [] };
                }
                const existingValue = result[item.trait_type].values.find(
                    (value) => value.value === item.value
                );
                if (existingValue) {
                    existingValue.count++;
                } else {
                    result[item.trait_type].values.push({ value: item.value, count: 1 });
                }
            });
            const output = Object.values(result).map((item) => {
                return { trait_type: item.trait_type, values: item.values };
            });
            setItems(items);
            setSelectedItems(items)
            setAttributes(output);
        }
        fetchItems();
    }, []);


    return (<Context.Provider value={{items,attributes,selectedItems,setSelectedItems}}>
        {children}
    </Context.Provider>)
}

export function useHomeContext(){
    return useContext(Context)
}