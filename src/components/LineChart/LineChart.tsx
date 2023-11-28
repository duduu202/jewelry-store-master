
import { useRef } from "react";
import { Line, getElementAtEvent } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
  } from 'chart.js'

interface Props {
  data: ChartData<"line">;
  setEstabelecimentoGraphicIndex: (index: number) => void;
}
ChartJS.register(
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement
);

export const LineChart = ({ data, setEstabelecimentoGraphicIndex }: Props) => {
  const chartRef = useRef();
  const onClickProductChart = (event: any) => {
    if (chartRef.current) {
      const [element] = getElementAtEvent(chartRef?.current, event);
      if (element) setEstabelecimentoGraphicIndex(element.index);
    }
  };
  const getMaxValue = () => {
    const highestValue = data.datasets?.reduce((acc, item) => {
      const highest = item.data?.reduce((acc, item) => {
        return item > acc ? item : acc;
      }, 0);
      return highest > acc ? highest : acc;
    }, 0);

    return highestValue + 10;
  }
  return (
    <Line
      width={50}
      height={20}
      data={data}
      ref={chartRef}
      options={{
        // maintainAspectRatio: false,
        backgroundColor: "#111111",
        responsive: true,
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: false,
            min: -0.5,
            max: getMaxValue() || 100,
            grid: {
              borderDash: [2, 3],
              color: "#514D4B",
            },
            ticks: {
              includeBounds: false,
              stepSize: 50,
            },
          },
        },
        plugins: {
          legend: {
            position: "top" as const,
          },
          title: {
            display: false,
            text: "Chart.js Bar Chart",
          },
        },
      }}
      style={{
        backgroundColor: "rgba(185, 185, 185, 0.1)",
        borderRadius: 5,
        padding: 10,
      }}
    />
  );
};