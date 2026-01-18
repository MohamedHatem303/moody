import axios from "axios";
export async function deleteMyComment( id ){
    try {
        let {data} = await  axios.delete(`https://linked-posts.routemisr.com/comments/${id}`,
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