import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [last, setLast] = useState(null); // Ajout d'un useState pour stocker les infos du dernier événement trouvé dans la liste d'évènements

  const getData = useCallback(async () => {
    try {
      const result = await api.loadData(); // ajout d'une variable pour stocker les données récupérées
      setData(result);

      // Chercher le dernier événement en fonction de la date
      if (result.events && result.events.length > 0) {
        const latestEvent = result.events.reduce((latest, current) => 
          new Date(latest.date) > new Date(current.date) ? latest : current
        , result.events[0]);
        setLast(latestEvent);        
      }
    } catch (err) {
      setError(err);
    }
  }, []);
  useEffect(() => {
    if (data) return;
    getData();
  });
  
  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
        last // ajout de last pour permettre aux composants enfants d'accéder à l'événement le plus récent
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;
