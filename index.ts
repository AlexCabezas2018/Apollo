import dotenv from 'dotenv';
import {Server} from './src/server';

dotenv.config();

Server.start()