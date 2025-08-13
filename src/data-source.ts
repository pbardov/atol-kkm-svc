import 'reflect-metadata';
import 'dotenv/config';
import {DataSource} from 'typeorm';
import getDataSourceOptions from './database/data-source.options.js';

const dataSource = new DataSource(getDataSourceOptions());
export default dataSource;
