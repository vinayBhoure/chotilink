import { getLocation, getOriginalUrl } from "@/redux/api/apiUrl";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { BarLoader } from "react-spinners";

function Redirect() {

  const { id } = useParams();
  const [data, setData] = useState<{ originalUrl: string }[] | null>(null);
  const [location, setLocation] = useState();

  const originalUrl = data ? data[0]?.originalUrl : null;
  const [loading, setLoading] = useState(false);

  const fetchOriginalUrl = async () => {
    try {
      const url = await getOriginalUrl(id!);
      setData(url);
      console.log("urls: ", url);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchOriginalUrl();
  }, []);

  useEffect(() => {
    if (originalUrl) {
      getLocation({ id: data[0]?.id, originalUrl }).catch((error) => {
        console.error(error);
      });
      setLoading(false);
    }
  }, [originalUrl]);


  return (<div>
    {loading ? <BarLoader width={"100%"} color="green" /> : null}
  </div>
  )
}

export default Redirect
