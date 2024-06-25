import instance, { instanceTest } from "../api/axios";
import { Iuser } from "../common/types/user.interface";
class UserService {
    async index(){
        return await instance.get('/users');
    }
    async create(data : Iuser){
        return await instance.post('/users', data);
    }
    async findOneId(id : number){
        return await instance.get(`/users/${id}`);
    }
    async update(id : number, data : Iuser){
        return await instance.put(`/users/${id}`, data);
    }
    async delete(id : number){
        return await instance.delete(`/users/${id}`);
    }
}

export const profileService = async (payload: string) => {
    return await instanceTest.get('/user/profile', {
        headers: {
            'Authorization': `Bearer ${payload}`
        }
    });
}


export default new UserService();