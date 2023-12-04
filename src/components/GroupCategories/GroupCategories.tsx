
import { useEffect, useRef, useState } from "react";
import { IPaginatedResponse } from "../../Interfaces/IPaginatedResponse";
import api from "../../services/api";
import { IGroupDTO } from "../../pages/Dashboard/dto/DashboardDTO";
import { GroupCell, GroupContainer } from "./styles";
import { ButtonComponent, PlusButtonComponent } from "../Button/styles";
import { Modal } from "../Modal/Modal";
import { ModalContent, ModalContent2 } from "../Modal/styles";
import { Input } from "../Input/Input";

import { FaHeadphones, FaChartPie, FaPlug, FaBook, FaUserAlt, FaSitemap, FaShoppingBag, FaTimes  } from "react-icons/fa";
import { IoAccessibilityOutline  } from "react-icons/io5";
import { ImArrowLeft2, ImBoxRemove, ImCancelCircle } from "react-icons/im";
import { ImArrowRight2 } from "react-icons/im";
import { SelectComponent } from "../Select/styles";
import { Container } from "../Input/styles";

interface Props {
    selectedGroups: IGroupDTO[];
    onSaved?: (groups: IGroupDTO[]) => void;
    onlyDisplayOneGroup?: boolean;
}


export const GroupCategories = ({ 
    selectedGroups,
    onSaved,
    onlyDisplayOneGroup,
}: Props) => {
    const [ categories, setCategories ] = useState<string[]>([]);
    const [ groups, setGroups ] = useState<IGroupDTO[]>([]);
    const [ isOpenModal, setIsOpenModal ] = useState(false);
    const [ newGroup, setNewGroup ] = useState<IGroupDTO>({
        categories: []
    });


    useEffect(() => {
        setGroups(selectedGroups);
        const fetchData = async () => {
            const { data: categories } = await api.get<IPaginatedResponse<any>>('product/categories/');
              //+'?division_split=12&start_date=2023-01-01T00:00:00.000Z&end_date=2023-12-01T00:00:00.000Z&categories[]=prata&categories[]=ouro');
            setCategories(categories.results.map((item) => item.name));
        }
        fetchData();
      }, []);


    const AddCategoryToNewGroup = (category: string) => {
        setNewGroup({
            categories: [...newGroup.categories, category]
        });
    }

    const RemoveCategoryFromNewGroup = (category: string) => {
        setNewGroup({
            categories: newGroup.categories.filter((item) => item !== category)
        });
    }

    const HandleRemoveGroup = (group: IGroupDTO) => {
        const updatedGroups = groups.filter((item) => item !== group);
        setGroups(updatedGroups? updatedGroups : []);
        selectedGroups = updatedGroups;
        onSaved?.(updatedGroups? updatedGroups : []);
    }

    const HandleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>, category: string) => {
        console.log('HandleChange', category, event.target.value, event.target);
        const position = event.target.id;
        const newCategory = event.target.value;
        // const updatedCategories = newGroup.categories.map(cat =>
        //    cat === category ? event.target.value : cat
        // );
        const updatedCategories = newGroup.categories.map((cat, index) => {
            if(index === Number(position)){
                return newCategory;
            }
            return cat;
        });

        if(Number(position) > newGroup.categories.length){
            updatedCategories.push(newCategory);
        }

        newGroup.categories = updatedCategories;
        setNewGroup({
           categories: updatedCategories,
        });
        console.log("result: ", newGroup, updatedCategories);
     };



    const HandleSave = async () => {
        console.log("ANTESDETUDO ",newGroup)
        newGroup.categories = newGroup.categories.filter((item) => item !== "");
        console.log('HandleSave', newGroup, !newGroup, newGroup.categories?.length === 0);
        if(!newGroup || newGroup.categories?.length === 0){
            newGroup.categories = [categories[0]];
            setNewGroup(newGroup)
        }
        setGroups([...groups, newGroup]);
        selectedGroups.push(newGroup);
        setIsOpenModal(false);
        setNewGroup({
            categories: []
        });
        onSaved?.(selectedGroups);
    }

  return (
    <div>
        <GroupContainer>
            {
                groups?.map((group) => {
                    return (
                        <GroupCell>
                            <GroupContainer>
                                {group.categories.join(', ')}
                                <PlusButtonComponent width="25px" height="100%" onClick={() => {
                                    HandleRemoveGroup(group);
                                }
                                }>
                                    <FaTimes />
                                </PlusButtonComponent>
                            </GroupContainer>
                        </GroupCell>
                    )
                }).concat(
                    <div>
                        {
                            onlyDisplayOneGroup ? 
                            <div>
                                {
                                    groups.length === 0 ?
                                    <GroupCell>
                                        <PlusButtonComponent width="50px" height="30px" onClick={() => {
                                            setIsOpenModal(true);
                                        }}><span>+</span></PlusButtonComponent>
                                    </GroupCell> : <></>
                                }
                            </div> : 
                            <GroupCell>
                                <PlusButtonComponent width="50px" height="30px" onClick={() => {
                                    setIsOpenModal(true);
                                }}>
                                    <span>+</span>
                                </PlusButtonComponent>
                            </GroupCell>
                        }
                    </div>
                )
            }
        </GroupContainer>
        <Modal isOpen={isOpenModal} setIsOpen={setIsOpenModal}>
                <h4>
                    Novo Grupo de Categorias
                </h4>
            <ModalContent2>
                {
                    newGroup?.categories?.map((category, index) => {
                        return (
                            <Container>
                                {/* <Input type="text" label={category} iconName={category} placeholder={category} value={category? category : ''} onChange={(e) => HandleChange(e, category)} /> */}
                                <div style={{width: '100%', height: '100%'}}
                                >
                                    <SelectComponent name="status" id={String(index)} defaultValue={categories[0]} onChange={(e) => {
                                        HandleChange(e, category);
                                    }
                                    }>
                                        {
                                            categories?.map((category) => {
                                                return (
                                                    <option value={category} 
                                                    >{category}</option>
                                                )
                                            })
                                        }
                                    </SelectComponent>
                                </div>
                                <PlusButtonComponent width="15%" height="100%"
                                onClick={() => {
                                    RemoveCategoryFromNewGroup(category);
                                }
                                }>
                                    <FaTimes />
                                </PlusButtonComponent>

                            </Container>
                        )
                    })
                
                }
                    <GroupContainer>
                        <PlusButtonComponent width="100%"  
                        onClick={() => {
                            AddCategoryToNewGroup("");
                            if(newGroup.categories.length === 0){
                                setNewGroup({
                                    categories: [categories[0]]
                                });
                            }
                        }}><span>+</span></PlusButtonComponent>
                    </GroupContainer>
                    <GroupContainer>
                    <ButtonComponent width="100%"  
                    onClick={() => {
                        HandleSave();
                    }}><span>Salvar</span></ButtonComponent>
                    </GroupContainer>
            </ModalContent2>
            
        </Modal>
    </div>
  );
};