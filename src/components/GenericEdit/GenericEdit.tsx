import { useEffect, useState } from "react";
import {

} from "./styles";
import api from "../../services/api";




interface Props {
  column_names?: string[];
  // data: IData[];
  object: any;
  route: string;
}
// interface IData {
  // items: JSX.Element[];
// }
function GenericEdit({
  //column_names,
  object = {},
  route,
}: Props) {
  const [keys, setKeys] = useState<string[]>();
  const [updatedObject, setUpdatedObject] = useState<any>({} as any);

  useEffect(() => {
    setKeys(Object.keys(object));
    setUpdatedObject(object);
  }, [object]);
  
  const handleUpdate = async () => {
    const {
      data: any,
    } = await api.put<any>(route, updatedObject);
    setUpdatedObject(any);
  }

  const handleInputChange = (key: string, value: string) => {
    setUpdatedObject({
      ...updatedObject,
      [key]: value,
    });
    
  };


  return (
    <div>
      {
        keys?.map((key) => {
          return (
            <div>
              <label>{key}</label>
              <input type="text" value={updatedObject?.[key]}
                onChange={(e) => {
                  handleInputChange(key, e.target.value);
                }}
              />
            </div>
          )
        })
      }
      <button onClick={handleUpdate}>Atualizar</button>
      

    </div>
  );
}

export default GenericEdit;
