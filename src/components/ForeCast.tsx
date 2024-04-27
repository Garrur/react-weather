import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import clearIcon from "../assets/icons/sun.png";
import rainIcon from "../assets/icons/rainy-day.png";
import cloudsIcon from "../assets/icons/cloudy.png";
import drizzleIcon from "../assets/icons/drizzle.png";

import axios from "axios";

interface ForecastDataItem {
    pop: number;
    dt_txt: string;
    main: {
      temp_min: number;
      temp_max: number;
      temp: number;
    };
    weather: {
      description: string;
      main: string;
    }[];
  }

  const apikey: string = process.env.REACT_APP_API_KEY ?? "" ;

 const ForeCast: React.FC = () => {
    const [foreCastData, setForeCastData] = useState<ForecastDataItem[]>([]);
    const [loading, setLoading] = useState(true)
    const { cityName } = useParams();



    useEffect(() => {
        const fetchForeCastData = async () => {
          try {
            const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apikey}`
            );
            const dailyForecasts = response.data.list.filter((item: any, index: number) =>index % 8 ===0)
            setForeCastData(dailyForecasts);
            setLoading(false)
            console.log(dailyForecasts);
          } catch (error) {
            console.log("Fetching Error",error);
            setLoading(false)

          } 
        };
        fetchForeCastData();
      }, [cityName]);

//icons

const option: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};


      

  return (
    <div className=" p-2">
        <h1 className=" text-center text-slate-600 text-3xl font-bold underline mb-4 ">Forecast</h1>{
            loading ?(
                <p>Loading...</p>
            ):(
                <div className=" flex xl:gap-5 flex-col xl:flex-row ">
                    {
                        foreCastData.map((day, index)=>{
                            let weatherIcon;
                            if(day.weather[0].main === "Clouds"){
                                weatherIcon = cloudsIcon
                            }else if(day.weather[0].main === "Rain"){
                                weatherIcon = rainIcon
                            }else if(day.weather[0].main === "Clear"){
                                weatherIcon = clearIcon
                            }else if(day.weather[0].main === "Drizzle"){
                                weatherIcon = drizzleIcon
                            }

                            //extracting date

                            const date = new Date(day.dt_txt)
                            
                            const forecastDate = date.toLocaleDateString('en-US', option);

                            return (
                                <>
                                <div >
                                   <div className=" border border-slate-700 border-y-4  border-x-4 rounded-lg bg-slate-300 shadow-lg hover:scale-110">
                                        <div key ={index} className="flex flex-col xl:gap-2 items-center text-black">
                                            <p className="font-semibold shadow-xl">{forecastDate}</p>
                                            <img src={weatherIcon} alt='cloud' className='animate-pulse w-[100px]' />
                                            <p className="underline text-left"> {day.weather[0].description}</p>
                                            <div className="mr-4 ">
                                                <p className="font-semibold">{(day.main.temp- 273.15).toFixed(1)}°c </p>
                                            </div>
                                            <div className="flex ">
                                                    <p className="font-thin shadow-md border-slate-300 border  font-light">Max Temp-{(day.main.temp_max- 273.15).toFixed(1)}°c </p>
                                                    <p className="pr-3"></p>
                                                    <p className="font-thin shadow-md border-slate-300 border font-light">Max Temp-{(day.main.temp_min- 273.15).toFixed(1)}°c </p>
                                            </div>
                                            


                                            <p>{day.pop * 100} %</p>
                                        </div>
                                    </div>
                                </div>    
                                </>
                            )
                            
                        })
                    }
                </div>
            )
        }
    </div>
  )
}

export default ForeCast ;