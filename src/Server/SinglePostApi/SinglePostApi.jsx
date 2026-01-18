import axios from "axios";
export async function getSinglePost(id){
    try {
        let {data} = await  axios.get(`https://linked-posts.routemisr.com/posts/${id}`,{
            headers:{
                token:localStorage.getItem("token")
            }
        })
        return data;
    } catch (error) {
        return error;
    }
}