import Navbar from "../../components/Navbar/Navbar";
import { PageContainer } from "../Home/styles";
import api from "../../services/api";
import { useEffect, useState } from "react";
import { NavbarMenuItem, UserList } from "./style";
import {Item, LineList, List} from "../../styles/style";
import { Container } from "../../styles/style";
import GenericList from "../../components/GenericList/GenericList";
import { IUser, User } from "../../hooks/useAuth";
import { IPaginatedResponse } from "../../Interfaces/IPaginatedResponse";
import { Navigate } from "react-router-dom";
import { FaHeadphones } from "react-icons/fa";
import UserEditPage from "./UserEdit";
import { useNavigate } from "react-router-dom";


const UserListPage = () => {
    //const { data } = await api.get('/user');
    console.log('UserListPage')
    const [ data, setData ] = useState<User[]>();
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await api.get<IPaginatedResponse<User>>('/user');
            console.log("data", data.results);
            setData(data.results);
            setLoading(false);
        }
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        await api.delete(`/user/${id}`);
        const { data } = await api.get('/user');
        setData(data.results);
    }
    const [editingUserId, setEditingUserId] = useState<string | null>(null);

    const handleEdit = (id: string) => {
        // Set the ID of the user being edited in the state
        navigate(`/users/edit/${id}`);
      };

      const handleCreate = () => {
        // Set the ID of the user being edited in the state
        navigate(`/users/create/`);
      };


    return (
      <PageContainer>
        <Navbar />
        <Container>
        <h1>Lista de usuários</h1>
        {loading ? (
            <p>Carregando...</p>
            ) : (
                <GenericList column_names={['Nome', "E-mail", "CPF", "Ações"]} data={data?.map((item) =>{
                    return {
                        id: item.id,
                        items: [item.name, item.email, item.CPF? item.CPF.slice(0,3) + "." + item.CPF.slice(3,6) + "." + item.CPF.slice(6,9) + "-" + item.CPF.slice(9,11) : "Não informado", 
                            <div>
                                <button onClick={() => handleDelete(item.id)}>Excluir</button>
                                <button onClick={() => handleEdit(item.id)}>Editar</button>
                            </div>
                    ]
                    }
                })}/>
            )}
            <button onClick={() => handleCreate()}>Criar</button>

        </Container>
      </PageContainer>
    );
}

//const UserListPage = async () => {
//    const { data } = await api.get('/user');
//    console.log("data",data.results)
//    return (
//      <PageContainer>
//        
//          <h1>Lista de usuários</h1>
//          <ul>
//              {data.results.map((user) => (
//                  <li key={user.id}>{user.name}</li>
//              ))}
//    
//          </ul>
//                
//                
//      </PageContainer>
//    );
//}

export default UserListPage;
