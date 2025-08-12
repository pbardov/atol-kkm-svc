import {Module} from '@nestjs/common';
import AppConfigModule from '../config/app-config.module.js';
import AtolKkmService from './atol-kkm.service.js';

@Module({
	imports: [AppConfigModule],
	providers: [AtolKkmService],
	exports: [AtolKkmService],
})
export default class AtolKkmModule {}
