import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Link,
} from "@nextui-org/react";
import { useState } from "react";

import { User } from "@/types";

import CreateUserModal from "./CreateUserModal";

interface UserInputProps {
  defaultValue?: string;
  isRequired?: boolean;
  items: User[];
  label: string;
  name: string;
}

export const UserInput = (props: UserInputProps) => {
  const { defaultValue, isRequired, items, label, name } = props;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <CreateUserModal
        isOpen={isCreateModalOpen}
        setOpen={setIsCreateModalOpen}
      />

      <Autocomplete
        className="col-span-12 md:col-span-6"
        defaultSelectedKey={defaultValue}
        description={
          <p>
            Kullanıcıyı seçmek için e-posta adresini yazın.
            <Link
              color="primary"
              href="#"
              onClick={() => setIsCreateModalOpen(true)}
              size="sm"
            >
              Yeni Kullanıcı Oluştur
            </Link>
          </p>
        }
        isRequired={isRequired}
        label={label}
        listboxProps={{
          emptyContent: (
            <div className="grid gap-2 text-center">
              <p className="text-lg font-bold">
                Hiçbir kullanıcı bulunamadı. Yeni bir kullanıcı oluşturun.
              </p>
              <Button
                color="primary"
                fullWidth
                onClick={() => setIsCreateModalOpen(true)}
                size="sm"
              >
                <strong>Yeni Kullanıcı Oluştur</strong>
              </Button>
            </div>
          ),
        }}
        name={name}
        type="text"
      >
        {items.map((user) => (
          <AutocompleteItem
            key={user.id}
            textValue={user.phoneNumber}
            value={user.id}
          >
            {user.displayName} ({user.email}) {user.phoneNumber}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </>
  );
};
