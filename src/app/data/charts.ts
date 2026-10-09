import { Colors } from '../constants/colors.service';

export const polarAreaChartData = {
  labels: ['PUNCH IN 50', 'PUNCH OUT 10', 'NOT PUNCH IN 2', 'ON LEAVE 5', 'WEEK OFF 3'],
  datasets: [
    {
      data: [50, 10, 2, 5, 3],
      borderWidth: 2,
      borderColor: [
        Colors.getColors().themeColor1,
        Colors.getColors().themeColor2,
        Colors.getColors().themeColor3,
        Colors.getColors().themeColor4,
        Colors.getColors().themeColor5,
      ],

      backgroundColor: [
        Colors.getColors().themeColor1_10,
        Colors.getColors().themeColor2_10,
        Colors.getColors().themeColor3_10,
        Colors.getColors().themeColor4_10,
        Colors.getColors().themeColor5_10,
      ],
    },
  ],
};

export const lineChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: '',
      data: [54, 63, 60, 65, 60, 68, 60],
      borderColor: Colors.getColors().themeColor1,
      pointBackgroundColor: Colors.getColors().foregroundColor,
      pointBorderColor: Colors.getColors().themeColor1,
      pointHoverBackgroundColor: Colors.getColors().themeColor1,
      pointHoverBorderColor: Colors.getColors().foregroundColor,
      pointRadius: 4,
      pointBorderWidth: 2,
      pointHoverRadius: 6,
      borderWidth: 2,
      fill: false,
    },
  ],
};

export const areaChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: '',
      data: [54, 63, 60, 65, 60, 68, 60],
      borderColor: Colors.getColors().themeColor1,
      pointBackgroundColor: Colors.getColors().foregroundColor,
      pointBorderColor: Colors.getColors().themeColor1,
      pointHoverBackgroundColor: Colors.getColors().themeColor1,
      pointHoverBorderColor: Colors.getColors().foregroundColor,
      pointRadius: 4,
      pointBorderWidth: 2,
      pointHoverRadius: 5,
      fill: true,
      borderWidth: 2,
      backgroundColor: Colors.getColors().themeColor1_10,
    },
  ],
};

export const conversionChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: '',
      data: [65, 60, 68, 60, 58, 63, 60],
      borderColor: Colors.getColors().themeColor2,
      pointBackgroundColor: Colors.getColors().foregroundColor,
      pointBorderColor: Colors.getColors().themeColor2,
      pointHoverBackgroundColor: Colors.getColors().themeColor2,
      pointHoverBorderColor: Colors.getColors().foregroundColor,
      pointRadius: 4,
      pointBorderWidth: 2,
      pointHoverRadius: 5,
      fill: true,
      borderWidth: 2,
      backgroundColor: Colors.getColors().themeColor2_10,
    },
  ],
};

export const scatterChartData = {
  datasets: [
    {
      borderWidth: 2,
      showLine: false,
      label: 'Cakes',
      borderColor: Colors.getColors().themeColor1,
      backgroundColor: Colors.getColors().themeColor1_10,
      data: [
        { x: 62, y: -78 },
        { x: -0, y: 74 },
        { x: -67, y: 45 },
        { x: -26, y: -43 },
        { x: -15, y: -30 },
        { x: 65, y: -68 },
        { x: -28, y: -61 },
      ],
    },
    {
      borderWidth: 2,
      showLine: false,
      label: 'Desserts',
      borderColor: Colors.getColors().themeColor2,
      backgroundColor: Colors.getColors().themeColor2_10,
      data: [
        { x: 79, y: 62 },
        { x: 62, y: 0 },
        { x: -76, y: -81 },
        { x: -51, y: 41 },
        { x: -9, y: 9 },
        { x: 72, y: -37 },
        { x: 62, y: -26 },
      ],
    },
  ],
};

export const barChartData = {
  labels: ['January'],
  datasets: [
    {
      label: 'Gross',
      borderColor: Colors.getColors().themeColor1,
      backgroundColor: Colors.getColors().themeColor1_10,
      data: [100000],
      borderWidth: 2,
    },
    {
      label: 'Deduction',
      borderColor: Colors.getColors().themeColor2,
      backgroundColor: Colors.getColors().themeColor2_10,
      data: [30000],
      borderWidth: 2,
    },
    {
      label: 'Net',
      borderColor: Colors.getColors().themeColor3,
      backgroundColor: Colors.getColors().themeColor3_10,
      data: [60000],
      borderWidth: 2,
    },
    {
      label: 'CTC',
      borderColor: Colors.getColors().themeColor4,
      backgroundColor: Colors.getColors().themeColor4_10,
      data: [80000],
      borderWidth: 2,
    },
  ],
};

export const barChartData2 = {
  labels: ['Group A', 'Group B', 'Group C'],
  datasets: [
    {
      label: 'Category 1',
      data: [10, 15, 20],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
      stack: 'Group A',
    },
    {
      label: 'Category 2',
      data: [5, 8, 12],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
      stack: 'Group A',
    },
  ],
};

