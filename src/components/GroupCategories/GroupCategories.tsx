
import { useEffect, useRef, useState } from "react";
import { IPaginatedResponse } from "../../Interfaces/IPaginatedResponse";
import api from "../../services/api";
import { IGroupDTO } from "../../pages/Dashboard/dto/DashboardDTO";
import { GenericListCell } from "../GenericList/styles";

interface Props {
    selectedGroups: IGroupDTO[];
}


export const GroupCategories = ({ 
    selectedGroups
}: Props) => {
    const [ categories, setCategories ] = useState<string[]>();

    useEffect(() => {
        const fetchData = async () => {
            const { data: categories } = await api.get<IPaginatedResponse<any>>('product/categories/');
              //+'?division_split=12&start_date=2023-01-01T00:00:00.000Z&end_date=2023-12-01T00:00:00.000Z&categories[]=prata&categories[]=ouro');
            setCategories(categories.results.map((item) => item.name));
        }
        fetchData();
      }, []);

  return (
    <div>
        {
            selectedGroups.map((group) => {
                return (
                    <GenericListCell>
                        
                            {group.name}

                    <GenericListCell/>
                )
            })
        }
    </div>
  );
};