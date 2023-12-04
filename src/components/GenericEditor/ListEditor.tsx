
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { IPaginatedResponse } from "../../Interfaces/IPaginatedResponse";
import handleError from "../../utils/message";
import { PageContainer } from "../../pages/Home/styles";
import Navbar from "../Navbar/Navbar";
import { Container } from "../Input/styles";
import GenericList from "../GenericList/GenericList";
import { ButtonComponent } from "../Button/styles";
import { Modal } from "../Modal/Modal";
import { ModalContent } from "../Modal/styles";
import Editor from "./Editor";
import { LoadingAnimation } from "../../styles/style";
import { AiOutlineLoading3Quarters } from "react-icons/ai";


interface IProps {
    route: string;
    /**
     * Object keys to be displayed on the editor
     * 
     * @example
     * objectKeys: {
     * name: 'Nome',
     * stock: 'Estoque',
     * price: 'Preço',
     * description: 'Descrição'
     * }
     */
    objectKeys: {
      [key: string]: any;
    }
}

const ListEditor = (props: IProps) => {
    //const { data } = await api.get('/object');
    const { route } = props;

    const [ data, setData ] = useState<any[]>();
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        
        const fetchData = async () => {
            const { data } = await api.get<IPaginatedResponse<any>>(route);
            console.log("data", data.results);
            setData(data.results);
            setLoading(false);
            setIsOpenModal(false);
        }
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        await api.delete(route + `/${id}`);
        const { data } = await api.get(route);
        setData(data.results);
    }

    const handleSave = async (object: any) => {
        const formData = new FormData();
      
        // Adicione os parâmetros do objeto (exceto a imagem e categories) ao formData
        for (const key in props.objectKeys) {
          if(key === 'image'){
            continue;
          }
          if (Object.prototype.hasOwnProperty.call(props.objectKeys, key)) {
            formData.append(key, object[key]);
          }
          // categories
          if (key === 'categories') {
            object.categories.forEach((category: string) => {
              formData.append('categories', category);
            });
          }

        }
      
        // Adicione a imagem ao formData
        //formData.append('image', object.image);
      
        try {
          if (object.id) {
            // Se o objeto já possui um ID, é uma atualização (método PUT)
            await api.put(route + `/${object.id}`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
          } else {
            // Se não possui ID, é uma criação (método POST)
            await api.post(route, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
          }
        } catch (error) {
          handleError(error);
        }
      
        // Atualize os dados e feche o modal como antes
        const { data } = await api.get(route);
        setData(data.results);
        setIsOpenModal(false);
      };


    const [editingUserId, setEditingUserId] = useState<string | undefined>(undefined);
    const [ isOpenModal, setIsOpenModal ] = useState(false);

    const handleEdit = (id: string) => {
        // Set the ID of the object being edited in the state
        //navigate(`/objects/edit/${id}`);
        setEditingUserId(id);
        setIsOpenModal(true);
      };

      const handleCreate = () => {
        // Set the ID of the object being edited in the state
        //navigate(`/objects/create/`);
        setEditingUserId(undefined);
        setIsOpenModal(true);
      };


    return (
        <div>
        {loading ? (
              <LoadingAnimation>
                <AiOutlineLoading3Quarters/>
              </LoadingAnimation>
            ) : (
                <div>
                    {/* <GenericList column_names={['Nome', "Estoque", "Imagem", "Preço" ,"Ações"]} data={data?.map((item) =>{ */}
                    <GenericList column_names={Object.values(props.objectKeys).concat("Ações")} data={data?.map((item) =>{
                        return {
                            id: item.id,
                            //items: [item.name, item.stock, item.image ? <img src={item.image} alt="imagem" width="100px" height="100px"/> : <></>, item.price ? item.price : <></>,
                            items: Object.keys(props.objectKeys).map(key => {
                                if(key === 'image'){
                                    return item.image ? <img src={item.image} alt="imagem" width="100px" height="100px"/> : <></>
                                }
                                if(key === 'categories'){
                                  console.log("keykeykeykey", key);
                                    return item.categories.map((category: any) => {
                                        return category.name;
                                    }).join(", ");
                                }
                                else{
                                    return item[key];
                                }
                            }
                            ).concat(
                                <div>
                                    <ButtonComponent onClick={() => handleDelete(item.id)}>Excluir</ButtonComponent>
                                    <ButtonComponent onClick={() => handleEdit(item.id)}>Editar</ButtonComponent>
                                </div>
                            )
                        
                        }
                    })}/>
                    <Modal isOpen={isOpenModal} setIsOpen={setIsOpenModal}>
                        <ModalContent>
                            <Editor handleSave={handleSave} id={editingUserId} route={route} objectKeys={props.objectKeys}/>
                        </ModalContent>
                    </Modal>

                    <ButtonComponent onClick={() => handleCreate()}>Criar</ButtonComponent>
                </div>
            )}

        </div>
    );
}

//const ListPage = async () => {
//    const { data } = await api.get('/object');
//    console.log("data",data.results)
//    return (
//      <PageContainer>
//        
//          <h1>Lista de usuários</h1>
//          <ul>
//              {data.results.map((object) => (
//                  <li key={object.id}>{object.name}</li>
//              ))}
//    
//          </ul>
//                
//                
//      </PageContainer>
//    );
//}

export default ListEditor;
