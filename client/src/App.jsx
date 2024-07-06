import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "./utils/constants";

const App = () => {
  const [foodName, setFoodName] = useState("");
  const [newFoodName, setNewFoodName] = useState("");
  const [daysSinceEaten, setDaysSinceEaten] = useState(0);
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(BASE_URL+`/display`);
        const data = response.data;
        setList(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const Add = async () => {
    try {
      await axios.post(BASE_URL, {
        foodName,
        daysSinceEaten,
      });
      setDaysSinceEaten(0);
      setFoodName("");
      alert("Added");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const Delete = async (id) => {
    try {
      await axios.delete(BASE_URL + `/delete/${id}`);
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert("Not Deleted");
    }
  };

  const Update = async (id) => {
    try {
      await axios.put(BASE_URL +`/update/${id}`, {
        id: id,
        newFoodName: newFoodName
      });
      alert("Updated");
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert("Not updated")
    }
  };

  return (
    <>
      <h1>CRUD APP using MERN</h1>
      <label>Food name</label>
      <input
        type="text"
        placeholder="Food name"
        value={foodName}
        onChange={(e) => setFoodName(e.target.value)}
      />
      <label>Days Since Eaten</label>
      <input
        type="number"
        placeholder="Days Since Eaten"
        value={daysSinceEaten}
        onChange={(e) => setDaysSinceEaten(e.target.value)}
      />
      <button onClick={Add}>Add data</button>
      {list.map((value, key) => (
        <div key={key}>
          <h1>{value.foodName}</h1>
          <h2>{value.daysSinceEaten}</h2>
          <input
            type="text"
            placeholder="Update name"
            onChange={(e) => setNewFoodName(e.target.value)}
          />
          <button onClick={() => Update(value._id)}>Update</button>
          <button onClick={() => Delete(value._id)}>Delete</button>
        </div>
      ))}
    </>
  );
};

export default App;

