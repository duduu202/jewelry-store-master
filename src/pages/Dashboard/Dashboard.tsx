import React, { useEffect, useRef, useState } from "react";
import Chart, { ChartDataset } from "chart.js/auto";
import Navbar from "../../components/Navbar/Navbar";
import { Container } from "../../styles/style";
import { PageContainer } from "./styles";
import { IGroupDTO, IRequestDashboard, IResponseDashboard } from "./dto/DashboardDTO";
import { LineChart } from "../../components/LineChart/LineChart";
import api from "../../services/api";
import { IPaginatedResponse } from "../../Interfaces/IPaginatedResponse";
import { Point } from "chart.js/dist/core/core.controller";
import { GroupCategories } from "../../components/GroupCategories/GroupCategories";
import { InputDate } from "../../components/Input/styles";

const route = "/dashboard";

const DashboardPage = () => {
  const chartRef = useRef(null);
  const [ data, setData ] = useState<IResponseDashboard[]>();


  // const start_month = new Date();
  // set days and hours to 0
  // start_month.setDate(1);
  // start_month.setHours(0, 0, 0, 0);

  const now = new Date();

  // start month = now - 6 months
  const start_month = new Date(now.getFullYear(), now.getMonth() - 6, 1);
  start_month.setDate(new Date(start_month.getFullYear(), start_month.getMonth() + 1, 0).getDate());
  start_month.setHours(0, 0, 0, 0);

  // end month = now + 6 months
  const end_month = new Date(now.getFullYear(), now.getMonth() + 6, 1);
  end_month.setDate(new Date(end_month.getFullYear(), end_month.getMonth() + 1, 0).getDate());
  end_month.setHours(23, 59, 59, 999);


  // set days to end of month and hours to 23:59:59
  // end_month.setDate(new Date(end_month.getFullYear(), end_month.getMonth() + 1, 0).getDate());
  // end_month.setHours(23, 59, 59, 999);

  const [ startDate, setStartDate ] = useState<Date>(start_month);
  const [ endDate, setEndDate ] = useState<Date>(end_month);
  const [ categories, setCategories ] = useState<string[]>();
  const [ selectedGroups, setSelectedGroups ] = useState<IGroupDTO[]>([{
    categories: ['ouro']
  },{
    categories: ['prata']
  }]);
  const [includeAllSales, setIncludeAllSales] = useState<boolean>(true);

  const [ loading, setLoading ] = useState(true);

  const HandleChangeIncludeAllSales = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeAllSales(event.target.checked);
  }

  const getDataSets = ():ChartDataset<'line', (number | Point | null)[]>[] => {
    if (!data) {
      return [{
        label: '',
        data: [],
        borderColor: '',
        tension: 0.1,
      }]
    };
    const chart =  data?.map((item) => {
      return {
        label: item.categories.join(', '),
        data: item.datas.map((item) => {
          return {
            y: item.quantity,
            x: String(item.date).split('T')[0]
          };
        }),
        borderColor: item.color,
        tension: 0.1,
      }
    });

    return chart;
  }

  // handle start date
  const handleStartDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(event.target.value);
    date.setHours(0, 0, 0, 0);
    setStartDate(date);
  }

  // handle end date
  const handleEndDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(event.target.value);
    date.setHours(23, 59, 59, 999);
    setEndDate(date);
  }

  const handleCategories = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const options = event.target.options;
    const list = [];

    console.log("options",options)
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        list.push(options[i].value);
      }
    }

    console.log("selectedGroupsList",list)
    setSelectedGroups(list);
  }

  const getLabels = () => {
    const milisecondsInMonth = 1000 * 60 * 60 * 24 * 30;
    const dateDiff = endDate.getTime() - startDate.getTime();
    const months = dateDiff / milisecondsInMonth;
    const labels = [];

    for (let i = 0; i < months; i++) {
      const date = new Date(startDate.getTime());
      date.setMonth(date.getMonth() + i);
      labels.push(getMonth(date));
    }
    if (labels.length <= 1) {
      for (let i = 0; i < months; i++) {
        const date = new Date(startDate.getTime());
        const days = getArrayDaysInMonth(startDate);
        labels.push(...days);
      }
    }


    return labels;
  }


  const getMonth = (date: Date): string => {
    const month = date.getMonth();
    switch (month) {
      case 0:
        return "Jan";
      case 1:
        return "Fev";
      case 2:
        return "Mar";
      case 3:
        return "Abr";
      case 4:
        return "Mai";
      case 5:
        return "Jun";
      case 6:
        return "Jul";
      case 7:
        return "Ago";
      case 8:
        return "Set";
      case 9:
        return "Out";
      case 10:
        return "Nov";
      case 11:
        return "Dez";
      default:
        return "Jan";
    }
  }

  const getArrayDaysInMonth = (date: Date): string[] => {
    const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const arrayDays = [];
    for (let i = 0; i < days; i++) {
      arrayDays.push(`${i + 1}`);
    }
    return arrayDays;
  }

  useEffect(() => {
    refetchData();
  }, [
    startDate,
    endDate,
    selectedGroups,
    includeAllSales
  ]);

  const refetchData = () => {
    console.log("refetching data", selectedGroups);
    const fetchData = async () => {
      const request: IRequestDashboard = {
        end_date: endDate.toISOString(),
        start_date: startDate.toISOString(),
        groups: selectedGroups.map((item) => {
          item.categories = item.categories.map((item) => item.toLowerCase());
          return item;
        }),
        division_split: 15,
        all_sales: includeAllSales
      }
        const { data } = await api.get<IResponseDashboard[]>(route, {
          params: {
            ...request
          }
        });
          //+'?division_split=12&start_date=2023-01-01T00:00:00.000Z&end_date=2023-12-01T00:00:00.000Z&categories[]=prata&categories[]=ouro');
        console.log("data", data);
        const withColor = data.map((item) => {
          return {
            ...item,
            color: `#${Math.floor(Math.random()*16777215).toString(16)}`
          }
        });
        setData(withColor);
        setLoading(false);
    }
    fetchData();
  }

  useEffect(() => {
    const fetchData = async () => {
        const { data: categories } = await api.get<IPaginatedResponse<any>>('product/categories/');
          //+'?division_split=12&start_date=2023-01-01T00:00:00.000Z&end_date=2023-12-01T00:00:00.000Z&categories[]=prata&categories[]=ouro');
        console.log("categories", categories.results);
        setCategories(categories.results.map((item) => item.name));
        setLoading(false);
    }
    fetchData();
  }, []);


  const HandleSaveGroups = (groups: IGroupDTO[]) => {
    setSelectedGroups(groups);
    refetchData();
  }

  return (
    <PageContainer>
      <Navbar />
      <Container>
        <div style={{margin: '0.25rem'}}>
          <div>
            <div>
              <label htmlFor="start_date">Data inicial </label>
            </div>
            <InputDate type="date" id="start_date" name="start_date" value={startDate.toISOString().split('T')[0]} onChange={handleStartDate} />
          </div>
          <div>
            <div>
              <label htmlFor="end_date">Data final </label>
            </div>
            <InputDate type="date" id="end_date" name="end_date" value={endDate.toISOString().split('T')[0]} onChange={handleEndDate} />
          </div>
        </div>

        <GroupCategories selectedGroups={selectedGroups} onSaved={HandleSaveGroups} />

        <div style={{margin: '0.25rem'}}>
          <input type="checkbox" id="include_all_sales" name="include_all_sales" checked={includeAllSales} onChange={HandleChangeIncludeAllSales} />
          <label htmlFor="include_all_sales">Incluir todas as vendas</label>
        </div>
      

        {loading ? (
          <div>Carregando...</div>
        ) : (
          <div>
          <LineChart 
          title="Vendas"
          data={
            {
              datasets: getDataSets()
            }
          } setEstabelecimentoGraphicIndex={['a']} key={['a']} />
        </div>)}
      </Container>
    </PageContainer>
  );
};

export default DashboardPage;