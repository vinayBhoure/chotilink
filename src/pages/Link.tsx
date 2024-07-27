import Device from "@/components/Device";
import Location from "@/components/Location";
import { deleteUrl, getClicksWithUrl, getUrlwithUser } from "@/redux/api/apiUrl";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaRegCopy, FaTrash } from "react-icons/fa6";
import { IoDownloadOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";

function Link() {

  const { id } = useParams<string>();
  const [url, setUrl] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const {user} = useSelector((state: RootState) => state.user);

  const fetchUrl = async () => {
    const url = await getUrlwithUser({ id: id || '', user_id: user?.id});  
    setUrl(url);
    console.log("urls: ", url);
  }

  const fetchClicks = async () => {
    setLoadingStats(true);
    const clicks = await getClicksWithUrl(id!);
    setStats(clicks);
    console.log("clicks: ", stats);
    setLoadingStats(false);
  }

  useEffect(() => {
    fetchUrl();
    fetchClicks();
  }, [])

  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;

    // Create an anchor element
    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;

    // Append the anchor to the body
    document.body.appendChild(anchor);

    // Trigger the download by simulating a click event
    anchor.click();

    // Remove the anchor from the document
    document.body.removeChild(anchor);
  };

  const [loadingdelete, setLoadingdelete] = useState(false)
  const navigate = useNavigate();

  let link = "";
  if (url) {
    link = url?.customUrl ? url?.customUrl : url?.shortUrl;
  }

  return (
    <div className="flex flex-col gap-8 md:flex-row justify-between">
      <div className="flex flex-col items-start gap-8 rounded-lg sm:w-2/5">
        <span className="text-6xl font-extrabold hover:underline cursor-pointer">
          {url?.title}
        </span>
        <a
          href={`https://trimrr.in/${link}`}
          target="_blank"
          className="text-3xl sm:text-4xl text-blue-400 font-bold hover:underline cursor-pointer"
        >
          https://trimrr.in/{link}
        </a>
        <a
          href={url?.original_url}
          target="_blank"
          className="flex items-center gap-1 hover:underline cursor-pointer"
        >

          {url?.original_url}
        </a>
        <span className="flex items-end font-extralight text-sm">
          {new Date(url?.created_at).toLocaleString()}
        </span>
        <div className="flex gap-2">
          <button

            onClick={() =>
              navigator.clipboard.writeText(`https://trimrr.in/${link}`)
            }
          >
             <FaRegCopy size={'25px'} />
          </button>
          <button onClick={downloadImage}>
          <IoDownloadOutline size={'25px'} />
          </button>
          <button
            onClick={() => {
              setLoadingdelete(true);
              deleteUrl(url?.id).then(() => {
                setLoadingdelete(false);
                toast.success("Link deleted successfully");
                navigate("/dashboard", { replace: true });
              });
            }}
            disabled={loadingdelete}
          >
            {loadingdelete ? <BeatLoader size={5} color="white" /> : <FaTrash size={'25px'} />}
          </button>
        </div>
        <img
          src={url?.qrCode}
          className="w-full self-center sm:self-start ring ring-blue-500 p-1 object-contain"
          alt="qr code"
        />
      </div>

      <div className="bg-white shadow-md rounded-lg p-4 sm:w-3/5">
        <div className="border-b border-gray-200 pb-2 mb-4">
          <h2 className="text-4xl font-extrabold">Stats</h2>
        </div>
        {stats && stats.length ? (
          <div className="flex flex-col gap-6">
            <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
              <div className="border-b border-gray-200 pb-2 mb-4">
                <h2 className="text-lg font-semibold">Total Clicks</h2>
              </div>
              <div className="mt-4">
                <p>{stats?.length}</p>
              </div>
            </div>

            <h2 className="text-lg font-semibold">Location Data</h2>
            <Location stats={stats} />
            <h2 className="text-lg font-semibold">Device Info</h2>
            <Device stats={stats} />
          </div>
        ) : (
          <div className="mt-4">
            {loadingStats === false ? "No Statistics yet" : "Loading Statistics.."}
          </div>
        )}
      </div>


    </div>
  )
}

export default Link
