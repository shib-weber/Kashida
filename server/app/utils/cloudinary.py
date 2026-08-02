import cloudinary
import cloudinary.uploader
from app.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)

async def upload_image_to_cloud(file_bytes) -> str:
    """
    Uploads raw file bytes to Cloudinary CDN and returns the secure HTTPS URL.
    """
    response = cloudinary.uploader.upload(
        file_bytes,
        folder="kashida_products",
        transformation=[
            {"width": 800, "crop": "limit"},  # Cap max width to 800px
            {"quality": "auto"},               # Compress dynamically
            {"fetch_format": "auto"}           # Auto-convert to WebP format
        ]
    )
    return response.get("secure_url")