import qrcode
from PIL import Image, ImageDraw, ImageFont
import os

url = "https://selamat-ulang-tahun-kamu.vercel.app/"
qr = qrcode.QRCode(version=1, box_size=8, border=2)
qr.add_data(url)
qr.make(fit=True)

# Warna-warna ringan
bg_color = (255, 255, 255) # Putih
heart_color = (255, 182, 193) # Pink pastel
text_color = (255, 141, 161)

# Generate QR
qr_img = qr.make_image(fill_color="black", back_color="white").convert("RGBA")
qr_w, qr_h = qr_img.size

# Buat kanvas 400x450
img = Image.new("RGBA", (400, 450), bg_color)
draw = ImageDraw.Draw(img)

# Menggambar bentuk hati sederhana di tengah
def draw_heart(draw, x_offset, y_offset, scale):
    # Approximation of heart using polygons or simple circles + triangle
    # We will just draw a nice pink rounded rectangle as background for the QR code for simplicity
    # since drawing a perfect heart in PIL without a path is tricky.
    pass

# Agar mudah, mari buat kotak pink dengan sudut membulat 
# Draw rounded rectangle
draw.rounded_rectangle([(40, 70), (360, 390)], radius=30, fill=heart_color)
draw.rounded_rectangle([(60, 90), (340, 370)], radius=20, fill="white")

# Paste QR code
img.paste(qr_img, (400//2 - qr_w//2, 460//2 - qr_h//2), mask=qr_img)

# Tambah Teks
# Gunakan font default jika tidak ada ttf
try:
    font = ImageFont.truetype("arial.ttf", 24)
except:
    font = ImageFont.load_default()

# Tambahkan tulisan "Untuk Kamu"
text = "Untuk Kamu"
# Calculate text width (in newer pillow versions use textbbox)
bbox = draw.textbbox((0,0), text, font=font)
tw = bbox[2] - bbox[0]
draw.text((400//2 - tw//2, 30), text, font=font, fill=text_color)

# Simpan langsung ke artifacts
out_path = r"C:\Users\mmoch\.gemini\antigravity-ide\brain\965fe15d-5b67-401a-baf6-96eec444558e\qrcode-love-special.png"
img.save(out_path)
print("Saved to", out_path)
