// noinspection TypeScriptValidateTypes
import {
	IsInt, IsPositive,
} from 'class-validator';
import {Expose, Type} from 'class-transformer';
import registerClassAs from '../common/config/register-class-as.js';

export class HttpConfig {
	@IsPositive()
	@IsInt()
	@Type(() => Number)
	@Expose({name: 'HTTP_PORT'})
	httpPort = 8080;
}

export default registerClassAs('http', HttpConfig);
