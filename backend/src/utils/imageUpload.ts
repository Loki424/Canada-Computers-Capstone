import axios from 'axios';

const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID || 'your-imgur-client-id';

export const uploadImageToImgur = async (imageBase64: string): Promise<string> => {
  try {
    const response = await axios.post(
      'https://api.imgur.com/3/image',
      {
        image: imageBase64,
        type: 'base64'
      },
      {
        headers: {
          Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.success) {
      return response.data.data.link;
    } else {
      throw new Error('Failed to upload image to Imgur');
    }
  } catch (error) {
    console.error('Imgur upload error:', error);
    throw new Error('Image upload failed');
  }
};
