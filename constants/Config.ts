/**
 * API Configuration
 */

const BASE_URL = 'http://192.168.1.69:3000';

export const Config = {
  BASE_URL: BASE_URL,
  API_URL: `${BASE_URL}/api`,
  IMAGE_BASE_URL: `${BASE_URL}/media`,

  RAZORPAY_KEY_ID: 'rzp_test_your_key',

  // Helper to get image URI
  getImageUri: (imagePath: string) => {
    if (!imagePath) return undefined;
    if (imagePath.startsWith('http')) return imagePath;

    // Handle paths that already include /media or media/
    let cleanPath = imagePath;
    if (cleanPath.startsWith('/')) {
      cleanPath = cleanPath.substring(1);
    }

    if (cleanPath.startsWith('media/')) {
      return `${BASE_URL}/${cleanPath}`;
    }

    return `${BASE_URL}/media/${cleanPath}`;
  }
};

export default Config;
