# Transfer ve Konaklama Planı Web Uygulaması

Bu klasör, Excel dosyasından oluşturulan mobil uyumlu web uygulamasını içerir.

## Dosyalar

- `index.html`: Ana sayfa.
- `style.css`: Tasarım dosyası.
- `app.js`: Uygulama mantığı.
- `data.js`: Excel'den dönüştürülmüş veriler.
- `convert_excel_to_js.py`: Verileri güncellemek isterseniz çalıştıracağınız Python betiği.

## Nasıl Yayınlanır? (GitHub Pages)

1. GitHub hesabınızda yeni bir "Public" repository oluşturun (örneğin: `transfer-plan`).
2. Bu klasörde bir terminal açın.
3. Aşağıdaki komutları sırasıyla uygulayın (Kendi repo adresinizi kullanın):

```bash
git init
git add .
git commit -m "İlk yükleme"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/REPO_ADINIZ.git
git push -u origin main
```

4. GitHub'da repository ayarlarına (Settings) gidin.
5. "Pages" menüsüne tıklayın.
6. "Branch" kısmından "main" seçin ve kaydedin.
7. Birkaç dakika sonra size verilen linkten siteye ulaşabilirsiniz.

## Verileri Güncelleme

Excel dosyasında değişiklik yaparsanız:
1. `transfer_plan.xlsx` dosyasını güncelleyin.
2. Terminalde şu komutu çalıştırın: `python convert_excel_to_js.py`
3. Değişiklikleri git ile tekrar yükleyin (`git add data.js`, `git commit...`, `git push`).
