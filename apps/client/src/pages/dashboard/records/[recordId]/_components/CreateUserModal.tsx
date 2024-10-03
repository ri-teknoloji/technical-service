import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { toast } from "sonner";

import http from "@/lib/http";

interface CreateUserModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export default function CreateUserModal({
  isOpen,
  setOpen,
}: CreateUserModalProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = Object.fromEntries(
      formData.entries(),
    );

    try {
      await http.post("/users", data);

      toast.success("Kullanıcı başarıyla oluşturuldu!");

      setOpen(false);
    } catch (error) {
      http.handleError(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={setOpen}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Kullanıcı Oluştur
        </ModalHeader>
        <ModalBody>
          <form className="grid gap-3" onSubmit={handleSubmit}>
            <Input isRequired label="Ad Soyad" name="name" />
            <Input
              isRequired={false}
              label="E-posta"
              name="email"
              type="email"
            />
            <Input isRequired label="Telefon Numarası" name="phoneNumber" />

            <Button color="primary" type="submit">
              Oluştur
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
