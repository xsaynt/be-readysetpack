// main-types
type Users = {
  user_id?: number;
  username: string;
  name: string;
};

type Trips = {
  trip_id?: number;
  user_id: number;
  destination: Destination;
  start_date: string;
  end_date: string;
  passport_issued_country: string;
  weather: Weather;
  is_need_visa: boolean;
  budget: Budget;
  is_booked_hotel: boolean;
  people_count: number;
  city_information: string;
  landmarks: Landmarks;
  events: Events[];
  daily_expected_cost: number;
};

type Checklist = {
    trip_id:number
    user_id:number
    checklist_id:number
    items:string[]
}

type DailyExpectedCost = {
    country:string
    daily_cost:number
}

// sub-types

type Destination = {
  city: string;
  country: string;
  currency: string;
};

type Weather = {
  temp: number;
  weather_type: string;
};
type Budget = {
  amount: number;
  currency: string;
};

type Landmarks = {
  best_places_to_visit: string[];
  img_url_of_landmarks: string[];
};

type Events = {
  name: string;
  venue: string;
  date: string;
  img: string;
  price: number;
};

export {Users,Trips,Checklist,DailyExpectedCost,Destination,Weather,Budget,Landmarks,Events}