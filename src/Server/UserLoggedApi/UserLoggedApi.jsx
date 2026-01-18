import axios from "axios";

export async function getLoggedUser(){
    try {
        const{data} = await axios.get('https://linked-posts.routemisr.com/users/profile-data', 
            {
                headers:{token:localStorage.getItem("token")}
            })            
        return data;
    } catch (error) {
        return error.response.data
    }
}
