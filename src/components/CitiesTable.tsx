import React, { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Define interface for city data
interface City {
  name: string;
  cou_name_en: string;
  timezone: string;
}

export const CitiesTable: FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [search, setSearch] = useState<string>('');
  const [cityData, setCityData] = useState<City[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: string }>({ key: null, direction: 'ascending' });

  useEffect(() => {
    const getCityData = async () => {
      try {
        const response = await axios.get<{ results: City[] }>("https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=100&page=${page}");
        setCities(response.data.results);
      } catch (error) {
        setError("Failed to fetch city data. Please try again.");
      }
    };
    getCityData();
  }, []);

  useEffect(() => {
    const filteredCities = cities.filter((city) =>
      city.name.toLowerCase().includes(search.toLowerCase())
    );
    setCityData(filteredCities);
  }, [cities, search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedCities = [...cityData].sort((a, b) => {
    if (sortConfig.direction === 'ascending') {
      return a[sortConfig.key as keyof City] > b[sortConfig.key as keyof City] ? 1 : -1;
    } else {
      return a[sortConfig.key as keyof City] < b[sortConfig.key as keyof City] ? 1 : -1;
    }
  });

  return (
    <div className="container mx-auto mt-20 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
      <div className="container mx-auto">
        <h2 className="underline font-bold text-4xl text-center mb-6">City Table</h2>
      </div>
      {error && ( // Display error msg if error state is not null
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      <div className="pb-2">
        <label className="relative block">
          <span className="sr-only">Search</span>
          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </span>
          <input
            onChange={handleSearch}
            value={search}
            className=" hover:scale-110 placeholder:italic placeholder-text-slate-400 block bg-white w-full sm:w-64 border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 text-sm"
            placeholder="Search for city..."
            type="text"
            name="search"
          />
        </label>
      </div>
      <div className="flex flex-col justify-center shadow-2xl">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="underline ">
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-base font-semibold text-gray-500 uppercase cursor-pointer"
                        onClick={() => handleSort('name')}
                      >
                        CityName
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-base font-semibold text-gray-500 uppercase cursor-pointer"
                        onClick={() => handleSort('cou_name_en')}
                      >
                        Country
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-base font-semibold text-gray-500 uppercase cursor-pointer"
                        onClick={() => handleSort('timezone')}
                      >
                        TimeZone
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortedCities.map((city:City, i) => (
                      <tr className="hover:bg-gray-100 shadow-l" key={i}>
                        <td className="px-6 py-4 whitespace-nowrap border text-sm font-medium text-gray-800 cursor-pointer  hover:animate-pulse">
                          <Link to={`/weather/${city.name}`} target="_blank">
                            {city.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {city.cou_name_en}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {city.timezone}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
