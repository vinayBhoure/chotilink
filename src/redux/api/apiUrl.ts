import supabase from "@/supabase/config";
import toast from "react-hot-toast";
import { UrlInfoType } from "@/types/types";
import { UAParser } from "ua-parser-js";

export async function getUrls(user_id: string) {
    const { data, error } = await supabase.from('urls').select('*').eq("user_id", user_id);

    if (error) {
        toast.error("Failed to fetch urls");
        throw new Error(error.message);
    }

    return data;
}

export async function getClicks(url_ids: string[]) {
    const { data, error } = await supabase.from('clicks').select('*').in("url_id", url_ids);


    if (error) {
        toast.error("Failed to fetch clicks");
        throw new Error(error.message);
    }

    return data;
}

export async function deleteUrl(id: string) {
    const { data, error } = await supabase.from("urls").delete().eq("id", id);

    if (error) {
        console.error(error);
        throw new Error("Unable to delete Url");
    }
    return data;
}

export async function createUrl(urlInfo: UrlInfoType) {

    const shortUrl = Math.random().toString(36).slice(2, 8);
    const extension = urlInfo.qrCode.name.split('.').pop();
    const fileName = `qr-${shortUrl}.${extension}`;

    const { error: storageError } = await supabase.storage.from('qrs').upload(fileName, urlInfo.qrCode);
    if (storageError) {
        return toast.error(storageError.message || 'Error uploading image');
    }

    const qrCodeUrl = `${import.meta.env.VITE_SUPABASE_URL}${import.meta.env.VITE_SUPABASE_STORAGE_QR}/${fileName}`
    const { data, error } = await supabase.from("urls").insert([{
        originalUrl: urlInfo.originalUrl,
        shortUrl: shortUrl,
        customUrl: urlInfo.customUrl,
        user_id: urlInfo.user_id,
        title: urlInfo.title,
        qrCode: qrCodeUrl
    }]).select();

    if (error) {
        console.error(error);
        throw new Error("Unable to create Url");
    }
    return data;
}

export const getOriginalUrl = async (id: string) => {
    const { data, error } =
        await
            supabase.from('urls').
                select('id, originalUrl').
                or(`shortUrl.eq.${id}, customUrl.eq.${id}`);

    if (error) {
        console.error(error);
        throw new Error("Unable to fetch Url");
    }

    return data;
}

const parser = new UAParser();

export const getLocation = async ({ id, originalUrl }: { id: string, originalUrl: string }) => {

    try {
        const res = parser.getResult();
        const device = res.device.type || 'Unknown';
        console.log("parser info", res);

        const response = await fetch("https://ipapi.co/json");
        const { city, country } = await response.json();

        const data = await supabase.from('clicks').insert([{
            url_id: id,
            device,
            city,
            country
        }]);
        window.location.href = originalUrl;
    } catch (error) {
        console.error(error);
        throw new Error("Unable to fetch location");
    }
}

export const getUrlwithUser = async ({ id, user_id }: { id: string, user_id: string }) => {
    const { data, error } = await supabase.from('urls').select('*').eq('id', id).eq('user_id', user_id).single();

    if (error) {
        console.error(error);
        throw new Error("Unable to fetch Url");
    }

    return data;
}

export const getClicksWithUrl = async (url_id: string) => {
    const { data, error } = await supabase.from('clicks').select('*').eq('url_id', url_id);

    if (error) {
        console.error(error);
        throw new Error("Unable to fetch Clicks");
    }

    return data;

}