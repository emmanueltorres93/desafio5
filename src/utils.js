import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

const finished = (error) => {
    if (error) {
        console.error(error);
        return;
    }
};

const codes_translator = function (code) {
    switch (code) {
        case 9001:
            return 'Quantity not recognized';
            break;
        case 9002:
            return 'Product code repeated';
            break;
        case 9003:
            return 'Product added';
            break;
        case 9004:
            return 'Type mismatch';
            break;
        case 9005:
            return 'Missing Value';
            break;
        case 9101:
            return "Cart ID doesn't exist";
            break;
        case 9102:
            return 'Product in URL must match product in body';
            break;
        case 9099:
            return 'Transaction successful';
            break;

        default:
            return 'Status Unknown';
    }
};