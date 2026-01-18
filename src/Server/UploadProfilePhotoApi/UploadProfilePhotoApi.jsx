import axios from "axios";
export async function uploadProfilePhoto(formData){
    try {
        let {data} = await  axios.put(`https://linked-posts.routemisr.com/users/upload-photo`,formData,
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