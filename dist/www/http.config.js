var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// noinspection TypeScriptValidateTypes
import { IsInt, IsPositive, } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import registerClassAs from '../common/config/register-class-as.js';
export class HttpConfig {
    httpPort = 8080;
}
__decorate([
    IsPositive(),
    IsInt(),
    Type(() => Number),
    Expose({ name: 'HTTP_PORT' }),
    __metadata("design:type", Object)
], HttpConfig.prototype, "httpPort", void 0);
export default registerClassAs('http', HttpConfig);
