import axios from "axios";
export async function createMyPost(formData){
    try {
        let {data} = await  axios.post(`https://linked-posts.routemisr.com/posts`,formData,
        {
            headers:{
                token:localStorage.getItem("token")
            }
        })
        return data;
    } catch (error) {
        return error;
    }
}