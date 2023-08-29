import Navbar from "../../components/Navbar/Navbar";
import { PageContainer } from "../Home/styles";
import api from "../../services/api";
import { useEffect, useState } from "react";
import { UserList } from "./style";
import {Item, LineList, List} from "../../styles/style";
import { Container } from "../../styles/style";
import GenericList from "../../components/GenericList/GenericList";
import { Address, IUser, User } from "../../hooks/useAuth";
import { IPaginatedResponse } from "../../Interfaces/IPaginatedResponse";
import { Navigate, useParams } from "react-router-dom";
import GenericCreate from "../../components/GenericCreate/GenericCreate";


const UserCreatePage = () => {
    //const { data } = await api.get('/user');
    //console.log("data",data.results)
    const [ userData, setUserData ] = useState<User>();
    const [ addresses, setAddresses ] = useState<Address>()
    
    const [ loading, setLoading ] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            const { data: userData } = await api.get<User>('/user/'+id);
            console.log("userData", userData);
            setUserData(userData);

            // const { data: addressData } = await api.get<IPaginatedResponse<Address>>('/address/?page=1&limit=10');
            // console.log("addressData", addressData);
            if(userData?.address){
                setAddresses(userData?.address[0]);
            }

            setLoading(false);
        }
        fetchData();
    }, []);



    return (
      <PageContainer>
        <Navbar />
        <Container>
        <h2>Editar</h2>
        <h3>Usuário</h3>
        {/* <GenericCreate column_names={['nome']} data={} /> */}
        <GenericCreate object={{
            name: userData?.name,
            email: userData?.email,
            CPF: userData?.CPF,
            phone: userData?.phone,
        }} route={'/user/'+id} />
        {/* <h3>Endereço</h3> */}
        {/* <GenericCreate object={{
            street: addresses?.street,
            number: addresses?.number,
            district: addresses?.district,
            city: addresses?.city,
            state: addresses?.state,
            zip_code: addresses?.zip_code,
        }} route={'/address/'+addresses?.id} /> */}

        </Container>
      </PageContainer>
    );
}

/*
        {
                        keys?.map((key) => {
                            return (
                                <div>
                                    <label>{key}</label>
                                    <input type="text" value={data?.[key]} />
                                </div>
                            )
                        })
        }
*/

export default UserCreatePage;
