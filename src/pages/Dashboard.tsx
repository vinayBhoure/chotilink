import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BarLoader } from "react-spinners"
import Linkcard from "@/components/Linkcard";
import { getUrls, getClicks } from "@/redux/api/apiUrl";
import CreateLink from "@/components/CreateLink";

type UrlType = {
  id: string;
  title: string;
  originalUrl: string;
  shortUrl: string;
  customUrl: string;
  qr: string;
}

type ClickType = {
  city: string;
  country: string;
  created_at: string;
  id: number;
  device: string;
  url_id: number;
}

function Dashboard() {

  const [search, setSearch] = useState("");
  const { user } = useSelector((state: RootState) => state.user);
  const [urlsInfo, setUrlsInfo] = useState<UrlType[]>([]);
  const [clicksInfo, setClicksInfo] = useState<ClickType[]>([]);
  const [loading, setLoading] = useState(false);


  const fetchUrls = async (id: string) => {
    setLoading(true);
    try {
      const respose = await getUrls(id);
      setUrlsInfo(respose);
      const url_ids = respose.map((url) => url.id);
      fetchClicks(url_ids);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }

  const fetchClicks = async (url_ids: string[]) => {
    try {
      const respose = await getClicks(url_ids);
      setClicksInfo(respose);
    } catch (err) {
      console.log(err);
    }
  }


  useEffect(() => {
    if (user) {
      fetchUrls(user?.id);
    }
  }, [])

  const filteredUrls = urlsInfo?.filter((url) => {
    return url?.title.toLowerCase().includes(search.toLowerCase());
  })

  return (<>
    {loading && <BarLoader width={"100%"} color="green" />}
    <div className="container flex flex-col gap-8 mt-4" style={{ minHeight: 'calc(100vh - 5rem)' }}>
      <div className=" grid grid-cols-2 gap-4">
        <div className="p-8 border-2 rounded" >
          <h1 className="text-xl">Links Created</h1>
          <p>{urlsInfo.length}</p>
        </div>
        <div className="p-8 border-2 rounded">
          <h1 className="text-xl" >Total Clicks</h1>
          <p>{clicksInfo.length}</p>
        </div>
      </div>

      <div className=" flex justify-between">
        <h1 className="text-4xl font-extrabold">My Links</h1>
        <CreateLink />
      </div>

      <div className="relative ">
        <input type="text" placeholder="filter links"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      {/* errors */}
      {
        (filteredUrls || []).map((url) => {
          return <Linkcard key={url.id} url={url} getUrls={getUrls} />
        })

      }
    </div>
  </>
  )
}

export default Dashboard