export const barChartData3 = {
  labels: ['Group A'],
  datasets: [
    {
      label: 'Category 1',
      data: [10],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
    {
      label: 'Category 2',
      data: [5],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
  ],
};

export const radarChartData = {
  datasets: [
    {
      label: 'Stock',
      borderWidth: 2,
      pointBackgroundColor: Colors.getColors().themeColor1,
      borderColor: Colors.getColors().themeColor1,
      backgroundColor: Colors.getColors().themeColor1_10,
      data: [80, 90, 70],
    },
    {
      label: 'Order',
      borderWidth: 2,
      pointBackgroundColor: Colors.getColors().themeColor2,
      borderColor: Colors.getColors().themeColor2,
      backgroundColor: Colors.getColors().themeColor2_10,
      data: [68, 80, 95],
    },
  ],
  labels: ['Cakes', 'Desserts', 'Cupcakes'],
};

export const pieChartData = {
  labels: ['PUNCH IN 50', 'PUNCH OUT 10', 'NOT PUNCH IN 2', 'ON LEAVE 5', 'WEEK OFF 3'],
  datasets: [
    {
      label: '',
      borderColor: [
        Colors.getColors().themeColor1,
        Colors.getColors().themeColor2,
        Colors.getColors().themeColor3,
        Colors.getColors().themeColor4,
        Colors.getColors().themeColor5,
      ],
      backgroundColor: [
        Colors.getColors().themeColor1_10,
        Colors.getColors().themeColor2_10,
        Colors.getColors().themeColor3_10,
        Colors.getColors().themeColor4_10,
        Colors.getColors().themeColor5_10,
      ],
      borderWidth: 2,
      data: [50, 10, 2, 5, 3],
    },
  ],
};

export const doughnutChartData = {
  labels: ['Active ', 'Deactive', 'Left'],
  datasets: [
    {
      label: '',
      borderColor: [
        Colors.getColors().themeColor2,
        Colors.getColors().themeColor3,
        Colors.getColors().themeColor1,
      ],
      backgroundColor: [
        Colors.getColors().themeColor2_10,
        Colors.getColors().themeColor3_10,

        Colors.getColors().themeColor1_10,
      ],
      borderWidth: 2,
      data: [45, 15, 2],
    },
  ],
};

export const smallChartData1 = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Orders',
      borderColor: Colors.getColors().themeColor1,
      pointBorderColor: Colors.getColors().themeColor1,
      pointHoverBackgroundColor: Colors.getColors().themeColor1,
      pointHoverBorderColor: Colors.getColors().themeColor1,
      pointRadius: 3,
      pointBackgroundColor: Colors.getColors().themeColor1,
      pointBorderWidth: 0,
      pointHoverRadius: 3,
      fill: false,
      borderWidth: 2,
      data: [1250, 1300, 1550, 921, 1810, 1106, 1610],
      datalabels: {
        align: 'end',
        anchor: 'end',
      },
    },
  ],
};

export const smallChartData2 = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Revenue',
      borderColor: Colors.getColors().themeColor1,
      pointBorderColor: Colors.getColors().themeColor1,
      pointHoverBackgroundColor: Colors.getColors().themeColor1,
      pointHoverBorderColor: Colors.getColors().themeColor1,
      pointRadius: 2,
      pointBorderWidth: 3,
      pointHoverRadius: 2,
      fill: false,
      borderWidth: 2,
      data: [115, 120, 300, 222, 105, 85, 36],
      datalabels: {
        align: 'end',
        anchor: 'end',
      },
    },
  ],
};

export const smallChartData3 = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Costs',
      borderColor: Colors.getColors().themeColor1,
      pointBorderColor: Colors.getColors().themeColor1,
      pointHoverBackgroundColor: Colors.getColors().themeColor1,
      pointHoverBorderColor: Colors.getColors().themeColor1,
      pointRadius: 2,
      pointBorderWidth: 3,
      pointHoverRadius: 2,
      fill: false,
      borderWidth: 2,
      data: [350, 452, 762, 952, 630, 85, 158],
      datalabels: {
        align: 'end',
        anchor: 'end',
      },
    },
  ],
};

export const smallChartData4 = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Returns',
      borderColor: Colors.getColors().themeColor1,
      pointBorderColor: Colors.getColors().themeColor1,
      pointHoverBackgroundColor: Colors.getColors().themeColor1,
      pointHoverBorderColor: Colors.getColors().themeColor1,
      pointRadius: 2,
      pointBorderWidth: 3,
      pointHoverRadius: 2,
      fill: false,
      borderWidth: 2,
      data: [200, 452, 250, 630, 125, 85, 20],
      datalabels: {
        align: 'end',
        anchor: 'end',
      },
    },
  ],
};
