import axios from "axios";

class TheCoinDesk{
    getItems(id){
        return axios.get(id).then(response=>response.data)
    }

    getMe(){
        return axios.get('sources/_metadata.json').then(response=>response.data)
    }
}
export default TheCoinDesk=new TheCoinDesk()