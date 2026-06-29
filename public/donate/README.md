# UPI QR code

Save your UPI QR image here as:

    upi-qr.png

(`components/UpiQrCard.tsx` loads `/donate/upi-qr.png`.)

Tips:
- PNG or JPG, square, ~500×500, with a quiet white margin around the code.
- Until the file exists, the donate page shows a graceful "UPI QR coming soon"
  placeholder instead of a broken image — so nothing looks broken.
- Optionally set `NEXT_PUBLIC_UPI_ID` in your env to also show the UPI id text
  and a "Pay via UPI app" deep link on mobile.
