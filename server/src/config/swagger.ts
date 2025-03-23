import YAML from 'yamljs';
import path from 'path';

// Load your YAML file. Adjust the path if needed.
const swaggerPath = path.join(__dirname, 'swagger.yaml');
export const swaggerSpec = YAML.load(swaggerPath);