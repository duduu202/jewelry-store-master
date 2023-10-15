
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
import handleError, { handleSuccess } from "../../../utils/message";
import UserEditor from "../User/UserEditor";
import { Cart_status, ICartDTO } from "./dto/CartDTO";
import { ButtonComponent } from "../../../components/Button/styles";
import ListEditor from "../../../components/GenericEditor/ListEditor";
import isIsoDate from "../../../utils/checkIsoDate";


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

    const handlePatchSave = async (cart: ICartDTO) => {
        try{
            if(cart.id){
                await api.patch(route + `/${cart.id}`, {
                    status: cart.status
                });
            }
        }
        catch (error) {
            handleError(error);
        }

        handleSuccess("Status do pedido atualizado com sucesso!");

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
        <GenericList
                column_names={["Items", "Status", "Valor Total", "Data"]}
                data={data?.map((item) => {
                  return {
                    id: item.id,
                    // items: [item.name, item.stock, item.image ? <img src={item.image} alt="imagem" width="100px" height="100px"/> : <></>, item.price ? item.price : <></>,
                    items: [
                      item.cart_items
                        ?.map((itm) => itm.product.name)
                        .join(", ") || "",
                        // cart.status, select with default value of cart.status, the options are Cart_status enum
                        <select name="status" id="status" defaultValue={item.status} onChange={(e) => {
                            const cart = item;
                            cart.status = e.target.value as Cart_status;
                            handlePatchSave(cart);
                        }
                        }>
                            {getOptions(item.status as Cart_status)}
                        </select>,
 
                      item.total_price,
                      isIsoDate(item.updated_at)
                        ? new Date(item.updated_at).toLocaleDateString()
                        : "",
                    ],
                  };
                })}
              />
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

function getOptions(status: Cart_status){
    if(status == Cart_status.APROVADA){
        return (
            <>
                <option value={Cart_status.EM_TRANSITO}>{formatStatus(Cart_status.EM_TRANSITO)}</option>
            </>
        )
    }
    if(status == Cart_status.EM_TRANSITO){
        return (
            <>
                <option value={Cart_status.ENTREGUE}>{formatStatus(Cart_status.ENTREGUE)}</option>
                <option value={Cart_status.APROVADA}>{formatStatus(Cart_status.APROVADA)}</option>
            </>
            
        )
    }
    if(status == Cart_status.ENTREGUE){
        return (
            <>
                <option value={Cart_status.EM_TRANSITO}>{formatStatus(Cart_status.EM_TRANSITO)}</option>
            </>
        )
    }
    if(status == Cart_status.EM_TROCA){
        return (
            <>
                <option value={Cart_status.TROCA_AUTORIZADA}>{formatStatus(Cart_status.TROCA_AUTORIZADA)}</option>
            </>
        )
    }
    if(status == Cart_status.EM_PROCESSAMENTO){
        return (
            <>
                <option value={Cart_status.EM_PROCESSAMENTO}>{formatStatus(Cart_status.EM_PROCESSAMENTO)}</option>
            </>
        )
    }

    return (
        <>
            <option value={status}>{formatStatus(status)}</option>
        </>
    )
}

function formatStatus(status: Cart_status){
    if(status == Cart_status.APROVADA){
        return "Aprovada"
    }
    if(status == Cart_status.EM_PROCESSAMENTO){
        return "Em processamento"
    }
    if(status == Cart_status.EM_TRANSITO){
        return "Em trânsito"
    }
    if(status == Cart_status.EM_TROCA){
        return "Em troca"
    }
    if(status == Cart_status.ENTREGUE){
        return "Entregue"
    }
    if(status == Cart_status.REPROVADA){
        return "Reprovada"
    }
    if(status == Cart_status.TROCA_AUTORIZADA){
        return "Trocado"
    }
    return status;
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
