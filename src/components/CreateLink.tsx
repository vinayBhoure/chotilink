import { createUrl } from "@/redux/api/apiUrl";
import { RootState } from "@/redux/store";
import { UrlInfoType } from "@/types/types";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux"
import { QRCode } from "react-qrcode-logo";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose, Label, Input, Button } from "./ui/dialog";
import { BeatLoader } from "react-spinners";


function CreateLink() {

    const { user } = useSelector((state: RootState) => state.user);

    const ref = useRef<QRCode>(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const originalUrl = searchParams.get("createNew");
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const [urlInfo, setUrlInfo] = useState({
        originalUrl: originalUrl ? originalUrl : "",
        customUrl: "",
        user_id: user?.id,
        title: "",
        qrCode: new File([], 'qr-code.png', { type: 'image/png' })
    } as UrlInfoType);

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrlInfo({
            ...urlInfo,
            [e.target.name]: e.target.value
        });
    }

    const createLink = async () => {
        setLoading(true);
        try {
            const canvas = ref.current?.canvasRef.current;
            if (!canvas) {
                throw new Error('Canvas reference is null');
            }

            const blob = await new Promise<BlobPart>((resolve) => {
                canvas.toBlob((blob: Blob | null) => {
                    if (blob) resolve(blob);
                });
            });

            const res = await createUrl({
                ...urlInfo,
                qrCode: new File([blob], 'qr-code.png', { type: 'image/png' })
            });

            toast.success("Link created successfully");
            navigate(`/link/${res[0].id}`);
            setIsOpen(false);
        } catch (error) {
            toast.error("Failed to create link");
        }
        setLoading(false);
    }

    return (
        <div>
            <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <DialogHeader>
                    <DialogTitle>Create New Link</DialogTitle>
                    <DialogClose onClose={() => setIsOpen(false)} />
                </DialogHeader>
                <DialogContent>
                    {urlInfo.originalUrl && <QRCode value={urlInfo.originalUrl} size={150} ref={ref} />}
                    <div className="grid gap-4 py-4">
                        <div className="grid items-center grid-cols-4 gap-4">
                            <Label htmlFor="originalUrl">Original</Label>
                            <Input
                                type="url"
                                id="originalUrl"
                                name="originalUrl"
                                value={urlInfo.originalUrl}
                                onChange={changeHandler}
                                required
                                placeholder="https://example.com"
                                className="col-span-3 p-2 border-2 rounded" />
                        </div>
                        <div className="grid items-center grid-cols-4 gap-4">
                            <Label htmlFor="customUrl">Custom URL</Label>
                            <Input
                                id="customUrl"
                                name="customUrl"
                                value={urlInfo.customUrl}
                                onChange={changeHandler}
                                placeholder="my-custom-link"
                                className="col-span-3 p-2 border-2 rounded" />
                        </div>
                        <div className="grid items-center grid-cols-4 gap-4">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                value={urlInfo.title}
                                required
                                onChange={changeHandler}
                                placeholder="My Custom Link"
                                className="col-span-3 p-2 border-2 rounded" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading} onClick={createLink} >
                            {loading ? <BeatLoader size={10} /> : "Create"}
                        </Button>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <DialogTrigger onClick={() => setIsOpen(true)}>
                <Button variant="outline" >Create</Button>
            </DialogTrigger>
        </div>
    );
}

export default CreateLink
