import axios from "axios";

export const fetchData = async () => {
  const res = await axios.get("http://localhost:5000/api/data");
  return res.data.data; 
};
