import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { BeatLoader } from 'react-spinners'
import { FaLink } from "react-icons/fa6";
import { FaRegCopy } from "react-icons/fa6";
import { IoDownloadOutline } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import { deleteUrl } from '@/redux/api/apiUrl';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import toast from 'react-hot-toast';


function Linkcard({ url, getUrls }: { url: any, getUrls: any }) {

    const { user } = useSelector((state: RootState) => state.user);

    const [loadingdelete, setLoadingdelete] = useState(false)
    const downloadImage = () => {
        const imageUrl = url?.qr;
        const extension = url?.qr.split('.').pop();
        const fileName = url?.title.split(' ').join('_') + '.' + extension;

        const anchor = document.createElement('a');
        anchor.href = imageUrl;
        anchor.download = fileName;

        document.body.appendChild(anchor);
        anchor.click();

        document.body.removeChild(anchor);
        toast.success("QR downloaded successfully");
    }

    return (
        <div className='flex gap-4 border-2 p-4 bg-white shadow rounded'>
            <img
                src={url?.qrCode}
                className="h-32 object-contain ring ring-blue-500 self-start"
                alt="qr code"
            />
            <Link to={`/link/${url?.id}`} className="flex flex-col flex-1">
                <span className="text-3xl font-extrabold hover:underline cursor-pointer">
                    {url?.title}
                </span>
                <span className="text-2xl text-blue-400 font-bold hover:underline cursor-pointer">
                    https://trimrr.in/{url?.customUrl ? url?.customUrl : url.shortUrl}
                </span>
                <span className="flex items-center gap-1 hover:underline cursor-pointer">
                    <FaLink />
                    {url?.originalUrl}
                </span>
                <span className="flex items-end font-extralight text-sm flex-1">
                    {new Date(url?.created_at).toLocaleString()}
                </span>
            </Link>
            <div className="flex flex-col justify-evenly">
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(` https://trimrr.in/${url?.customUrl ? url?.customUrl : url.shortUrl}`);
                        toast.success("Link copied to clipboard");
                    }
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
                            getUrls(user?.id).then((urls: any) => {
                                console.log(urls);
                            })
                        });
                    }}
                    disabled={loadingdelete}
                >
                    {loadingdelete ? <BeatLoader size={5} color="white" /> : <FaTrash size={'25px'} />}
                </button>
            </div>
        </div>
    )
}

export default Linkcard
