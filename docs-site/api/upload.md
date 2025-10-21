# Dosya Yükleme API’sı

`POST /api/upload` uç noktası tekil görsel yüklemelerini gerçekleştirir. Şu an rota herkese açıktır; dilerseniz `protect` middleware’i ekleyerek token zorunlu hale getirebilirsiniz.

| Metot | Yol | Açıklama |
| --- | --- | --- |
| `POST` | `/api/upload` | `image` alanı ile gönderilen tek dosyayı `server/uploads/` içine kaydeder. |

## İstek Gereksinimleri

- İçerik tipi: `multipart/form-data`
- Alan adı: `image`
- Maksimum boyut: 10 MB (Multer limiti)
- Kabul edilen MIME türleri: `image/*`

## Yanıt

Başarılı (`200`) yükleme:
```json
{
  "message": "Dosya başarıyla yüklendi",
  "filePath": "/uploads/image-1709999999999-123456789.png"
}
```

Sunucu `uploads/` klasörünü statik olarak servis eder; istemci tam URL’yi `https://api.dijinew.com/uploads/...` şeklinde oluşturabilir.

Hatalar `400` durum kodu ile döner (uyumsuz MIME türü, dosya eksikliği, boyut aşımı vb.).
