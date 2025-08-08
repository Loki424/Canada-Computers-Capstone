"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageToImgur = void 0;
const axios_1 = __importDefault(require("axios"));
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID || 'your-imgur-client-id';
const uploadImageToImgur = async (imageBase64) => {
    try {
        const response = await axios_1.default.post('https://api.imgur.com/3/image', {
            image: imageBase64,
            type: 'base64'
        }, {
            headers: {
                Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.data.success) {
            return response.data.data.link;
        }
        else {
            throw new Error('Failed to upload image to Imgur');
        }
    }
    catch (error) {
        console.error('Imgur upload error:', error);
        throw new Error('Image upload failed');
    }
};
exports.uploadImageToImgur = uploadImageToImgur;
//# sourceMappingURL=imageUpload.js.map