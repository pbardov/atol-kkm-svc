var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TypeGuardPipe_1;
import { BadRequestException, Injectable, Logger, } from '@nestjs/common';
let TypeGuardPipe = TypeGuardPipe_1 = class TypeGuardPipe {
    isType;
    logError;
    logger = new Logger(TypeGuardPipe_1.name);
    constructor(isType, logError = false) {
        this.isType = isType;
        this.logError = logError;
        //
    }
    transform(value, metadata) {
        if (this.isType(value)) {
            return value;
        }
        if (this.logError) {
            this.logger.error(`Validation failed, data: ${JSON.stringify(value, null, '  ')}`);
        }
        throw new BadRequestException('Validation failed');
    }
};
TypeGuardPipe = TypeGuardPipe_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Function, Object])
], TypeGuardPipe);
export default TypeGuardPipe;
