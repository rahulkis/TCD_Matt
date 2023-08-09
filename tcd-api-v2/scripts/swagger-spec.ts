//@ts-ignore
import type Request from '../src/types'
import { config } from 'dotenv';

config({ path: './env/dev.env' });

import '../src/util/swagger-spec';
