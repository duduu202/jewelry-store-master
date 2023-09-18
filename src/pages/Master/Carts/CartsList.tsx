
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IPaginatedResponse } from "../../../Interfaces/IPaginatedResponse";
import api from "../../../services/api";
import { PageContainer } from "../../Home/styles";
import Navbar from "../../../components/Navbar/Navbar";
import { Container } from "../../../styles/style";
import GenericList from "../../../components/GenericList/GenericList";
import { User } from "../../../hooks/useAuth";
import { Modal } from "../../../components/Modal/Modal";
import { ModalContent } from "../../../components/Modal/styles";
import handleError from "../../../utils/message";
import UserEditor from "../User/UserEditor";
import { ICartDTO } from "./dto/CartDTO";
import { ButtonComponent } from "../../../components/Button/styles";
import ListEditor from "../../../components/GenericEditor/ListEditor";


const route = '/cart';

const CartsListPage = () => {
    //const { data } = await api.get('/user');
    console.log('CartsListPage')
    const [ data, setData ] = useState<ICartDTO[]>();
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await api.get<IPaginatedResponse<ICartDTO>>(route);
            console.log("data", data.results);
            setData(data.results);
            setLoading(false);
        }
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        await api.delete(route + `/${id}`);
        const { data } = await api.get(route);
        setData(data.results);
    }

    const handleSave = async (user: ICartDTO) => {
        const { id, role, created_at, updated_at, address, ...rest } = user;
        try{
            if(user.id){
                await api.put(route + `/${user.id}`, rest);
            }
            else{
                await api.post(route, rest);
            }
        } catch (error) {
            handleError(error);
        }
        
        const { data } = await api.get(route);
        setData(data.results);
        setIsOpenModal(false);
    }


    const [editingUserId, setEditingUserId] = useState<string | undefined>(undefined);
    const [ isOpenModal, setIsOpenModal ] = useState(false);

    const handleEdit = (id: string) => {
        // Set the ID of the user being edited in the state
        //navigate(`/users/edit/${id}`);
        setEditingUserId(id);
        setIsOpenModal(true);
      };

      const handleCreate = () => {
        // Set the ID of the user being edited in the state
        //navigate(`/users/create/`);
        setEditingUserId(undefined);
        setIsOpenModal(true);
      };


    return (
      <PageContainer>
        <Navbar />
        <Container>
        <h1>Pedidos</h1>
        <h1>Produtos</h1>
            <ListEditor route={route} objectKeys={{
                status: 'Status',
                total_price: 'Valor Total',
            }} ></ListEditor>
        {/* {loading ? (
            <p>Carregando...</p>
            ) : (
                <div>
                    <GenericList column_names={['Status', "Valor Total","Ações"]} data={data?.map((item) =>{
                        return {
                            id: item.id,
                            items: [item.status, item.total_price,
                                <div>
                                    <ButtonComponent onClick={() => handleDelete(item.id)}>Excluir</ButtonComponent>
                                    <ButtonComponent onClick={() => handleEdit(item.id)}>Editar</ButtonComponent>
                                </div>

                        ]
                        }
                    })}/>
                    <Modal isOpen={isOpenModal} setIsOpen={setIsOpenModal}>
                        <ModalContent>
                            <UserEditor handleSave={handleSave} id={editingUserId}/>
                        </ModalContent>
                    </Modal>
                    <ButtonComponent onClick={() => handleCreate()}>Criar</ButtonComponent>
                </div>
            )} */}

        </Container>
      </PageContainer>
    );
}

//const CartsListPage = async () => {
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

export default CartsListPage;
