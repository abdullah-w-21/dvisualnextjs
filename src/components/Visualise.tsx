import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface SensorData {
  date: string;
  time: string;
  reading: number;
}

interface VisualizeProps {
  siteId: string;
}

const Visualize: React.FC<VisualizeProps> = ({ siteId }) => {
  const [sensorNames, setSensorNames] = useState<string[]>([]);
  const [selectedSensor, setSelectedSensor] = useState<string>('');
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSensorNames = async () => {
      try {
        const response = await axios.get<{ sensorNames: string[] }>(`/api/sensors/${siteId}`);
        setSensorNames(response.data.sensorNames);
      } catch (error) {
        console.error('Error fetching sensor names:', error);
        setError('Error fetching sensor names');
      }
    };

    fetchSensorNames();
  }, [siteId]);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        if (selectedSensor) {
          setLoading(true);
          const response = await axios.get<{ sensorData: SensorData[] }>(
            `/api/sensordata/${selectedSensor}/${siteId}`
          );
          setSensorData(response.data.sensorData);
        }
      } catch (error) {
        console.error('Error fetching sensor data:', error);
        setError('Error fetching sensor data');
      } finally {
        setLoading(false);
      }
    };

    fetchSensorData();
  }, [selectedSensor, siteId]);

  // Function to group data by date for PieChart
  const groupDataByDate = () => {
    const groupedData = sensorData.reduce((acc, entry) => {
      const date = entry.date;
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += entry.reading;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(groupedData).map(([date, reading]) => ({ date, reading }));
  };

  // Function to format time for BarChart
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4">
      <h1 className="text-3xl mb-4">Visualize Page</h1>
      <label className="mr-2">Select Sensor:</label>
      <select
        value={selectedSensor}
        onChange={(e) => setSelectedSensor(e.target.value)}
        className="p-2"
      >
        <option value="">Select Sensor</option>
        {sensorNames.map((sensorName, index) => (
          <option key={index} value={sensorName}>
            {sensorName}
          </option>
        ))}
      </select>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Visualization for {selectedSensor}</p>
      {selectedSensor && (
        <div className="mt-4">
          {/* Line Chart */}
          <h2 className="text-2xl mb-2">Line Chart</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={sensorData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="reading" stroke="#8884d8" name="Reading" />
            </LineChart>
          </ResponsiveContainer>

          {/* Bar Chart */}
          <h2 className="text-2xl mb-2 mt-4">Bar Chart</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={sensorData}>
              <XAxis dataKey="time" tickFormatter={formatTime} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="reading" fill="#8884d8" name="Reading" />
            </BarChart>
          </ResponsiveContainer>

          {/* Pie Chart */}
          <h2 className="text-2xl mb-2 mt-4">Pie Chart</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={groupDataByDate()}
                dataKey="reading"
                nameKey="date"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {groupDataByDate().map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Visualize;
