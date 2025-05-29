import qrcode
print(qrcode.__file__)


# Example: Molding Injection Machine Specification
specs = """
Machine Name: Engel Victory 330/80
Clamping Force: 800 kN
Screw Diameter: 25 mm
Max Injection Pressure: 2200 bar
Year of Manufacture: 2022
"""

# Generate QR code
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=10,
    border=4,
)
qr.add_data(specs)
qr.make(fit=True)

# Create an image
img = qr.make_image(fill_color="black", back_color="white")

# Save the image
img.save("machine_spec_qr.png")
