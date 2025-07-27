export const chartColors = {
  default: {
    1: "221.2 83.2% 53.3%",
    2: "142.1 76.2% 36.3%", 
    3: "0 84.2% 60.2%",
    4: "47.9 95.8% 53.1%",
    5: "262.1 83.3% 57.8%",
  },
  ocean: {
    1: "188.7 94.5% 42.7%",
    2: "214.3 95.7% 57.8%",
    3: "230 87.1% 67.8%",
    4: "198.4 88.8% 48.4%",
    5: "171.4 89.5% 39.8%",
  },
  forest: {
    1: "142.1 76.2% 36.3%",
    2: "155.8 76.2% 36.3%",
    3: "173.4 76.2% 36.3%",
    4: "158.1 76.2% 46.3%",
    5: "168.2 76.2% 26.3%",
  },
  sunset: {
    1: "24.6 95% 53.1%",
    2: "0 84.2% 60.2%",
    3: "330.4 81.2% 60.4%",
    4: "47.9 95.8% 53.1%",
    5: "14.1 91.1% 63.1%",
  },
  purple: {
    1: "262.1 83.3% 57.8%",
    2: "271.5 81.3% 55.9%",
    3: "288.3 83.2% 64.7%",
    4: "280.4 89.3% 69.8%",
    5: "253.4 85.2% 54.9%",
  },
  mono: {
    1: "0 0% 20%",
    2: "0 0% 40%",
    3: "0 0% 60%",
    4: "0 0% 80%",
    5: "0 0% 50%",
  },
};

export const themes = {
  themes: [
    {
      name: "default",
      extend: {
        colors: {
          chart: chartColors.default,
        },
      },
    },
    {
      name: "ocean",
      extend: {
        colors: {
          chart: chartColors.ocean,
        },
      },
    },
    {
      name: "forest",
      extend: {
        colors: {
          chart: chartColors.forest,
        },
      },
    },
    {
      name: "sunset",
      extend: {
        colors: {
          chart: chartColors.sunset,
        },
      },
    },
    {
      name: "purple",
      extend: {
        colors: {
          chart: chartColors.purple,
        },
      },
    },
    {
      name: "mono",
      extend: {
        colors: {
          chart: chartColors.mono,
        },
      },
    },
  ],
};

export const colorSchemes = [
  { 
    name: "Default", 
    value: "default", 
    colors: ["bg-blue-500", "bg-green-500", "bg-red-500"] 
  },
  { 
    name: "Ocean", 
    value: "ocean", 
    colors: ["bg-cyan-500", "bg-blue-500", "bg-indigo-500"] 
  },
  { 
    name: "Forest", 
    value: "forest", 
    colors: ["bg-green-500", "bg-emerald-500", "bg-teal-500"] 
  },
  { 
    name: "Sunset", 
    value: "sunset", 
    colors: ["bg-orange-500", "bg-red-500", "bg-pink-500"] 
  },
  { 
    name: "Purple", 
    value: "purple", 
    colors: ["bg-purple-500", "bg-violet-500", "bg-fuchsia-500"] 
  },
  { 
    name: "Monochrome", 
    value: "mono", 
    colors: ["bg-gray-600", "bg-gray-500", "bg-gray-400"] 
  },
];
