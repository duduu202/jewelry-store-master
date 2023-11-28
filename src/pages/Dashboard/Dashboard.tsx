import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import Navbar from "../../components/Navbar/Navbar";
import { Container } from "../../styles/style";
import { PageContainer } from "./styles";
import { IGroupData } from "./dto/DashboardDTO";
import { LineChart } from "../../components/LineChart/LineChart";
import api from "../../services/api";
import { IPaginatedResponse } from "../../Interfaces/IPaginatedResponse";

const route = "/dashboard";

const DashboardPage = () => {
  const chartRef = useRef(null);
  const [ data, setData ] = useState<IGroupData[]>();


  // const start_month = new Date();
  // set days and hours to 0
  // start_month.setDate(1);
  // start_month.setHours(0, 0, 0, 0);

  const start_month = new Date('2023-01-01T00:00:00.000Z');


  const end_month = new Date('2023-12-01T00:00:00.000Z');
  // set days to end of month and hours to 23:59:59
  // end_month.setDate(new Date(end_month.getFullYear(), end_month.getMonth() + 1, 0).getDate());
  // end_month.setHours(23, 59, 59, 999);

  const [ startDate, setStartDate ] = useState<Date>(start_month);
  const [ endDate, setEndDate ] = useState<Date>(end_month);
  const [ categories, setCategories ] = useState<string[]>();
  const [ selectedCategories, setSelectedCategories ] = useState<string[]>(['ouro', 'prata']);

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
        borderColor: item.color,
        tension: 0.1

      }
    });
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

    console.log("selectedCategoriesList",list)
    setSelectedCategories(list);
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
    selectedCategories
  ]);

  const refetchData = () => {
    console.log("refetching data", selectedCategories);
    const fetchData = async () => {
        const { data } = await api.get<IGroupData[]>(route, {
          params: {
            division_split: getLabels().length,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            categories: selectedCategories
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

  return (
    <PageContainer>
      <Navbar />
      <Container>
        <div>
          <label htmlFor="start_date">Data inicial</label>
          <input type="date" id="start_date" name="start_date" value={startDate.toISOString().split('T')[0]} onChange={handleStartDate} />

          <label htmlFor="end_date">Data final</label>
          <input type="date" id="end_date" name="end_date" value={endDate.toISOString().split('T')[0]} onChange={handleEndDate} />
        </div>
        <div>
          <label htmlFor="categories">Categorias</label>
          <select name="categories" id="categories" multiple onChange={handleCategories}>
            {categories?.map((item) => {
              return (
                <option value={item}>{item}</option>
              )
            })}
          </select>
        </div>
        <div>
            {/*
            colors:
            */}
            {
              data?.map((item) => {
                return (
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <div style={{width: 20, height: 20, backgroundColor: item.color, marginRight: 10}}></div>
                    <span>{item.name}</span>
                  </div>
                )
              })
            }

          </div>
        {loading ? (
          <div>Carregando...</div>
        ) : (
          <div>
          <LineChart 
          
          data={
            {
              labels: getLabels(),
              datasets: getDataSets()
            }
          } setEstabelecimentoGraphicIndex={['a']} key={['a']} />
        </div>)}
      </Container>
    </PageContainer>
  );
};

export default DashboardPage;
