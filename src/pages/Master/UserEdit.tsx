import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { PageContainer } from "../Home/styles";
import { Container } from "../../styles/style";
import GenericEdit from "../../components/GenericEdit/GenericEdit";
import { Address, User } from "../../hooks/useAuth";

const UserEditPage = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState<User>();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Address | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: userData } = await api.get<User>('/user/' + id);
        setUserData(userData);

        if (userData?.address) {
          setAddresses(userData?.address);
        }

        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddAddress = () => {
    setAddingAddress(true);
    setNewAddress({
      street: "",
      number: "",
      district: "",
      city: "",
      state: "",
      zip_code: "",
    });
  };

  const handleAddressCreate = () => {
    if (newAddress) {
      // Adicione o novo endereço à lista de endereços
      setAddresses([...addresses, newAddress]);
      setNewAddress(null);
      setAddingAddress(false);
    }
  };

  return (
    <PageContainer>
      <Navbar />
      <Container>
        <h2>Editar</h2>
        <h3>Usuário</h3>
        <GenericEdit
          object={{
            fields: [
              {
                field: userData?.name,
                field_name: 'name',
              },
              {
                field: userData?.email,
                field_name: 'email',
              },
              {
                field: userData?.password,
                field_name: 'password',
                hidden: true,
              },
              {
                field: userData?.phone,
                field_name: 'phone',
              },
              {
                field: userData?.CPF,
                field_name: 'CPF',
              },
            ],
          }}
          route={'/user'}
          id={id}
        />
        <h3>Endereços</h3>
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          {addresses?.map((address, index) => (
            <div key={index}>
              <h4>Endereço {index + 1}</h4>
              <GenericEdit
                object={{
                  fields: [
                    {
                      field: address.street,
                      field_name: 'street',
                    },
                    {
                      field: address.number,
                      field_name: 'number',
                    },
                    {
                      field: address.district,
                      field_name: 'district',
                    },
                    {
                      field: address.city,
                      field_name: 'city',
                    },
                    {
                      field: address.state,
                      field_name: 'state',
                    },
                    {
                      field: address.zip_code,
                      field_name: 'zip_code',
                    },
                  ],
                }}
                route={'/address'}
                id={address.id}
              />
            </div>
          ))}
          {addingAddress ? (
            <div>
              <h4>Novo Endereço</h4>
              <GenericEdit
                object={{
                  fields: [
                    {
                      field: newAddress?.street,
                      field_name: 'street',
                    },
                    {
                      field: newAddress?.number,
                      field_name: 'number',
                    },
                    {
                      field: newAddress?.district,
                      field_name: 'district',
                    },
                    {
                      field: newAddress?.city,
                      field_name: 'city',
                    },
                    {
                      field: newAddress?.state,
                      field_name: 'state',
                    },
                    {
                      field: newAddress?.zip_code,
                      field_name: 'zip_code',
                    },
                    {
                        field: id,
                        field_name: 'user_id',
                        render: false,
                    }
                  ],
                }}
                route={'/address'}
              />
              <button onClick={handleAddressCreate}>Criar Endereço</button>
            </div>
          ) : (
            <button onClick={handleAddAddress}>Adicionar Endereço</button>
          )}
        </div>
      </Container>
    </PageContainer>
  );
};

export default UserEditPage;
