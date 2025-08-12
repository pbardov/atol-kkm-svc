import registerClassAs from '../common/config/register-class-as.js';
import {Expose, Type} from 'class-transformer';
import {IsString} from 'class-validator';

export class AtolKkmConfig {
	@IsString()
	@Type(() => String)
	@Expose({name: 'KKM_CONFIG'})
	kkmConfig = 'settings.json'
}

export default registerClassAs('kkm-config', AtolKkmConfig);
