import {createContext, useContext, useEffect, useState} from "react";
import TheCoinDesk from "../services/TheCoinDesk";
import {ethers} from "ethers";

const Context=createContext()
const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/')
const account =new ethers.BrowserProvider(window.ethereum)
export default function HomeProvider({children}){
    const [items, setItems] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [selectedItems,setSelectedItems]=useState([])
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [userBalance, setUserBalance] = useState(null);
    const [itemSelected,setItemSelected]=useState({})

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
        connectWalletHandler()
    }, []);

    const getuserBalance = async (address) => {
        const balance = await provider.getBalance(address, "latest")
    }
    const accountChangedHandler = async (newAccount) => {
        // const address = await newAccount._getAddress();
        setDefaultAccount(newAccount.address);
        const balance = await provider.getBalance(newAccount.getAddress())
        setUserBalance(ethers.formatUnits(balance));
        // await getuserBalance(address)
    }
    const connectWalletHandler =() => {
        if (window.ethereum) {
            provider.send("eth_chainId", []).then(async () => {
                await accountChangedHandler(await account.getSigner());
            })
        } else {
            setErrorMessage("Please Install Metamask!!!");
        }
    }

    const sendTransaction=async ()=>{
        const tx = (await account.getSigner()).sendTransaction({
            to: '0xad44FdeC24d7E2f6F45261c2Fd66Fd69e56C0ACB',
            value: ethers.parseUnits(''+itemSelected.price),
        })
    }

    return (<Context.Provider value={{items,attributes,selectedItems,setSelectedItems,connectWalletHandler,defaultAccount,userBalance,itemSelected,setItemSelected,sendTransaction}}>
        {children}
    </Context.Provider>)
}

export function useHomeContext(){
    return useContext(Context)
}