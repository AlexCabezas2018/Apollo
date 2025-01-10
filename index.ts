import dotenv from 'dotenv';
import Server from './src/server';

dotenv.config();

new Server().start();
