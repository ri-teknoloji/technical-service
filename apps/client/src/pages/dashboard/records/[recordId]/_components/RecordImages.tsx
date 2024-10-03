import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Input,
  Progress,
} from "@nextui-org/react";
import { AxiosProgressEvent } from "axios";
import { FileIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";

import http from "@/lib/http";
import { ServiceRecord } from "@/types";
import { getFileUrl } from "@/utils";

interface ViewImagesProps {
  record: ServiceRecord;
}

export const ViewImages = ({ record }: ViewImagesProps) => {
  const [uploadState, setUploadState] = useState<AxiosProgressEvent>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await http.post(`/records/${record.id}/images`, formData, {
        onUploadProgress: setUploadState,
      });
      toast.success("Resimler  başarıyla yüklendi!");
      mutate(`/records/${record.id}`);
    } catch (error) {
      http.handleError(error);
    }

    setUploadState(undefined);
  };

  const handleOpen = (image: string) => {
    window.open(getFileUrl(image), "_blank");
  };

  const handleDelete = async (image: string) => {
    try {
      await http.delete(`/records/${record.id}/images/${image}`);
      toast.success("Resim başarıyla silindi!");
      mutate(`/records/${record.id}`);
    } catch (error) {
      http.handleError(error);
    }
  };

  return (
    <Card>
      <CardBody>
        <form className="grid gap-3" onSubmit={handleSubmit}>
          <Input
            accept="image/*"
            capture="user"
            className="col-span-12"
            isRequired
            label="Resim Seç"
            multiple
            name="images"
            startContent={<FileIcon />}
            type="file"
          />
          <Button color="primary" type="submit">
            <strong>Yükle</strong>
          </Button>
          {uploadState && (
            <div className="col-span-12">
              <Progress value={uploadState.loaded} />
            </div>
          )}
        </form>
        <br />

        <div className="grid grid-cols-12 gap-3">
          {record.images.map((image) => (
            <Card
              className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
              key={image}
            >
              <CardBody>
                <img
                  alt={record.productName}
                  className="h-full w-full object-fill"
                  onClick={() => window.open(getFileUrl(image), "_blank")}
                  src={getFileUrl(image)}
                />
              </CardBody>
              <CardFooter className="justify-between">
                <Button
                  color="primary"
                  onClick={() => handleOpen(image)}
                  variant="light"
                >
                  <strong>Görüntüle</strong>
                </Button>
                <Button
                  color="danger"
                  onClick={() => handleDelete(image)}
                  variant="light"
                >
                  <strong>Sil</strong>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
