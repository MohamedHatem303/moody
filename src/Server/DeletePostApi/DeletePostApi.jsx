import axios from "axios";
export async function deleteMyPost( id ){
    try {
        let {data} = await  axios.delete(`https://linked-posts.routemisr.com/posts/${id}` ,
            {
                headers:{
                    token:localStorage.getItem("token")
                }
            }
        )
        return data;
    } catch (error) {
        return error;
    }
}