import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import Navbar from "../../components/Navbar/Navbar";
import { Container } from "../../styles/style";
import { PageContainer } from "./styles";
import { IGroupData } from "./dto/DashboardDTO";
import { LineChart } from "../../components/LineChart/LineChart";
import api from "../../services/api";

const route = "/dashboard";

const DashboardPage = () => {
  const chartRef = useRef(null);
  const [ data, setData ] = useState<IGroupData[]>();
  const [ loading, setLoading ] = useState(true);

  const getDataSets = () => {
    if (!data) return [];
    return data?.map((item) => {
      return {
        label: item.name,
        data: item.datas.map((item) => {
          console.log(item.quantity);
          return item.quantity;
        }),
        fill: false,
        // borderColor: 'rgb(75, 192, 192)',
        // random color
        borderColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        tension: 0.1
      }
    });
  }

  useEffect(() => {
      const fetchData = async () => {
          const { data } = await api.get<IGroupData[]>(route+'?division_split=12&start_date=2023-01-01T00:00:00.000Z&end_date=2023-12-01T00:00:00.000Z&categories[]=prata&categories[]=ouro');
          console.log("data", data);
          setData(data);
          setLoading(false);
      }
      fetchData();
  }, []);

  return (
    <PageContainer>
      <Navbar />
      <Container>
        {loading ? (
          <div>Carregando...</div>
        ) : (
          <LineChart data={
            {
              labels: [
              "Jan",
              "Fev",
              "Mar",
              "Abr",
              "Mai",
              "Jun",
              "Jul",
              "Ago",
              "Set",
              "Out",
              "Nov",
              "Dez",
            ],
              datasets: getDataSets()
            }
          } setEstabelecimentoGraphicIndex={['a']} key={['a']} />
        )}
      </Container>
    </PageContainer>
  );
};

export default DashboardPage;
