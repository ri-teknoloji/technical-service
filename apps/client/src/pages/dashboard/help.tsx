import { Card, CardBody, CardHeader } from "@nextui-org/react";

const Help = () => {
  return (
    <div className="grid gap-3">
      <Card>
        <CardHeader className="justify-center">
          <h1 className="text-lg font-bold">Yönetim Paneli</h1>
        </CardHeader>
        <CardBody>
          <h4 className="text-xl font-bold">Kullanım Kılavuzu</h4>
          <p>
            Bu panelde bulunan özelliklerin nasıl kullanılacağı hakkında bilgi
            almak için aşağıdaki başlıkları inceleyebilirsiniz.
          </p>
        </CardBody>
        <CardBody>
          <h4 className="text-xl font-bold">Kullanıcılar</h4>
          <ul className="grid max-w-xl list-disc gap-3 p-5">
            <li>
              Kullanıcılar sayfasında kullanıcıları görüntüleyebilir,
              düzenleyebilir ve silebilirsiniz.
            </li>
            <li>
              "kullanıcı" rolüne sahip kullanıcılar admin paneline erişemez.
              "admin" rolüne sahip kullanıcılar tüm yetkilere sahiptir.
            </li>
            <li>
              Kullanıcı oluştururken şifre belirleyemezsiniz. Kullanıcıya
              rasgele bir şifre oluşturulur. Daha sonra şifremi unuttum
              sayfasından şifre sıfırlama işlemi yapabilir.
            </li>
            <li>
              Servis kayıtları oluştururken kullanıcı seçmek zorunludur. Servis
              kaydı oluşturmadan önce kullanıcı oluşturmanız gerekmektedir.
            </li>
            <li>
              Oluşturulan kullanıcı profil sekmesinden kendine ait bilgileri
              görebilir ve düzenleyebilir. Şifre değişikliği yapabilir.
            </li>
            <li>Kullanıcı kendine ait servis kayıtlarını görüntüleyebilir.</li>
          </ul>
        </CardBody>
        <CardBody>
          <h4 className="text-xl font-bold">Servis Kayıtları</h4>
          <ul className="grid max-w-xl list-disc gap-3 p-5">
            <li>
              Servis kayıtları sayfasında kayıtları görüntüleyebilir,
              düzenleyebilir ve silebilirsiniz.
            </li>
            <li>
              Servis kaydı oluşturduktan sonra resimleri güncelleyebilir ve
              olaylar ekleyip düzenleyebilirsiniz.
            </li>
            <li>
              Oluşturulan servis kaydı profil sekmesinden servis kaydına ait
              bilgileri görebilir.
            </li>
            <li>
              Servis kaydı oluştururken kullanıcı seçmek zorunludur. Servis
              kaydı oluşturmadan önce kullanıcı oluşturmanız gerekmektedir.
            </li>
          </ul>
        </CardBody>
        <CardBody>
          <h4 className="text-xl font-bold">Servis Kayıt Olayları</h4>
          <ul className="grid max-w-xl list-disc gap-3 p-5">
            <li>Olayları ekleyeblir, düzenleyebilir veya silebilirsiniz.</li>
            <li>
              Olaylar sekmesinin kullanım amacı onarım sırasında yapılan
              işlemleri kaydetmektir.
            </li>
            <li>
              Olaylar sekmesinde atanan teknisyeni belirtebilir, tedarik edilen
              parçaları not olarak ekleyebilir, ürün hakkında sonradan tespit
              edilen durumları not alabilir, veya ürünün müşteriye nasıl teslim
              edildiğini belirtebilirsiniz.
            </li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );
};

export default Help;
